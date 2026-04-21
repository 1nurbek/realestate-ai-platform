type ChartItem = {
  label: string;
  value: number;
};

type SimpleBarChartProps = {
  title: string;
  data: ChartItem[];
  heightClassName?: string;
};

export default function SimpleBarChart({ title, data, heightClassName = "h-40" }: SimpleBarChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className={`mt-4 flex items-end gap-2 ${heightClassName}`}>
        {data.map((item) => {
          const percentage = (item.value / max) * 100;
          return (
            <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="relative w-full rounded bg-slate-100" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 w-full rounded bg-indigo-500"
                  style={{ height: `${percentage}%` }}
                  title={`${item.label}: ${item.value}`}
                />
              </div>
              <span className="truncate text-xs text-slate-600">{item.label}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}