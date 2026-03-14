import { NextRequest } from 'next/server';
import { ZodTypeAny } from 'zod';
import { getOrgId, getSessionUser } from '@/lib/auth';
import { badRequest, created, forbidden, ok, serverError, unauthorized } from '@/lib/http';
import { canAccess } from '@/lib/rbac';
import { createByOrg, createOne, listAll, listByOrg, validateBody } from '@/services/crudService';

type HandlerOptions = {
  table: string;
  schema: ZodTypeAny;
  authRequired?: boolean;
  orgScoped?: boolean;
  resource?: string;
};

export function createCollectionHandlers(options: HandlerOptions) {
  async function GET(req: NextRequest) {
    try {
      const session = await getSessionUser(req);
      if (options.authRequired !== false && !session) {
        return unauthorized();
      }

      if (session && options.resource && !canAccess(session.role, options.resource, 'read')) {
        return forbidden('Insufficient permissions');
      }

      if (options.orgScoped === false) {
        const { data, error } = await listAll(options.table, session?.accessToken);
        if (error) {
          return serverError('Failed to fetch records', error.message);
        }
        return ok(data || []);
      }

      if (!session) {
        return unauthorized();
      }

      const orgId = getOrgId(session);
      const { data, error } = await listByOrg(options.table, orgId, session.accessToken);
      if (error) {
        return serverError('Failed to fetch records', error.message);
      }
      return ok(data || []);
    } catch (error) {
      return serverError('Unhandled error', (error as Error).message);
    }
  }

  async function POST(req: NextRequest) {
    try {
      const session = await getSessionUser(req);
      if (options.authRequired !== false && !session) {
        return unauthorized();
      }

      if (session && options.resource && !canAccess(session.role, options.resource, 'write')) {
        return forbidden('Insufficient permissions');
      }

      const body = await req.json();
      const parsed = validateBody(options.schema, body);
      if (!parsed.success) {
        return badRequest('Validation failed', parsed.error.flatten());
      }

      const payload = parsed.data as Record<string, unknown>;
      if (!payload.requested_by && session?.appUserId && options.table === 'change_orders') {
        payload.requested_by = session.appUserId;
      }
      if (!payload.created_by && session?.appUserId && (options.table === 'products' || options.table === 'boms')) {
        payload.created_by = session.appUserId;
      }

      if (options.orgScoped === false) {
        const { data, error } = await createOne(options.table, payload, session?.accessToken);
        if (error) {
          return serverError('Failed to create record', error.message);
        }
        return created(data);
      }

      if (!session) {
        return unauthorized();
      }

      const orgId = getOrgId(session);
      const { data, error } = await createByOrg(options.table, orgId, payload, session.accessToken);
      if (error) {
        return serverError('Failed to create record', error.message);
      }
      return created(data);
    } catch (error) {
      return serverError('Unhandled error', (error as Error).message);
    }
  }

  return { GET, POST };
}

