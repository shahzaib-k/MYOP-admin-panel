"use client";

import { useState } from "react";
import type { OrderStatus } from "@/types";
import { getAllowedNextStatuses, ORDER_STATUS_LABELS } from "@/utils/orderStatus";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export function OrderStatusSelector({
  currentStatus,
  onChangeStatus,
  isUpdating,
}: {
  currentStatus: OrderStatus;
  onChangeStatus: (status: OrderStatus) => Promise<void>;
  isUpdating: boolean;
}) {
  const allowedNextStatuses = getAllowedNextStatuses(currentStatus);
  const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");

  if (allowedNextStatuses.length === 0) {
    return <p className="text-sm text-slate-500">This order is completed — no further status changes are possible.</p>;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Select
        label="Update status to"
        value={nextStatus}
        onChange={(event) => setNextStatus(event.target.value as OrderStatus)}
        disabled={isUpdating}
        className="sm:w-56"
      >
        <option value="">Select a status</option>
        {allowedNextStatuses.map((status) => (
          <option key={status} value={status}>
            {ORDER_STATUS_LABELS[status]}
          </option>
        ))}
      </Select>
      <Button
        onClick={() => nextStatus && onChangeStatus(nextStatus)}
        disabled={!nextStatus}
        isLoading={isUpdating}
      >
        Update Status
      </Button>
    </div>
  );
}
