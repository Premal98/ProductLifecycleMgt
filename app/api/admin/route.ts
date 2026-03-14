import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { ok, serverError, unauthorized } from '@/lib/http';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    if (session.role !== 'admin') {
      return unauthorized('Admin only');
    }

    const orgId = getOrgId(session);
    const supabase = createSupabaseServerClient(session.accessToken);

    const [auditLogs, users] = await Promise.all([
      supabase.from('audit_logs').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(20),
      supabase.from('users').select('id,email,role,is_active').eq('organization_id', orgId)
    ]);

    return ok({
      users: users.data || [],
      recentAuditLogs: auditLogs.data || []
    });
  } catch (error) {
    return serverError('Admin endpoint failed', (error as Error).message);
  }
}
