import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, created, ok, serverError, unauthorized } from '@/lib/http';
import { notificationSchema } from '@/lib/validation';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    const supabase = createSupabaseServerClient(session.accessToken);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('organization_id', getOrgId(session))
      .eq('user_id', session.appUserId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return serverError('Failed to fetch notifications', error.message);
    }

    return ok(data || []);
  } catch (error) {
    return serverError('Failed to fetch notifications', (error as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    const body = await req.json();
    const parsed = notificationSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten());
    }

    const supabase = createSupabaseServerClient(session.accessToken);
    const { data, error } = await supabase
      .from('notifications')
      .insert({ ...parsed.data, organization_id: getOrgId(session) })
      .select('*')
      .single();

    if (error) {
      return serverError('Failed to create notification', error.message);
    }

    return created(data);
  } catch (error) {
    return serverError('Failed to create notification', (error as Error).message);
  }
}
