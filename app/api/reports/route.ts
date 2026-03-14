import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { ok, serverError, unauthorized } from '@/lib/http';
import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { ensureDemoDataForOrg } from '@/services/demoDataService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    const orgId = getOrgId(session);
    await ensureDemoDataForOrg({ organizationId: orgId, ownerUserId: session.appUserId, ownerRole: session.role });

    const supabase = createSupabaseServerClient(session.accessToken);

    const [products, projects, openChanges, upcomingMilestones, recentDocuments] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'active'),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('organization_id', orgId).in('status', ['planning', 'in_progress']),
      supabase.from('change_orders').select('id', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'open'),
      supabase.from('milestones').select('id,name,due_date,status,project_id').eq('organization_id', orgId).gte('due_date', new Date().toISOString().slice(0, 10)).order('due_date', { ascending: true }).limit(5),
      supabase.from('documents').select('id,title,file_name,created_at').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(5)
    ]);

    return ok({
      activeProducts: products.count || 0,
      activeProjects: projects.count || 0,
      openChangeOrders: openChanges.count || 0,
      upcomingMilestones: upcomingMilestones.data || [],
      recentDocuments: recentDocuments.data || []
    });
  } catch (error) {
    return serverError('Report generation failed', (error as Error).message);
  }
}
