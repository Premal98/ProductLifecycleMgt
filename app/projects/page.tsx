"use client";

import { AppShell } from '@/components/AppShell';
import { FormEvent, useEffect, useState } from 'react';

type Project = { id: string; name: string; status: string; due_date?: string };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');

  async function loadProjects() {
    const res = await fetch('/api/projects');
    const payload = await res.json();
    setProjects(payload.data || []);
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, status: 'planning' })
    });
    setName('');
    await loadProjects();
  }

  return (
    <AppShell>
      <h2 className="mb-4 text-2xl font-semibold">Projects</h2>
      <form className="mb-6 flex gap-3 rounded-lg bg-white p-4 shadow" onSubmit={onSubmit}>
        <input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} required />
        <button className="bg-brand-600 text-white" type="submit">Create Project</button>
      </form>
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-medium">{project.name}</p>
            <p className="text-sm text-slate-500">Status: {project.status}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
