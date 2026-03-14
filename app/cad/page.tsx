"use client";

import { AppShell } from '@/components/AppShell';
import { CadViewer } from '@/components/CadViewer';
import { useEffect, useMemo, useState } from 'react';

type CadFile = {
  id: string;
  title: string;
  file_name: string;
  file_url?: string;
  preview_url?: string;
  product_id?: string | null;
  created_at?: string;
};

type AiMessage = { role: 'user' | 'assistant'; content: string };

const SUPPORTED_FORMATS = ['gltf', 'glb', 'stl', 'obj'];

function getExtension(value?: string | null) {
  if (!value) return '';
  const clean = value.split('?')[0];
  return clean.split('.').pop()?.toLowerCase() || '';
}

function isSupportedCadFile(file: CadFile | null) {
  if (!file) return false;
  const urlExt = getExtension(file.file_url || file.preview_url || '');
  const nameExt = getExtension(file.file_name || '');
  return SUPPORTED_FORMATS.includes(urlExt) || SUPPORTED_FORMATS.includes(nameExt);
}

const demoCad: CadFile[] = [
  {
    id: 'demo-1',
    title: 'Industrial Pump Housing',
    file_name: 'industrial_pump_housing.stl',
    file_url: 'https://raw.githubusercontent.com/gkjohnson/threejs-sandbox/master/models/stanford-bunny.stl'
  },
  {
    id: 'demo-2',
    title: 'Medical Device Enclosure',
    file_name: 'medical_enclosure.stl',
    file_url: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/models/bunny.stl'
  },
  {
    id: 'demo-3',
    title: 'Air Quality Sensor Casing',
    file_name: 'air_quality_casing.stl',
    file_url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/ascii/slotted_disk.stl'
  }
];

export default function CadPage() {
  const [items, setItems] = useState<CadFile[]>([]);
  const [selected, setSelected] = useState<CadFile | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    void fetch('/api/cad-files')
      .then((res) => res.json())
      .then((payload) => setItems(payload.data || []))
      .catch(() => setItems([]));
  }, []);

  const display = useMemo(() => (items.length ? items : demoCad), [items]);

  useEffect(() => {
    if (!selected && display.length) {
      const supported = display.find((file) => isSupportedCadFile(file));
      setSelected(supported || display[0]);
    }
  }, [display, selected]);

  function sendPrompt() {
    if (!prompt.trim()) return;
    const userMsg: AiMessage = { role: 'user', content: prompt.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'This component routes fluid through the pump housing; ensure seals are rated for pressure and consider switching to a lower-cost aluminum casting while keeping stiffness.'
        }
      ]);
    }, 400);
  }

  const selectedSupported = isSupportedCadFile(selected);
  const selectedUrl = selectedSupported ? selected?.file_url || selected?.preview_url : null;

  return (
    <AppShell>
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <section className="plm-panel plm-soft p-5">
            <p className="plm-chip">CAD Vault</p>
            <h2 className="mt-3 text-2xl font-bold">3D CAD Workspace</h2>
            <p className="mt-2 text-sm text-slate-600">Upload and explore glTF, OBJ, and STL models with interactive 3D viewing.</p>
          </section>

          <section className="plm-panel p-4">
            <p className="text-sm font-semibold text-slate-800">Files</p>
            <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto">
              {display.map((file) => {
                const supported = isSupportedCadFile(file);
                return (
                  <button
                    key={file.id}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${selected?.id === file.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:bg-slate-50'}`}
                    onClick={() => setSelected(file)}
                  >
                    <p className="font-semibold text-slate-900">{file.title}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{file.file_name}</span>
                      {!supported ? <span className="rounded-full border border-slate-200 px-2 py-0.5">Unsupported</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="plm-panel p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-800">AI Helper</p>
            <div className="h-32 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
              {messages.length === 0 ? <p className="text-slate-500">Ask about the component, BOM links, or cost ideas.</p> : null}
              {messages.map((m, i) => (
                <p key={i} className={m.role === 'assistant' ? 'text-slate-800' : 'text-slate-600'}>
                  <strong>{m.role === 'assistant' ? 'AI:' : 'You:'}</strong> {m.content}
                </p>
              ))}
            </div>
            <textarea
              className="w-full rounded-xl border border-slate-200 p-2 text-sm"
              rows={2}
              placeholder={'Ask e.g. "identify parts in BOM"'}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={sendPrompt}>
              Ask AI helper
            </button>
          </section>
        </div>

        <div className="plm-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">3D Viewer</p>
              <p className="text-lg font-semibold text-slate-900">{selected?.title || 'Select a CAD file'}</p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p>{selected?.file_name}</p>
              <p>{selected?.created_at ? new Date(selected.created_at).toLocaleString() : ''}</p>
            </div>
          </div>
          <div className="mt-4">
            {selectedSupported ? (
              <CadViewer url={selectedUrl} placeholder="No CAD preview available." />
            ) : (
              <div className="h-[480px] rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Selected CAD file uses an unsupported format. Upload a glTF, GLB, STL, or OBJ file to preview in 3D.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}