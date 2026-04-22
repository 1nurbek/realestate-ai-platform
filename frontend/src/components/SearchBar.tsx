'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FiMapPin, FiHome, FiDollarSign, FiSearch } from 'react-icons/fi';
import Button from './Button';

const propertyTypes: Array<{ label: string; value: string }> = [
  { label: 'Any Type', value: '' },
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'House', value: 'HOUSE' },
  { label: 'Villa', value: 'VILLA' },
  { label: 'Commercial', value: 'COMMERCIAL' },
  { label: 'Land', value: 'LAND' },
];

const priceRanges: Array<{ label: string; min?: number; max?: number }> = [
  { label: 'Any Price' },
  { label: '$100k - $300k', min: 100000, max: 300000 },
  { label: '$300k - $600k', min: 300000, max: 600000 },
  { label: '$600k - $1M', min: 600000, max: 1000000 },
  { label: '$1M+', min: 1000000 },
];

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [type, setType] = useState(propertyTypes[0].label);
  const [price, setPrice] = useState(priceRanges[0].label);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    const typeEntry = propertyTypes.find((item) => item.label === type);
    if (typeEntry?.value) params.set('type', typeEntry.value);
    const priceEntry = priceRanges.find((item) => item.label === price);
    if (priceEntry?.min !== undefined) params.set('minPrice', String(priceEntry.min));
    if (priceEntry?.max !== undefined) params.set('maxPrice', String(priceEntry.max));
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : '/properties');
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="relative">
          <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border-slate-200 py-2.5 pl-9 pr-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>

        <label className="relative">
          <FiHome className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            className="w-full rounded-lg border-slate-200 py-2.5 pl-9 pr-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {propertyTypes.map((item) => (
              <option key={item.label}>{item.label}</option>
            ))}
          </select>
        </label>

        <label className="relative">
          <FiDollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            className="w-full rounded-lg border-slate-200 py-2.5 pl-9 pr-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          >
            {priceRanges.map((item) => (
              <option key={item.label}>{item.label}</option>
            ))}
          </select>
        </label>

        <Button className="w-full gap-2" type="submit">
          <FiSearch />
          Search
        </Button>
      </div>
    </form>
  );
}
