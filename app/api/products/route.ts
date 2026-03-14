import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, created, forbidden, ok, serverError, unauthorized } from '@/lib/http';
import { canAccess } from '@/lib/rbac';
import { productSchema } from '@/lib/validation';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const orgId = getOrgId(session);
    const supabase = createSupabaseServerClient(session.accessToken);

    let query = supabase
      .from('products')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    const q = searchParams.get('q');
    const lifecycle = searchParams.get('lifecycle');
    const owner = searchParams.get('owner');
    const category = searchParams.get('category');

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }
    if (lifecycle) {
      query = query.eq('lifecycle_stage', lifecycle);
    }
    if (owner) {
      query = query.ilike('owner_id', owner);
    }
    if (category) {
      query = query.ilike('category', `%${category}%`);
    }

    const { data, error } = await query;

    if (error) {
      return serverError('Failed to fetch products', error.message);
    }

    return ok(data || []);
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    if (!canAccess(session.role, 'products', 'write')) {
      return forbidden('Insufficient permissions');
    }

    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten());
    }

    const orgId = getOrgId(session);
    const supabase = createSupabaseServerClient(session.accessToken);
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...parsed.data,
        organization_id: orgId,
        created_by: session.appUserId,
        lifecycle_stage: parsed.data.lifecycle_stage || 'design',
        status: parsed.data.status || 'active',
        version: parsed.data.version || 'v1'
      })
      .select('*')
      .single();

    if (error) {
      return serverError('Failed to create product', error.message);
    }

    return created(data);
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}
