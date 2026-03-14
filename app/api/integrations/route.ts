import { createCollectionHandlers } from '@/services/routeHandlers';
import { integrationSchema } from '@/lib/validation';

const handlers = createCollectionHandlers({ table: 'integrations', schema: integrationSchema });

export const GET = handlers.GET;
export const POST = handlers.POST;
