import { createClient } from '@supabase/supabase-js';

type Row = Record<string, unknown>;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const ORG_ID = '0f1f0000-0000-4000-8000-000000000001';

const users = [
  { id: '0f2f0000-0000-4000-8000-000000000001', organization_id: ORG_ID, email: 'alex.mercer@novatechmfg.com', full_name: 'Alex Mercer', role: 'admin', is_active: true },
  { id: '0f2f0000-0000-4000-8000-000000000002', organization_id: ORG_ID, email: 'priya.nair@novatechmfg.com', full_name: 'Priya Nair', role: 'product_manager', is_active: true },
  { id: '0f2f0000-0000-4000-8000-000000000003', organization_id: ORG_ID, email: 'liam.hart@novatechmfg.com', full_name: 'Liam Hart', role: 'mechanical_engineer', is_active: true },
  { id: '0f2f0000-0000-4000-8000-000000000004', organization_id: ORG_ID, email: 'sofia.chen@novatechmfg.com', full_name: 'Sofia Chen', role: 'electronics_engineer', is_active: true },
  { id: '0f2f0000-0000-4000-8000-000000000005', organization_id: ORG_ID, email: 'daniel.ross@novatechmfg.com', full_name: 'Daniel Ross', role: 'quality_engineer', is_active: true },
  { id: '0f2f0000-0000-4000-8000-000000000006', organization_id: ORG_ID, email: 'meera.kapoor@novatechmfg.com', full_name: 'Meera Kapoor', role: 'procurement_manager', is_active: true }
];

const products = [
  { id: '0f5f0000-0000-4000-8000-000000000001', organization_id: ORG_ID, name: 'NovaPulse Portable Patient Monitor', sku: 'MED-NPM-300', lifecycle_stage: 'design', status: 'active', created_by: users[1].id },
  { id: '0f5f0000-0000-4000-8000-000000000002', organization_id: ORG_ID, name: 'VascuTrack Digital Blood Pressure Monitor', sku: 'MED-DBP-120', lifecycle_stage: 'prototype', status: 'active', created_by: users[1].id },
  { id: '0f5f0000-0000-4000-8000-000000000003', organization_id: ORG_ID, name: 'MediFlow Smart Infusion Pump', sku: 'MED-INF-500', lifecycle_stage: 'engineering_validation', status: 'active', created_by: users[1].id },
  { id: '0f5f0000-0000-4000-8000-000000000004', organization_id: ORG_ID, name: 'IronTrack Smart Conveyor Belt Controller', sku: 'IND-CNV-410', lifecycle_stage: 'design', status: 'active', created_by: users[1].id },
  { id: '0f5f0000-0000-4000-8000-000000000005', organization_id: ORG_ID, name: 'Sentinel S1 Smart Home Security Camera', sku: 'CON-CAM-710', lifecycle_stage: 'engineering_validation', status: 'active', created_by: users[1].id },
  { id: '0f5f0000-0000-4000-8000-000000000006', organization_id: ORG_ID, name: 'AeroSense IoT Environmental Sensor Hub', sku: 'IOT-ENV-260', lifecycle_stage: 'design', status: 'active', created_by: users[1].id }
];

const projects = products.map((p, i) => ({
  id: `0f6f0000-0000-4000-8000-00000000000${i + 1}`,
  organization_id: ORG_ID,
  product_id: p.id,
  name: `${p.sku} Development Program`,
  description: `Cross-functional development project for ${p.name}.`,
  owner_id: users[1].id,
  status: i < 5 ? 'in_progress' : 'planning',
  start_date: `2026-0${(i % 3) + 1}-10`,
  due_date: `2026-1${(i % 3) + 0}-20`
}));

function seq(prefix: string, n: number) {
  return `${prefix}${n.toString().padStart(3, '0')}`;
}

const milestoneNames = ['Concept Design', 'Prototype Development', 'Engineering Validation', 'Manufacturing Preparation'];
const milestones = projects.flatMap((project, pi) =>
  milestoneNames.map((name, mi) => ({
    id: seq('2e0e0000-0000-4000-8000-000000000', pi * 4 + mi + 1),
    organization_id: ORG_ID,
    project_id: project.id,
    name,
    description: `${name} milestone for ${project.name}`,
    due_date: `2026-${String(2 + mi).padStart(2, '0')}-${String(5 + pi).padStart(2, '0')}`,
    status: mi === 0 ? 'completed' : mi === 1 ? 'in_progress' : 'pending'
  }))
);

