import { ZodTypeAny } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function listByOrg(table: string, organizationId: string, accessToken?: string) {
  const supabase = createSupabaseServerClient(accessToken);
  return supabase.from(table).select('*').eq('organization_id', organizationId).order('created_at', { ascending: false });
}

export async function listAll(table: string, accessToken?: string) {
  const supabase = createSupabaseServerClient(accessToken);
  return supabase.from(table).select('*').order('created_at', { ascending: false });
}

export async function createByOrg<T extends object>(table: string, organizationId: string, payload: T, accessToken?: string) {
  const supabase = createSupabaseServerClient(accessToken);
  return supabase
    .from(table)
    .insert({ ...payload, organization_id: organizationId })
    .select('*')
    .single();
}

export async function createOne<T extends object>(table: string, payload: T, accessToken?: string) {
  const supabase = createSupabaseServerClient(accessToken);
  return supabase.from(table).insert(payload).select('*').single();
}

export function validateBody(schema: ZodTypeAny, payload: unknown) {
  return schema.safeParse(payload);
}
