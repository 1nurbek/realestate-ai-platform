"use client";

import { useState } from "react";

type FavoriteProperty = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
};

const initialFavorites: FavoriteProperty[] = [
  {
    id: "f1",
    title: "Waterfront Penthouse",
    price: "$980,000",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "f2",
    title: "Urban Smart Apartment",
    price: "$520,000",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=500&q=60",
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(initialFavorites);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Favorites</h1>
        <p className="mt-2 text-slate-600">Quickly revisit the properties you saved.</p>
      </header>

      {!favorites.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">No favorite properties yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((property) => (
            <article key={property.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={property.image} alt={property.title} className="h-44 w-full object-cover" />
              <div className="space-y-2 p-4">
                <h2 className="text-lg font-semibold text-slate-900">{property.title}</h2>
                <p className="text-sm text-slate-600">{property.location}</p>
                <p className="text-sm font-semibold text-indigo-700">{property.price}</p>
                <button
                  onClick={() => setFavorites((prev) => prev.filter((item) => item.id !== property.id))}
                  className="mt-2 rounded-md border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                >
                  Remove from Favorites
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}