"use client";

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import clsx from 'clsx';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'manager', label: 'Manager' },
  { value: 'viewer', label: 'Viewer' }
];

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  engineer: 'Engineer',
  manager: 'Manager',
  viewer: 'Viewer',
  product_manager: 'Manager',
  procurement_manager: 'Manager',
  mechanical_engineer: 'Engineer',
  electronics_engineer: 'Engineer',
  quality_engineer: 'Engineer',
  member: 'Viewer'
};

const ROLE_GROUPS: Record<string, string> = {
  product_manager: 'manager',
  procurement_manager: 'manager',
  mechanical_engineer: 'engineer',
  electronics_engineer: 'engineer',
  quality_engineer: 'engineer',
  member: 'viewer'
};

type UserRecord = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

type SessionPayload = {
  appUserId?: string;
  role?: string;
};

function formatRole(role: string) {
  return ROLE_LABELS[role] || role.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatDate(value: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
}

function generatePassword(length = 14) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*?';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export default function UsersSettingsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [notice, setNotice] = useState('');

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createRole, setCreateRole] = useState('engineer');
  const [createPassword, setCreatePassword] = useState('');
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  useEffect(() => {
    function handleClick() {
      setOpenMenuId(null);
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError('');

    try {
      const meResponse = await fetch('/api/me');
      if (!meResponse.ok) {
        router.replace('/login');
        return;
      }

      const mePayload = (await meResponse.json()) as { data?: SessionPayload };
      const session = mePayload.data;
      if (session?.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }

      setCurrentUserId(session?.appUserId || '');

      const response = await fetch('/api/users');
      if (response.status === 403) {
        router.replace('/dashboard');
        return;
      }
      if (!response.ok) {
        setError('Unable to load users. Please try again.');
        return;
      }

      const payload = await response.json().catch(() => ({} as { data?: { users?: UserRecord[] } }));
      setUsers(payload.data?.users || []);
    } catch (err) {
      setError('Unable to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const roleGroup = ROLE_GROUPS[user.role] || user.role;
      const matchesRole = roleFilter === 'all' || roleGroup === roleFilter;
      const matchesQuery =
        !query ||
        user.email.toLowerCase().includes(query) ||
        (user.full_name || '').toLowerCase().includes(query);
      return matchesRole && matchesQuery;
    });
  }, [users, search, roleFilter]);

  async function handleInvite(event: FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'invite',
        email: inviteEmail,
        role: inviteRole
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as { error?: string }));
      setError(payload.error || 'Failed to send invitation.');
      return;
    }

    setInviteOpen(false);
    setInviteEmail('');
    setInviteRole('viewer');
    setNotice('Invitation sent.');
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        email: createEmail,
        full_name: createName,
        role: createRole,
        password: createPassword
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as { error?: string }));
      setError(payload.error || 'Failed to create user.');
      return;
    }

    const payload = await response.json().catch(() => ({} as { data?: { user?: UserRecord } }));
    const createdUser = payload.data?.user;
    if (createdUser) {
      setUsers((prev) => [...prev, createdUser]);
    }

    setCreateOpen(false);
    setCreateName('');
    setCreateEmail('');
    setCreateRole('engineer');
    setCreatePassword('');
    setNotice('User created.');
  }

  async function handleRoleChange(userId: string, role: string) {
    setError('');
    setNotice('');

    const response = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'role', userId, role })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as { error?: string }));
      setError(payload.error || 'Failed to update role.');
      return;
    }

    const payload = await response.json().catch(() => ({} as { data?: UserRecord }));
    const updatedUser = payload.data;
    if (updatedUser?.id) {
      setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)));
    }

    setNotice('Role updated.');
  }

  async function handleStatusToggle(user: UserRecord) {
    setOpenMenuId(null);
    setError('');
    setNotice('');

    const response = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', userId: user.id, is_active: !user.is_active })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as { error?: string }));
      setError(payload.error || 'Failed to update status.');
      return;
    }

    const payload = await response.json().catch(() => ({} as { data?: UserRecord }));
    const updatedUser = payload.data;
    if (updatedUser?.id) {
      setUsers((prev) => prev.map((item) => (item.id === updatedUser.id ? { ...item, ...updatedUser } : item)));
    }

    setNotice(user.is_active ? 'User deactivated.' : 'User reactivated.');
  }

  async function handleDelete(user: UserRecord) {
    setOpenMenuId(null);
    if (!window.confirm(`Delete ${user.full_name || user.email}? This cannot be undone.`)) {
      return;
    }

    setError('');
    setNotice('');

    const response = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as { error?: string }));
      setError(payload.error || 'Failed to delete user.');
      return;
    }

    setUsers((prev) => prev.filter((item) => item.id !== user.id));
    setNotice('User deleted.');
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Settings</p>
        <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
        <p className="text-sm text-slate-600">Manage organization members, roles, and access.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                placeholder="Search by name or email"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="all">All roles</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={() => setInviteOpen(true)}
            >
              Invite User
            </button>
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => setCreateOpen(true)}
            >
              Create User
            </button>
          </div>
        </div>

        {notice ? <p className="mt-4 text-sm text-emerald-600">{notice}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="border-b border-slate-200 pb-3">Name</th>
                <th className="border-b border-slate-200 pb-3">Email</th>
                <th className="border-b border-slate-200 pb-3">Role</th>
                <th className="border-b border-slate-200 pb-3">Status</th>
                <th className="border-b border-slate-200 pb-3">Created</th>
                <th className="border-b border-slate-200 pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td className="py-6 text-slate-500" colSpan={6}>
                    Loading users...
                  </td>
                </tr>
              ) : null}
              {!loading && filteredUsers.length === 0 ? (
                <tr>
                  <td className="py-6 text-slate-500" colSpan={6}>
                    No users match your filters.
                  </td>
                </tr>
              ) : null}
              {!loading && filteredUsers.length > 0
                ? filteredUsers.map((user) => {
                    const statusLabel = user.is_active ? 'Active' : 'Inactive';
                    return (
                      <tr key={user.id} className="text-slate-700">
                        <td className="py-4">
                          <div className="text-sm font-semibold text-slate-900">{user.full_name || '�'}</div>
                        </td>
                        <td className="py-4 text-slate-600">{user.email}</td>
                        <td className="py-4">
                          <select
                            className="w-36 rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"
                            value={ROLE_GROUPS[user.role] || user.role}
                            onChange={(event) => handleRoleChange(user.id, event.target.value)}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-slate-500">Current: {formatRole(user.role)}</p>
                        </td>
                        <td className="py-4">
                          <span
                            className={clsx(
                              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                              user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            )}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-4 text-slate-500">{formatDate(user.created_at)}</td>
                        <td className="py-4 text-right">
                          <div className="relative inline-block text-left">
                            <button
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                              onClick={(event) => {
                                event.stopPropagation();
                                setOpenMenuId((prev) => (prev === user.id ? null : user.id));
                              }}
                            >
                              Actions
                            </button>
                            {openMenuId === user.id ? (
                              <div
                                className="absolute right-0 z-10 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-xl"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <button
                                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                                  onClick={() => handleStatusToggle(user)}
                                  disabled={user.id === currentUserId}
                                >
                                  {user.is_active ? 'Deactivate user' : 'Reactivate user'}
                                </button>
                                <button
                                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                                  onClick={() => handleDelete(user)}
                                  disabled={user.id === currentUserId}
                                >
                                  Delete user
                                </button>
                                {user.id === currentUserId ? (
                                  <p className="px-3 pt-2 text-xs text-slate-400">You cannot modify your own status.</p>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>

      {inviteOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Invite user</h3>
              <p className="text-sm text-slate-500">Send an invite link to join your organization.</p>
            </div>
            <form className="space-y-4" onSubmit={handleInvite}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value)}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                  onClick={() => setInviteOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {createOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Create user</h3>
              <p className="text-sm text-slate-500">Add a user directly to your organization.</p>
            </div>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full name</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                  value={createName}
                  onChange={(event) => setCreateName(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                  value={createEmail}
                  onChange={(event) => setCreateEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                  value={createRole}
                  onChange={(event) => setCreateRole(event.target.value)}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Temporary password</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-inner focus-within:border-slate-400">
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    className="w-full border-none bg-transparent p-0 text-sm text-slate-900 focus:outline-none"
                    value={createPassword}
                    onChange={(event) => setCreatePassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="text-xs font-semibold text-slate-600"
                    onClick={() => setShowCreatePassword((value) => !value)}
                  >
                    {showCreatePassword ? 'Hide' : 'Show'}
                  </button>
                  <button
                    type="button"
                    className="text-xs font-semibold text-slate-600"
                    onClick={() => setCreatePassword(generatePassword())}
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}


