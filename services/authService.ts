import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { getSupabaseAdminClient } from '@/lib/supabaseAdminClient';
import { ensureDemoDataForOrg } from '@/services/demoDataService';
import { DEFAULT_TEAMS, type AppRole } from '@/types/auth';

export type SignupInput = {
  email: string;
  password: string;
  fullName?: string;
  organizationName: string;
  industry?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type InviteInput = {
  email: string;
  role: AppRole;
  organizationId: string;
  invitedBy: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

async function createDefaultTeams(organizationId: string) {
  const admin = getSupabaseAdminClient();
  const rows = DEFAULT_TEAMS.map((name) => ({
    organization_id: organizationId,
    name,
    description: `${name} team`
  }));
  await admin.from('teams').upsert(rows, { onConflict: 'organization_id,name' });
}

export async function signupWithEmail(input: SignupInput) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { data: null, error: new Error('Service role key missing: set SUPABASE_SERVICE_ROLE_KEY.') };
  }

  const supabase = createSupabaseServerClient();
  const admin = getSupabaseAdminClient();

  try {
    const { data: authResult, error: createError } = await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        full_name: input.fullName || '',
        organization_name: input.organizationName,
        role: 'admin'
      }
    });

    if (createError || !authResult.user) {
      return { data: null, error: createError || new Error('Failed to create auth user') };
    }

    const baseSlug = slugify(input.organizationName) || 'organization';
    const slug = `${baseSlug}-${authResult.user.id.slice(0, 8)}`;

    const { data: organization, error: orgError } = await admin
      .from('organizations')
      .insert({ name: input.organizationName, slug, industry: input.industry || null })
      .select('*')
      .single();

    if (orgError || !organization) {
      return { data: null, error: orgError || new Error('Failed to create organization') };
    }

    const { data: userRow, error: userError } = await admin
      .from('users')
      .insert({
        auth_user_id: authResult.user.id,
        organization_id: organization.id,
        email: input.email,
        full_name: input.fullName || null,
        role: 'admin',
        is_active: true
      })
      .select('id')
      .single();

    if (userError) {
      return { data: null, error: userError };
    }

    await createDefaultTeams(organization.id as string);
    await ensureDemoDataForOrg({ organizationId: organization.id as string, ownerUserId: userRow?.id, ownerRole: 'admin' });

    const { error: updateError } = await admin.auth.admin.updateUserById(authResult.user.id, {
      user_metadata: {
        full_name: input.fullName || '',
        organization_id: organization.id,
        role: 'admin'
      }
    });

    if (updateError) {
      return { data: null, error: updateError };
    }

    return { data: { user: authResult.user, organization }, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export async function loginWithEmail(input: LoginInput) {
  const supabase = createSupabaseServerClient();
  const result = await supabase.auth.signInWithPassword({ email: input.email, password: input.password });

  // Best-effort sync with invitations and metadata when service role key is present
  if (result.data.user && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      await syncUserMembership(result.data.user.id, result.data.user.email || '');
    } catch (err) {
      // Do not block login if metadata sync fails
      console.error('Membership sync skipped:', err);
    }
  }
  return result;
}

export async function syncUserMembership(authUserId: string, email: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const admin = getSupabaseAdminClient();

  const { data: existing } = await admin
    .from('users')
    .select('id,organization_id,role')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (existing) {
    await admin.auth.admin.updateUserById(authUserId, {
      user_metadata: {
        organization_id: existing.organization_id,
        role: existing.role
      }
    });
    return existing;
  }

  const { data: invitation } = await admin
    .from('invitations')
    .select('*')
    .eq('email', email)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .maybeSingle();

  if (!invitation) {
    return null;
  }

  const { data: createdUser, error } = await admin
    .from('users')
    .insert({
      auth_user_id: authUserId,
      organization_id: invitation.organization_id,
      email,
      role: invitation.role,
      is_active: true
    })
    .select('id,organization_id,role')
    .single();

  if (error || !createdUser) {
    return null;
  }

  await admin.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id);
  await admin.auth.admin.updateUserById(authUserId, {
    user_metadata: {
      organization_id: createdUser.organization_id,
      role: createdUser.role
    }
  });

  return createdUser;
}

export async function inviteUserToOrganization(input: InviteInput) {
  const admin = getSupabaseAdminClient();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

  const { data: invitation, error: invitationError } = await admin
    .from('invitations')
    .insert({
      organization_id: input.organizationId,
      email: input.email,
      role: input.role,
      invited_by: input.invitedBy,
      token,
      expires_at: expiresAt
    })
    .select('*')
    .single();

  if (invitationError) {
    return { data: null, error: invitationError };
  }

  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;
  const inviteResult = await admin.auth.admin.inviteUserByEmail(input.email, {
    redirectTo,
    data: {
      organization_id: input.organizationId,
      role: input.role,
      invitation_token: token
    }
  });

  if (inviteResult.error) {
    return { data: null, error: inviteResult.error };
  }

  return { data: invitation, error: null };
}

export async function updateUserRole(userId: string, role: AppRole, organizationId: string) {
  const admin = getSupabaseAdminClient();

  const { data: user, error } = await admin
    .from('users')
    .update({ role })
    .eq('id', userId)
    .eq('organization_id', organizationId)
    .select('id,auth_user_id,organization_id,role')
    .single();

  if (error || !user) {
    return { data: null, error };
  }

  if (user.auth_user_id) {
    await admin.auth.admin.updateUserById(user.auth_user_id as string, {
      user_metadata: {
        organization_id: user.organization_id,
        role
      }
    });
  }

  return { data: user, error: null };
}

export function applySessionCookies(response: NextResponse, session: { access_token: string; refresh_token: string }, user: { id: string; user_metadata?: Record<string, unknown> }) {
  const organizationId = (user.user_metadata?.organization_id as string) || '';
  const role = (user.user_metadata?.role as string) || 'member';
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: process.env.NODE_ENV === 'production'
  };

  response.cookies.set('plm-access-token', session.access_token, cookieOptions);
  response.cookies.set('plm-refresh-token', session.refresh_token, cookieOptions);
  response.cookies.set('plm-user-id', user.id, cookieOptions);
  response.cookies.set('plm-role', role, cookieOptions);
  response.cookies.set('plm-org-id', organizationId, cookieOptions);
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.delete('plm-access-token');
  response.cookies.delete('plm-refresh-token');
  response.cookies.delete('plm-user-id');
  response.cookies.delete('plm-role');
  response.cookies.delete('plm-org-id');
}
