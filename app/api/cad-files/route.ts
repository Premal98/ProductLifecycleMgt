import { createCollectionHandlers } from '@/services/routeHandlers';
import { cadFileSchema } from '@/lib/validation';

const handlers = createCollectionHandlers({ table: 'cad_files', schema: cadFileSchema, resource: 'cad_files' });

export const GET = handlers.GET;
export const POST = handlers.POST;
