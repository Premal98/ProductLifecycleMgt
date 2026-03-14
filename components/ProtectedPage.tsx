"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const response = await fetch('/api/me');
      if (!response.ok) {
        router.replace('/login');
        return;
      }
      if (active) {
        setReady(true);
      }
    }

    void checkAuth();
    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) {
    return <div className="p-6 text-sm text-slate-500">Loading workspace...</div>;
  }

  return <>{children}</>;
}
