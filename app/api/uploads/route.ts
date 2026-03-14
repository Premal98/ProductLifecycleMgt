import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, created, ok, serverError, unauthorized } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    const formData = await req.formData();
    const file = formData.get('file');
    const title = String(formData.get('title') || 'Untitled');
    const productId = formData.get('product_id')?.toString() || null;
    const projectId = formData.get('project_id')?.toString() || null;
    const type = (formData.get('type')?.toString() || 'document') as 'document' | 'cad';
    const documentId = formData.get('document_id')?.toString() || null;
    const nextVersion = formData.get('version')?.toString();
    const status = formData.get('status')?.toString() || 'draft';

    if (!file || !(file instanceof File)) return badRequest('File is required');

    const bucket = type === 'cad' ? 'cad-files' : 'documents';
    const orgId = getOrgId(session);
    const path = `${orgId}/${Date.now()}-${file.name}`;
    const bytes = await file.arrayBuffer();
    const supabase = createSupabaseServerClient(session.accessToken);

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, bytes, {
      contentType: file.type,
      upsert: true
    });
    if (uploadError) return serverError('Upload failed', uploadError.message);

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

    const baseDoc = {
      organization_id: orgId,
      product_id: productId,
      project_id: projectId,
      title,
      document_number: formData.get('document_number')?.toString() || undefined,
      version: nextVersion || 'v1',
      file_type: file.type,
      file_name: file.name,
      file_path: path,
      file_url: urlData.publicUrl,
      mime_type: file.type,
      size_bytes: file.size,
      owner_id: session.appUserId || null,
      status
    };

    if (!documentId) {
      const { data, error } = await supabase.from('documents').insert(baseDoc).select('*').single();
      if (error) return serverError('Record creation failed', error.message);
      await supabase.from('versions').insert({
        organization_id: orgId,
        entity_type: 'document',
        entity_id: data.id,
        version_number: 1,
        changelog: 'Initial upload',
        created_by: session.appUserId || null
      });
      return created(data);
    }

    // new revision
    const { data: current } = await supabase.from('documents').select('version').eq('id', documentId).eq('organization_id', orgId).maybeSingle();
    const currentNumber = current?.version ? Number(current.version.replace(/[^0-9]/g, '')) || 1 : 1;
    const newVersion = nextVersion || `v${currentNumber + 1}`;

    const { data: updated, error: updateError } = await supabase
      .from('documents')
      .update({ ...baseDoc, version: newVersion })
      .eq('id', documentId)
      .eq('organization_id', orgId)
      .select('*')
      .single();
    if (updateError) return serverError('Failed to save revision', updateError.message);

    await supabase.from('versions').insert({
      organization_id: orgId,
      entity_type: 'document',
      entity_id: documentId,
      version_number: Number(newVersion.replace(/[^0-9]/g, '')) || currentNumber + 1,
      changelog: `Revision uploaded (${newVersion})`,
      created_by: session.appUserId || null
    });

    return ok(updated);
  } catch (error) {
    return serverError('Upload endpoint failed', (error as Error).message);
  }
}
