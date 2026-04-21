type AdminStatsCardProps = {
  label: string;
  value: number | string;
  hint?: string;
};

export default function AdminStatsCard({ label, value, hint }: AdminStatsCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </article>
  );
}