'use client';

import { useState } from 'react';
import { FiMapPin, FiHome, FiDollarSign, FiSearch } from 'react-icons/fi';
import Button from './Button';

const propertyTypes = ['Any Type', 'Apartment', 'House', 'Villa', 'Commercial'];
const priceRanges = ['Any Price', '$100k - $300k', '$300k - $600k', '$600k - $1M', '$1M+'];

export default function SearchBar() {
  const [location, setLocation] = useState('');
  const [type, setType] = useState(propertyTypes[0]);
  const [price, setPrice] = useState(priceRanges[0]);

  return (
    <div className="rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
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
              <option key={item}>{item}</option>
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
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <Button className="w-full gap-2" type="button">
          <FiSearch />
          Search
        </Button>
      </div>
    </div>
  );
}