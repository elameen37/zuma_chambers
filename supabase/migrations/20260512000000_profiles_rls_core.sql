-- ─── [COMPANY_NAME] — Phase 1: Profiles, Finance, Blog, RLS ───────
-- Run after: 20260502000000_hr_notifications_library.sql
-- Idempotent: All statements use IF NOT EXISTS / CREATE OR REPLACE

-- ─── Extensions ──────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search later

-- ─── Profiles Table ──────────────────────────────────────────────
-- Mirrors auth.users — auto-populated via trigger on signup
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT '',
  email         TEXT,
  role          TEXT NOT NULL DEFAULT 'client'
                  CHECK (role IN ('partner', 'associate', 'admin', 'clerk', 'finance', 'client')),
  initials      TEXT,
  title         TEXT,
  department    TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  bar_number    TEXT,            -- For attorneys
  specialization TEXT[],        -- e.g. ['Litigation', 'IP']
  is_active     BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, initials)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(
      NEW.raw_user_meta_data->>'initials',
      upper(left(COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 2))
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Keep profiles.updated_at in sync
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Invoices Table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  client_id     UUID REFERENCES clients(id) ON DELETE SET NULL,
  matter_id     UUID REFERENCES matters(id) ON DELETE SET NULL,
  issued_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status        TEXT NOT NULL DEFAULT 'Draft'
                  CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled')),
  currency      TEXT NOT NULL DEFAULT 'NGN',
  subtotal      DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_rate      DECIMAL(5,2) NOT NULL DEFAULT 0,
  tax_amount    DECIMAL(15,2) GENERATED ALWAYS AS (subtotal * tax_rate / 100) STORED,
  total         DECIMAL(15,2) GENERATED ALWAYS AS (subtotal + (subtotal * tax_rate / 100)) STORED,
  due_date      DATE,
  paid_at       TIMESTAMPTZ,
  notes         TEXT,
  line_items    JSONB NOT NULL DEFAULT '[]',
  -- e.g. [{"description": "Legal consultation", "qty": 2, "rate": 150000, "amount": 300000}]
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS invoices_updated_at ON invoices;
CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate invoice numbers: INV-2026-0001
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  year_part TEXT := to_char(now(), 'YYYY');
  seq_num   INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM invoices
  WHERE invoice_number LIKE 'INV-' || year_part || '-%';
  NEW.invoice_number := 'INV-' || year_part || '-' || lpad(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_invoice_number ON invoices;
CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
  EXECUTE FUNCTION generate_invoice_number();

-- ─── Blog / Insights Posts Table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  excerpt       TEXT,
  content       TEXT NOT NULL DEFAULT '',
  cover_image   TEXT,
  author_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category      TEXT DEFAULT 'General'
                  CHECK (category IN ('General', 'Litigation', 'Corporate', 'Tech & IP',
                                      'Compliance', 'Newsletter', 'Case Review')),
  tags          TEXT[] DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'Draft'
                  CHECK (status IN ('Draft', 'Published', 'Archived')),
  published_at  TIMESTAMPTZ,
  views         INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Slug auto-generator from title
CREATE OR REPLACE FUNCTION slugify(text_input TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(text_input, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
END;
$$;

-- ─── Office Branches Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS branches (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  city          TEXT NOT NULL,
  country       TEXT NOT NULL DEFAULT 'Nigeria',
  address       TEXT,
  phone         TEXT,
  email         TEXT,
  is_headquarters BOOLEAN NOT NULL DEFAULT false,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  coordinates   JSONB, -- { "lat": 9.0765, "lng": 7.3986 }
  operating_hours TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Audit Logs Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_name    TEXT,
  action        TEXT NOT NULL,   -- e.g. 'CREATE_MATTER', 'LOGIN', 'DELETE_DOCUMENT'
  resource_type TEXT NOT NULL,   -- e.g. 'matter', 'client', 'auth'
  resource_id   UUID,
  resource_name TEXT,
  ip_address    INET,
  status        TEXT NOT NULL DEFAULT 'success'
                  CHECK (status IN ('success', 'denied', 'warning')),
  details       TEXT,
  metadata      JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── User Notifications (In-App) Table ────────────────────────────
CREATE TABLE IF NOT EXISTS user_notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  type          TEXT NOT NULL DEFAULT 'info'
                  CHECK (type IN ('info', 'warning', 'success', 'error', 'case', 'invoice', 'hearing')),
  link          TEXT,            -- e.g. '/dashboard/cases/uuid'
  is_read       BOOLEAN NOT NULL DEFAULT false,
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Client Inquiries / Contact Form ─────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  nature        TEXT,            -- Nature of legal matter
  preferred_date DATE,
  message       TEXT,
  status        TEXT NOT NULL DEFAULT 'New'
                  CHECK (status IN ('New', 'Reviewed', 'Contacted', 'Converted', 'Closed')),
  assigned_to   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Seed: HQ Branch ──────────────────────────────────────────────
INSERT INTO branches (name, city, country, address, phone, email, is_headquarters, is_active)
VALUES
  ('[COMPANY_NAME] HQ', 'Abuja', 'Nigeria', 'No. 5 Adetokunbo Ademola Crescent, Wuse II, Abuja', '+234 (0) 800 ZUMALAW', 'office@zumachambers.law', true, true),
  ('Lagos Office', 'Lagos', 'Nigeria', '12A Kofo Abayomi Street, Victoria Island, Lagos', '+234 (0) 800 ZUMALAW', 'lagos@zumachambers.law', false, true),
  ('London Office', 'London', 'United Kingdom', '1 Canada Square, Canary Wharf, London E14 5AB', '+44 20 7946 0958', 'london@zumachambers.law', false, true)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- ═══════════════════════════════════════════════════════════════════

-- ─── Enable RLS ───────────────────────────────────────────────────
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices          ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches          ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries         ENABLE ROW LEVEL SECURITY;
ALTER TABLE matters           ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents   ENABLE ROW LEVEL SECURITY;
ALTER TABLE matter_events     ENABLE ROW LEVEL SECURITY;

-- ─── Helper: get current user role ────────────────────────────────
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION is_internal()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT get_my_role() IN ('partner', 'associate', 'admin', 'clerk', 'finance');
$$;

CREATE OR REPLACE FUNCTION is_partner_or_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT get_my_role() IN ('partner', 'admin');
$$;

-- ─── Profiles Policies ────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_read_self" ON profiles;
CREATE POLICY "profiles_read_self"   ON profiles FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_read_internal" ON profiles;
CREATE POLICY "profiles_read_internal" ON profiles FOR SELECT USING (is_internal());

DROP POLICY IF EXISTS "profiles_update_self" ON profiles;
CREATE POLICY "profiles_update_self" ON profiles FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_admin_full" ON profiles;
CREATE POLICY "profiles_admin_full"  ON profiles FOR ALL USING (is_partner_or_admin());

-- ─── Matters Policies ─────────────────────────────────────────────
DROP POLICY IF EXISTS "matters_internal_read" ON matters;
CREATE POLICY "matters_internal_read"  ON matters FOR SELECT USING (is_internal());

DROP POLICY IF EXISTS "matters_client_own" ON matters;
CREATE POLICY "matters_client_own"     ON matters FOR SELECT USING (
  get_my_role() = 'client' AND client_id = auth.uid()
);

DROP POLICY IF EXISTS "matters_create" ON matters;
CREATE POLICY "matters_create"         ON matters FOR INSERT WITH CHECK (
  get_my_role() IN ('partner', 'admin', 'associate')
);

DROP POLICY IF EXISTS "matters_update" ON matters;
CREATE POLICY "matters_update"         ON matters FOR UPDATE USING (
  get_my_role() IN ('partner', 'admin', 'associate', 'clerk')
);

DROP POLICY IF EXISTS "matters_delete" ON matters;
CREATE POLICY "matters_delete"         ON matters FOR DELETE USING (is_partner_or_admin());

-- ─── Clients Policies ─────────────────────────────────────────────
DROP POLICY IF EXISTS "clients_internal_read" ON clients;
CREATE POLICY "clients_internal_read"  ON clients FOR SELECT USING (is_internal());

DROP POLICY IF EXISTS "clients_manage" ON clients;
CREATE POLICY "clients_manage"         ON clients FOR ALL USING (
  get_my_role() IN ('partner', 'admin', 'associate', 'clerk')
);

-- ─── Invoices Policies ────────────────────────────────────────────
DROP POLICY IF EXISTS "invoices_internal_read" ON invoices;
CREATE POLICY "invoices_internal_read" ON invoices FOR SELECT USING (is_internal());

DROP POLICY IF EXISTS "invoices_client_own" ON invoices;
CREATE POLICY "invoices_client_own"    ON invoices FOR SELECT USING (
  get_my_role() = 'client' AND client_id IN (
    SELECT id FROM clients WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "invoices_create" ON invoices;
CREATE POLICY "invoices_create"        ON invoices FOR INSERT WITH CHECK (
  get_my_role() IN ('partner', 'admin', 'finance')
);

DROP POLICY IF EXISTS "invoices_update" ON invoices;
CREATE POLICY "invoices_update"        ON invoices FOR UPDATE USING (
  get_my_role() IN ('partner', 'admin', 'finance')
);

-- ─── Documents Policies ───────────────────────────────────────────
DROP POLICY IF EXISTS "docs_internal_read" ON legal_documents;
CREATE POLICY "docs_internal_read"     ON legal_documents FOR SELECT USING (is_internal());

DROP POLICY IF EXISTS "docs_client_own" ON legal_documents;
CREATE POLICY "docs_client_own"        ON legal_documents FOR SELECT USING (
  get_my_role() = 'client' AND client_id = auth.uid()
);

DROP POLICY IF EXISTS "docs_upload" ON legal_documents;
CREATE POLICY "docs_upload"            ON legal_documents FOR INSERT WITH CHECK (
  get_my_role() IN ('partner', 'admin', 'associate', 'clerk')
);

DROP POLICY IF EXISTS "docs_delete" ON legal_documents;
CREATE POLICY "docs_delete"            ON legal_documents FOR DELETE USING (is_partner_or_admin());

-- ─── Events / Hearings Policies ───────────────────────────────────
DROP POLICY IF EXISTS "events_internal_read" ON matter_events;
CREATE POLICY "events_internal_read"   ON matter_events FOR SELECT USING (is_internal());

DROP POLICY IF EXISTS "events_client_own" ON matter_events;
CREATE POLICY "events_client_own"      ON matter_events FOR SELECT USING (
  get_my_role() = 'client' AND matter_id IN (
    SELECT id FROM matters WHERE client_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "events_manage" ON matter_events;
CREATE POLICY "events_manage"          ON matter_events FOR ALL USING (
  get_my_role() IN ('partner', 'admin', 'associate', 'clerk')
);

-- ─── Blog Posts Policies ──────────────────────────────────────────
DROP POLICY IF EXISTS "blog_public_read" ON blog_posts;
CREATE POLICY "blog_public_read"       ON blog_posts FOR SELECT USING (status = 'Published');

DROP POLICY IF EXISTS "blog_internal_read" ON blog_posts;
CREATE POLICY "blog_internal_read"     ON blog_posts FOR SELECT USING (is_internal());

DROP POLICY IF EXISTS "blog_manage" ON blog_posts;
CREATE POLICY "blog_manage"            ON blog_posts FOR ALL USING (is_partner_or_admin());

-- ─── Branches: Public Read ────────────────────────────────────────
DROP POLICY IF EXISTS "branches_public_read" ON branches;
CREATE POLICY "branches_public_read"   ON branches FOR SELECT USING (true);

DROP POLICY IF EXISTS "branches_admin_manage" ON branches;
CREATE POLICY "branches_admin_manage"  ON branches FOR ALL USING (is_partner_or_admin());

-- ─── Audit Logs: Admin Only ───────────────────────────────────────
DROP POLICY IF EXISTS "audit_admin_read" ON audit_logs;
CREATE POLICY "audit_admin_read"       ON audit_logs FOR SELECT USING (is_partner_or_admin());

DROP POLICY IF EXISTS "audit_system_insert" ON audit_logs;
CREATE POLICY "audit_system_insert"    ON audit_logs FOR INSERT WITH CHECK (true);

-- ─── User Notifications: Own Only ────────────────────────────────
DROP POLICY IF EXISTS "notifications_own" ON user_notifications;
CREATE POLICY "notifications_own"      ON user_notifications FOR ALL USING (recipient_id = auth.uid());

-- ─── Inquiries: Admin Read + Public Insert ────────────────────────
DROP POLICY IF EXISTS "inquiries_public_insert" ON inquiries;
CREATE POLICY "inquiries_public_insert" ON inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "inquiries_admin_read" ON inquiries;
CREATE POLICY "inquiries_admin_read"   ON inquiries FOR SELECT USING (is_partner_or_admin());

DROP POLICY IF EXISTS "inquiries_admin_update" ON inquiries;
CREATE POLICY "inquiries_admin_update" ON inquiries FOR UPDATE USING (is_partner_or_admin());

-- ═══════════════════════════════════════════════════════════════════
-- PERFORMANCE INDEXES
-- ═══════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_profiles_role         ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email        ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id    ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_matter_id    ON invoices(matter_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status       ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status     ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug       ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor      ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created    ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recip   ON user_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread  ON user_notifications(recipient_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_matters_stage         ON matters(stage);
CREATE INDEX IF NOT EXISTS idx_clients_type          ON clients(type);
