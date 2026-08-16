import type { Category } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Description</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-slate-50">
              <td className="px-5 py-3 font-medium text-slate-900">{category.name}</td>
              <td className="max-w-xs truncate px-5 py-3 text-slate-500">
                {category.description || "—"}
              </td>
              <td className="px-5 py-3">
                <Badge tone={category.isActive ? "success" : "neutral"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-5 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onEdit(category)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(category)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
