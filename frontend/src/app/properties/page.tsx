'use client';

import { useMemo, useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';
import Button from '@/components/Button';

const allProperties: PropertyCardData[] = Array.from({ length: 12 }).map((_, idx) => ({
  id: `${idx + 1}`,
  title: `Premium Residence ${idx + 1}`,
  location: ['Austin, TX', 'Miami, FL', 'Seattle, WA', 'Denver, CO'][idx % 4],
  price: `$${(350000 + idx * 45000).toLocaleString()}`,
  beds: 2 + (idx % 4),
  baths: 1 + (idx % 3),
  size: 1100 + idx * 120,
  image: `https://picsum.photos/seed/listing-${idx + 1}/800/500`,
}));

const sortOptions = ['Price: Low to High', 'Price: High to Low', 'Newest', 'Most Viewed'];

function FiltersPanel() {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
        <input className="w-full rounded-lg border-slate-200 text-sm" placeholder="Search city or area" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Min Price</label>
          <input className="w-full rounded-lg border-slate-200 text-sm" placeholder="$100,000" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Max Price</label>
          <input className="w-full rounded-lg border-slate-200 text-sm" placeholder="$2,000,000" />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Property Type</label>
        <select className="w-full rounded-lg border-slate-200 text-sm">
          <option>Any Type</option>
          <option>Apartment</option>
          <option>House</option>
          <option>Villa</option>
          <option>Commercial</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Rooms</label>
        <select className="w-full rounded-lg border-slate-200 text-sm">
          <option>Any</option>
          <option>1+</option>
          <option>2+</option>
          <option>3+</option>
          <option>4+</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
        <select className="w-full rounded-lg border-slate-200 text-sm">
          <option>For Sale</option>
          <option>For Rent</option>
          <option>New Projects</option>
        </select>
      </div>
      <Button fullWidth>Apply Filters</Button>
    </div>
  );
}

export default function PropertiesPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sort, setSort] = useState(sortOptions[0]);

  const visible = useMemo(() => {
    const items = [...allProperties];
    if (sort === 'Price: Low to High') return items.sort((a, b) => Number(a.price.replace(/\D/g, '')) - Number(b.price.replace(/\D/g, '')));
    if (sort === 'Price: High to Low') return items.sort((a, b) => Number(b.price.replace(/\D/g, '')) - Number(a.price.replace(/\D/g, '')));
    return items;
  }, [sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Property Listings</h1>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden" onClick={() => setMobileOpen(true)}>
          <FiFilter /> Filters
        </button>
      </div>

      <div className="mb-6 flex justify-end">
        <select className="rounded-lg border-slate-200 text-sm" value={sort} onChange={(event) => setSort(event.target.value)}>
          {sortOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-5 md:block">
          <FiltersPanel />
        </aside>
        <section>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.slice(0, 9).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-10 flex items-center justify-center gap-2">
            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm">Prev</button>
            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white">1</button>
            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm">2</button>
            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm">3</button>
            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm">Next</button>
          </div>
        </section>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 md:hidden">
          <div className="ml-auto h-full w-80 bg-white p-5">
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