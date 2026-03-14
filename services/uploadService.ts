import { getSupabaseClient } from '@/lib/supabaseClient';

export async function uploadToBucket(bucket: 'documents' | 'cad-files', path: string, file: File) {
  const supabaseClient = getSupabaseClient();
  const { error } = await supabaseClient.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true
  });

  if (error) {
    throw error;
  }

  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
