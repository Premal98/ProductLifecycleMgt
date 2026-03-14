import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, created, forbidden, ok, serverError, unauthorized } from '@/lib/http';
import { canAccess } from '@/lib/rbac';
import { projectSchema } from '@/lib/validation';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    if (!canAccess(session.role, 'projects', 'read')) {
      return forbidden('Insufficient permissions');
    }

    const supabase = createSupabaseServerClient(session.accessToken);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('organization_id', getOrgId(session))
      .order('created_at', { ascending: false });

    if (error) {
      return serverError('Failed to fetch projects', error.message);
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

    if (!canAccess(session.role, 'projects', 'write')) {
      return forbidden('Insufficient permissions');
    }

    const body = await req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten());
    }

    const supabase = createSupabaseServerClient(session.accessToken);
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...parsed.data,
        organization_id: getOrgId(session),
        owner_id: parsed.data.owner_id || session.appUserId
      })
      .select('*')
      .single();

    if (error) {
      return serverError('Failed to create project', error.message);
    }

    return created(data);
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}