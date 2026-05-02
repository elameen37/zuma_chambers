-- ─── Zuma Chambers Supabase Schema — v2 ─────────────────────────
-- Notifications, HR, Research & Extended Tables
-- Run after: 20260501000000_case_management.sql

-- ─── Enable UUID extension ────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Notifications Log Table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT,
  recipient_phone TEXT,
  type          TEXT NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
  subject       TEXT NOT NULL,
  body          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  message_id    TEXT,
  error_message TEXT,
  sent_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Staff / HR Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staff (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('Partner', 'Associate', 'Clerk', 'Secretary', 'Admin')),
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  department    TEXT NOT NULL,
  workload      INTEGER DEFAULT 0 CHECK (workload >= 0 AND workload <= 100),
  status        TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Field')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Leave Requests Table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leave_requests (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id      UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('Annual', 'Sick', 'Maternity', 'Compassionate')),
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  status        TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  reason        TEXT,
  reviewed_by   UUID REFERENCES staff(id),
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Dispatch Logs Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dispatch_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id      UUID NOT NULL REFERENCES staff(id),
  destination   TEXT NOT NULL,
  purpose       TEXT NOT NULL,
  time_out      TIME NOT NULL,
  time_in       TIME,
  status        TEXT NOT NULL DEFAULT 'In Transit' CHECK (status IN ('In Transit', 'Completed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Legal Resources (Law Library) Table ─────────────────────────
CREATE TABLE IF NOT EXISTS legal_resources (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('Statute', 'CaseLaw', 'Precedent')),
  citation      TEXT,
  year          INTEGER,
  court         TEXT,
  content       TEXT NOT NULL,
  tags          TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Saved Authorities Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_authorities (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL,
  resource_id   UUID NOT NULL REFERENCES legal_resources(id) ON DELETE CASCADE,
  saved_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- ─── Asset Management Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS office_assets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('Electronics', 'Furniture', 'Equipment')),
  assigned_to   UUID REFERENCES staff(id),
  status        TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Assigned', 'Maintenance')),
  serial_number TEXT,
  purchased_at  DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Admin Notices Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_notices (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  priority      TEXT NOT NULL DEFAULT 'Low' CHECK (priority IN ('Low', 'High')),
  created_by    UUID REFERENCES staff(id),
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ
);

-- ─── Row Level Security (RLS) Policies ───────────────────────────
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notices ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view all staff and legal resources
CREATE POLICY "staff_read_all" ON staff FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "legal_resources_read" ON legal_resources FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "notices_read" ON admin_notices FOR SELECT USING (auth.role() = 'authenticated');

-- ─── Indexes for Performance ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leave_requests_staff_id ON leave_requests(staff_id);
CREATE INDEX IF NOT EXISTS idx_legal_resources_type ON legal_resources(type);
CREATE INDEX IF NOT EXISTS idx_legal_resources_tags ON legal_resources USING GIN(tags);
