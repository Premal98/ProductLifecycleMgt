export type AppRole =
  | 'admin'
  | 'product_manager'
  | 'mechanical_engineer'
  | 'electronics_engineer'
  | 'quality_engineer'
  | 'procurement_manager'
  | 'member';

export const ROLE_OPTIONS: AppRole[] = [
  'admin',
  'product_manager',
  'mechanical_engineer',
  'electronics_engineer',
  'quality_engineer',
  'procurement_manager'
];

export const DEFAULT_TEAMS = [
  'Product Management',
  'Mechanical Engineering',
  'Electronics & Firmware',
  'Quality & Supply Chain'
] as const;
