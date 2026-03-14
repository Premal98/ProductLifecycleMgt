-- /supabase/storage-setup.sql
-- Required buckets for PLM uploads

insert into storage.buckets (id, name, public)
values
  ('documents', 'documents', false),
  ('cad-files', 'cad-files', false)
on conflict (id) do nothing;

drop policy if exists "authenticated_read_documents" on storage.objects;
create policy "authenticated_read_documents"
on storage.objects for select
to authenticated
using (bucket_id = 'documents');

drop policy if exists "authenticated_write_documents" on storage.objects;
create policy "authenticated_write_documents"
on storage.objects for insert
to authenticated
with check (bucket_id = 'documents');

drop policy if exists "authenticated_read_cad" on storage.objects;
create policy "authenticated_read_cad"
on storage.objects for select
to authenticated
using (bucket_id = 'cad-files');

drop policy if exists "authenticated_write_cad" on storage.objects;
create policy "authenticated_write_cad"
on storage.objects for insert
to authenticated
with check (bucket_id = 'cad-files');
