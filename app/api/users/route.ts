import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, forbidden, ok, serverError, unauthorized } from '@/lib/http';
import { DEFAULT_ROLE_OPTIONS, type AppRole } from '@/types/auth';
import {
  createUserInOrganization,
  deleteUserFromOrganization,
  inviteUserToOrganization,
  setUserActiveStatus,
  updateUserRole
} from '@/services/authService';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    if (session.role !== 'admin') {
      return forbidden('Admin only');
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
    const { action, userId, role, is_active } = body as {
      action?: 'role' | 'status';
      userId?: string;
      role?: AppRole;
      is_active?: boolean;
    };

    if (!userId) {
      return badRequest('userId is required');
    }

    if (action === 'status') {
      if (typeof is_active !== 'boolean') {
        return badRequest('is_active must be provided for status updates');
      }

      if (userId === session.appUserId) {
        return forbidden('You cannot deactivate your own account');
      }

      const { data, error } = await setUserActiveStatus(userId, is_active, getOrgId(session));
      if (error) {
        return serverError('Failed to update user status', error.message);
      }

      return ok(data);
    }

    if (!role || !DEFAULT_ROLE_OPTIONS.includes(role)) {
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
    const { action, email, role, full_name, password } = body as {
      action?: 'invite' | 'create';
      email?: string;
      role?: AppRole;
      full_name?: string;
      password?: string;
    };

    if (!email || !role || !DEFAULT_ROLE_OPTIONS.includes(role)) {
      return badRequest('email and valid role are required');
    }

    if (action === 'create') {
      const fullName = full_name?.trim() ?? '';
      if (!fullName || !password) {
        return badRequest('full_name and password are required for user creation');
      }

      const { data, error } = await createUserInOrganization({
        email,
        fullName,
        role,
        organizationId: getOrgId(session),
        password
      });

      if (error) {
        return serverError('Failed to create user', error.message);
      }

      return ok({ user: data });
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

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    if (session.role !== 'admin') {
      return forbidden('Admin only');
    }

    const body = await req.json().catch(() => ({} as { userId?: string }));
    const { userId } = body;

    if (!userId) {
      return badRequest('userId is required');
    }

    if (userId === session.appUserId) {
      return forbidden('You cannot delete your own account');
    }

    const { data, error } = await deleteUserFromOrganization(userId, getOrgId(session));
    if (error) {
      return serverError('Failed to delete user', error.message);
    }

    return ok({ deleted: data });
  } catch (error) {
    return serverError('Failed to delete user', (error as Error).message);
  }
}
