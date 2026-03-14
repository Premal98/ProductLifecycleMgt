import type { AppRole } from '@/types/auth';

type Action = 'read' | 'write' | 'admin';

type PermissionMap = Record<string, AppRole[]>;

const WRITE_PERMISSIONS: PermissionMap = {
  products: ['admin', 'product_manager'],
  projects: ['admin', 'product_manager'],
  boms: ['admin', 'product_manager', 'mechanical_engineer', 'electronics_engineer'],
  cad_files: ['admin', 'mechanical_engineer', 'electronics_engineer'],
  documents: ['admin', 'product_manager', 'mechanical_engineer', 'electronics_engineer', 'quality_engineer'],
  suppliers: ['admin', 'procurement_manager'],
  costs: ['admin', 'procurement_manager'],
  workflows: ['admin', 'quality_engineer'],
  changes: ['admin', 'product_manager', 'quality_engineer']
};

export function canAccess(role: string, resource: string, action: Action): boolean {
  const appRole = role as AppRole;

  if (appRole === 'admin') {
    return true;
  }

  if (action === 'read') {
    return true;
  }

  if (action === 'admin') {
    return false;
  }

  const allowed = WRITE_PERMISSIONS[resource] || [];
  return allowed.includes(appRole);
}
