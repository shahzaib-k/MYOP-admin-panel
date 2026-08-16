import { Button } from "@/components/ui/Button";
import type { Pagination as PaginationMeta } from "@/types";

export function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  const { page, totalPages, totalItems } = pagination;

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages} · {totalItems} total
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
