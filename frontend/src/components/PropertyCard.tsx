'use client';

import Link from 'next/link';
import { FiMapPin, FiHome, FiDroplet, FiMaximize2 } from 'react-icons/fi';

export type PropertyCardData = {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  size: number;
  image: string;
};

export default function PropertyCard({ property }: { property: PropertyCardData }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative">
        <img src={property.image} alt={property.title} className="h-52 w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
          {property.price}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-indigo-600">{property.title}</h3>
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <FiMapPin />
          {property.location}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
            <FiHome /> {property.beds} Beds
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
            <FiDroplet /> {property.baths} Baths
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
            <FiMaximize2 /> {property.size} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}