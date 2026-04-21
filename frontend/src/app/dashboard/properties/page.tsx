import Link from "next/link";
import PropertyTable, { UserProperty } from "@/components/dashboard/PropertyTable";

const mockProperties: UserProperty[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=400&q=60",
    title: "Modern Loft in Downtown",
    price: "$580,000",
    status: "Published",
    views: 1024,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=60",
    title: "Suburban Family House",
    price: "$430,000",
    status: "Pending",
    views: 761,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=60",
    title: "Lakefront Villa",
    price: "$1,290,000",
    status: "Draft",
    views: 187,
  },
];

export default function MyPropertiesPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Properties</h1>
          <p className="mt-2 text-slate-600">Manage your listed homes, prices, and visibility.</p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Add New Property
        </Link>
      </div>

      <PropertyTable properties={mockProperties} />
    </section>
  );
}