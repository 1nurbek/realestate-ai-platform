import Link from "next/link";

export type UserProperty = {
  id: string;
  image: string;
  title: string;
  price: string;
  status: "Published" | "Draft" | "Pending";
  views: number;
};

type PropertyTableProps = {
  properties: UserProperty[];
};

const statusStyles: Record<UserProperty["status"], string> = {
  Published: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Pending: "bg-sky-100 text-sky-700",
};

export default function PropertyTable({ properties }: PropertyTableProps) {
  if (!properties.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">No properties yet.</p>
        <Link
          href="/dashboard/properties/new"
          className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Add your first property
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {properties.map((property) => (
              <tr key={property.id} className="text-sm">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={property.image} alt={property.title} className="h-12 w-16 rounded-md object-cover" />
                    <span className="font-medium text-slate-800">{property.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{property.price}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[property.status]}`}>
                    {property.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{property.views}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                      Edit
                    </button>
                    <button className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}