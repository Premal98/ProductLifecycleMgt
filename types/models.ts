export type ApiResponse<T> = {
  data: T;
};

export type EntityBase = {
  id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
};

export type Product = EntityBase & {
  name: string;
  sku?: string;
  description?: string;
  lifecycle_stage: string;
  status: string;
};

export type DocumentRecord = EntityBase & {
  title: string;
  file_name: string;
  file_path: string;
  file_url?: string;
};
