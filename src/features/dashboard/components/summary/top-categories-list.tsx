import { formatCurrency } from "@/features/dashboard/lib";
import { Currency } from "@prisma/client";
import { Tag } from "lucide-react";

interface TopCategoriesListProps {
  categoriesBreakdown: Record<string, number>;
  defaultCurrency: Currency;
}

const sortCategories = (categoriesBreakdown: Record<string, number>) => {
  return Object.entries(categoriesBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
};

export function TopCategoriesList({
  categoriesBreakdown,
  defaultCurrency,
}: TopCategoriesListProps) {
  const sortedCategories = sortCategories(categoriesBreakdown);

  return (
    <div>
      <h3 className="text-sm font-medium text-accent-foreground mb-3 flex items-center">
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
