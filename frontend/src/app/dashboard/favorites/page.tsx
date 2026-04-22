'use client';

import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';
import { apiClient } from '@/lib/api';

const FALLBACK_IMAGE = 'https://picsum.photos/seed/property-fallback/800/500';

type FavoriteEntry = {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    location: string;
    price: number | string;
    rooms: number;
    bathrooms: number;
    size?: number | string;
    images?: string[];
  };
};

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState('');

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/favorites');
      const data = res.data?.data;
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (propertyId: string) => {
    setRemovingId(propertyId);
    try {
      await apiClient.delete(`/favorites/${propertyId}`);
      setItems((prev) => prev.filter((fav) => fav.propertyId !== propertyId));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to remove favorite.');
    } finally {
      setRemovingId('');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">My Favorites</h1>
        <p className="mt-1 text-sm text-slate-500">Properties you saved for later.</p>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">You haven't saved any properties yet.</p>
          <Link href="/properties" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((fav) => {
            const p = fav.property;
            const card: PropertyCardData = {
              id: p.id,
              title: p.title,
              location: p.location,
              price: `$${Number(p.price).toLocaleString()}`,
              beds: Number(p.rooms) || 0,
              baths: Number(p.bathrooms) || 0,
              size: Number(p.size) || 0,
              image: p.images?.[0] || FALLBACK_IMAGE,
            };
            return (
              <div key={fav.id} className="relative">
                <PropertyCard property={card} />
                <button
                  onClick={() => removeFavorite(p.id)}
                  disabled={removingId === p.id}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow hover:bg-rose-50 disabled:opacity-60"
                  aria-label="Remove from favorites"
                >
                  <FiTrash2 />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
