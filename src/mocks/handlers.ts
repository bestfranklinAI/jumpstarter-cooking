// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import type { Deal, Order } from '../types';

type RawDeal = {
  id: string;
  name: string;
  description: string;
  supermarket: {
    brand: string;
    name: string;
    location: {
      address: string;
      coordinates: { lat: number; lng: number };
    };
  };
  category: string;
  originalPrice: number;
  newPrice: number;
  quantity: number;
  unit: string;
  expiryTimestamp: string;
};

const rawDeals: RawDeal[] = [
  {
    id: 'SKU-384729',
    name: 'Kowloon Dairy Organic Milk (1L)',
    description: 'Fresh, organic whole milk from Kowloon Dairy.',
    supermarket: {
      brand: 'Wellcome',
      name: 'Wellcome - Sai Ying Pun',
      location: {
        address: '52-60 High Street, Sai Ying Pun',
        coordinates: { lat: 22.2863, lng: 114.1418 },
      },
    },
    category: 'Dairy & Eggs',
    originalPrice: 35.0,
    newPrice: 15.0,
    quantity: 18,
    unit: 'carton',
    expiryTimestamp: '2025-11-14T23:59:59+08:00',
  },
  {
    id: 'SKU-927461',
    name: "Pain D'Avoine Sourdough",
    description: 'Artisanal sourdough bread, baked fresh daily.',
    supermarket: {
      brand: 'ParknShop',
      name: 'ParknShop - May Tower, Central',
      location: {
        address: '7-9 May Rd, Mid-Levels',
        coordinates: { lat: 22.2741, lng: 114.1568 },
      },
    },
    category: 'Bakery',
    originalPrice: 48.0,
    newPrice: 20.0,
    quantity: 9,
    unit: 'loaf',
    expiryTimestamp: '2025-11-12T23:59:59+08:00',
  },
  {
    id: 'SKU-228374',
    name: 'Deluxe Nigiri Sushi Set (12pc)',
    description: 'Assorted nigiri set with salmon, tuna, and shrimp. Must be consumed today.',
    supermarket: {
      brand: 'YATA',
      name: 'YATA - Sha Tin',
      location: {
        address: 'New Town Plaza 3, Sha Tin',
        coordinates: { lat: 22.3813, lng: 114.1884 },
      },
    },
    category: 'Ready-to-Eat',
    originalPrice: 108.0,
    newPrice: 54.0,
    quantity: 11,
    unit: 'set',
    expiryTimestamp: '2025-11-12T20:00:00+08:00',
  },
  {
    id: 'SKU-561920',
    name: 'US Angus Ribeye Steak (250g)',
    description: 'Premium grain-fed US Angus ribeye, perfect for grilling.',
    supermarket: {
      brand: 'CitySuper',
      name: 'CitySuper - Times Square',
      location: {
        address: 'Times Square, Causeway Bay',
        coordinates: { lat: 22.2783, lng: 114.1823 },
      },
    },
    category: 'Meat & Poultry',
    originalPrice: 145.0,
    newPrice: 70.0,
    quantity: 6,
    unit: 'pack',
    expiryTimestamp: '2025-11-13T23:59:59+08:00',
  },
  {
    id: 'SKU-773629',
    name: 'Norwegian Salmon Fillet (300g)',
    description: 'Sustainably farmed Norwegian salmon, sashimi grade.',
    supermarket: {
      brand: 'CitySuper',
      name: 'CitySuper - Times Square',
      location: {
        address: 'Times Square, Causeway Bay',
        coordinates: { lat: 22.2783, lng: 114.1823 },
      },
    },
    category: 'Seafood',
    originalPrice: 110.0,
    newPrice: 55.0,
    quantity: 8,
    unit: 'pack',
    expiryTimestamp: '2025-11-13T23:59:59+08:00',
  },
  {
    id: 'SKU-192837',
    name: 'Organic Avocado (3-pack)',
    description: 'Ripe and ready-to-eat Hass avocados.',
    supermarket: {
      brand: 'ParknShop',
      name: "ParknShop - The Belcher's, HKU",
      location: {
        address: "G/F, The Belcher's, Pok Fu Lam",
        coordinates: { lat: 22.2858, lng: 114.1311 },
      },
    },
    category: 'Produce',
    originalPrice: 65.0,
    newPrice: 30.0,
    quantity: 22,
    unit: 'pack',
    expiryTimestamp: '2025-11-14T23:59:59+08:00',
  },
  {
    id: 'SKU-482711',
    name: 'Japanese Free-Range Eggs (10-pack)',
    description: 'Premium eggs with rich, orange yolks.',
    supermarket: {
      brand: 'YATA',
      name: 'YATA - Sha Tin',
      location: {
        address: 'New Town Plaza 3, Sha Tin',
        coordinates: { lat: 22.3813, lng: 114.1884 },
      },
    },
    category: 'Dairy & Eggs',
    originalPrice: 42.0,
    newPrice: 21.0,
    quantity: 15,
    unit: 'pack',
    expiryTimestamp: '2025-11-15T23:59:59+08:00',
  },
  {
    id: 'SKU-663810',
    name: 'Truffle Brie (150g)',
    description: 'Creamy brie cheese infused with black truffle.',
    supermarket: {
      brand: 'Market Place',
      name: 'Market Place - Langham Place',
      location: {
        address: 'Langham Place, Mong Kok',
        coordinates: { lat: 22.3184, lng: 114.1691 },
      },
    },
    category: 'Deli & Cheese',
    originalPrice: 95.0,
    newPrice: 45.0,
    quantity: 7,
    unit: 'piece',
    expiryTimestamp: '2025-11-16T23:59:59+08:00',
  },
  {
    id: 'SKU-381729',
    name: 'CP Fresh Chicken Drumsticks (500g)',
    description: 'Fresh, hormone-free chicken drumsticks.',
    supermarket: {
      brand: 'Wellcome',
      name: 'Wellcome - Sai Ying Pun',
      location: {
        address: '52-60 High Street, Sai Ying Pun',
        coordinates: { lat: 22.2863, lng: 114.1418 },
      },
    },
    category: 'Meat & Poultry',
    originalPrice: 55.0,
    newPrice: 27.5,
    quantity: 14,
    unit: 'pack',
    expiryTimestamp: '2025-11-13T23:59:59+08:00',
  },
  {
    id: 'SKU-448291',
    name: 'Croissant (2-pack)',
    description: 'Flaky, all-butter croissants.',
    supermarket: {
      brand: 'ParknShop',
      name: 'ParknShop - May Tower, Central',
      location: {
        address: '7-9 May Rd, Mid-Levels',
        coordinates: { lat: 22.2741, lng: 114.1568 },
      },
    },
    category: 'Bakery',
    originalPrice: 24.0,
    newPrice: 12.0,
    quantity: 10,
    unit: 'pack',
    expiryTimestamp: '2025-11-12T23:59:59+08:00',
  },
  {
    id: 'SKU-510283',
    name: 'Zespri Gold Kiwifruit (Large)',
    description: 'Sweet and juicy gold kiwifruit.',
    supermarket: {
      brand: 'ParknShop',
      name: "ParknShop - The Belcher's, HKU",
      location: {
        address: "G/F, The Belcher's, Pok Fu Lam",
        coordinates: { lat: 22.2858, lng: 114.1311 },
      },
    },
    category: 'Produce',
    originalPrice: 8.0,
    newPrice: 3.0,
    quantity: 45,
    unit: 'piece',
    expiryTimestamp: '2025-11-15T23:59:59+08:00',
  },
  {
    id: 'SKU-772619',
    name: 'Haagen-Dazs Vanilla Ice Cream (473ml)',
    description: 'Classic vanilla bean ice cream pint.',
    supermarket: {
      brand: 'Wellcome',
      name: 'Wellcome - Sai Ying Pun',
      location: {
        address: '52-60 High Street, Sai Ying Pun',
        coordinates: { lat: 22.2863, lng: 114.1418 },
      },
    },
    category: 'Frozen Foods',
    originalPrice: 88.0,
    newPrice: 44.0,
    quantity: 13,
    unit: 'pint',
    expiryTimestamp: '2026-01-30T23:59:59+08:00',
  },
  {
    id: 'SKU-629910',
    name: 'Roast Chicken & Avocado Sandwich',
    description: 'Ready-to-eat sandwich on wholewheat bread.',
    supermarket: {
      brand: 'Market Place',
      name: 'Market Place - Langham Place',
      location: {
        address: 'Langham Place, Mong Kok',
        coordinates: { lat: 22.3184, lng: 114.1691 },
      },
    },
    category: 'Ready-to-Eat',
    originalPrice: 42.0,
    newPrice: 21.0,
    quantity: 8,
    unit: 'pack',
    expiryTimestamp: '2025-11-12T21:00:00+08:00',
  },
  {
    id: 'SKU-381121',
    name: 'Barilla Spaghetti No. 5 (500g)',
    description: 'Classic spaghetti pasta.',
    supermarket: {
      brand: 'ParknShop',
      name: "ParknShop - The Belcher's, HKU",
      location: {
        address: "G/F, The Belcher's, Pok Fu Lam",
        coordinates: { lat: 22.2858, lng: 114.1311 },
      },
    },
    category: 'Pantry Goods',
    originalPrice: 25.0,
    newPrice: 12.5,
    quantity: 30,
    unit: 'pack',
    expiryTimestamp: '2026-06-15T23:59:59+08:00',
  },
  {
    id: 'SKU-992817',
    name: 'Freshly Squeezed Orange Juice (1L)',
    description: '100% pure orange juice, squeezed in-store.',
    supermarket: {
      brand: 'CitySuper',
      name: 'CitySuper - Times Square',
      location: {
        address: 'Times Square, Causeway Bay',
        coordinates: { lat: 22.2783, lng: 114.1823 },
      },
    },
    category: 'Drinks & Juices',
    originalPrice: 68.0,
    newPrice: 34.0,
    quantity: 10,
    unit: 'bottle',
    expiryTimestamp: '2025-11-14T23:59:59+08:00',
  },
  {
    id: 'SKU-411234',
    name: 'Boston Lobster (Live)',
    description: 'Live Boston lobster, approx 600g.',
    supermarket: {
      brand: 'YATA',
      name: 'YATA - Sha Tin',
      location: {
        address: 'New Town Plaza 3, Sha Tin',
        coordinates: { lat: 22.3813, lng: 114.1884 },
      },
    },
    category: 'Seafood',
    originalPrice: 198.0,
    newPrice: 99.0,
    quantity: 5,
    unit: 'piece',
    expiryTimestamp: '2025-11-12T22:00:00+08:00',
  },
  {
    id: 'SKU-841273',
    name: 'Impossible Plant-Based Burger Patties (2-pack)',
    description: 'Juicy plant-based patties high in protein and iron.',
    supermarket: {
      brand: 'CitySuper',
      name: 'CitySuper - Times Square',
      location: {
        address: 'Times Square, Causeway Bay',
        coordinates: { lat: 22.2783, lng: 114.1823 },
      },
    },
    category: 'Plant-Based',
    originalPrice: 68.0,
    newPrice: 39.0,
    quantity: 12,
    unit: 'pack',
    expiryTimestamp: '2025-11-14T18:00:00+08:00',
  },
  {
    id: 'SKU-550118',
    name: 'Thai Mango Sticky Rice Cup',
    description: 'Single-serve dessert with coconut cream and seasonal mangos.',
    supermarket: {
      brand: 'Market Place',
      name: 'Market Place - Langham Place',
      location: {
        address: 'Langham Place, Mong Kok',
        coordinates: { lat: 22.3184, lng: 114.1691 },
      },
    },
    category: 'Desserts',
    originalPrice: 36.0,
    newPrice: 18.0,
    quantity: 16,
    unit: 'cup',
    expiryTimestamp: '2025-11-12T21:30:00+08:00',
  },
];

