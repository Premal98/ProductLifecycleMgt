import { createCollectionHandlers } from '@/services/routeHandlers';
import { changeOrderSchema } from '@/lib/validation';

const handlers = createCollectionHandlers({ table: 'change_orders', schema: changeOrderSchema, resource: 'changes' });

export const GET = handlers.GET;
export const POST = handlers.POST;
