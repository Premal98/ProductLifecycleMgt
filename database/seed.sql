-- /database/seed.sql
-- Realistic PLM seed data for NovaTech Manufacturing Group

insert into organizations (id, name, slug, industry)
values ('0f1f0000-0000-4000-8000-000000000001', 'NovaTech Manufacturing Group', 'novatech-manufacturing-group', 'Medical Devices, Industrial Equipment, Consumer Electronics, Smart Hardware, Automation')
on conflict (id) do update set name = excluded.name, slug = excluded.slug, industry = excluded.industry;

insert into users (id, organization_id, email, full_name, role, is_active)
values
  ('0f2f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', 'alex.mercer@novatechmfg.com', 'Alex Mercer', 'admin', true),
  ('0f2f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', 'priya.nair@novatechmfg.com', 'Priya Nair', 'product_manager', true),
  ('0f2f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', 'liam.hart@novatechmfg.com', 'Liam Hart', 'mechanical_engineer', true),
  ('0f2f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', 'sofia.chen@novatechmfg.com', 'Sofia Chen', 'electronics_engineer', true),
  ('0f2f0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', 'daniel.ross@novatechmfg.com', 'Daniel Ross', 'quality_engineer', true),
  ('0f2f0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', 'meera.kapoor@novatechmfg.com', 'Meera Kapoor', 'procurement_manager', true)
on conflict (id) do update set full_name = excluded.full_name, role = excluded.role, is_active = excluded.is_active;

insert into teams (id, organization_id, name, description)
values
  ('0f3f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', 'Product Management', 'Portfolio planning and lifecycle governance'),
  ('0f3f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', 'Mechanical Engineering', 'CAD, enclosure design, and DFM activities'),
  ('0f3f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', 'Electronics & Firmware', 'PCB, embedded software, and electronics validation'),
  ('0f3f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', 'Quality & Supply Chain', 'Supplier qualification and production quality gates')
on conflict (id) do update set description = excluded.description;

insert into suppliers (id, organization_id, name, contact_name, email, phone, certifications, rating)
values
  ('0f4f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', 'Precision Sensorics', 'Elena Varga', 'sales@precisionsensorics.com', '+1-415-555-1401', 'ISO9001, ISO13485', 4.70),
  ('0f4f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', 'CircuitForge Electronics', 'Ravi Menon', 'account@circuitforge.com', '+1-408-555-2290', 'IPC-A-610 Class 3', 4.50),
  ('0f4f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', 'BioShield Polymers', 'Claire Donnelly', 'support@bioshieldpolymers.com', '+1-312-555-7712', 'RoHS, REACH', 4.40),
  ('0f4f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', 'SteriCore Materials', 'Hiro Tanaka', 'medgrade@stericore.com', '+1-646-555-8810', 'USP Class VI, ISO10993', 4.80),
  ('0f4f0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', 'MotionWorks Mechanical', 'Jonas Berg', 'quotes@motionworksmech.com', '+1-206-555-0944', 'ISO9001, AS9100', 4.60),
  ('0f4f0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', 'PowerCore Modules', 'Fatima Noor', 'oem@powercoremodules.com', '+1-971-555-3018', 'UL, CE', 4.55)
on conflict (id) do update set rating = excluded.rating, certifications = excluded.certifications;

