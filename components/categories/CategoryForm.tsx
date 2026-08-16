"use client";

import { useState, type FormEvent } from "react";
import type { Category } from "@/types";
import type { CategoryPayload } from "@/services/categoryService";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
}: {
  initialData?: Category;
  onSubmit: (payload: CategoryPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setNameError("Category name is required");
      return;
    }

    setNameError(null);
    await onSubmit({ name: name.trim(), description: description.trim(), image: image.trim(), isActive });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {submitError}
        </div>
      )}

      <Input
        label="Name"
        name="name"
        placeholder="e.g. Burgers"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={nameError ?? undefined}
        disabled={isSubmitting}
      />

      <Textarea
        label="Description"
        name="description"
        rows={3}
        placeholder="Optional short description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        disabled={isSubmitting}
      />

      <Input
        label="Image URL"
        name="image"
        placeholder="https://..."
        value={image}
        onChange={(event) => setImage(event.target.value)}
        disabled={isSubmitting}
      />

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
        />
        Active (visible to customers)
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? "Save Changes" : "Add Category"}
        </Button>
      </div>
    </form>
  );
}
