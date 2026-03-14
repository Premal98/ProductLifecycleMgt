import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, created, ok, serverError, unauthorized } from '@/lib/http';
import { componentSchema } from '@/lib/validation';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    const { searchParams } = new URL(req.url);
    const bomId = searchParams.get('bom_id');

    const supabase = createSupabaseServerClient(session.accessToken);
    let query = supabase.from('components').select('*').eq('organization_id', getOrgId(session));
    if (bomId) query = query.eq('bom_id', bomId);
    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) return serverError('Failed to fetch components', error.message);
    return ok(data || []);
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    const body = await req.json();
    const parsed = componentSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());

    const supabase = createSupabaseServerClient(session.accessToken);
    const payload = { ...parsed.data, organization_id: getOrgId(session) };
    const { data, error } = await supabase.from('components').insert(payload).select('*').single();
    if (error) return serverError('Failed to create component', error.message);
    return created(data);
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}
