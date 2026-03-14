"use client";
import { AppShell } from '@/components/AppShell';
import { ContentContainer } from '@/components/ContentContainer';
import { useEffect, useMemo, useState } from 'react';

type Bom = { id: string; product_id: string; bom_number?: string | null; revision?: string | null; status?: string | null };
type Component = {
  id: string;
  bom_id: string;
  parent_component_id?: string | null;
  name: string;
  part_number: string;
  quantity: number;
  unit?: string | null;
  unit_cost?: number | null;
};

type TreeNode = Component & { children: TreeNode[] };

const demoTree: TreeNode[] = [
  {
    id: 'demo-root-1',
    bom_id: 'demo-bom-1',
    name: 'Main Assembly',
    part_number: 'INF-ASM-001',
    quantity: 1,
    unit_cost: 0,
    children: [
      { id: 'demo-motor', bom_id: 'demo-bom-1', name: 'Pump Motor', part_number: 'INF-MTR-010', quantity: 1, unit_cost: 42, children: [] },
      { id: 'demo-ctrl', bom_id: 'demo-bom-1', name: 'Control Board', part_number: 'INF-PCB-020', quantity: 1, unit_cost: 65, children: [] },
      { id: 'demo-batt', bom_id: 'demo-bom-1', name: 'Battery Pack', part_number: 'INF-BAT-030', quantity: 1, unit_cost: 28, children: [] },
      { id: 'demo-hsg', bom_id: 'demo-bom-1', name: 'Plastic Housing', part_number: 'INF-HSG-040', quantity: 1, unit_cost: 12, children: [] }
    ]
  }
];

