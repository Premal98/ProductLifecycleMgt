import { createCollectionHandlers } from '@/services/routeHandlers';
import { commentSchema } from '@/lib/validation';

const handlers = createCollectionHandlers({ table: 'comments', schema: commentSchema });

export const GET = handlers.GET;
export const POST = handlers.POST;
