import { createCollectionHandlers } from '@/services/routeHandlers';
import { documentSchema } from '@/lib/validation';

const handlers = createCollectionHandlers({ table: 'documents', schema: documentSchema, resource: 'documents' });

export const GET = handlers.GET;
export const POST = handlers.POST;
