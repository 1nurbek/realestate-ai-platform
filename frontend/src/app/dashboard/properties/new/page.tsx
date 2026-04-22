'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';

type Category = { id: string; name: string; slug: string };

const TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL'] as const;

type FormState = {
  title: string;
  description: string;
  price: string;
  location: string;
  address: string;
  size: string;
  rooms: string;
  bathrooms: string;
  type: (typeof TYPES)[number];
  categoryId: string;
  imagesText: string;
  featuresText: string;
  latitude: string;
  longitude: string;
};

const initialState: FormState = {
  title: '',
  description: '',
  price: '',
  location: '',
  address: '',
  size: '',
  rooms: '',
  bathrooms: '',
  type: 'APARTMENT',
  categoryId: '',
  imagesText: '',
  featuresText: '',
  latitude: '',
  longitude: '',
};

export default function NewPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient
      .get('/categories')
      .then((res) => {
        const list: Category[] = res.data?.data || [];
        setCategories(list);
        setForm((prev) => ({ ...prev, categoryId: prev.categoryId || list[0]?.id || '' }));
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  const bind = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value } as FormState));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const images = form.imagesText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    const features = form.featuresText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (images.length === 0) {
      setError('Please add at least one image URL.');
      return;
    }

    const payload: any = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      location: form.location.trim(),
      address: form.address.trim(),
      size: Number(form.size),
      rooms: Number(form.rooms),
      bathrooms: Number(form.bathrooms),
      type: form.type,
      categoryId: form.categoryId,
      images,
      features,
    };
    if (form.latitude.trim()) payload.latitude = Number(form.latitude);
    if (form.longitude.trim()) payload.longitude = Number(form.longitude);

    setSaving(true);
    try {
      await apiClient.post('/properties', payload);
      router.push('/dashboard/properties');
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.message ||
        'Failed to save property.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Add Property</h1>
        <p className="mt-1 text-sm text-slate-500">Fill out the details below.</p>
      </header>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input className="w-full rounded-lg border-slate-200 text-sm" value={form.title} onChange={bind('title')} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Price (USD)</label>
            <input type="number" min="0" step="1" className="w-full rounded-lg border-slate-200 text-sm" value={form.price} onChange={bind('price')} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Location (City/Area)</label>
            <input className="w-full rounded-lg border-slate-200 text-sm" value={form.location} onChange={bind('location')} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
            <input className="w-full rounded-lg border-slate-200 text-sm" value={form.address} onChange={bind('address')} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Size (sqft)</label>
            <input type="number" min="0" className="w-full rounded-lg border-slate-200 text-sm" value={form.size} onChange={bind('size')} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Rooms</label>
            <input type="number" min="0" className="w-full rounded-lg border-slate-200 text-sm" value={form.rooms} onChange={bind('rooms')} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Bathrooms</label>
            <input type="number" min="0" className="w-full rounded-lg border-slate-200 text-sm" value={form.bathrooms} onChange={bind('bathrooms')} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
            <select className="w-full rounded-lg border-slate-200 text-sm" value={form.type} onChange={bind('type')}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select className="w-full rounded-lg border-slate-200 text-sm" value={form.categoryId} onChange={bind('categoryId')} required>
              <option value="" disabled>Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Latitude (optional)</label>
            <input type="number" step="any" className="w-full rounded-lg border-slate-200 text-sm" value={form.latitude} onChange={bind('latitude')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Longitude (optional)</label>
            <input type="number" step="any" className="w-full rounded-lg border-slate-200 text-sm" value={form.longitude} onChange={bind('longitude')} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea rows={5} className="w-full rounded-lg border-slate-200 text-sm" value={form.description} onChange={bind('description')} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Image URLs</label>
          <textarea rows={4} className="w-full rounded-lg border-slate-200 text-sm" placeholder="https://... (one per line)" value={form.imagesText} onChange={bind('imagesText')} />
          <p className="mt-1 text-xs text-slate-400">Enter one image URL per line. Uploads are coming soon.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Features</label>
          <textarea rows={3} className="w-full rounded-lg border-slate-200 text-sm" placeholder="e.g. Parking, Pool (one per line)" value={form.featuresText} onChange={bind('featuresText')} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Property'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
