import { Product } from '@/domain/entities/Product';
import type { IProductRepository, ProductFilters } from '@/domain/repositories/IProductRepository';

/**
 * InMemoryProductRepository — Infrastructure
 *
 * In-memory implementation of IProductRepository seeded with realistic
 * inventory data. Replace with a DB-backed implementation without touching
 * any other layer — only the DI wiring in container.ts needs to change.
 */
export class InMemoryProductRepository implements IProductRepository {
  private readonly store: Product[];

  constructor() {
    this.store = SEED_DATA.map((d) => Product.create(d));
  }

  public async findBySku(sku: string): Promise<Product | null> {
    return this.store.find((p) => p.sku === sku) ?? null;
  }

  public async save(product: Product): Promise<void> {
    const idx = this.store.findIndex((p) => p.id === product.id);
    if (idx !== -1) {
      this.store[idx] = product;
    } else {
      this.store.push(product);
    }
  }

  public async findAll(filters?: ProductFilters): Promise<Product[]> {
    let results = [...this.store];

    if (filters?.name) {
      const needle = filters.name.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(needle));
    }

    if (filters?.sku) {
      const needle = filters.sku.toLowerCase();
      results = results.filter((p) => p.sku.toLowerCase().includes(needle));
    }

    if (filters?.category) {
      const needle = filters.category.toLowerCase();
      results = results.filter((p) => p.category === needle);
    }

    return results;
  }
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_DATA: {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
}[] = [
  {
    id: '1',
    sku: 'ELEC-001',
    name: 'Laptop Pro 15',
    brand: 'TechCorp',
    price: 1299.99,
    stock: 42,
    category: 'electronics',
  },
  {
    id: '2',
    sku: 'ELEC-002',
    name: 'Wireless Mouse',
    brand: 'TechCorp',
    price: 29.99,
    stock: 3,
    category: 'electronics',
  },
  {
    id: '3',
    sku: 'ELEC-003',
    name: 'Mechanical Keyboard',
    brand: 'KeyMaster',
    price: 89.99,
    stock: 15,
    category: 'electronics',
  },
  {
    id: '4',
    sku: 'ELEC-004',
    name: '4K Monitor 27"',
    brand: 'VisionX',
    price: 449.99,
    stock: 2,
    category: 'electronics',
  },
  {
    id: '5',
    sku: 'ELEC-005',
    name: 'USB-C Hub 7-in-1',
    brand: 'ConnectPro',
    price: 49.99,
    stock: 78,
    category: 'electronics',
  },
  {
    id: '6',
    sku: 'FURN-001',
    name: 'Ergonomic Office Chair',
    brand: 'ComfortSeat',
    price: 349.99,
    stock: 10,
    category: 'furniture',
  },
  {
    id: '7',
    sku: 'FURN-002',
    name: 'Standing Desk 160cm',
    brand: 'DeskRise',
    price: 599.99,
    stock: 4,
    category: 'furniture',
  },
  {
    id: '8',
    sku: 'FURN-003',
    name: 'Monitor Arm Mount',
    brand: 'DeskRise',
    price: 79.99,
    stock: 22,
    category: 'furniture',
  },
  {
    id: '9',
    sku: 'STAT-001',
    name: 'Notebook A5 Hardcover',
    brand: 'PaperCo',
    price: 12.99,
    stock: 120,
    category: 'stationery',
  },
  {
    id: '10',
    sku: 'STAT-002',
    name: 'Ballpoint Pen Set 10pk',
    brand: 'PaperCo',
    price: 8.49,
    stock: 0,
    category: 'stationery',
  },
  {
    id: '11',
    sku: 'STAT-003',
    name: 'Whiteboard Markers 4pk',
    brand: 'ColorMark',
    price: 6.99,
    stock: 55,
    category: 'stationery',
  },
  {
    id: '12',
    sku: 'NET-001',
    name: 'Wi-Fi 6 Router',
    brand: 'NetSpeed',
    price: 199.99,
    stock: 1,
    category: 'networking',
  },
  {
    id: '13',
    sku: 'NET-002',
    name: 'Ethernet Switch 8-Port',
    brand: 'NetSpeed',
    price: 59.99,
    stock: 18,
    category: 'networking',
  },
  {
    id: '14',
    sku: 'NET-003',
    name: 'Cat6 Patch Cable 2m',
    brand: 'CableX',
    price: 4.99,
    stock: 200,
    category: 'networking',
  },
  {
    id: '15',
    sku: 'AUDIO-001',
    name: 'Noise-Cancelling Headphones',
    brand: 'SoundWave',
    price: 249.99,
    stock: 3,
    category: 'audio',
  },
  {
    id: '16',
    sku: 'AUDIO-002',
    name: 'Desk Speakerphone',
    brand: 'SoundWave',
    price: 119.99,
    stock: 9,
    category: 'audio',
  },
  {
    id: '17',
    sku: 'AUDIO-003',
    name: 'USB Condenser Microphone',
    brand: 'VoicePro',
    price: 89.99,
    stock: 14,
    category: 'audio',
  },
];
