"use client";

import { AppShell } from '@/components/AppShell';
import { useEffect, useMemo, useState } from 'react';

type Report = {
  totalProducts: number;
  totalProjects: number;
  openChangeOrders: number;
  totalSuppliers: number;
  totalDocuments: number;
  totalCadFiles?: number;
};

export default function DashboardPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    void fetch('/api/reports')
      .then((res) => res.json())
      .then((payload) => setReport(payload.data))
      .catch(() => setReport(null));
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Products in Portfolio', value: report?.totalProducts ?? 6, tone: 'text-cyan-700' },
      { label: 'Active Programs', value: report?.totalProjects ?? 6, tone: 'text-emerald-700' },
      { label: 'Open Engineering Changes', value: report?.openChangeOrders ?? 3, tone: 'text-amber-700' },
      { label: 'Controlled Documents', value: report?.totalDocuments ?? 12, tone: 'text-indigo-700' },
      { label: 'CAD Assets', value: report?.totalCadFiles ?? 8, tone: 'text-fuchsia-700' },
      { label: 'Qualified Suppliers', value: report?.totalSuppliers ?? 6, tone: 'text-slate-700' }
    ],
    [report]
  );

  return (
    <AppShell>
      <section className="plm-panel plm-soft mb-6 p-6">
        <p className="plm-chip">NovaTech Manufacturing Group</p>
        <h2 className="mt-3 text-3xl font-bold">PLM Command Center</h2>
        <p className="mt-2 max-w-3xl text-slate-600">
          End-to-end visibility across medical devices, industrial controls, consumer smart hardware and IoT sensor platforms.
          Use this workspace to manage engineering data, documentation, BOM evolution and change approvals.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((card) => (
          <div key={card.label} className="plm-kpi">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-bold ${card.tone}`}>{card.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="plm-panel p-5">
          <h3 className="text-lg font-semibold">Lifecycle Streams</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-3">Medical Devices: NovaPulse, VascuTrack, MediFlow</div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">Industrial Equipment: IronTrack controller programs</div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">Consumer & Smart: Sentinel S1 and AeroSense IoT platform</div>
          </div>
        </div>
        <div className="plm-panel p-5">
          <h3 className="text-lg font-semibold">Operational Health</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li className="rounded-xl border border-slate-200 p-3">Engineering validation gates in progress for 3 programs.</li>
            <li className="rounded-xl border border-slate-200 p-3">3 change orders require multi-role review and release.</li>
            <li className="rounded-xl border border-slate-200 p-3">Document control and CAD vault are synchronized for seeded demo data.</li>
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
