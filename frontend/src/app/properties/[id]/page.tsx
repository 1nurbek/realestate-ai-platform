'use client';

import { useState } from 'react';
import { FiMapPin, FiCheck, FiMessageCircle } from 'react-icons/fi';
import Button from '@/components/Button';
import MapView from '@/components/MapView';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';

const gallery = [
  'https://picsum.photos/seed/detail-1/1200/700',
  'https://picsum.photos/seed/detail-2/1200/700',
  'https://picsum.photos/seed/detail-3/1200/700',
  'https://picsum.photos/seed/detail-4/1200/700',
];

const similar: PropertyCardData[] = [
  { id: '11', title: 'Garden View Condo', location: 'Austin, TX', price: '$740,000', beds: 3, baths: 2, size: 1850, image: 'https://picsum.photos/seed/sim-1/800/500' },
  { id: '12', title: 'Luxury Hillside Home', location: 'Los Angeles, CA', price: '$1,890,000', beds: 5, baths: 4, size: 4100, image: 'https://picsum.photos/seed/sim-2/800/500' },
  { id: '13', title: 'Riverside Apartment', location: 'Portland, OR', price: '$520,000', beds: 2, baths: 2, size: 1200, image: 'https://picsum.photos/seed/sim-3/800/500' },
];

const features = ['Smart Home System', 'Swimming Pool', 'Private Parking', 'Gym Access', 'Backyard Patio', '24/7 Security'];

export default function PropertyDetailsPage() {
  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-2xl">
            <img src={activeImage} alt="Property main" className="h-[420px] w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((image) => (
              <button
                key={image}
                className={`overflow-hidden rounded-lg border-2 ${activeImage === image ? 'border-indigo-600' : 'border-transparent'}`}
                onClick={() => setActiveImage(image)}
              >
                <img src={image} alt="Property thumbnail" className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contemporary Family Estate</h1>
            <p className="mt-2 flex items-center gap-2 text-slate-500">
              <FiMapPin /> 245 Maple Avenue, Austin, TX
            </p>
            <p className="mt-3 text-3xl font-bold text-indigo-600">$1,280,000</p>
            <p className="mt-4 text-slate-600">
              Spacious and modern estate featuring open-concept living, premium finishes, and a private landscaped backyard.
              Perfectly located near top schools, shopping, and city conveniences.
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div><p className="text-xs text-slate-500">Rooms</p><p className="font-semibold">5</p></div>
            <div><p className="text-xs text-slate-500">Bathrooms</p><p className="font-semibold">4</p></div>
            <div><p className="text-xs text-slate-500">Size</p><p className="font-semibold">3,950 sqft</p></div>
            <div><p className="text-xs text-slate-500">Type</p><p className="font-semibold">Villa</p></div>
            <div><p className="text-xs text-slate-500">Status</p><p className="font-semibold">Active</p></div>
            <div><p className="text-xs text-slate-500">Year Built</p><p className="font-semibold">2021</p></div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Features</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                  <FiCheck className="text-indigo-600" /> {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">Location Map</h2>
            <div className="h-64 overflow-hidden rounded-2xl">
              <MapView latitude={30.2672} longitude={-97.7431} zoom={14} />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold">Listed by Sarah Johnson</h3>
            <p className="mt-1 text-sm text-slate-500">Senior Property Agent</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Phone: +1 (555) 180-3344</p>
              <p>Email: sarah@estateai.com</p>
            </div>
            <Button className="mt-5 w-full gap-2">
              <FiMessageCircle /> Message Agent
            </Button>
          </div>
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Similar Properties</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
}