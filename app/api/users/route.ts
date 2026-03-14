import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, forbidden, ok, serverError, unauthorized } from '@/lib/http';
import { ROLE_OPTIONS, type AppRole } from '@/types/auth';
import { inviteUserToOrganization, updateUserRole } from '@/services/authService';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    const supabase = createSupabaseServerClient(session.accessToken);
    const orgId = getOrgId(session);

    const [users, invitations] = await Promise.all([
      supabase.from('users').select('id,email,full_name,role,is_active,created_at').eq('organization_id', orgId).order('created_at', { ascending: true }),
      supabase.from('invitations').select('id,email,role,status,created_at,expires_at').eq('organization_id', orgId).order('created_at', { ascending: false })
    ]);

    return ok({ users: users.data || [], invitations: invitations.data || [] });
  } catch (error) {
    return serverError('Failed to fetch users', (error as Error).message);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    if (session.role !== 'admin') {
      return forbidden('Admin only');
    }

    const body = await req.json();
    const { userId, role } = body as { userId?: string; role?: AppRole };

    if (!userId || !role || !ROLE_OPTIONS.includes(role)) {
      return badRequest('userId and valid role are required');
    }

    const { data, error } = await updateUserRole(userId, role, getOrgId(session));
    if (error) {
      return serverError('Failed to update role', error.message);
    }

    return ok(data);
  } catch (error) {
    return serverError('Failed to update user', (error as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    if (session.role !== 'admin') {
      return forbidden('Admin only');
    }

    const body = await req.json();
    const { email, role } = body as { email?: string; role?: AppRole };

    if (!email || !role || !ROLE_OPTIONS.includes(role)) {
      return badRequest('email and valid role are required');
    }

    const { data, error } = await inviteUserToOrganization({
      email,
      role,
      organizationId: getOrgId(session),
      invitedBy: session.appUserId
    });

    if (error) {
      return serverError('Failed to send invitation', error.message);
    }

    return ok(data);
  } catch (error) {
    return serverError('Failed to invite user', (error as Error).message);
  }
}