insert into products (id, organization_id, name, sku, description, lifecycle_stage, status, created_by)
values
  ('0f5f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', 'NovaPulse Portable Patient Monitor', 'MED-NPM-300', 'Portable monitor for ECG, SpO2 and temperature in ambulatory care.', 'design', 'active', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f5f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', 'VascuTrack Digital Blood Pressure Monitor', 'MED-DBP-120', 'Oscillometric blood pressure monitor for home and outpatient use.', 'prototype', 'active', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f5f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', 'MediFlow Smart Infusion Pump', 'MED-INF-500', 'Connected infusion system with safety guardrails and telemetry.', 'engineering_validation', 'active', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f5f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', 'IronTrack Smart Conveyor Belt Controller', 'IND-CNV-410', 'Controller for conveyor diagnostics and predictive maintenance.', 'design', 'active', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f5f0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', 'Sentinel S1 Smart Home Security Camera', 'CON-CAM-710', '2K smart camera with low-light enhancement and local processing.', 'engineering_validation', 'active', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f5f0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', 'AeroSense IoT Environmental Sensor Hub', 'IOT-ENV-260', 'IoT hub for temperature, humidity, VOC and particulate sensing.', 'design', 'active', '0f2f0000-0000-4000-8000-000000000002')
on conflict (id) do update set lifecycle_stage = excluded.lifecycle_stage, status = excluded.status;

insert into projects (id, organization_id, product_id, name, description, owner_id, status, start_date, due_date)
values
  ('0f6f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000001', 'NPM-300 Platform Development', 'Full development program for the NovaPulse patient monitor.', '0f2f0000-0000-4000-8000-000000000002', 'in_progress', '2026-01-08', '2026-10-15'),
  ('0f6f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000002', 'DBP-120 Clinical Readiness', 'Design transfer and compliance preparation for blood pressure monitor.', '0f2f0000-0000-4000-8000-000000000002', 'in_progress', '2026-02-10', '2026-09-22'),
  ('0f6f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000003', 'INF-500 Safety Program', 'Safety validation and design transfer for infusion pump.', '0f2f0000-0000-4000-8000-000000000002', 'in_progress', '2025-12-05', '2026-11-30'),
  ('0f6f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000004', 'Conveyor Controller Rev-B', 'Thermal and reliability redesign for industrial controller.', '0f2f0000-0000-4000-8000-000000000002', 'in_progress', '2026-01-20', '2026-08-28'),
  ('0f6f0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000005', 'Sentinel S1 Production Readiness', 'EVT/DVT/PVT execution for consumer camera launch.', '0f2f0000-0000-4000-8000-000000000002', 'in_progress', '2026-01-03', '2026-09-30'),
  ('0f6f0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000006', 'AeroSense Deployment Program', 'Deployment-ready hardware and certification activities.', '0f2f0000-0000-4000-8000-000000000002', 'planning', '2026-02-18', '2026-11-18')
on conflict (id) do update set status = excluded.status, due_date = excluded.due_date;

insert into boms (id, organization_id, product_id, bom_number, revision, status, created_by)
values
  ('0f7f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000001', 'BOM-NPM-300-A', 'A', 'released', '0f2f0000-0000-4000-8000-000000000004'),
  ('0f7f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000002', 'BOM-DBP-120-A', 'A', 'released', '0f2f0000-0000-4000-8000-000000000004'),
  ('0f7f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000003', 'BOM-INF-500-B', 'B', 'draft', '0f2f0000-0000-4000-8000-000000000004'),
  ('0f7f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000004', 'BOM-CNV-410-B', 'B', 'draft', '0f2f0000-0000-4000-8000-000000000004'),
  ('0f7f0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000005', 'BOM-CAM-710-C', 'C', 'released', '0f2f0000-0000-4000-8000-000000000004'),
  ('0f7f0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000006', 'BOM-ENV-260-A', 'A', 'draft', '0f2f0000-0000-4000-8000-000000000004')
on conflict (id) do update set revision = excluded.revision, status = excluded.status;

insert into components (id, organization_id, bom_id, supplier_id, part_number, name, quantity, unit, unit_cost)
values
  ('0f8f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000001', '0f4f0000-0000-4000-8000-000000000001', 'MCU-STM32H743', 'Main Microcontroller', 1, 'pcs', 14.20),
  ('0f8f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000001', '0f4f0000-0000-4000-8000-000000000002', 'PCB-6L-MED-A1', '6-Layer Medical PCB', 1, 'pcs', 22.80),
  ('0f8f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000001', '0f4f0000-0000-4000-8000-000000000004', 'MAT-SIL-TUBE-02', 'Medical Grade Silicone Tubing', 1.2, 'm', 6.40),
  ('0f8f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000001', '0f4f0000-0000-4000-8000-000000000003', 'ENC-PC-ABS-M01', 'ABS+PC Enclosure Set', 1, 'set', 8.60),
  ('0f8f0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000002', '0f4f0000-0000-4000-8000-000000000001', 'SNS-PRES-48', 'Pressure Sensor Module', 1, 'pcs', 9.90),
  ('0f8f0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000002', '0f4f0000-0000-4000-8000-000000000002', 'PCB-4L-DBP-A2', '4-Layer Control PCB', 1, 'pcs', 11.70),
  ('0f8f0000-0000-4000-8000-000000000007', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000002', '0f4f0000-0000-4000-8000-000000000003', 'HOUS-HS-TPE-01', 'Thermoplastic Housing', 1, 'pcs', 5.20),
  ('0f8f0000-0000-4000-8000-000000000008', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000002', '0f4f0000-0000-4000-8000-000000000006', 'PWR-LIION-2S', 'Rechargeable Power Module', 1, 'pcs', 12.10),
  ('0f8f0000-0000-4000-8000-000000000009', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000003', '0f4f0000-0000-4000-8000-000000000006', 'DRV-STEPPER-3A', 'Stepper Motor Driver', 1, 'pcs', 13.50),
  ('0f8f0000-0000-4000-8000-000000000010', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000003', '0f4f0000-0000-4000-8000-000000000004', 'MAT-PEEK-VALVE', 'PEEK Valve Housing', 1, 'pcs', 18.40),
  ('0f8f0000-0000-4000-8000-000000000011', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000003', '0f4f0000-0000-4000-8000-000000000002', 'PCB-6L-INF-B1', 'Infusion Pump Main PCB', 1, 'pcs', 24.20),
  ('0f8f0000-0000-4000-8000-000000000012', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000003', '0f4f0000-0000-4000-8000-000000000005', 'BRK-AL-6061-PMP', 'Pump Motor Bracket', 1, 'pcs', 7.30),
  ('0f8f0000-0000-4000-8000-000000000013', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000004', '0f4f0000-0000-4000-8000-000000000001', 'SNS-VIBE-TRIAX', 'Tri-Axis Vibration Sensor', 2, 'pcs', 6.80),
  ('0f8f0000-0000-4000-8000-000000000014', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000004', '0f4f0000-0000-4000-8000-000000000002', 'PCB-8L-CNV-B2', 'Conveyor Controller PCB', 1, 'pcs', 27.00),
  ('0f8f0000-0000-4000-8000-000000000015', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000004', '0f4f0000-0000-4000-8000-000000000005', 'ENC-AL-IP65-410', 'IP65 Aluminum Enclosure', 1, 'pcs', 31.50),
  ('0f8f0000-0000-4000-8000-000000000016', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000004', '0f4f0000-0000-4000-8000-000000000006', 'PWR-24V-IND', '24V Isolated Power Module', 1, 'pcs', 16.90),
  ('0f8f0000-0000-4000-8000-000000000017', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000005', '0f4f0000-0000-4000-8000-000000000001', 'SNS-CMOS-2K', '2K CMOS Image Sensor', 1, 'pcs', 10.90),
  ('0f8f0000-0000-4000-8000-000000000018', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000005', '0f4f0000-0000-4000-8000-000000000002', 'PCB-6L-CAM-C3', 'Camera Compute PCB', 1, 'pcs', 18.10),
  ('0f8f0000-0000-4000-8000-000000000019', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000005', '0f4f0000-0000-4000-8000-000000000003', 'ENC-PC-CAM-S1', 'Polycarbonate Camera Housing', 1, 'pcs', 6.75),
  ('0f8f0000-0000-4000-8000-000000000020', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000005', '0f4f0000-0000-4000-8000-000000000006', 'PWR-USB-C-PD15', 'USB-C PD Power Board', 1, 'pcs', 4.90),
  ('0f8f0000-0000-4000-8000-000000000021', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000006', '0f4f0000-0000-4000-8000-000000000001', 'SNS-VOC-AQ3', 'VOC Sensor', 1, 'pcs', 7.80),
  ('0f8f0000-0000-4000-8000-000000000022', '0f1f0000-0000-4000-8000-000000000001', '0f7f0000-0000-4000-8000-000000000006', '0f4f0000-0000-4000-8000-000000000001', 'SNS-PM25-LZR', 'Laser PM2.5 Sensor', 1, 'pcs', 12.40)
on conflict (id) do update set unit_cost = excluded.unit_cost, quantity = excluded.quantity;
insert into milestones (id, organization_id, project_id, name, description, due_date, status)
values
  ('2e0e0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', 'Concept Design', 'Requirements baseline completed.', '2026-02-05', 'completed'),
  ('2e0e0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', 'Prototype Development', 'Alpha prototype build and bench validation.', '2026-04-15', 'in_progress'),
  ('2e0e0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', 'Engineering Validation', 'EMC and reliability test readiness.', '2026-06-20', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', 'Manufacturing Preparation', 'Pilot line release package complete.', '2026-08-30', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000002', 'Concept Design', 'Clinical use case and ergonomics review.', '2026-03-01', 'completed'),
  ('2e0e0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000002', 'Prototype Development', 'Cuff and pressure subsystem prototype.', '2026-04-28', 'in_progress'),
  ('2e0e0000-0000-4000-8000-000000000007', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000002', 'Engineering Validation', 'Signal repeatability studies.', '2026-06-16', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000008', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000002', 'Manufacturing Preparation', 'Tooling freeze and packaging qualification.', '2026-08-12', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000009', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000003', 'Concept Design', 'Dose safety architecture defined.', '2026-01-30', 'completed'),
  ('2e0e0000-0000-4000-8000-000000000010', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000003', 'Prototype Development', 'Pump module prototype and calibration.', '2026-04-05', 'in_progress'),
  ('2e0e0000-0000-4000-8000-000000000011', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000003', 'Engineering Validation', 'IEC 60601 and software hazard validation.', '2026-07-18', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000012', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000003', 'Manufacturing Preparation', 'Design transfer readiness.', '2026-10-25', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000013', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000004', 'Concept Design', 'Controller IO architecture completed.', '2026-02-18', 'completed'),
  ('2e0e0000-0000-4000-8000-000000000014', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000004', 'Prototype Development', 'Thermal enclosure beta prototype.', '2026-04-20', 'in_progress'),
  ('2e0e0000-0000-4000-8000-000000000015', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000004', 'Engineering Validation', 'Vibration and ingress tests.', '2026-06-30', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000016', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000004', 'Manufacturing Preparation', 'Harness standardization and PPAP.', '2026-08-22', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000017', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000005', 'Concept Design', 'Optics and pipeline architecture signoff.', '2026-02-01', 'completed'),
  ('2e0e0000-0000-4000-8000-000000000018', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000005', 'Prototype Development', 'DVT prototype with revised thermal stack.', '2026-04-12', 'in_progress'),
  ('2e0e0000-0000-4000-8000-000000000019', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000005', 'Engineering Validation', 'Image quality and cybersecurity verification.', '2026-06-25', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000020', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000005', 'Manufacturing Preparation', 'PVT lot and packaging line validation.', '2026-08-31', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000021', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000006', 'Concept Design', 'Sensor fusion requirements baseline.', '2026-03-10', 'completed'),
  ('2e0e0000-0000-4000-8000-000000000022', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000006', 'Prototype Development', 'Node enclosure and board spin verification.', '2026-05-22', 'in_progress'),
  ('2e0e0000-0000-4000-8000-000000000023', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000006', 'Engineering Validation', 'Wireless coexistence stress tests.', '2026-07-28', 'pending'),
  ('2e0e0000-0000-4000-8000-000000000024', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000006', 'Manufacturing Preparation', 'Certification and factory deployment checklist.', '2026-10-05', 'pending')
on conflict (id) do update set status = excluded.status;

insert into tasks (id, organization_id, project_id, milestone_id, title, description, assignee_id, status, priority, due_date)
values
  ('2f0f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', '2e0e0000-0000-4000-8000-000000000001', 'Define clinical monitoring requirement matrix', 'Capture ECG and SpO2 constraints with clinical advisors.', '0f2f0000-0000-4000-8000-000000000002', 'completed', 'high', '2026-01-29'),
  ('2f0f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', '2e0e0000-0000-4000-8000-000000000002', 'Create enclosure CAD and snap-fit analysis', 'Finalize enclosure concept with ingress-resistant geometry.', '0f2f0000-0000-4000-8000-000000000003', 'in_progress', 'high', '2026-03-20'),
  ('2f0f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', '2e0e0000-0000-4000-8000-000000000003', 'PCB stack-up review for patient monitor board', 'Review EMI strategy and analog routing clearances.', '0f2f0000-0000-4000-8000-000000000004', 'pending', 'high', '2026-05-26'),
  ('2f0f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000002', '2e0e0000-0000-4000-8000-000000000006', 'Design pressure sensor interface board', 'Implement analog filtering and calibration routines.', '0f2f0000-0000-4000-8000-000000000004', 'in_progress', 'high', '2026-04-08'),
  ('2f0f0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000002', '2e0e0000-0000-4000-8000-000000000007', 'Run repeatability test protocol', 'Validate ±3 mmHg accuracy across ambient ranges.', '0f2f0000-0000-4000-8000-000000000005', 'pending', 'high', '2026-06-01'),
  ('2f0f0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000003', '2e0e0000-0000-4000-8000-000000000009', 'Create infusion safety hazard log', 'Complete FMEA and software mitigation mapping.', '0f2f0000-0000-4000-8000-000000000005', 'completed', 'high', '2026-01-18'),
  ('2f0f0000-0000-4000-8000-000000000007', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000003', '2e0e0000-0000-4000-8000-000000000010', 'Model pump motor bracket', 'Update CAD for serviceability and vibration damping.', '0f2f0000-0000-4000-8000-000000000003', 'in_progress', 'high', '2026-03-26'),
  ('2f0f0000-0000-4000-8000-000000000008', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000003', '2e0e0000-0000-4000-8000-000000000011', 'Validate pump control watchdog logic', 'Stress test under occlusion and low battery scenarios.', '0f2f0000-0000-4000-8000-000000000004', 'pending', 'high', '2026-06-20'),
  ('2f0f0000-0000-4000-8000-000000000009', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000004', '2e0e0000-0000-4000-8000-000000000014', 'Redesign thermal enclosure fins', 'Improve heat rejection for sustained 60C ambient operation.', '0f2f0000-0000-4000-8000-000000000003', 'in_progress', 'high', '2026-04-02'),
  ('2f0f0000-0000-4000-8000-000000000010', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000004', '2e0e0000-0000-4000-8000-000000000015', 'Execute vibration endurance test', '72-hour vibration exposure with full load diagnostics.', '0f2f0000-0000-4000-8000-000000000005', 'pending', 'medium', '2026-06-12'),
  ('2f0f0000-0000-4000-8000-000000000011', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000005', '2e0e0000-0000-4000-8000-000000000018', 'Rework camera enclosure for thermal spreader', 'Adjust venting and mounting geometry for passive cooling.', '0f2f0000-0000-4000-8000-000000000003', 'in_progress', 'high', '2026-03-30'),
  ('2f0f0000-0000-4000-8000-000000000012', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000005', '2e0e0000-0000-4000-8000-000000000019', 'Run secure boot validation', 'Execute cybersecurity checklist before DVT gate.', '0f2f0000-0000-4000-8000-000000000005', 'pending', 'high', '2026-06-02'),
  ('2f0f0000-0000-4000-8000-000000000013', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000006', '2e0e0000-0000-4000-8000-000000000021', 'Create VOC and PM2.5 sensing requirements', 'Define sensor accuracy and calibration targets.', '0f2f0000-0000-4000-8000-000000000002', 'completed', 'medium', '2026-02-25'),
  ('2f0f0000-0000-4000-8000-000000000014', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000006', '2e0e0000-0000-4000-8000-000000000022', 'Design sensor mount and airflow duct', 'Model bracket and airflow chamber for stable measurements.', '0f2f0000-0000-4000-8000-000000000003', 'in_progress', 'medium', '2026-05-04'),
  ('2f0f0000-0000-4000-8000-000000000015', '0f1f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000006', '2e0e0000-0000-4000-8000-000000000023', 'Validate BLE and Wi-Fi coexistence', 'Execute RF coexistence matrix in dense office settings.', '0f2f0000-0000-4000-8000-000000000004', 'pending', 'high', '2026-07-11')
on conflict (id) do update set status = excluded.status;

insert into versions (id, organization_id, entity_type, entity_id, version_number, changelog, created_by)
values
  ('0f9f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', 'product', '0f5f0000-0000-4000-8000-000000000001', 1, 'Initial baseline approved.', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f9f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', 'product', '0f5f0000-0000-4000-8000-000000000002', 1, 'Initial baseline approved.', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f9f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', 'product', '0f5f0000-0000-4000-8000-000000000003', 2, 'Updated safety interlock requirements.', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f9f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', 'product', '0f5f0000-0000-4000-8000-000000000004', 2, 'Thermal enclosure redesign started.', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f9f0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', 'product', '0f5f0000-0000-4000-8000-000000000005', 3, 'Camera PCB revision C released.', '0f2f0000-0000-4000-8000-000000000002'),
  ('0f9f0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', 'product', '0f5f0000-0000-4000-8000-000000000006', 1, 'Initial baseline approved.', '0f2f0000-0000-4000-8000-000000000002')
on conflict (id) do update set version_number = excluded.version_number;
insert into documents (id, organization_id, product_id, project_id, title, file_name, file_path, file_url, mime_type, size_bytes, version_id, uploaded_by)
values
  ('1a0a0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', 'NovaPulse Product Specification', 'product_specification.pdf', 'documents/novapulse/product_specification.pdf', 'https://novatech.supabase.co/storage/v1/object/public/documents/novapulse/product_specification.pdf', 'application/pdf', 428331, '0f9f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000002'),
  ('1a0a0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', 'Patient Monitor Testing Protocol', 'testing_protocol.docx', 'documents/novapulse/testing_protocol.docx', 'https://novatech.supabase.co/storage/v1/object/public/documents/novapulse/testing_protocol.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 91244, null, '0f2f0000-0000-4000-8000-000000000005'),
  ('1a0a0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000002', '0f6f0000-0000-4000-8000-000000000002', 'Blood Pressure Safety Compliance Report', 'safety_compliance_report.pdf', 'documents/dbp120/safety_compliance_report.pdf', 'https://novatech.supabase.co/storage/v1/object/public/documents/dbp120/safety_compliance_report.pdf', 'application/pdf', 365102, '0f9f0000-0000-4000-8000-000000000002', '0f2f0000-0000-4000-8000-000000000005'),
  ('1a0a0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000003', '0f6f0000-0000-4000-8000-000000000003', 'Infusion Pump Firmware Architecture', 'firmware_architecture.pdf', 'documents/inf500/firmware_architecture.pdf', 'https://novatech.supabase.co/storage/v1/object/public/documents/inf500/firmware_architecture.pdf', 'application/pdf', 446012, '0f9f0000-0000-4000-8000-000000000003', '0f2f0000-0000-4000-8000-000000000004'),
  ('1a0a0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000004', '0f6f0000-0000-4000-8000-000000000004', 'Conveyor Controller Interface Specification', 'controller_interface_spec.pdf', 'documents/cnv410/controller_interface_spec.pdf', 'https://novatech.supabase.co/storage/v1/object/public/documents/cnv410/controller_interface_spec.pdf', 'application/pdf', 287113, '0f9f0000-0000-4000-8000-000000000004', '0f2f0000-0000-4000-8000-000000000004'),
  ('1a0a0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000005', '0f6f0000-0000-4000-8000-000000000005', 'Sentinel Manufacturing Guidelines', 'manufacturing_guidelines.pdf', 'documents/cam710/manufacturing_guidelines.pdf', 'https://novatech.supabase.co/storage/v1/object/public/documents/cam710/manufacturing_guidelines.pdf', 'application/pdf', 298004, '0f9f0000-0000-4000-8000-000000000005', '0f2f0000-0000-4000-8000-000000000006'),
  ('1a0a0000-0000-4000-8000-000000000007', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000006', '0f6f0000-0000-4000-8000-000000000006', 'AeroSense Product Specification', 'product_specification.pdf', 'documents/env260/product_specification.pdf', 'https://novatech.supabase.co/storage/v1/object/public/documents/env260/product_specification.pdf', 'application/pdf', 318772, '0f9f0000-0000-4000-8000-000000000006', '0f2f0000-0000-4000-8000-000000000002')
on conflict (id) do update set title = excluded.title;

insert into cad_files (id, organization_id, product_id, title, file_name, file_path, file_url, version_id, uploaded_by)
values
  ('1b0b0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000001', 'Patient Monitor Enclosure Design', 'enclosure_design.step', 'cad-files/novapulse/enclosure_design.step', 'https://novatech.supabase.co/storage/v1/object/public/cad-files/novapulse/enclosure_design.step', null, '0f2f0000-0000-4000-8000-000000000003'),
  ('1b0b0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000001', 'Patient Monitor PCB Layout', 'pcb_layout_v2.stp', 'cad-files/novapulse/pcb_layout_v2.stp', 'https://novatech.supabase.co/storage/v1/object/public/cad-files/novapulse/pcb_layout_v2.stp', null, '0f2f0000-0000-4000-8000-000000000004'),
  ('1b0b0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000003', 'Infusion Pump Bracket', 'mounting_bracket_v3.sldprt', 'cad-files/inf500/mounting_bracket_v3.sldprt', 'https://novatech.supabase.co/storage/v1/object/public/cad-files/inf500/mounting_bracket_v3.sldprt', null, '0f2f0000-0000-4000-8000-000000000003'),
  ('1b0b0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000004', 'Conveyor Thermal Enclosure Rev-B', 'enclosure_thermal_rev_b.step', 'cad-files/cnv410/enclosure_thermal_rev_b.step', 'https://novatech.supabase.co/storage/v1/object/public/cad-files/cnv410/enclosure_thermal_rev_b.step', null, '0f2f0000-0000-4000-8000-000000000003'),
  ('1b0b0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000004', 'Sensor Mount', 'sensor_mount_v1.step', 'cad-files/cnv410/sensor_mount_v1.step', 'https://novatech.supabase.co/storage/v1/object/public/cad-files/cnv410/sensor_mount_v1.step', null, '0f2f0000-0000-4000-8000-000000000003'),
  ('1b0b0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000005', 'Camera Wall Bracket', 'wall_bracket_v1.sldprt', 'cad-files/cam710/wall_bracket_v1.sldprt', 'https://novatech.supabase.co/storage/v1/object/public/cad-files/cam710/wall_bracket_v1.sldprt', null, '0f2f0000-0000-4000-8000-000000000003'),
  ('1b0b0000-0000-4000-8000-000000000007', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000005', 'Camera Housing Rev C', 'camera_housing_rev_c.step', 'cad-files/cam710/camera_housing_rev_c.step', 'https://novatech.supabase.co/storage/v1/object/public/cad-files/cam710/camera_housing_rev_c.step', null, '0f2f0000-0000-4000-8000-000000000003'),
  ('1b0b0000-0000-4000-8000-000000000008', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000006', 'AeroSense Enclosure Assembly', 'enclosure_assembly_v1.step', 'cad-files/env260/enclosure_assembly_v1.step', 'https://novatech.supabase.co/storage/v1/object/public/cad-files/env260/enclosure_assembly_v1.step', null, '0f2f0000-0000-4000-8000-000000000003')
on conflict (id) do update set title = excluded.title;

insert into change_orders (id, organization_id, product_id, project_id, order_number, title, description, status, priority, requested_by, approved_by)
values
  ('1c0c0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000001', '0f6f0000-0000-4000-8000-000000000001', 'ECO-2026-014', 'Replace SpO2 sensor module', 'Intermittent low perfusion noise found in pilot testing; replace module and recalibrate.', 'open', 'high', '0f2f0000-0000-4000-8000-000000000004', null),
  ('1c0c0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000004', '0f6f0000-0000-4000-8000-000000000004', 'ECO-2026-021', 'Redesign enclosure for thermal improvement', 'Thermal chamber tests exceeded junction target by 7C under full load.', 'in_review', 'high', '0f2f0000-0000-4000-8000-000000000003', null),
  ('1c0c0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000005', '0f6f0000-0000-4000-8000-000000000005', 'ECO-2026-029', 'Upgrade PCB revision to C.1', 'Component EOL requires alternate PMIC and minor routing updates.', 'approved', 'medium', '0f2f0000-0000-4000-8000-000000000004', '0f2f0000-0000-4000-8000-000000000001')
on conflict (id) do update set status = excluded.status;

insert into workflows (id, organization_id, name, entity_type, status, definition)
values
  ('1d0d0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', 'Engineering Change Approval Workflow', 'change_order', 'active', '{"steps":["engineering_review","quality_review","product_manager_approval","admin_release"],"sla_hours":72}'::jsonb),
  ('1d0d0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', 'NPI Manufacturing Readiness Workflow', 'project', 'active', '{"steps":["dfm_review","supplier_readiness","pilot_build","qa_signoff"],"sla_hours":120}'::jsonb)
on conflict (id) do update set status = excluded.status;

insert into approvals (id, organization_id, workflow_id, change_order_id, approver_id, status, comments, approved_at)
values
  ('1e0e0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '1d0d0000-0000-4000-8000-000000000001', '1c0c0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000003', 'approved', 'Mechanical impact assessed; no enclosure redesign required.', '2026-03-10 10:35:00+00'),
  ('1e0e0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '1d0d0000-0000-4000-8000-000000000001', '1c0c0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000005', 'pending', 'Awaiting updated biocompatibility evidence.', null),
  ('1e0e0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '1d0d0000-0000-4000-8000-000000000001', '1c0c0000-0000-4000-8000-000000000002', '0f2f0000-0000-4000-8000-000000000004', 'approved', 'Power derating and board spacing update accepted.', '2026-03-12 15:05:00+00'),
  ('1e0e0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '1d0d0000-0000-4000-8000-000000000001', '1c0c0000-0000-4000-8000-000000000002', '0f2f0000-0000-4000-8000-000000000002', 'pending', 'Need revised thermal simulation attached.', null),
  ('1e0e0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', '1d0d0000-0000-4000-8000-000000000001', '1c0c0000-0000-4000-8000-000000000003', '0f2f0000-0000-4000-8000-000000000005', 'approved', 'EMC retest scope accepted with delta matrix.', '2026-03-13 09:50:00+00'),
  ('1e0e0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', '1d0d0000-0000-4000-8000-000000000001', '1c0c0000-0000-4000-8000-000000000003', '0f2f0000-0000-4000-8000-000000000001', 'approved', 'Approved for release to Rev C.1 production lot.', '2026-03-13 16:20:00+00')
on conflict (id) do update set status = excluded.status;
insert into comments (id, organization_id, entity_type, entity_id, user_id, content)
values
  ('1f0f0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', 'product', '0f5f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000003', 'Thermal simulation indicates enclosure vent geometry is acceptable for 8-hour operation.'),
  ('1f0f0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', 'project', '0f6f0000-0000-4000-8000-000000000003', '0f2f0000-0000-4000-8000-000000000004', 'Firmware watchdog behavior is stable across 500 cycle stress test.'),
  ('1f0f0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', 'change_order', '1c0c0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000005', 'Please attach revised sensor biocompatibility certificate before quality sign-off.'),
  ('1f0f0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', 'document', '1a0a0000-0000-4000-8000-000000000006', '0f2f0000-0000-4000-8000-000000000006', 'Packaging constraints from logistics team added in section 4.2.'),
  ('1f0f0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', 'bom', '0f7f0000-0000-4000-8000-000000000005', '0f2f0000-0000-4000-8000-000000000004', 'Alternate PMIC vendor validated, no layout violations.'),
  ('1f0f0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', 'project', '0f6f0000-0000-4000-8000-000000000004', '0f2f0000-0000-4000-8000-000000000002', 'Move vibration test by one week to align with fixture delivery.')
on conflict (id) do update set content = excluded.content;

insert into costs (id, organization_id, product_id, component_id, cost_type, amount, currency, effective_date)
values
  ('2a0a0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', null, '0f8f0000-0000-4000-8000-000000000001', 'component_cost', 14.20, 'USD', '2026-03-01'),
  ('2a0a0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', null, '0f8f0000-0000-4000-8000-000000000005', 'component_cost', 9.90, 'USD', '2026-03-01'),
  ('2a0a0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', null, '0f8f0000-0000-4000-8000-000000000010', 'component_cost', 18.40, 'USD', '2026-03-01'),
  ('2a0a0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', null, '0f8f0000-0000-4000-8000-000000000015', 'component_cost', 31.50, 'USD', '2026-03-01'),
  ('2a0a0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', null, '0f8f0000-0000-4000-8000-000000000017', 'component_cost', 10.90, 'USD', '2026-03-01'),
  ('2a0a0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', null, '0f8f0000-0000-4000-8000-000000000022', 'component_cost', 12.40, 'USD', '2026-03-01'),
  ('2a0a0000-0000-4000-8000-000000000007', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000001', null, 'estimated_manufacturing_cost', 248.00, 'USD', '2026-03-10'),
  ('2a0a0000-0000-4000-8000-000000000008', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000002', null, 'estimated_manufacturing_cost', 119.00, 'USD', '2026-03-10'),
  ('2a0a0000-0000-4000-8000-000000000009', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000003', null, 'estimated_manufacturing_cost', 684.00, 'USD', '2026-03-10'),
  ('2a0a0000-0000-4000-8000-000000000010', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000004', null, 'estimated_manufacturing_cost', 415.00, 'USD', '2026-03-10'),
  ('2a0a0000-0000-4000-8000-000000000011', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000005', null, 'estimated_manufacturing_cost', 154.00, 'USD', '2026-03-10'),
  ('2a0a0000-0000-4000-8000-000000000012', '0f1f0000-0000-4000-8000-000000000001', '0f5f0000-0000-4000-8000-000000000006', null, 'estimated_manufacturing_cost', 96.00, 'USD', '2026-03-10')
on conflict (id) do update set amount = excluded.amount;

insert into notifications (id, organization_id, user_id, title, message, is_read, metadata)
values
  ('2b0b0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000002', 'ECO Pending Approval', 'ECO-2026-021 is awaiting product manager approval.', false, '{"change_order_id":"1c0c0000-0000-4000-8000-000000000002"}'::jsonb),
  ('2b0b0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000005', 'Quality Review Required', 'Upload updated biocompatibility report for NovaPulse sensor change.', false, '{"product_id":"0f5f0000-0000-4000-8000-000000000001"}'::jsonb),
  ('2b0b0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000006', 'Supplier Quote Received', 'PowerCore submitted revised quote for USB-C PD board.', true, '{"supplier_id":"0f4f0000-0000-4000-8000-000000000006"}'::jsonb),
  ('2b0b0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000003', 'CAD Revision Published', 'camera_housing_rev_c.step has been uploaded to CAD vault.', true, '{"cad_file_id":"1b0b0000-0000-4000-8000-000000000007"}'::jsonb)
on conflict (id) do update set is_read = excluded.is_read;

insert into audit_logs (id, organization_id, user_id, action, entity_type, entity_id, before_data, after_data)
values
  ('2c0c0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000002', 'create', 'product', '0f5f0000-0000-4000-8000-000000000006', null, '{"name":"AeroSense IoT Environmental Sensor Hub"}'::jsonb),
  ('2c0c0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000004', 'create', 'change_order', '1c0c0000-0000-4000-8000-000000000001', null, '{"order_number":"ECO-2026-014","status":"open"}'::jsonb),
  ('2c0c0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000005', 'approve', 'approval', '1e0e0000-0000-4000-8000-000000000005', '{"status":"pending"}'::jsonb, '{"status":"approved"}'::jsonb),
  ('2c0c0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000001', 'approve', 'change_order', '1c0c0000-0000-4000-8000-000000000003', '{"status":"in_review"}'::jsonb, '{"status":"approved"}'::jsonb),
  ('2c0c0000-0000-4000-8000-000000000005', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000003', 'create', 'cad_file', '1b0b0000-0000-4000-8000-000000000008', null, '{"file_name":"enclosure_assembly_v1.step"}'::jsonb),
  ('2c0c0000-0000-4000-8000-000000000006', '0f1f0000-0000-4000-8000-000000000001', '0f2f0000-0000-4000-8000-000000000006', 'update', 'supplier', '0f4f0000-0000-4000-8000-000000000006', '{"rating":4.40}'::jsonb, '{"rating":4.55}'::jsonb)
on conflict (id) do update set action = excluded.action;

insert into templates (id, organization_id, name, template_type, data, is_default)
values
  ('2d0d0000-0000-4000-8000-000000000001', '0f1f0000-0000-4000-8000-000000000001', 'Medical Device Product Template', 'product', '{"required_fields":["name","sku","risk_class","sterilization_method"],"default_stage":"concept"}'::jsonb, true),
  ('2d0d0000-0000-4000-8000-000000000002', '0f1f0000-0000-4000-8000-000000000001', 'Industrial Controller BOM Template', 'bom', '{"sections":["electronics","mechanical","wiring_harness"]}'::jsonb, true),
  ('2d0d0000-0000-4000-8000-000000000003', '0f1f0000-0000-4000-8000-000000000001', 'Engineering Change Request Template', 'workflow', '{"steps":["request","engineering_review","quality_review","approval"]}'::jsonb, true),
  ('2d0d0000-0000-4000-8000-000000000004', '0f1f0000-0000-4000-8000-000000000001', 'Project Milestone Plan Template', 'project', '{"milestones":["Concept Design","Prototype Development","Engineering Validation","Manufacturing Preparation"]}'::jsonb, true)
on conflict (id) do update set is_default = excluded.is_default;
