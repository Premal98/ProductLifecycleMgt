import { createCollectionHandlers } from '@/services/routeHandlers';
import { bomSchema } from '@/lib/validation';

const handlers = createCollectionHandlers({ table: 'boms', schema: bomSchema, resource: 'boms' });

export const GET = handlers.GET;
export const POST = handlers.POST;
