export type AppRole =
  | 'admin'
  | 'engineer'
  | 'manager'
  | 'viewer'
  | 'product_manager'
  | 'mechanical_engineer'
  | 'electronics_engineer'
  | 'quality_engineer'
  | 'procurement_manager'
  | 'member';

export const DEFAULT_ROLE_OPTIONS: AppRole[] = ['admin', 'engineer', 'manager', 'viewer'];

export const ROLE_OPTIONS: AppRole[] = [
  ...DEFAULT_ROLE_OPTIONS,
  'product_manager',
  'mechanical_engineer',
  'electronics_engineer',
  'quality_engineer',
  'procurement_manager',
  'member'
];

export const DEFAULT_TEAMS = [
  'Product Management',
  'Mechanical Engineering',
  'Electronics & Firmware',
  'Quality & Supply Chain'
] as const;
