import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { ok, serverError, unauthorized } from '@/lib/http';
import { canAccess } from '@/lib/rbac';
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

    const allowProducts = canAccess(session.role, 'products', 'read');
    const allowDocuments = canAccess(session.role, 'documents', 'read');
    const allowComponents = canAccess(session.role, 'boms', 'read');
    const allowSuppliers = canAccess(session.role, 'suppliers', 'read');

    const productsPromise = allowProducts
      ? supabase.from('products').select('id,name,sku,description').eq('organization_id', orgId).or(`name.ilike.%${q}%,sku.ilike.%${q}%`).limit(10)
      : Promise.resolve({ data: [] });
    const documentsPromise = allowDocuments
      ? supabase.from('documents').select('id,title,file_name').eq('organization_id', orgId).or(`title.ilike.%${q}%,file_name.ilike.%${q}%`).limit(10)
      : Promise.resolve({ data: [] });
    const componentsPromise = allowComponents
      ? supabase.from('components').select('id,name,part_number').eq('organization_id', orgId).or(`name.ilike.%${q}%,part_number.ilike.%${q}%`).limit(10)
      : Promise.resolve({ data: [] });
    const suppliersPromise = allowSuppliers
      ? supabase.from('suppliers').select('id,name,email').eq('organization_id', orgId).ilike('name', `%${q}%`).limit(10)
      : Promise.resolve({ data: [] });

    const [products, documents, components, suppliers] = await Promise.all([
      productsPromise,
      documentsPromise,
      componentsPromise,
      suppliersPromise
    ]);

    return ok({
      products: allowProducts ? products.data || [] : [],
      documents: allowDocuments ? documents.data || [] : [],
      components: allowComponents ? components.data || [] : [],
      suppliers: allowSuppliers ? suppliers.data || [] : []
    });
  } catch (error) {
    return serverError('Search failed', (error as Error).message);
  }
}