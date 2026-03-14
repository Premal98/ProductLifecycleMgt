import { AppShell } from '@/components/AppShell';

export default function SettingsPage() {
  return (
    <AppShell>
      <h2 className="mb-4 text-2xl font-semibold">Settings</h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">Configure organization preferences, integrations, and user access from this panel in the next iteration.</p>
      </div>
    </AppShell>
  );
}
