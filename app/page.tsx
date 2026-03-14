import Link from 'next/link';
import { ContentContainer } from '@/components/ContentContainer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#e8f1ff_0%,transparent_30%),radial-gradient(circle_at_85%_12%,#f3ecff_0%,transparent_28%),linear-gradient(135deg,#f8fbff_0%,#eef2ff_60%,#e3f2ff_100%)] pb-16 pt-14 text-slate-900">
      <ContentContainer>
        {/* Hero */}
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="pill">NovaTech PLM</p>
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">Modern SaaS PLM for hardware teams</h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Unify product data, BOMs, CAD, suppliers, and engineering changes in a single multi-tenant workspace. Built for medical devices, industrial controls, and smart hardware programs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Start Free Trial
              </Link>
              <Link href="/login" className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
                Login
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[['99.9%', 'Uptime target'], ['ISO-ready', 'Data controls'], ['Multi-tenant', 'Org isolation']].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                  <p className="text-xl font-bold text-slate-900">{k}</p>
                  <p className="text-sm text-slate-600">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card overflow-hidden border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Lifecycle Overview</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[['Active Products', '24'], ['Open ECOs', '11'], ['Controlled Docs', '386'], ['Qualified Suppliers', '58']].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white/10 p-4">
                    <p className="text-sm text-slate-100">{label}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">Engineering Change Workflow</p>
                <p className="mt-1 text-sm text-slate-600">Route ECOs through engineering, quality, and release gates with audit trails.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">Unified Search</p>
                <p className="mt-1 text-sm text-slate-600">Search products, suppliers, BOM components, and documents instantly.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">Team Administration</p>
                <p className="mt-1 text-sm text-slate-600">Invite roles across product, engineering, quality, and procurement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-16 space-y-8">
          <div className="text-center">
            <p className="pill mx-auto">Platform capabilities</p>
            <h2 className="mt-3 text-3xl font-bold">Purpose-built for product lifecycle teams</h2>
            <p className="mt-2 text-base text-slate-600">Everything you need to manage hardware from concept through release.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['Product Data Management', 'Centralize specs, revisions, and release decisions.'],
              ['BOM Management', 'Hierarchical BOMs with costs, suppliers, and revisions.'],
              ['CAD Integration', 'Store and preview STEP/SolidWorks assets with versioning.'],
              ['Change Management', 'ECR/ECO workflows with approvals and audit trails.'],
              ['Supplier Management', 'Qualify vendors, track certifications, link to components.'],
              ['Project Tracking', 'Milestones, tasks, and delivery status per program.']
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                <p className="text-lg font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ContentContainer>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/70 bg-white/70 py-10 backdrop-blur">
        <ContentContainer>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-900">NovaTech PLM</p>
              <p className="text-sm text-slate-600">Modern SaaS PLM for multi-disciplinary hardware teams.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
              <Link href="/login" className="hover:text-slate-900">Login</Link>
              <Link href="/signup" className="hover:text-slate-900">Start Free Trial</Link>
              <Link href="https://github.com" className="hover:text-slate-900" target="_blank" rel="noreferrer">GitHub</Link>
              <Link href="/api/health" className="hover:text-slate-900">Documentation</Link>
            </div>
          </div>
        </ContentContainer>
      </footer>
    </main>
  );
}
