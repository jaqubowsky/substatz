import { Currency } from "@prisma/client";
import { Tag } from "lucide-react";
import { formatCurrency } from "../../lib/format-currency";

interface TopCategoriesListProps {
  categoriesBreakdown: Record<string, number>;
  defaultCurrency: Currency;
}

export function TopCategoriesList({
  categoriesBreakdown,
  defaultCurrency,
}: TopCategoriesListProps) {
  const sortedCategories = Object.entries(categoriesBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
        <Tag className="h-4 w-4 mr-1" />
        Top Categories
      </h3>
      <ul className="space-y-2">
        {sortedCategories.map(([category, amount]) => (
          <li
            key={category}
            className="flex justify-between p-2 rounded hover:bg-secondary/50"
          >
            <span className="text-foreground">{category}</span>
            <span className="font-medium text-foreground">
              {formatCurrency(amount, defaultCurrency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
