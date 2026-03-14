import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, forbidden, ok, serverError, unauthorized } from '@/lib/http';
import { canAccess } from '@/lib/rbac';
import { productSchema, uuidSchema } from '@/lib/validation';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser(_req);
    if (!session) return unauthorized();

    if (!canAccess(session.role, 'products', 'read')) {
      return forbidden('Insufficient permissions');
    }

    const { id } = await params;
    if (!uuidSchema.safeParse(id).success) return badRequest('Invalid product id');

    const supabase = createSupabaseServerClient(session.accessToken);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', getOrgId(session))
      .eq('id', id)
      .maybeSingle();

    if (error) return serverError('Failed to fetch product', error.message);
    if (!data) return badRequest('Product not found');
    return ok(data);
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (!canAccess(session.role, 'products', 'write')) return forbidden('Insufficient permissions');

    const { id: productId } = await params;
    const body = await req.json();
    const action = body.action as string | undefined;
    const supabase = createSupabaseServerClient(session.accessToken);
    const orgId = getOrgId(session);

    if (action === 'archive') {
      const { error } = await supabase.from('products').update({ status: 'archived', lifecycle_stage: 'retired' }).eq('id', productId).eq('organization_id', orgId);
      if (error) return serverError('Failed to archive product', error.message);
      return ok({ id: productId, status: 'archived' });
    }

    if (action === 'duplicate') {
      const { data: existing, error } = await supabase.from('products').select('*').eq('id', productId).eq('organization_id', orgId).maybeSingle();
      if (error || !existing) return serverError('Failed to duplicate product', error?.message || 'Not found');
      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert({
          ...existing,
          id: undefined,
          name: `${existing.name} Copy`,
          sku: existing.sku ? `${existing.sku}-COPY` : null,
          created_at: undefined,
          updated_at: undefined,
          version: existing.version || 'v1'
        })
        .select('*')
        .single();
      if (insertError) return serverError('Failed to duplicate product', insertError.message);
      return ok(inserted);
    }

    if (action === 'newVersion') {
      const { data: existing, error } = await supabase.from('products').select('version').eq('id', productId).eq('organization_id', orgId).maybeSingle();
      if (error || !existing) return serverError('Failed to version product', error?.message || 'Not found');
      const current = existing.version || 'v1';
      const nextNumber = Number(current.replace(/[^0-9]/g, '')) + 1 || 2;
      const nextVersion = `v${nextNumber}`;
      const { error: updateError, data } = await supabase
        .from('products')
        .update({ version: nextVersion, lifecycle_stage: body.lifecycle_stage || 'design' })
        .eq('id', productId)
        .eq('organization_id', orgId)
        .select('*')
        .single();
      if (updateError) return serverError('Failed to bump version', updateError.message);
      return ok(data);
    }

    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());

    const { data, error } = await supabase
      .from('products')
      .update({ ...parsed.data })
      .eq('id', productId)
      .eq('organization_id', orgId)
      .select('*')
      .single();

    if (error) return serverError('Failed to update product', error.message);
    return ok(data);
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}