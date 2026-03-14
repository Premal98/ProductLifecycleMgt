"use client";

import { AppShell } from '@/components/AppShell';
import { useEffect, useState } from 'react';

type Report = {
  totalProducts: number;
  totalProjects: number;
  openChangeOrders: number;
  totalSuppliers: number;
  totalDocuments: number;
};

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    void fetch('/api/reports')
      .then((res) => res.json())
      .then((payload) => setReport(payload.data));
  }, []);

  return (
    <AppShell>
      <h2 className="mb-4 text-2xl font-semibold">Reports</h2>
      <pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">{JSON.stringify(report, null, 2)}</pre>
    </AppShell>
  );
}
