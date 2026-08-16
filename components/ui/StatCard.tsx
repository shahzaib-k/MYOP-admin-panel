import clsx from "clsx";

export function StatCard({
  label,
  value,
  accent = "neutral",
}: {
  label: string;
  value: string | number;
  accent?: "neutral" | "amber" | "green" | "blue" | "red";
}) {
  const accentClasses: Record<string, string> = {
    neutral: "text-slate-900",
    amber: "text-amber-600",
    green: "text-green-600",
    blue: "text-blue-600",
    red: "text-red-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={clsx("mt-2 text-3xl font-bold", accentClasses[accent])}>{value}</p>
    </div>
  );
}
