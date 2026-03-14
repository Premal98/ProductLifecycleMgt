import { createCollectionHandlers } from '@/services/routeHandlers';
import { workflowSchema } from '@/lib/validation';

const handlers = createCollectionHandlers({ table: 'workflows', schema: workflowSchema, resource: 'workflows' });

export const GET = handlers.GET;
export const POST = handlers.POST;
