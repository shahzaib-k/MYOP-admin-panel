"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  isConfirming = false,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={isConfirming}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isConfirming}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
