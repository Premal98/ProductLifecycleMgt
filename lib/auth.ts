import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';
import type { AppRole } from '@/types/auth';

export type SessionUser = {
  userId: string;
  appUserId: string;
  organizationId: string;
  role: AppRole;
  email: string;
  accessToken: string;
};

export async function getSessionUser(req: NextRequest): Promise<SessionUser | null> {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return null;
  }

  const supabase = createSupabaseServerClient(accessToken);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user || !data.user.email) {
    return null;
  }

  const { data: appUser } = await supabase
    .from('users')
    .select('id,organization_id,role,email')
    .eq('auth_user_id', data.user.id)
    .maybeSingle();

  if (!appUser) {
    return null;
  }

  return {
    userId: data.user.id,
    appUserId: appUser.id as string,
    organizationId: appUser.organization_id as string,
    role: (appUser.role as AppRole) || 'member',
    email: appUser.email as string,
    accessToken
  };
}

export function getOrgId(session: SessionUser): string {
  return session.organizationId;
}

export function getAccessToken(req: NextRequest): string | null {
  const bearer = req.headers.get('authorization');
  if (bearer?.startsWith('Bearer ')) {
    return bearer.slice(7);
  }

  return req.cookies.get('plm-access-token')?.value || null;
}
