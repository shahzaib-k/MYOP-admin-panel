"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import * as categoryService from "@/services/categoryService";
import type { CategoryPayload } from "@/services/categoryService";
import type { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { EmptyState } from "@/components/ui/EmptyState";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { normalizeError } from "@/utils/errorHandler";

type ModalState = { mode: "create" } | { mode: "edit"; category: Category } | null;

export default function CategoriesPage() {
  const { categories, isLoading, error, refetch } = useCategories();
  const [modalState, setModalState] = useState<ModalState>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const closeModal = () => {
    setModalState(null);
    setFormError(null);
  };

  const handleSubmit = async (payload: CategoryPayload) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (modalState?.mode === "edit") {
        await categoryService.updateCategory(modalState.category.id, payload);
      } else {
        await categoryService.createCategory(payload);
      }

      closeModal();
      await refetch();
    } catch (err) {
      setFormError(normalizeError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      await refetch();
    } catch (err) {
      setDeleteError(normalizeError(err).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{categories.length} categories</p>
        <Button onClick={() => setModalState({ mode: "create" })}>+ Add Category</Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <LoadingSpinner label="Loading categories..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Add your first category to start building the menu."
            action={<Button onClick={() => setModalState({ mode: "create" })}>+ Add Category</Button>}
          />
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={(category) => setModalState({ mode: "edit", category })}
            onDelete={(category) => {
              setCategoryToDelete(category);
              setDeleteError(null);
            }}
          />
        )}
      </div>

      <Modal
        isOpen={modalState !== null}
        onClose={closeModal}
        title={modalState?.mode === "edit" ? "Edit Category" : "Add Category"}
      >
        <CategoryForm
          initialData={modalState?.mode === "edit" ? modalState.category : undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
          submitError={formError}
        />
      </Modal>

      <ConfirmDialog
        isOpen={categoryToDelete !== null}
        title="Delete Category?"
        message={
          deleteError ||
          `Are you sure you want to delete "${categoryToDelete?.name}"? This cannot be undone.`
        }
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
