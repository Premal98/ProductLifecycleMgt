import { NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { ok, unauthorized } from '@/lib/http';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return unauthorized();
  }

  const supabase = createSupabaseServerClient(session.accessToken);
  const { data: organization } = await supabase
    .from('organizations')
    .select('id,name,slug,industry')
    .eq('id', session.organizationId)
    .maybeSingle();

  return ok({ ...session, organization });
}
