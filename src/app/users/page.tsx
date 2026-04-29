/**
 * Users Page (/users)
 *
 * Server Component that fetches users via the internal API route and
 * renders them.  In a real app you might call the use case directly
 * from a Server Action or Server Component — fetching via the API is
 * shown here to demonstrate the full request/response cycle.
 */

import type { JSX } from 'react';

import type { UserDto } from '@/application/dtos/UserDto';

async function getUsers(): Promise<UserDto[]> {
  // In production set an absolute URL via NEXT_PUBLIC_BASE_URL.
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  const res = await fetch(`${base}/api/users`, {
    // No caching during dev so we always see fresh data.
    cache: 'no-store',
  });

  if (!res.ok) return [];

  const json = (await res.json()) as { success: boolean; data: UserDto[] };
  return json.success ? json.data : [];
}

export default async function UsersPage(): Promise<JSX.Element> {
  const users = await getUsers();

  return (
    <main className="container">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Users
      </h1>

      {users.length === 0 ? (
        <div className="card" style={{ color: '#6b7280', textAlign: 'center' }}>
          <p>No users yet.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Create one via <code>POST /api/users</code>
          </p>
        </div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="card">
            <p style={{ fontWeight: 600 }}>{user.name}</p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{user.email}</p>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              ID: {user.id}
            </p>
          </div>
        ))
      )}

      <p style={{ marginTop: '1rem' }}>
        <a href="/">&larr; Back to home</a>
      </p>
    </main>
  );
}
