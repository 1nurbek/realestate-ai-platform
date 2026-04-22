'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';

const sortOptions: Array<{ label: string; sortBy: string; sortOrder: 'asc' | 'desc' }> = [
  { label: 'Newest', sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Most Viewed', sortBy: 'views', sortOrder: 'desc' },
];

const typeOptions = [
  { label: 'Any Type', value: '' },
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'House', value: 'HOUSE' },
  { label: 'Villa', value: 'VILLA' },
  { label: 'Commercial', value: 'COMMERCIAL' },
  { label: 'Land', value: 'LAND' },
];

const FALLBACK_IMAGE = 'https://picsum.photos/seed/property-fallback/800/500';

type ApiProperty = {
  id: string;
  title: string;
  location: string;
  price: number | string;
  rooms: number;
  bathrooms: number;
  size: number | string;
  images?: string[];
};

const toCard = (p: ApiProperty): PropertyCardData => ({
  id: p.id,
  title: p.title,
  location: p.location,
  price: `$${Number(p.price).toLocaleString()}`,
  beds: Number(p.rooms) || 0,
  baths: Number(p.bathrooms) || 0,
  size: Number(p.size) || 0,
  image: p.images?.[0] || FALLBACK_IMAGE,
});

export default function PropertiesPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500">Loading...</main>}>
      <PropertiesInner />
    </Suspense>
  );
}

function PropertiesInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [items, setItems] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Local draft filters (controlled inputs)
  const [location, setLocation] = useState(params.get('location') || '');
  const [minPrice, setMinPrice] = useState(params.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [type, setType] = useState(params.get('type') || '');
  const [rooms, setRooms] = useState(params.get('rooms') || '');
  const page = Number(params.get('page') || '1');
  const sortLabel = params.get('sort') || sortOptions[0].label;

  // Sync drafts when URL changes
  useEffect(() => {
    setLocation(params.get('location') || '');
    setMinPrice(params.get('minPrice') || '');
    setMaxPrice(params.get('maxPrice') || '');
    setType(params.get('type') || '');
    setRooms(params.get('rooms') || '');
  }, [params]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const sortEntry = sortOptions.find((s) => s.label === sortLabel) || sortOptions[0];
      const query: Record<string, string | number> = {
        page,
        limit: 9,
        sortBy: sortEntry.sortBy,
        sortOrder: sortEntry.sortOrder,
      };
      if (params.get('location')) query.location = params.get('location') as string;
      if (params.get('minPrice')) query.minPrice = params.get('minPrice') as string;
      if (params.get('maxPrice')) query.maxPrice = params.get('maxPrice') as string;
      if (params.get('type')) query.type = params.get('type') as string;
      if (params.get('rooms')) query.rooms = params.get('rooms') as string;

      const res = await apiClient.get('/properties', { params: query });
      const data = res.data?.data;
      const list: ApiProperty[] = data?.items || [];
      setItems(list.map(toCard));
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load properties.');
    } finally {
      setLoading(false);
    }
  }, [params, page, sortLabel]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateParams = (next: Record<string, string | undefined>) => {
    const current = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === '') current.delete(k);
      else current.set(k, v);
    });
    const qs = current.toString();
    router.push(qs ? `/properties?${qs}` : '/properties');
  };

  const applyFilters = (e: FormEvent) => {
    e.preventDefault();
    updateParams({ location, minPrice, maxPrice, type, rooms, page: '1' });
    setMobileOpen(false);
  };

  const goToPage = (p: number) => updateParams({ page: String(p) });

  const FiltersPanel = useMemo(
    () =>
      function FiltersPanel() {
        return (
          <form className="space-y-5" onSubmit={applyFilters}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
              <input
                className="w-full rounded-lg border-slate-200 text-sm"
                placeholder="Search city or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Min Price</label>
                <input
                  type="number"
                  className="w-full rounded-lg border-slate-200 text-sm"
                  placeholder="100000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Max Price</label>
                <input
                  type="number"
                  className="w-full rounded-lg border-slate-200 text-sm"
                  placeholder="2000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Property Type</label>
              <select className="w-full rounded-lg border-slate-200 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
                {typeOptions.map((opt) => (
                  <option key={opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Rooms</label>
              <select className="w-full rounded-lg border-slate-200 text-sm" value={rooms} onChange={(e) => setRooms(e.target.value)}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <Button type="submit" fullWidth>
              Apply Filters
            </Button>
          </form>
        );
      },
    [location, minPrice, maxPrice, type, rooms],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Property Listings</h1>
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="mb-6 flex justify-end">
        <select
          className="rounded-lg border-slate-200 text-sm"
          value={sortLabel}
          onChange={(event) => updateParams({ sort: event.target.value, page: '1' })}
        >
          {sortOptions.map((option) => (
            <option key={option.label}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-5 md:block">
          <FiltersPanel />
        </aside>
        <section>
          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
          )}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm text-slate-500">No properties match your filters.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`rounded-md px-3 py-2 text-sm ${
                    page === i + 1 ? 'bg-indigo-600 text-white' : 'border border-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 md:hidden">
          <div className="ml-auto h-full w-80 overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                <FiX />
              </button>
            </div>
            <FiltersPanel />
          </div>
        </div>
      )}
    </main>
  );
}
