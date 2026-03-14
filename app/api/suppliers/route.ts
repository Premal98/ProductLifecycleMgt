import { createCollectionHandlers } from '@/services/routeHandlers';
import { supplierSchema } from '@/lib/validation';

const handlers = createCollectionHandlers({ table: 'suppliers', schema: supplierSchema, resource: 'suppliers' });

export const GET = handlers.GET;
export const POST = handlers.POST;