// Eagerly import all product images from src/assets/images and build a slug-based index
const productImages = import.meta.glob('../assets/images/*', { eager: true, import: 'default' }) as Record<string, string>;

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    // Normalize apostrophes and fancy quotes
    .replace(/[’']/g, '')
    // Remove units in parentheses and extra spaces
    .replace(/\([^)]*\)/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const imageIndex = new Map<string, string>();
for (const path in productImages) {
  const file = path.split('/').pop()!; // e.g. "kowloon-dairy-organic-milk-1l.jpg"
  const base = file.replace(/\.[^.]+$/, '');
  imageIndex.set(slugify(base), productImages[path]);
}

function resolveProductImage(name: string): string {
  const originalSlug = slugify(name);
  const variants = new Set<string>([
    originalSlug,
    // Remove pack counts
    originalSlug.replace(/-\d+(g|ml|pc|pack|l)$/g, ''),
    originalSlug.replace(/-(\d+)+$/g, ''),
    originalSlug.replace(/-(large|small)$/g, ''),
  ]);

  for (const variant of variants) {
    if (imageIndex.has(variant)) return imageIndex.get(variant)!;
  }
  // Fuzzy pass
  for (const [key, url] of imageIndex) {
    for (const variant of variants) {
      if (key.includes(variant) || variant.includes(key)) return url;
    }
  }
  // Placeholder search
  for (const [key, url] of imageIndex) {
    if (key.includes('placeholder') || key.includes('default')) return url;
  }
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="320"><rect width="100%" height="100%" fill="#eef2ff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6366f1" font-family="system-ui, -apple-system, Segoe UI, Roboto" font-size="20">No image</text></svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const dietaryTagsByCategory: Record<string, string[]> = {
  'Dairy & Eggs': ['Vegetarian', 'High Protein'],
  'Bakery': ['Vegetarian'],
  'Ready-to-Eat': ['Ready to Eat'],
  'Meat & Poultry': ['High Protein'],
  Seafood: ['Omega-3'],
  Produce: ['Vegan', 'Local'],
  'Deli & Cheese': ['Gourmet'],
  'Frozen Foods': ['Family Friendly'],
  'Pantry Goods': ['Shelf Stable'],
  'Drinks & Juices': ['Vitamin C'],
  'Plant-Based': ['Vegan', 'High Protein'],
  Desserts: ['Sweet Treat'],
};

const badgesByCategory: Record<string, string[]> = {
  'Dairy & Eggs': ['Organic pick'],
  'Bakery': ['Baked today'],
  'Ready-to-Eat': ['Dinner rush'],
  'Meat & Poultry': ['Chef favourite'],
  Seafood: ['Ocean friendly'],
  Produce: ['In season'],
  'Deli & Cheese': ['Limited batch'],
  'Frozen Foods': ['Freezer friendly'],
  'Pantry Goods': ['Staple deal'],
  'Drinks & Juices': ['Pressed today'],
  'Plant-Based': ['Plant-powered'],
  Desserts: ['Dessert dash'],
};

const storeMetadata: Record<
  string,
  { distanceKm: number; phone: string; openingHours: string }
> = {
  'wellcome-sai-ying-pun': { distanceKm: 0.8, phone: '3106 1234', openingHours: '08:00 - 22:00' },
  'parknshop-may-tower-central': { distanceKm: 1.4, phone: '2831 2211', openingHours: '09:00 - 21:00' },
  "parknshop-the-belcher-s-hku": { distanceKm: 1.1, phone: '2559 3777', openingHours: '09:00 - 21:30' },
  'yata-sha-tin': { distanceKm: 10.2, phone: '2694 1111', openingHours: '10:00 - 22:00' },
  'citysuper-times-square': { distanceKm: 3.4, phone: '2506 2888', openingHours: '10:00 - 22:00' },
  'market-place-langham-place': { distanceKm: 5.9, phone: '2780 1122', openingHours: '09:30 - 21:30' },
};

// slugify already defined above

const deals: Deal[] = rawDeals.map((entry) => {
  const storeId = slugify(entry.supermarket.name.replace(/\s+/g, ' '));
  const metadata = storeMetadata[storeId] ?? { distanceKm: 4.5, phone: '2700 0000', openingHours: '09:00 - 21:00' };
  const images = [resolveProductImage(entry.name)];
  return {
    dealId: entry.id,
    sku: entry.id,
    itemId: entry.id,
    storeId,
    originalPrice: entry.originalPrice,
    discountedPrice: entry.newPrice,
    expiryTimestamp: entry.expiryTimestamp,
    quantity: entry.quantity,
    category: entry.category,
    unit: entry.unit,
    dietaryTags: dietaryTagsByCategory[entry.category] ?? [],
    badges: badgesByCategory[entry.category] ?? [],
    distanceKm: metadata.distanceKm,
    item: {
      itemId: entry.id,
      name: entry.name,
      description: entry.description,
      images,
      unit: entry.unit,
    },
    store: {
      storeId,
      brand: entry.supermarket.brand,
      name: entry.supermarket.name,
      address: entry.supermarket.location.address,
      location: {
        lat: entry.supermarket.location.coordinates.lat,
        lng: entry.supermarket.location.coordinates.lng,
      },
      distanceKm: metadata.distanceKm,
      phone: metadata.phone,
      openingHours: metadata.openingHours,
    },
  } satisfies Deal;
});

const orders: Order[] = [];

const dealsById = new Map(deals.map((deal) => [deal.dealId, deal]));

export const handlers = [
  http.get('/api/deals', () => {
    return HttpResponse.json(deals);
  }),

  http.get('/api/deals/:dealId', ({ params }) => {
    const { dealId } = params as { dealId: string };
    const deal = dealsById.get(dealId);
    if (!deal) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(deal);
  }),

  // Mock blockchain proof endpoint
  http.get('/api/deals/:dealId/proof', async ({ params }) => {
    const { dealId } = params as { dealId: string };
    const deal = dealsById.get(dealId);
    if (!deal) {
      return new HttpResponse(null, { status: 404 });
    }

    // Canonical message representing what gets anchored
    const canonical = JSON.stringify({
      dealId: deal.dealId,
      storeId: deal.storeId,
      name: deal.item?.name,
      expiry: deal.expiryTimestamp,
      price: deal.discountedPrice,
    });

    async function sha256Hex(input: string): Promise<string> {
      const enc = new TextEncoder();
      const data = enc.encode(input);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - crypto available in SW/browser
      const digest = await crypto.subtle.digest('SHA-256', data);
      const bytes = Array.from(new Uint8Array(digest));
      return '0x' + bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    const [contentHash, txHash] = await Promise.all([
      sha256Hex(canonical),
      sha256Hex(deal.dealId),
    ]);

    // Derive stable-looking metadata
    const base = Math.abs([...deal.dealId].reduce((a, c) => a + c.charCodeAt(0), 0));
    const blockNumber = 1_000_000 + (base % 50_000);
    const anchorTimestamp = new Date(Date.now() - (base % (72 * 3600 * 1000))).toISOString();

    const proof = {
      network: 'Testnet',
      dealId: deal.dealId,
      contentHash,
      txHash,
      blockNumber,
      anchorTimestamp,
      signer: deal.store?.brand ?? 'Trusted partner',
      canonical,
    };

    return HttpResponse.json(proof);
  }),

  http.get('/api/orders', () => {
    return HttpResponse.json(orders);
  }),

  http.post('/api/orders', async ({ request }) => {
    const body = (await request.json()) as { cart: { items: { dealId: string; quantity: number }[] } };
    const now = Date.now();
    const grouped = new Map<string, Order>();

    for (const line of body.cart?.items ?? []) {
      const deal = dealsById.get(line.dealId);
      if (!deal || !deal.store) {
        continue;
      }

      const key = deal.storeId ?? deal.store.storeId;
      if (!grouped.has(key)) {
        const pickupStart = new Date(now + grouped.size * 60000);
        const pickupEnd = new Date(pickupStart.getTime() + 2 * 60 * 60 * 1000);
        grouped.set(key, {
          orderId: `order-${now}-${grouped.size + 1}`,
          userId: 'user-1',
          storeId: key,
          storeSnapshot: {
            storeId: key,
            brand: deal.store.brand,
            name: deal.store.name,
            address: deal.store.address,
          },
          deals: [],
          status: 'Paid',
          qrCode: `COOKING-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          pickupWindow: {
            start: pickupStart.toISOString(),
            end: pickupEnd.toISOString(),
          },
          createdAt: new Date().toISOString(),
          totalAmount: 0,
        });
      }

      const order = grouped.get(key)!;
      order.deals.push({
        dealId: deal.dealId,
        quantity: line.quantity,
        priceAtPurchase: deal.discountedPrice,
      });
      order.totalAmount = Number(((order.totalAmount ?? 0) + deal.discountedPrice * line.quantity).toFixed(2));
    }

    const createdOrders = Array.from(grouped.values());
    if (!createdOrders.length) {
      return HttpResponse.json([], { status: 201 });
    }

    orders.unshift(...createdOrders);
    return HttpResponse.json(createdOrders, { status: 201 });
  }),

  http.get('/api/orders/:orderId', ({ params }) => {
    const { orderId } = params;
    const order = orders.find((o) => o.orderId === orderId);
    if (order) {
      return HttpResponse.json(order);
    }
    return new HttpResponse(null, { status: 404 });
  }),
];
