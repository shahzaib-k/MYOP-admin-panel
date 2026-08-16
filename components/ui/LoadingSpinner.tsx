import clsx from "clsx";

export function LoadingSpinner({
  label = "Loading...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center justify-center gap-3 py-12 text-slate-500", className)}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-amber-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
