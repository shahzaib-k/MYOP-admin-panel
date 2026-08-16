import clsx from "clsx";
import { Button } from "@/components/ui/Button";

export function ErrorMessage({
  message,
  onRetry,
  variant = "block",
}: {
  message: string;
  onRetry?: () => void;
  variant?: "block" | "inline";
}) {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        <span>{message}</span>
        {onRetry && (
          <button onClick={onRetry} className="font-semibold underline underline-offset-2">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center"
      )}
    >
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
