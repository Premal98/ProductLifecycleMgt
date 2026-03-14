import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().optional(),
  description: z.string().optional(),
  lifecycle_stage: z.enum(["concept", "design", "prototype", "production", "retired"]).optional(),
  status: z.string().optional(),
  version: z.string().optional(),
  owner_id: uuidSchema.optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  category: z.string().optional(),
  compliance_status: z.string().optional()
});

export const projectSchema = z.object({
  product_id: uuidSchema.optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  owner_id: uuidSchema.optional(),
  status: z.string().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional()
});

export const userSchema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  role: z.string().optional(),
  organization_id: uuidSchema.optional()
});

export const organizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  industry: z.string().optional()
});

export const documentSchema = z.object({
  product_id: uuidSchema.optional(),
  project_id: uuidSchema.optional(),
  title: z.string().min(2),
  document_number: z.string().optional(),
  version: z.string().optional(),
  file_type: z.string().optional(),
  file_name: z.string().min(1),
  file_path: z.string().min(1),
  file_url: z.string().url().optional(),
  mime_type: z.string().optional(),
  size_bytes: z.number().optional(),
  owner_id: uuidSchema.optional(),
  status: z.enum(["draft", "review", "approved"]).optional()
});

export const cadFileSchema = z.object({
  product_id: uuidSchema.optional(),
  title: z.string().min(2),
  file_name: z.string().min(1),
  file_path: z.string().min(1),
  file_url: z.string().url().optional(),
  preview_url: z.string().url().optional()
});

export const bomSchema = z.object({
  product_id: uuidSchema,
  bom_number: z.string().optional(),
  revision: z.string().optional(),
  status: z.string().optional()
});

export const componentSchema = z.object({
  bom_id: uuidSchema,
  parent_component_id: uuidSchema.optional(),
  supplier_id: uuidSchema.optional(),
  part_number: z.string().min(1),
  name: z.string().min(2),
  quantity: z.number().min(0),
  unit: z.string().optional(),
  unit_cost: z.number().min(0).optional()
});

export const supplierSchema = z.object({
  name: z.string().min(2),
  contact_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  certifications: z.string().optional(),
  rating: z.number().min(0).max(5).optional()
});

export const changeOrderSchema = z.object({
  product_id: uuidSchema.optional(),
  project_id: uuidSchema.optional(),
  order_number: z.string().optional(),
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  requested_by: uuidSchema.optional()
});

export const workflowSchema = z.object({
  name: z.string().min(2),
  entity_type: z.string().min(2),
  status: z.string().optional(),
  definition: z.record(z.any()).optional()
});

export const commentSchema = z.object({
  entity_type: z.string().min(2),
  entity_id: uuidSchema,
  content: z.string().min(1)
});

export const integrationSchema = z.object({
  provider: z.string().min(2),
  name: z.string().min(2),
  config: z.record(z.any()).optional(),
  is_enabled: z.boolean().optional()
});

export const notificationSchema = z.object({
  user_id: uuidSchema,
  title: z.string().min(2),
  message: z.string().min(2),
  metadata: z.record(z.any()).optional()
});
