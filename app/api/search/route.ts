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

    const orgId = getOrgId(session);
    const q = req.nextUrl.searchParams.get('q')?.trim() || '';
    const supabase = createSupabaseServerClient(session.accessToken);

    const [products, documents, components, suppliers] = await Promise.all([
      supabase.from('products').select('id,name,sku,description').eq('organization_id', orgId).or(`name.ilike.%${q}%,sku.ilike.%${q}%`).limit(10),
      supabase.from('documents').select('id,title,file_name').eq('organization_id', orgId).or(`title.ilike.%${q}%,file_name.ilike.%${q}%`).limit(10),
      supabase.from('components').select('id,name,part_number').eq('organization_id', orgId).or(`name.ilike.%${q}%,part_number.ilike.%${q}%`).limit(10),
      supabase.from('suppliers').select('id,name,email').eq('organization_id', orgId).ilike('name', `%${q}%`).limit(10)
    ]);

    return ok({
      products: products.data || [],
      documents: documents.data || [],
      components: components.data || [],
      suppliers: suppliers.data || []
    });
  } catch (error) {
    return serverError('Search failed', (error as Error).message);
  }
}
