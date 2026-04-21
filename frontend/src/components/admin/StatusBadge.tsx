type Status = "ACTIVE" | "PENDING" | "SOLD";

type StatusBadgeProps = {
  status: Status;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorMap: Record<Status, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    SOLD: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colorMap[status]}`}>
      {status}
    </span>
  );
}