const tasks = milestones.slice(0, 18).map((m, i) => ({
  id: seq('2f0f0000-0000-4000-8000-000000000', i + 1),
  organization_id: ORG_ID,
  project_id: m.project_id,
  milestone_id: m.id,
  title: `Engineering task ${i + 1}`,
  description: `Execution task for ${m.name} on project ${m.project_id}.`,
  assignee_id: users[(i % 4) + 2].id,
  status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'in_progress' : 'pending',
  priority: i % 2 === 0 ? 'high' : 'medium',
  due_date: `2026-${String((i % 8) + 2).padStart(2, '0')}-15`
}));

const suppliers = [
  { id: '0f4f0000-0000-4000-8000-000000000001', organization_id: ORG_ID, name: 'Precision Sensorics', contact_name: 'Elena Varga', email: 'sales@precisionsensorics.com', certifications: 'ISO9001, ISO13485', rating: 4.7 },
  { id: '0f4f0000-0000-4000-8000-000000000002', organization_id: ORG_ID, name: 'CircuitForge Electronics', contact_name: 'Ravi Menon', email: 'account@circuitforge.com', certifications: 'IPC-A-610 Class 3', rating: 4.5 },
  { id: '0f4f0000-0000-4000-8000-000000000003', organization_id: ORG_ID, name: 'BioShield Polymers', contact_name: 'Claire Donnelly', email: 'support@bioshieldpolymers.com', certifications: 'RoHS, REACH', rating: 4.4 },
  { id: '0f4f0000-0000-4000-8000-000000000004', organization_id: ORG_ID, name: 'SteriCore Materials', contact_name: 'Hiro Tanaka', email: 'medgrade@stericore.com', certifications: 'ISO10993', rating: 4.8 },
  { id: '0f4f0000-0000-4000-8000-000000000005', organization_id: ORG_ID, name: 'MotionWorks Mechanical', contact_name: 'Jonas Berg', email: 'quotes@motionworksmech.com', certifications: 'AS9100', rating: 4.6 },
  { id: '0f4f0000-0000-4000-8000-000000000006', organization_id: ORG_ID, name: 'PowerCore Modules', contact_name: 'Fatima Noor', email: 'oem@powercoremodules.com', certifications: 'UL, CE', rating: 4.55 }
];

const boms = products.map((p, i) => ({
  id: `0f7f0000-0000-4000-8000-00000000000${i + 1}`,
  organization_id: ORG_ID,
  product_id: p.id,
  bom_number: `BOM-${p.sku}-${String.fromCharCode(65 + (i % 3))}`,
  revision: ['A', 'A', 'B', 'B', 'C', 'A'][i],
  status: i === 0 || i === 4 ? 'released' : 'draft',
  created_by: users[3].id
}));

const components = Array.from({ length: 22 }).map((_, i) => ({
  id: seq('0f8f0000-0000-4000-8000-000000000', i + 1),
  organization_id: ORG_ID,
  bom_id: boms[i % boms.length].id,
  supplier_id: suppliers[i % suppliers.length].id,
  part_number: `NT-PART-${String(i + 1).padStart(3, '0')}`,
  name: ['Microcontroller', 'PCB Board', 'Power Module', 'Sensor', 'Enclosure', 'Mounting Bracket'][i % 6],
  quantity: (i % 3) + 1,
  unit: 'pcs',
  unit_cost: Number((3.5 + i * 1.15).toFixed(2))
}));

async function upsert(table: string, rows: Row[], onConflict = 'id') {
  if (!rows.length) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }
}

