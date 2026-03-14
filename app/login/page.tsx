"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

async function login(email: string, password: string) {
  return fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const response = await login(email, password);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error || 'Login failed. Please verify your email and password.');
        return;
      }
      router.replace('/dashboard');
    } catch (err) {
      setError('Unable to reach server. Check your connection and try again.');
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white md:grid-cols-2">
      <div className="relative hidden md:flex">
        <img
          src="https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=1600&q=80"
          alt="Engineering"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">NovaTech PLM</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Control product data, CAD, and changes in one workspace.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200/80">
            Built for regulated hardware teams: medical devices, industrial controls, and smart connected products.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-100/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Document version control with full audit trails.</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Change management aligned to ECO workflows.</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-6 py-10 text-slate-900">
        <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">NovaTech PLM</p>
              <p className="text-lg font-semibold text-slate-900">Sign in</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-600"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" type="submit">
              Sign In
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <Link href="/signup" className="hover:text-slate-900">
              Create an account
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
