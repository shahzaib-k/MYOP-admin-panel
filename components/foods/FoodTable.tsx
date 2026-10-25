import type { Food } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatters";

export function FoodTable({
  foods,
  onEdit,
  onDelete,
  onToggleAvailability,
  togglingId,
}: {
  foods: Food[];
  onEdit: (food: Food) => void;
  onDelete: (food: Food) => void;
  onToggleAvailability: (food: Food) => void;
  togglingId: string | null;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Image</th>
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Price</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {foods.map((food) => {
            const isAvailable = food.available !== false;

            return (
            <tr key={food.id} className="hover:bg-slate-50">
              <td className="px-5 py-3">
                {food.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-10 w-10 rounded-lg object-cover"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-slate-100" />
                )}
              </td>
              <td className="px-5 py-3 font-medium text-slate-900">{food.name}</td>
              <td className="px-5 py-3 text-slate-500">{food.category}</td>
              <td className="px-5 py-3 text-slate-700">{formatCurrency(food.price)}</td>
              <td className="px-5 py-3">
                <Badge tone={isAvailable ? "success" : "danger"}>
                  {isAvailable ? "Available" : "Sold out"}
                </Badge>
              </td>
              <td className="px-5 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    isLoading={togglingId === food.id}
                    disabled={togglingId !== null}
                    onClick={() => onToggleAvailability(food)}
                  >
                    {isAvailable ? "Mark sold out" : "Mark available"}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onEdit(food)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(food)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
