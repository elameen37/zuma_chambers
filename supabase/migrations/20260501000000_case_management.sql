-- Case Management Schema for Zuma Chambers

-- Enum for Matter Stages
CREATE TYPE matter_stage AS ENUM ('Intake', 'Discovery', 'Pre-Trial', 'Hearing', 'Judgment', 'Closed');
CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE participant_role AS ENUM ('Client', 'Lead Counsel', 'Associate', 'Clerk', 'Opposing Counsel');
CREATE TYPE event_type AS ENUM ('Filing', 'Hearing', 'Deadline', 'Milestone', 'Meeting');
CREATE TYPE evidence_type AS ENUM ('Document', 'Exhibit', 'Testimony', 'Digital');
CREATE TYPE evidence_status AS ENUM ('Pending', 'Admitted', 'Contested');

-- Matters Table
CREATE TABLE IF NOT EXISTS matters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suit_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    client_id UUID REFERENCES auth.users(id),
    opposing_party TEXT,
    opposing_counsel TEXT,
    jurisdiction TEXT,
    court TEXT,
    judge TEXT,
    stage matter_stage DEFAULT 'Intake',
    risk_level risk_level DEFAULT 'Low',
    risk_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Matter Participants (Team & Opposing)
CREATE TABLE IF NOT EXISTS matter_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id), -- Null for external parties
    name TEXT NOT NULL,
    role participant_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Matter Events (Hearings, Deadlines, etc.)
CREATE TABLE IF NOT EXISTS matter_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    type event_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    -- Court Logistics
    courtroom TEXT,
    assigned_clerk_id UUID REFERENCES auth.users(id),
    attendance_status TEXT DEFAULT 'Pending', -- Pending, Attended, Missed
    outcome TEXT,
    next_hearing_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Evidence Tracker
CREATE TABLE IF NOT EXISTS matter_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type evidence_type NOT NULL,
    status evidence_status DEFAULT 'Pending',
    file_path TEXT, -- Storage path
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Case Notes
CREATE TABLE IF NOT EXISTS matter_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Linked Precedents & Statutes
CREATE TABLE IF NOT EXISTS linked_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    reference TEXT NOT NULL, -- e.g. "Section 124 of PIA"
    description TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('Individual', 'Company', 'Government')),
    email TEXT,
    phone TEXT,
    address TEXT,
    kyc_status TEXT DEFAULT 'Pending',
    risk_profile TEXT DEFAULT 'Low',
    cac_number TEXT,
    industry TEXT,
    retainer_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Client Interactions
CREATE TABLE IF NOT EXISTS client_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('Email', 'Call', 'Meeting', 'Letter')),
    subject TEXT NOT NULL,
    summary TEXT,
    interaction_date TIMESTAMPTZ DEFAULT now(),
    staff_id UUID REFERENCES auth.users(id)
);

-- Legal Documents & Versioning
CREATE TABLE IF NOT EXISTS legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matter_id UUID REFERENCES matters(id),
    client_id UUID REFERENCES clients(id),
    title TEXT NOT NULL,
    category TEXT,
    current_version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Draft',
    privilege TEXT DEFAULT 'Confidential',
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    changes TEXT,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Triggers for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update triggers
CREATE TRIGGER update_matters_updated_at BEFORE UPDATE ON matters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_documents_updated_at BEFORE UPDATE ON legal_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


