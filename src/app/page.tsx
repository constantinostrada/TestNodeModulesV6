/**
 * Home Page — TestNodeModulesV6
 *
 * Landing page for the application.  Rendered as a React Server Component
 * (default in App Router) — no 'use client' required.
 */

import type { JSX } from 'react';

const LAYERS = [
  {
    badge: 'Domain',
    color: 'badge--purple',
    path: 'src/domain/',
    description:
      'Entities, Value Objects, Domain Services, Repository Interfaces. ' +
      'Zero external dependencies — pure business logic.',
  },
  {
    badge: 'Application',
    color: 'badge--blue',
    path: 'src/application/',
    description:
      'Use Cases (one class, one execute() method), DTOs, Mappers, Port interfaces. ' +
      'Orchestrates domain objects to fulfil use cases.',
  },
  {
    badge: 'Infrastructure',
    color: 'badge--green',
    path: 'src/infrastructure/',
    description:
      'Repository implementations, ID generators, DB/HTTP/LLM clients. ' +
      'All I/O lives here. Implements interfaces from domain/application.',
  },
  {
    badge: 'Interfaces',
    color: 'badge--yellow',
    path: 'src/interfaces/ + src/app/api/',
    description:
      'HTTP route handlers, controllers, CLI entry points. ' +
      'Translates external requests into use case calls and serialises results.',
  },
];

const ENDPOINTS = [
  { method: 'GET',    path: '/api/users',     description: 'List all users'       },
  { method: 'POST',   path: '/api/users',     description: 'Create a new user'    },
  { method: 'GET',    path: '/api/users/:id', description: 'Get a user by ID'     },
  { method: 'PATCH',  path: '/api/users/:id', description: 'Update a user'        },
  { method: 'DELETE', path: '/api/users/:id', description: 'Delete a user'        },
];

export default function HomePage(): JSX.Element {
  return (
    <main className="container">
      {/* Hero */}
      <section style={{ marginBottom: '2.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          TestNodeModulesV6
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          A production-ready <strong>Next.js 14 + TypeScript</strong> boilerplate built on{' '}
          <strong>Clean Architecture</strong> principles.
        </p>
      </section>

      {/* Architecture layers */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>
          Architecture Layers
        </h2>
        {LAYERS.map((layer) => (
          <div key={layer.badge} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${layer.color}`}>{layer.badge}</span>
              <code>{layer.path}</code>
            </div>
            <p style={{ color: '#374151' }}>{layer.description}</p>
          </div>
        ))}
      </section>

      {/* REST API */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>
          REST API Endpoints
        </h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                {['Method', 'Path', 'Description'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((ep, i) => (
                <tr
                  key={ep.path + ep.method}
                  style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f9fafb' }}
                >
                  <td style={{ padding: '0.625rem 1rem' }}>
                    <code
                      style={{
                        color:
                          ep.method === 'GET'    ? '#15803d' :
                          ep.method === 'POST'   ? '#1d4ed8' :
                          ep.method === 'PATCH'  ? '#a16207' :
                          '#b91c1c',
                        background: 'transparent',
                      }}
                    >
                      {ep.method}
                    </code>
                  </td>
                  <td style={{ padding: '0.625rem 1rem' }}>
                    <code>{ep.path}</code>
                  </td>
                  <td style={{ padding: '0.625rem 1rem', color: '#374151' }}>
                    {ep.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick start */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>
          Quick Start
        </h2>
        <div className="card">
          <pre>{`npm install
npm run dev

# Create a user
curl -X POST http://localhost:3000/api/users \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"Alice","email":"alice@example.com"}'

# List all users
curl http://localhost:3000/api/users`}</pre>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ color: '#9ca3af', fontSize: '0.875rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
        TestNodeModulesV6 — TypeScript · Next.js 14 · Clean Architecture
      </footer>
    </main>
  );
}
