import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { forbidden, ok, serverError, unauthorized } from '@/lib/http';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    const supabase = createSupabaseServerClient(session.accessToken);
    const orgId = getOrgId(session);
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) {
      return serverError('Failed to fetch organization', error.message);
    }

    return ok(data);
  } catch (error) {
    return serverError('Organization endpoint failed', (error as Error).message);
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return unauthorized();
  }

  if (session.role !== 'admin') {
    return forbidden('Admin only');
  }

  return ok({ message: 'Organization creation is handled during signup.' });
}
