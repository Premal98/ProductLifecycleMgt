const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function parseEnv(content) {
  const env = {};
  content.split(/\r?\n/).forEach((line) => {
    if (!line || line.trim().startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    env[key] = value;
  });
  return env;
}

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return {};
  return parseEnv(fs.readFileSync(envPath, 'utf8'));
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchBuffer(url) {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available in this Node version.');
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url} (${res.status})`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  const env = { ...loadEnvFile(), ...process.env };
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id,name')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (orgError || !org) {
    throw new Error(orgError?.message || 'No organization found.');
  }

  const { data: adminUser } = await supabase
    .from('users')
    .select('id,role')
    .eq('organization_id', org.id)
    .eq('role', 'admin')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: anyUser } = !adminUser
    ? await supabase
        .from('users')
        .select('id')
        .eq('organization_id', org.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const userId = adminUser?.id || anyUser?.id || null;

  const demoProducts = [
    {
      name: 'Industrial Water Pump',
      sku: 'IND-PUMP-300',
      lifecycle_stage: 'design',
      description: 'High-efficiency industrial water pump for facility circulation and cooling loops.',
      cadTitle: 'Pump Housing Assembly',
      modelFile: 'industrial_water_pump.glb',
      sourceUrl:
        'https://github.com/KhronosGroup/glTF-Sample-Models/blob/master/2.0/2CylinderEngine/glTF-Binary/2CylinderEngine.glb?raw=true',
      bomNumber: 'BOM-PUMP-300-A',
      docTitle: 'Industrial Water Pump Specification',
      docFile: 'industrial_water_pump_spec.pdf'
    },
    {
      name: 'Smart Infusion Pump',
      sku: 'MED-INF-900',
      lifecycle_stage: 'prototype',
      description: 'Connected infusion pump with safety interlocks and telemetry.',
      cadTitle: 'Infusion Pump Enclosure',
      modelFile: 'smart_infusion_pump.glb',
      sourceUrl:
        'https://github.com/KhronosGroup/glTF-Sample-Models/blob/master/2.0/BoomBox/glTF-Binary/BoomBox.glb?raw=true',
      bomNumber: 'BOM-INF-900-A',
      docTitle: 'Smart Infusion Pump Requirements',
      docFile: 'smart_infusion_pump_requirements.pdf'
    },
    {
      name: 'Air Quality Sensor',
      sku: 'IOT-AQS-210',
      lifecycle_stage: 'design',
      description: 'Indoor air quality sensor with particulate, VOC, and humidity monitoring.',
      cadTitle: 'Sensor Device Casing',
      modelFile: 'air_quality_sensor.glb',
      sourceUrl:
        'https://github.com/KhronosGroup/glTF-Sample-Assets/raw/refs/heads/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
      bomNumber: 'BOM-AQS-210-A',
      docTitle: 'Air Quality Sensor Datasheet',
      docFile: 'air_quality_sensor_datasheet.pdf'
    }
  ];

  for (const item of demoProducts) {
    const slug = slugify(item.name);

    const { data: product, error: productError } = await supabase
      .from('products')
      .upsert(
        {
          organization_id: org.id,
          name: item.name,
          sku: item.sku,
          description: item.description,
          lifecycle_stage: item.lifecycle_stage,
          status: 'active',
          created_by: userId
        },
        { onConflict: 'organization_id,name' }
      )
      .select('id,name')
      .single();

    if (productError || !product) {
      throw new Error(productError?.message || `Failed to upsert product ${item.name}`);
    }

    const { data: existingBom } = await supabase
      .from('boms')
      .select('id')
      .eq('product_id', product.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!existingBom) {
      const { error: bomError } = await supabase.from('boms').insert({
        organization_id: org.id,
        product_id: product.id,
        bom_number: item.bomNumber,
        revision: 'A',
        status: 'draft',
        created_by: userId
      });

      if (bomError) {
        throw new Error(bomError.message);
      }
    }

    const { data: existingDoc } = await supabase
      .from('documents')
      .select('id')
      .eq('product_id', product.id)
      .eq('title', item.docTitle)
      .maybeSingle();

    if (!existingDoc) {
      const docPath = `documents/demo/${slug}/${item.docFile}`;
      const docUrl = `${supabaseUrl}/storage/v1/object/public/documents/${docPath}`;

      const { error: docError } = await supabase.from('documents').insert({
        organization_id: org.id,
        product_id: product.id,
        title: item.docTitle,
        file_name: item.docFile,
        file_path: docPath,
        file_url: docUrl,
        mime_type: 'application/pdf',
        size_bytes: null,
        uploaded_by: userId
      });

      if (docError) {
        throw new Error(docError.message);
      }
    }

    const cadPath = `demo/${slug}/${item.modelFile}`;
    const modelBuffer = await fetchBuffer(item.sourceUrl);

    const { error: uploadError } = await supabase.storage.from('cad-files').upload(cadPath, modelBuffer, {
      upsert: true,
      contentType: 'model/gltf-binary'
    });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage.from('cad-files').getPublicUrl(cadPath);
    const fileUrl = publicUrlData.publicUrl;

    const { data: existingCad } = await supabase
      .from('cad_files')
      .select('id')
      .eq('product_id', product.id)
      .eq('title', item.cadTitle)
      .maybeSingle();

    if (existingCad) {
      const { error: updateError } = await supabase
        .from('cad_files')
        .update({ file_name: item.modelFile, file_path: cadPath, file_url: fileUrl })
        .eq('id', existingCad.id);

      if (updateError) {
        throw new Error(updateError.message);
      }
    } else {
      const { error: cadError } = await supabase.from('cad_files').insert({
        organization_id: org.id,
        product_id: product.id,
        title: item.cadTitle,
        file_name: item.modelFile,
        file_path: cadPath,
        file_url: fileUrl,
        uploaded_by: userId
      });

      if (cadError) {
        throw new Error(cadError.message);
      }
    }

    console.log(`Seeded ${item.name}`);
  }

  console.log('Demo CAD seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});