import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { forbidden, ok, serverError, unauthorized } from '@/lib/http';
import { canAccess } from '@/lib/rbac';
import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { ensureDemoDataForOrg } from '@/services/demoDataService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return unauthorized();
    }

    if (!canAccess(session.role, 'reports', 'read')) {
      return forbidden('Insufficient permissions');
    }

    const orgId = getOrgId(session);
    await ensureDemoDataForOrg({ organizationId: orgId, ownerUserId: session.appUserId, ownerRole: session.role });

    const supabase = createSupabaseServerClient(session.accessToken);

    const allowProducts = canAccess(session.role, 'products', 'read');
    const allowProjects = canAccess(session.role, 'projects', 'read');
    const allowChanges = canAccess(session.role, 'changes', 'read');
    const allowDocuments = canAccess(session.role, 'documents', 'read');

    const productsPromise = allowProducts
      ? supabase.from('products').select('id', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'active')
      : Promise.resolve({ count: 0 });
    const projectsPromise = allowProjects
      ? supabase.from('projects').select('id', { count: 'exact', head: true }).eq('organization_id', orgId).in('status', ['planning', 'in_progress'])
      : Promise.resolve({ count: 0 });
    const changesPromise = allowChanges
      ? supabase.from('change_orders').select('id', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'open')
      : Promise.resolve({ count: 0 });
    const milestonesPromise = allowProjects
      ? supabase.from('milestones').select('id,name,due_date,status,project_id').eq('organization_id', orgId).gte('due_date', new Date().toISOString().slice(0, 10)).order('due_date', { ascending: true }).limit(5)
      : Promise.resolve({ data: [] });
    const documentsPromise = allowDocuments
      ? supabase.from('documents').select('id,title,file_name,created_at').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(5)
      : Promise.resolve({ data: [] });

    const [products, projects, openChanges, upcomingMilestones, recentDocuments] = await Promise.all([
      productsPromise,
      projectsPromise,
      changesPromise,
      milestonesPromise,
      documentsPromise
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