import { getCategory } from "../lib/categories";
import { formatMoney, type Currency } from "../lib/money";
import type { CategoryId } from "../types";
import type { CategoryTotal } from "./SpendingSummary";

interface CategoryBreakdownProps {
  totals: CategoryTotal[];
  total: number;
  currency: Currency;
  activeCategory: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
}

export function CategoryBreakdown({ totals, total, currency, activeCategory, onSelect }: CategoryBreakdownProps) {
  return (
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="section-title">
        By category
      </h2>
      {totals.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Categories appear here once you add expenses for this month.</p>
      ) : (
        <ul className="mt-2">
          {totals.map((item) => {
            const category = getCategory(item.id);
            const Icon = category.icon;
            const active = activeCategory === item.id;
            const share = total > 0 ? Math.round((item.total / total) * 100) : 0;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(active ? null : item.id)}
                  className={`grid w-full grid-cols-[2rem_minmax(0,1fr)_auto_2.75rem] items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
                    active ? "bg-surface shadow-[inset_0_0_0_1px_var(--color-line)]" : "hover:bg-surface"
                  } ${activeCategory && !active ? "opacity-55" : ""}`}
                >
                  <span className="grid size-8 place-items-center rounded-full" style={{ background: category.color }}>
                    <Icon aria-hidden="true" className="size-4 text-white" strokeWidth={2} />
                  </span>
                  <span className="truncate font-medium">{category.name}</span>
                  <span className="tabular-nums">{formatMoney(item.total, currency)}</span>
                  <span className="text-right text-sm text-muted tabular-nums">{share}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
