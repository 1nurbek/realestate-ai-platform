'use client';

import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { FiMapPin, FiCheck, FiHeart, FiSend } from 'react-icons/fi';
import Button from '@/components/Button';
import MapView from '@/components/MapView';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';
import { apiClient } from '@/lib/api';
import { readToken } from '@/lib/auth';

const FALLBACK_IMAGE = 'https://picsum.photos/seed/property-fallback/1200/700';

type PropertyDetail = {
  id: string;
  title: string;
  description: string;
  price: number | string;
  location: string;
  address: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  size: number | string;
  rooms: number;
  bathrooms: number;
  type: string;
  status: string;
  images?: string[];
  features?: string[];
  views?: number;
  createdAt?: string;
  user?: { id: string; name: string; email?: string; avatar?: string | null; phone?: string | null };
  category?: { id: string; name: string; slug: string };
};

const toCard = (p: any): PropertyCardData => ({
  id: p.id,
  title: p.title,
  location: p.location,
  price: `$${Number(p.price).toLocaleString()}`,
  beds: Number(p.rooms) || 0,
  baths: Number(p.bathrooms) || 0,
  size: Number(p.size) || 0,
  image: p.images?.[0] || FALLBACK_IMAGE,
});

export default function PropertyDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [similar, setSimilar] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState<string>('');

  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState('');
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await apiClient.get(`/properties/${id}`);
        const data = res.data?.data as PropertyDetail;
        if (cancelled) return;
        setProperty(data);
        setActiveImage((data.images && data.images[0]) || FALLBACK_IMAGE);

        // similar = featured minus this one
        try {
          const simRes = await apiClient.get('/properties/featured');
          const list = (simRes.data?.data || []).filter((p: any) => p.id !== id).slice(0, 3);
          if (!cancelled) setSimilar(list.map(toCard));
        } catch {
          /* ignore */
        }

        // favorite status if logged in
        if (readToken()) {
          try {
            const favRes = await apiClient.get(`/favorites/check/${id}`);
            if (!cancelled) setIsFavorited(!!favRes.data?.data?.isFavorited);
          } catch {
            /* ignore */
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.message || 'Property not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const toggleFavorite = async () => {
    if (!readToken()) {
      router.push('/login');
      return;
    }
    if (!id) return;
    setFavLoading(true);
    try {
      const res = await apiClient.post(`/favorites/${id}`);
      setIsFavorited(!!res.data?.data?.isFavorited);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    setMessageError('');
    setMessageSuccess('');
    if (!readToken()) {
      router.push('/login');
      return;
    }
    if (!property?.user?.id || !property?.id) return;
    if (!message.trim()) {
      setMessageError('Please enter a message.');
      return;
    }
    setSending(true);
    try {
      await apiClient.post('/messages', {
        receiverId: property.user.id,
        propertyId: property.id,
        content: message.trim(),
      });
      setMessage('');
      setMessageSuccess('Message sent. Check your dashboard for replies.');
    } catch (err: any) {
      setMessageError(err?.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <main className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500">Loading...</main>;
  }
  if (error || !property) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
          {error || 'Property not found.'}
        </div>
      </main>
    );
  }

  const gallery = property.images?.length ? property.images : [FALLBACK_IMAGE];
  const lat = property.latitude ? Number(property.latitude) : undefined;
  const lng = property.longitude ? Number(property.longitude) : undefined;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-2xl">
            <img src={activeImage} alt={property.title} className="h-[420px] w-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((image) => (
                <button
                  key={image}
                  className={`overflow-hidden rounded-lg border-2 ${activeImage === image ? 'border-indigo-600' : 'border-transparent'}`}
                  onClick={() => setActiveImage(image)}
                >
                  <img src={image} alt="Thumbnail" className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-bold text-slate-900">{property.title}</h1>
              <button
                onClick={toggleFavorite}
                disabled={favLoading}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                  isFavorited ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                } disabled:opacity-60`}
              >
                <FiHeart className={isFavorited ? 'fill-current' : ''} />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </button>
            </div>
            <p className="mt-2 flex items-center gap-2 text-slate-500">
              <FiMapPin /> {property.address}, {property.location}
            </p>
            <p className="mt-3 text-3xl font-bold text-indigo-600">${Number(property.price).toLocaleString()}</p>
            <p className="mt-4 whitespace-pre-wrap text-slate-600">{property.description}</p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div><p className="text-xs text-slate-500">Rooms</p><p className="font-semibold">{property.rooms}</p></div>
            <div><p className="text-xs text-slate-500">Bathrooms</p><p className="font-semibold">{property.bathrooms}</p></div>
            <div><p className="text-xs text-slate-500">Size</p><p className="font-semibold">{Number(property.size).toLocaleString()} sqft</p></div>
            <div><p className="text-xs text-slate-500">Type</p><p className="font-semibold">{property.type}</p></div>
            <div><p className="text-xs text-slate-500">Status</p><p className="font-semibold">{property.status}</p></div>
            {property.category && (
              <div><p className="text-xs text-slate-500">Category</p><p className="font-semibold">{property.category.name}</p></div>
            )}
          </div>

          {property.features && property.features.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">Features</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <FiCheck className="text-indigo-600" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lat !== undefined && lng !== undefined && (
            <div>
              <h2 className="mb-3 text-xl font-bold text-slate-900">Location Map</h2>
              <div className="h-64 overflow-hidden rounded-2xl">
                <MapView latitude={lat} longitude={lng} zoom={14} />
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold">Listed by {property.user?.name || 'Owner'}</h3>
            <p className="mt-1 text-sm text-slate-500">Property Owner</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {property.user?.email && <p>Email: {property.user.email}</p>}
              {property.user?.phone && <p>Phone: {property.user.phone}</p>}
            </div>
            <form className="mt-4 space-y-3" onSubmit={sendMessage}>
              <textarea
                className="w-full rounded-lg border border-slate-200 p-3 text-sm"
                placeholder="Ask a question about this property..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {messageError && <p className="text-xs text-red-600">{messageError}</p>}
              {messageSuccess && <p className="text-xs text-emerald-700">{messageSuccess}</p>}
              <Button className="w-full gap-2" type="submit" disabled={sending}>
                <FiSend /> {sending ? 'Sending...' : 'Message Owner'}
              </Button>
            </form>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Similar Properties</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
