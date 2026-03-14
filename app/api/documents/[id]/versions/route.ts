import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { forbidden, ok, serverError, unauthorized } from '@/lib/http';
import { canAccess } from '@/lib/rbac';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    if (!canAccess(session.role, 'documents', 'read')) {
      return forbidden('Insufficient permissions');
    }

    const { id } = await params;

    const supabase = createSupabaseServerClient(session.accessToken);
    const { data, error } = await supabase
      .from('versions')
      .select('*')
      .eq('organization_id', getOrgId(session))
      .eq('entity_type', 'document')
      .eq('entity_id', id)
      .order('version_number', { ascending: false });

    if (error) return serverError('Failed to fetch versions', error.message);
    return ok(data || []);
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}