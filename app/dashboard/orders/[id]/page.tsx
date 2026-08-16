"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import * as orderService from "@/services/orderService";
import type { Order, OrderStatus } from "@/types";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { OrderStatusSelector } from "@/components/orders/OrderStatusSelector";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { normalizeError } from "@/utils/errorHandler";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setLoadError(null);

    orderService
      .getOrder(params.id)
      .then((result) => {
        if (!ignore) setOrder(result);
      })
      .catch((err) => {
        if (!ignore) setLoadError(normalizeError(err).message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [params.id, retryVersion]);

  const handleStatusChange = async (status: OrderStatus) => {
    setIsUpdatingStatus(true);
    setStatusError(null);

    try {
      const updated = await orderService.updateOrderStatus(params.id, status);
      setOrder(updated);
    } catch (err) {
      setStatusError(normalizeError(err).message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await orderService.deleteOrder(params.id);
      router.push("/dashboard/orders");
    } catch (err) {
      setDeleteError(normalizeError(err).message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading order..." />;
  }

  if (loadError) {
    return <ErrorMessage message={loadError} onRetry={() => setRetryVersion((v) => v + 1)} />;
  }

  if (!order) {
    return <ErrorMessage message="Order not found." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard/orders" className="text-sm font-medium text-amber-600 hover:underline">
          ← Back to Orders
        </Link>
        <Button variant="danger" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
          Delete Order
        </Button>
      </div>

      <OrderDetails order={order} />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Order Status</h2>
        {statusError && (
          <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {statusError}
          </div>
        )}
        <OrderStatusSelector
          currentStatus={order.status}
          onChangeStatus={handleStatusChange}
          isUpdating={isUpdatingStatus}
        />
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Order?"
        message={deleteError || "Are you sure you want to permanently delete this order? This cannot be undone."}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
