'use client';

/**
 * InventoryClient — Interactive inventory table
 *
 * Full client component that owns:
 *   - TanStack Table v8 (sorting + column/global filtering)
 *   - Search bar (name / SKU)
 *   - Category dropdown
 *   - "Solo stock crítico" toggle
 *   - Stock badges: yellow (stock 1–4), red (stock 0)
 */

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import type { ProductDto } from '@/application/dtos/ProductDto';

import { useProducts } from './useProducts';
import styles from './inventory.module.css';

// ─── Stock Badge ──────────────────────────────────────────────────────────────

function StockBadge({ stock }: { stock: number }): JSX.Element {
  if (stock === 0) {
    return <span className={`${styles.badge} ${styles.badgeRed}`}>Sin stock</span>;
  }
  if (stock < 5) {
    return <span className={`${styles.badge} ${styles.badgeYellow}`}>Crítico</span>;
  }
  return <span className={`${styles.badge} ${styles.badgeGreen}`}>OK</span>;
}

// ─── Sort icon helper ─────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: 'asc' | 'desc' | false }): JSX.Element {
  if (direction === 'asc') return <span className={styles.sortIcon} aria-hidden>▲</span>;
  if (direction === 'desc') return <span className={styles.sortIcon} aria-hidden>▼</span>;
  return <span className={`${styles.sortIcon} ${styles.sortIconInactive}`} aria-hidden>⇅</span>;
}

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS: ColumnDef<ProductDto>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
    size: 130,
    enableSorting: true,
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    size: 240,
    enableSorting: true,
  },
  {
    accessorKey: 'brand',
    header: 'Marca',
    size: 140,
    enableSorting: true,
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
    size: 140,
    enableSorting: true,
  },
  {
    accessorKey: 'price',
    header: 'Precio',
    size: 110,
    enableSorting: true,
    cell: ({ getValue }) => {
      const v = getValue<number>();
      return (
        <span className={styles.priceCell}>
          ${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    size: 110,
    enableSorting: true,
    cell: ({ getValue }) => {
      const v = getValue<number>();
      return (
        <span className={styles.stockCell}>
          <span className={styles.stockNumber}>{v}</span>
          <StockBadge stock={v} />
        </span>
      );
    },
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function InventoryClient(): JSX.Element {
  const { items, categories, criticalStockCount, total, loading, error } = useProducts();

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Build the filtered dataset that TanStack Table will receive.
  // Category + critical-stock filters run as pre-filters so TanStack's
  // own global filter (search) can operate on the reduced set.
  const filteredData = useMemo(() => {
    let data = items;

    if (selectedCategory !== '') {
      data = data.filter((p) => p.category === selectedCategory);
    }

    if (onlyCritical) {
      data = data.filter((p) => p.criticalStock);
    }

    return data;
  }, [items, selectedCategory, onlyCritical]);

  // Global filter function: matches name or SKU (case-insensitive).
  const globalFilterFn = useMemo(
    () =>
      (row: import('@tanstack/react-table').Row<ProductDto>): boolean => {
        if (globalFilter.trim() === '') return true;
        const q = globalFilter.toLowerCase();
        const name = String(row.getValue<string>('name')).toLowerCase();
        const sku = String(row.getValue<string>('sku')).toLowerCase();
        return name.includes(q) || sku.includes(q);
      },
    [globalFilter],
  );

  const table = useReactTable<ProductDto>({
    data: filteredData,
    columns: COLUMNS,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const visibleCount = table.getRowModel().rows.length;

  // ── Render ──────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className={styles.errorState}>
        <span className={styles.errorIcon}>⚠</span>
        <p>No se pudo cargar el inventario: <strong>{error}</strong></p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        <StatPill label="Total productos" value={total} />
        <StatPill label="Stock crítico" value={criticalStockCount} accent />
        <StatPill label="Mostrando" value={visibleCount} />
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} aria-hidden>🔍</span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Buscar por nombre o SKU…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            aria-label="Buscar productos por nombre o SKU"
          />
          {globalFilter && (
            <button
              className={styles.clearBtn}
              onClick={() => setGlobalFilter('')}
              aria-label="Limpiar búsqueda"
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <select
          className={styles.categorySelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* Critical stock toggle */}
        <label className={styles.toggleLabel}>
          <span
            className={`${styles.toggleTrack} ${onlyCritical ? styles.toggleTrackOn : ''}`}
            role="switch"
            aria-checked={onlyCritical}
          >
            <input
              type="checkbox"
              className={styles.toggleInput}
              checked={onlyCritical}
              onChange={(e) => setOnlyCritical(e.target.checked)}
              aria-label="Mostrar solo stock crítico"
            />
            <span className={styles.toggleThumb} />
          </span>
          <span className={styles.toggleText}>Solo stock crítico</span>
        </label>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <span className={styles.spinner} aria-hidden />
            <p>Cargando inventario…</p>
          </div>
        ) : visibleCount === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon} aria-hidden>📦</span>
            <p>No se encontraron productos con los filtros actuales.</p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => {
                setGlobalFilter('');
                setSelectedCategory('');
                setOnlyCritical(false);
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <table className={styles.table} aria-label="Tabla de inventario">
            <thead className={styles.thead}>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`${styles.th} ${header.column.getCanSort() ? styles.thSortable : ''}`}
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                      aria-sort={
                        header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                            ? 'descending'
                            : 'none'
                      }
                    >
                      <span className={styles.thContent}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortIcon direction={header.column.getIsSorted()} />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => {
                const stock = row.getValue<number>('stock');
                const rowClass = [
                  styles.tr,
                  idx % 2 === 0 ? styles.trEven : styles.trOdd,
                  stock === 0 ? styles.trOutOfStock : stock < 5 ? styles.trCritical : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <tr key={row.id} className={rowClass}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={styles.td}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Footer count ───────────────────────────────────────────────────── */}
      {!loading && visibleCount > 0 && (
        <p className={styles.footerCount}>
          Mostrando <strong>{visibleCount}</strong> de <strong>{total}</strong> productos
        </p>
      )}
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}): JSX.Element {
  return (
    <div className={`${styles.statPill} ${accent ? styles.statPillAccent : ''}`}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