async function run() {
  await upsert('organizations', [{ id: ORG_ID, name: 'NovaTech Manufacturing Group', slug: 'novatech-manufacturing-group', industry: 'Medical Devices, Industrial Equipment, Consumer Electronics, Smart Hardware, Automation' }]);
  await upsert('users', users);
  await upsert('teams', [
    { id: '0f3f0000-0000-4000-8000-000000000001', organization_id: ORG_ID, name: 'Product Management', description: 'Portfolio planning and lifecycle governance' },
    { id: '0f3f0000-0000-4000-8000-000000000002', organization_id: ORG_ID, name: 'Mechanical Engineering', description: 'CAD and enclosure development' },
    { id: '0f3f0000-0000-4000-8000-000000000003', organization_id: ORG_ID, name: 'Electronics & Firmware', description: 'PCB and embedded engineering' },
    { id: '0f3f0000-0000-4000-8000-000000000004', organization_id: ORG_ID, name: 'Quality & Supply Chain', description: 'Supplier and quality operations' }
  ]);
  await upsert('suppliers', suppliers);
  await upsert('products', products);
  await upsert('projects', projects);
  await upsert('milestones', milestones);
  await upsert('tasks', tasks);
  await upsert('boms', boms);
  await upsert('components', components);
  await upsert('change_orders', [
    { id: '1c0c0000-0000-4000-8000-000000000001', organization_id: ORG_ID, product_id: products[0].id, project_id: projects[0].id, order_number: 'ECO-2026-014', title: 'Replace sensor module', description: 'Replace noisy sensor variant with validated module.', status: 'open', priority: 'high', requested_by: users[3].id },
    { id: '1c0c0000-0000-4000-8000-000000000002', organization_id: ORG_ID, product_id: products[3].id, project_id: projects[3].id, order_number: 'ECO-2026-021', title: 'Redesign enclosure for thermal improvement', description: 'Thermal test exceeded target temperatures.', status: 'in_review', priority: 'high', requested_by: users[2].id },
    { id: '1c0c0000-0000-4000-8000-000000000003', organization_id: ORG_ID, product_id: products[4].id, project_id: projects[4].id, order_number: 'ECO-2026-029', title: 'Upgrade PCB revision', description: 'PMIC replacement due to lifecycle notice.', status: 'approved', priority: 'medium', requested_by: users[3].id, approved_by: users[0].id }
  ]);
  await upsert('workflows', [
    { id: '1d0d0000-0000-4000-8000-000000000001', organization_id: ORG_ID, name: 'Engineering Change Approval Workflow', entity_type: 'change_order', status: 'active', definition: { steps: ['engineering_review', 'quality_review', 'pm_approval', 'release'] } }
  ]);
  await upsert('approvals', [
    { id: '1e0e0000-0000-4000-8000-000000000001', organization_id: ORG_ID, workflow_id: '1d0d0000-0000-4000-8000-000000000001', change_order_id: '1c0c0000-0000-4000-8000-000000000001', approver_id: users[2].id, status: 'approved', comments: 'Mechanical impact acceptable.' },
    { id: '1e0e0000-0000-4000-8000-000000000002', organization_id: ORG_ID, workflow_id: '1d0d0000-0000-4000-8000-000000000001', change_order_id: '1c0c0000-0000-4000-8000-000000000001', approver_id: users[4].id, status: 'pending', comments: 'Awaiting quality evidence.' }
  ]);
  await upsert('documents', [{ id: '1a0a0000-0000-4000-8000-000000000001', organization_id: ORG_ID, product_id: products[0].id, project_id: projects[0].id, title: 'NovaPulse Product Specification', file_name: 'product_specification.pdf', file_path: 'documents/novapulse/product_specification.pdf', file_url: 'https://novatech.supabase.co/storage/v1/object/public/documents/novapulse/product_specification.pdf', mime_type: 'application/pdf', size_bytes: 428331, uploaded_by: users[1].id }]);
  await upsert('cad_files', [{ id: '1b0b0000-0000-4000-8000-000000000001', organization_id: ORG_ID, product_id: products[0].id, title: 'Patient Monitor Enclosure', file_name: 'enclosure_design.step', file_path: 'cad-files/novapulse/enclosure_design.step', file_url: 'https://novatech.supabase.co/storage/v1/object/public/cad-files/novapulse/enclosure_design.step', uploaded_by: users[2].id }]);
  await upsert('comments', [{ id: '1f0f0000-0000-4000-8000-000000000001', organization_id: ORG_ID, entity_type: 'product', entity_id: products[0].id, user_id: users[2].id, content: 'Thermal vent geometry validated for the latest enclosure revision.' }]);
  await upsert('costs', products.map((p, i) => ({ id: seq('2a0a0000-0000-4000-8000-000000000', i + 1), organization_id: ORG_ID, product_id: p.id, cost_type: 'estimated_manufacturing_cost', amount: 95 + i * 70, currency: 'USD', effective_date: '2026-03-10' })));
  await upsert('notifications', [{ id: '2b0b0000-0000-4000-8000-000000000001', organization_id: ORG_ID, user_id: users[1].id, title: 'ECO Pending Approval', message: 'ECO-2026-021 is awaiting product manager approval.', is_read: false, metadata: { change_order_id: '1c0c0000-0000-4000-8000-000000000002' } }]);
  await upsert('audit_logs', [{ id: '2c0c0000-0000-4000-8000-000000000001', organization_id: ORG_ID, user_id: users[0].id, action: 'approve', entity_type: 'change_order', entity_id: '1c0c0000-0000-4000-8000-000000000003', before_data: { status: 'in_review' }, after_data: { status: 'approved' } }]);
  await upsert('templates', [{ id: '2d0d0000-0000-4000-8000-000000000001', organization_id: ORG_ID, name: 'Medical Device Product Template', template_type: 'product', data: { required_fields: ['name', 'sku', 'risk_class'] }, is_default: true }]);

  console.log('Seed completed successfully.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
