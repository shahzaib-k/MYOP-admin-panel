"use client";

import { useState, type FormEvent } from "react";
import type { Category, Food } from "@/types";
import type { FoodPayload } from "@/services/foodService";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface FieldErrors {
  name?: string;
  price?: string;
  category?: string;
  image?: string;
  description?: string;
}

export function FoodForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
  submitLabel,
}: {
  initialData?: Food;
  categories: Category[];
  onSubmit: (payload: FoodPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  submitLabel: string;
}) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [price, setPrice] = useState(initialData ? String(initialData.price) : "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  // Missing on items saved before the flag existed, which count as available.
  const [available, setAvailable] = useState(initialData?.available !== false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) nextErrors.name = "Name is required";
    if (!price.trim() || Number.isNaN(Number(price)) || Number(price) <= 0) {
      nextErrors.price = "Enter a valid positive price";
    }
    if (!category) nextErrors.category = "Category is required";
    if (!image.trim()) nextErrors.image = "Image URL is required";
    if (!description.trim()) nextErrors.description = "Description is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      price: Number(price),
      category,
      image: image.trim(),
      description: description.trim(),
      available,
    });
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
        placeholder="e.g. Zinger Burger"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errors.name}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Price (Rs.)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          error={errors.price}
          disabled={isSubmitting}
        />

        <Select
          label="Category"
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          error={errors.category}
          disabled={isSubmitting || categories.length === 0}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-amber-600">
          No categories exist yet — create a category before adding food items.
        </p>
      )}

      <Textarea
        label="Description"
        name="description"
        rows={3}
        placeholder="Short description of this item"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        error={errors.description}
        disabled={isSubmitting}
      />

      <Input
        label="Image URL"
        name="image"
        placeholder="https://..."
        value={image}
        onChange={(event) => setImage(event.target.value)}
        error={errors.image}
        disabled={isSubmitting}
      />

      {image.trim() && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.trim()}
          alt="Preview"
          className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      <label className="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-slate-300"
          checked={available}
          onChange={(event) => setAvailable(event.target.checked)}
          disabled={isSubmitting}
        />
        <span>
          <span className="font-medium text-slate-900">Available for ordering</span>
          <span className="block text-slate-500">
            Untick to mark this item as sold out. Customers will see it greyed out and
            it will not be suggested.
          </span>
        </span>
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
