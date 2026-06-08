-- Create a storage bucket for legal documents if it doesn't exist
insert into storage.buckets (id, name, public)
values ('legal_documents', 'legal_documents', false)
on conflict (id) do nothing;

-- Set up RLS for the bucket
-- Allow authenticated users to upload files
create policy "Allow authenticated uploads"
on storage.objects for insert
with check (
  bucket_id = 'legal_documents'
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to view/download files
create policy "Allow authenticated reads"
on storage.objects for select
using (
  bucket_id = 'legal_documents'
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to update/delete files
create policy "Allow authenticated updates"
on storage.objects for update
using (
  bucket_id = 'legal_documents'
  and auth.role() = 'authenticated'
);

create policy "Allow authenticated deletes"
on storage.objects for delete
using (
  bucket_id = 'legal_documents'
  and auth.role() = 'authenticated'
);
