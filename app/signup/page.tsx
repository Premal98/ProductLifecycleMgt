"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        organization_name: orgName,
        industry
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as { error?: string }));
      setError(payload.error || 'Signup failed');
      return;
    }

    router.replace('/login');
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white md:grid-cols-2">
      <div className="relative hidden md:flex">
        <img
          src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80"
          alt="Product development"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">NovaTech PLM</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Launch your PLM workspace in minutes.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200/80">We create your organization, seed demo data, and secure it with Supabase Auth.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-100/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Suppliers, BOMs, CAD and docs synced in one vault.</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Role-based access for product, engineering, quality, procurement.</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-6 py-10 text-slate-900">
        <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">NovaTech PLM</p>
              <p className="text-lg font-semibold text-slate-900">Create workspace</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Organization name</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                placeholder="NovaTech Manufacturing Group"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Industry (optional)</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                placeholder="Medical devices, industrial automation"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full name</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-inner focus-within:border-slate-400">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="w-full border-none bg-transparent p-0 text-sm text-slate-900 focus:outline-none"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="text-xs font-semibold text-slate-600" onClick={() => setShowPw((v) => !v)}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" type="submit">
              Create Workspace
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <Link href="/login" className="hover:text-slate-900">
              Already have an account?
            </Link>
            <Link href="/login" className="hover:text-slate-900">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
