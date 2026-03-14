﻿import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <AppShell>
      <Suspense fallback={<SearchFallback />}>
        <SearchClient />
      </Suspense>
    </AppShell>
  );
}

function SearchFallback() {
  return (
    <section className="plm-panel plm-soft mb-6 p-6">
      <p className="plm-chip">Global Search</p>
      <h2 className="mt-3 text-3xl font-bold">Results</h2>
      <p className="mt-2 text-sm text-slate-600">Loading search results...</p>
    </section>
  );
}
