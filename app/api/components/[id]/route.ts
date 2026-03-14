import { NextRequest } from 'next/server';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, ok, serverError, unauthorized } from '@/lib/http';
import { componentSchema, uuidSchema } from '@/lib/validation';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    const { id } = await params;
    if (!uuidSchema.safeParse(id).success) return badRequest('Invalid component id');

    const body = await req.json();
    const action = body.action as string | undefined;
    const supabase = createSupabaseServerClient(session.accessToken);
    const orgId = getOrgId(session);

    if (action === 'duplicate') {
      const { data: allComponents, error: fetchError } = await supabase
        .from('components')
        .select('*')
        .eq('organization_id', orgId);
      if (fetchError) return serverError('Failed to fetch components', fetchError.message);

      const target = allComponents?.find((c) => c.id === id);
      if (!target) return badRequest('Component not found');

      const toCopy = new Set<string>([id]);
      let added = true;
      while (added) {
        added = false;
        for (const comp of allComponents || []) {
          if (comp.parent_component_id && toCopy.has(comp.parent_component_id) && !toCopy.has(comp.id)) {
            toCopy.add(comp.id);
            added = true;
          }
        }
      }

      const idMap = new Map<string, string>();
      for (const cid of toCopy) idMap.set(cid, crypto.randomUUID());

      const ordered = (allComponents || []).filter((c) => toCopy.has(c.id));

      const payloads = ordered.map((c) => ({
        bom_id: c.bom_id,
        organization_id: orgId,
        parent_component_id: c.parent_component_id ? idMap.get(c.parent_component_id) : null,
        supplier_id: c.supplier_id,
        part_number: c.part_number,
        name: `${c.name} Copy`,
        quantity: c.quantity,
        unit: c.unit,
        unit_cost: c.unit_cost
      }));

      const { data: inserted, error: insertError } = await supabase.from('components').insert(payloads).select('*');
      if (insertError) return serverError('Failed to duplicate assembly', insertError.message);
      return ok(inserted || []);
    }

    const parsed = componentSchema.partial().safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten());

    const { data, error } = await supabase
      .from('components')
      .update({ ...parsed.data })
      .eq('id', id)
      .eq('organization_id', orgId)
      .select('*')
      .single();

    if (error) return serverError('Failed to update component', error.message);
    return ok(data);
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    const { id } = await params;
    if (!uuidSchema.safeParse(id).success) return badRequest('Invalid component id');

    const supabase = createSupabaseServerClient(session.accessToken);
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id)
      .eq('organization_id', getOrgId(session));

    if (error) return serverError('Failed to delete component', error.message);
    return ok({ id });
  } catch (error) {
    return serverError('Unhandled error', (error as Error).message);
  }
}
