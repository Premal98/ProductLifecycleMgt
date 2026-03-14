import type { AppRole } from '@/types/auth';

type Action = 'read' | 'write' | 'admin';
type RoleGroup = 'admin' | 'engineer' | 'manager' | 'viewer';

type PermissionMap = Record<string, RoleGroup[]>;

const ROLE_GROUP_MAP: Record<AppRole, RoleGroup> = {
  admin: 'admin',
  engineer: 'engineer',
  manager: 'manager',
  viewer: 'viewer',
  product_manager: 'manager',
  procurement_manager: 'manager',
  mechanical_engineer: 'engineer',
  electronics_engineer: 'engineer',
  quality_engineer: 'engineer',
  member: 'viewer'
};

const READ_PERMISSIONS: PermissionMap = {
  dashboard: ['admin', 'engineer', 'manager', 'viewer'],
  products: ['admin', 'engineer', 'manager', 'viewer'],
  projects: ['admin', 'engineer', 'manager', 'viewer'],
  boms: ['admin', 'engineer'],
  documents: ['admin', 'engineer'],
  cad_files: ['admin', 'engineer'],
  suppliers: ['admin', 'manager'],
  reports: ['admin', 'manager'],
  settings: ['admin'],
  users: ['admin']
};

const WRITE_PERMISSIONS: PermissionMap = {
  products: ['admin', 'engineer'],
  projects: ['admin', 'manager'],
  boms: ['admin', 'engineer'],
  components: ['admin', 'engineer'],
  documents: ['admin', 'engineer'],
  cad_files: ['admin', 'engineer'],
  suppliers: ['admin', 'manager'],
  reports: ['admin', 'manager'],
  changes: ['admin', 'manager'],
  workflows: ['admin', 'manager']
};

export function normalizeRole(role: string): RoleGroup {
  return ROLE_GROUP_MAP[role as AppRole] || 'viewer';
}

export function canAccess(role: string, resource: string, action: Action): boolean {
  const roleGroup = normalizeRole(role);

  if (roleGroup === 'admin') {
    return true;
  }

  if (action === 'admin') {
    return false;
  }

  if (action === 'read') {
    const allowed = READ_PERMISSIONS[resource];
    if (!allowed) {
      return true;
    }
    return allowed.includes(roleGroup);
  }

  const allowed = WRITE_PERMISSIONS[resource];
  if (!allowed) {
    return false;
  }

  return allowed.includes(roleGroup);
}
