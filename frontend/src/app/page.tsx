'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiSearch, FiHome, FiKey } from 'react-icons/fi';
import Button from '@/components/Button';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { apiClient } from '@/lib/api';

const steps = [
  { title: 'Search', description: 'Explore curated listings with intelligent filters and local insights.', icon: FiSearch },
  { title: 'Visit', description: 'Schedule tours and compare homes with transparent market data.', icon: FiHome },
  { title: 'Own', description: 'Close with confidence using a trusted, guided buying experience.', icon: FiKey },
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

export default function HomePage() {
  const [featured, setFeatured] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiClient.get('/properties/featured');
        const data = res.data?.data;
        if (!cancelled && Array.isArray(data)) {
          setFeatured(data.slice(0, 6).map(toCard));
        }
      } catch {
        // ignore — show empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-600">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/seed/hero-home/1600/900" alt="Modern home exterior" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">Find Your Dream Home</h1>
            <p className="mt-5 text-base text-indigo-100 sm:text-lg">
              Discover beautiful properties in top neighborhoods with expert guidance at every step.
            </p>
          </div>
          <div className="mt-10 max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Featured Properties</h2>
          <Link href="/properties">
            <Button variant="outline" className="gap-2">View all <FiArrowRight /></Button>
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">No featured properties yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-slate-900">How It Works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <step.icon className="mx-auto text-3xl text-indigo-600" />
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-2xl bg-indigo-600 p-8 text-white sm:grid-cols-3">
          <div><p className="text-4xl font-bold">8,500+</p><p className="mt-1 text-indigo-100">Properties Listed</p></div>
          <div><p className="text-4xl font-bold">3,200+</p><p className="mt-1 text-indigo-100">Happy Clients</p></div>
          <div><p className="text-4xl font-bold">95+</p><p className="mt-1 text-indigo-100">Cities Covered</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-10 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to move into your next home?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-orange-50">
            Browse top-rated listings and connect with trusted agents today.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/properties">
              <Button className="bg-white text-orange-600 hover:bg-orange-50">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