export default function BomPage() {
  const [boms, setBoms] = useState<Bom[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedBom, setSelectedBom] = useState<string>('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: '', part_number: '', quantity: 1, unit_cost: 0, parent_component_id: '' });

  async function loadBoms() {
    const res = await fetch('/api/boms');
    const payload = await res.json();
    setBoms(payload.data || []);
    if (!selectedBom && payload.data?.length) setSelectedBom(payload.data[0].id);
  }

  async function loadComponents(bomId: string) {
    if (!bomId) return;
    const res = await fetch(`/api/components?bom_id=${bomId}`);
    const payload = await res.json();
    setComponents(payload.data || []);
  }

  useEffect(() => {
    void loadBoms();
  }, []);

  useEffect(() => {
    if (selectedBom) void loadComponents(selectedBom);
  }, [selectedBom]);

  async function addComponent(parentId?: string | null) {
    const payload = {
      bom_id: selectedBom,
      parent_component_id: parentId || null,
      name: form.name,
      part_number: form.part_number,
      quantity: Number(form.quantity) || 1,
      unit_cost: Number(form.unit_cost) || 0
    };
    await fetch('/api/components', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setForm({ name: '', part_number: '', quantity: 1, unit_cost: 0, parent_component_id: '' });
    await loadComponents(selectedBom);
  }

  async function updateComponent(id: string, patch: Partial<Component>) {
    await fetch(`/api/components/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
    await loadComponents(selectedBom);
  }

  async function deleteComponent(id: string) {
    await fetch(`/api/components/${id}`, { method: 'DELETE' });
    await loadComponents(selectedBom);
  }

  async function duplicateAssembly(id: string) {
    await fetch(`/api/components/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'duplicate' }) });
    await loadComponents(selectedBom);
  }

  const tree = useMemo<TreeNode[]>(() => {
    if (!components.length && selectedBom && demoTree[0].bom_id === 'demo-bom-1') {
      return demoTree;
    }
    const map = new Map<string, TreeNode>();
    components.forEach((c) => map.set(c.id, { ...c, children: [] }));
    const roots: TreeNode[] = [];
    map.forEach((node) => {
      if (node.parent_component_id && map.has(node.parent_component_id)) {
        map.get(node.parent_component_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }, [components, selectedBom]);

  const totalCost = useMemo(() => {
    const sum = (nodes: TreeNode[]): number =>
      nodes.reduce((acc, n) => acc + (n.unit_cost || 0) * n.quantity + sum(n.children), 0);
    return sum(tree);
  }, [tree]);

  function toggle(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  }

  function exportCsv() {
    const rows = [['Name', 'Part Number', 'Quantity', 'Unit Cost']];
    const walk = (nodes: TreeNode[], depth = 0) => {
      for (const n of nodes) {
        rows.push([`${'  '.repeat(depth)}${n.name}`, n.part_number, String(n.quantity), String(n.unit_cost ?? 0)]);
        walk(n.children, depth + 1);
      }
    };
    walk(tree);
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bom.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function Node({ node }: { node: TreeNode }) {
    const isOpen = expanded.has(node.id);
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="text-sm font-semibold text-slate-900" onClick={() => toggle(node.id)}>
            {node.children.length ? (isOpen ? '▾' : '▸') : '•'} {node.name}
          </button>
          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-mono text-slate-700">{node.part_number}</span>
          <input
            className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs"
            type="number"
            value={node.quantity}
            onChange={(e) => updateComponent(node.id, { quantity: Number(e.target.value) })}
          />
          <input
            className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-xs"
            type="number"
            step="0.01"
            value={node.unit_cost ?? 0}
            onChange={(e) => updateComponent(node.id, { unit_cost: Number(e.target.value) })}
          />
          <div className="ml-auto flex items-center gap-2 text-xs">
            <button className="rounded-lg border border-slate-200 px-2 py-1" onClick={() => addComponent(node.id)}>+ Child</button>
            <button className="rounded-lg border border-slate-200 px-2 py-1" onClick={() => duplicateAssembly(node.id)}>Duplicate</button>
            <button className="rounded-lg border border-red-200 px-2 py-1 text-red-700" onClick={() => deleteComponent(node.id)}>Delete</button>
          </div>
        </div>
        {isOpen && node.children.length ? (
          <div className="mt-2 space-y-2 border-l border-slate-200 pl-4">
            {node.children.map((child) => (
              <Node key={child.id} node={child} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <AppShell>
      <ContentContainer>
        <section className="plm-panel plm-soft mb-6 p-6">
          <p className="plm-chip">BOM Studio</p>
          <h2 className="mt-3 text-3xl font-bold">Hierarchical Engineering BOM</h2>
          <p className="mt-2 text-slate-600">Build assemblies, manage component costs, and view rollups.</p>
        </section>

        <div className="plm-panel mb-4 grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select BOM</label>
            <select value={selectedBom} onChange={(e) => setSelectedBom(e.target.value)}>
              {boms.map((b) => (
                <option key={b.id} value={b.id}>{b.bom_number || b.id.slice(0, 8)} — rev {b.revision || 'A'}</option>
              ))}
              {!boms.length ? <option value="">No BOMs found</option> : null}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Add assembly / component</label>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Part number" value={form.part_number} onChange={(e) => setForm({ ...form, part_number: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Qty / Unit cost</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Qty" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              <input type="number" step="0.01" placeholder="Unit cost" value={form.unit_cost} onChange={(e) => setForm({ ...form, unit_cost: Number(e.target.value) })} />
            </div>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => addComponent(form.parent_component_id || null)}>
              Add to root
            </button>
          </div>
          <div className="flex items-end justify-end">
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={exportCsv}>Export CSV</button>
          </div>
        </div>

        <div className="plm-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">BOM Tree</p>
            <p className="text-sm text-slate-700">Cost rollup: <span className="font-bold">${totalCost.toFixed(2)}</span></p>
          </div>
          <div className="space-y-2">
            {tree.map((node) => (
              <Node key={node.id} node={node} />
            ))}
            {!tree.length ? <p className="text-sm text-slate-500">No components yet.</p> : null}
          </div>
        </div>
      </ContentContainer>
    </AppShell>
  );
}

