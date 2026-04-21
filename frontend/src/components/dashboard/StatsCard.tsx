type StatsCardProps = {
  label: string;
  value: number | string;
  hint?: string;
};

export default function StatsCard({ label, value, hint }: StatsCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </article>
  );
}