/**
 * Inventory Page (/inventory)
 *
 * Server Component shell — renders the page chrome (title, description)
 * and mounts the interactive InventoryClient component that owns the
 * TanStack Table with search, category filter, and critical-stock toggle.
 */

import type { Metadata } from 'next';
import type { JSX } from 'react';

import { InventoryClient } from './InventoryClient';

export const metadata: Metadata = {
  title: 'Inventory — TestNodeModulesV6',
  description: 'Browse and filter the full product inventory.',
};

export default function InventoryPage(): JSX.Element {
  return (
    <main className="container" style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '0.25rem',
          }}
        >
          Inventory
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
          Browse and manage your product catalogue.
        </p>
      </header>

      <InventoryClient />
    </main>
  );
}
