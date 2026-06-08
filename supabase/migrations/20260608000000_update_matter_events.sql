-- Add assigned_counsel and assigned_clerk to matter_events table
ALTER TABLE matter_events
ADD COLUMN assigned_counsel TEXT[],
ADD COLUMN assigned_clerk TEXT;
