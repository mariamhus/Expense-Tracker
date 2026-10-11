import { Search, Trash2, X } from "lucide-react";
import { getCategory } from "../lib/categories";
import { formatDayHeading } from "../lib/dates";
import { formatMoney, type Currency } from "../lib/money";
import type { CategoryId, Expense } from "../types";

interface ExpenseListProps {
  expenses: Expense[];
  monthHasExpenses: boolean;
  currency: Currency;
  query: string;
  activeCategory: CategoryId | null;
  onQueryChange: (query: string) => void;
  onClearCategory: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onAdd: () => void;
}

export function ExpenseList({
  expenses,
  monthHasExpenses,
  currency,
  query,
  activeCategory,
  onQueryChange,
  onClearCategory,
  onEdit,
  onDelete,
  onAdd,
}: ExpenseListProps) {
  const groups = new Map<string, Expense[]>();
  for (const expense of [...expenses].sort((a, b) => b.date.localeCompare(a.date))) {
    const group = groups.get(expense.date) ?? [];
    group.push(expense);
    groups.set(expense.date, group);
  }

  const filtered = query.trim() !== "" || activeCategory !== null;

  return (
    <section aria-labelledby="expenses-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="expenses-heading" className="section-title">
          Expenses
        </h2>
        <div className="relative w-full sm:w-64">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search expenses"
            aria-label="Search expenses"
            className="field h-10 w-full pl-9"
          />
        </div>
      </div>

      {activeCategory && (
        <div className="mt-3">
          <button
            type="button"
            onClick={onClearCategory}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pr-2 pl-3 text-sm"
          >
            <span className="size-2.5 rounded-full" style={{ background: getCategory(activeCategory).color }} />
            {getCategory(activeCategory).name}
            <X aria-hidden="true" className="size-3.5 text-muted" />
            <span className="sr-only">Remove category filter</span>
          </button>
        </div>
      )}

      {groups.size === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line px-6 py-12 text-center">
          {monthHasExpenses && filtered ? (
            <p className="text-muted">No expenses match these filters. Try a different search or clear the category.</p>
          ) : (
            <>
              <p className="font-semibold">No expenses this month</p>
              <p className="mt-1 text-sm text-muted">Add what you've spent and it will show up here, grouped by day.</p>
              <button type="button" onClick={onAdd} className="button-primary mt-5 h-10">
                Add expense
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {[...groups.entries()].map(([date, items]) => (
            <div key={date}>
              <div className="flex items-baseline justify-between border-b border-line pr-10 pb-2 text-sm">
                <h3 className="font-semibold">{formatDayHeading(date)}</h3>
                <p className="text-muted tabular-nums">
                  {formatMoney(
                    items.reduce((sum, item) => sum + item.amount, 0),
                    currency,
                  )}
                </p>
              </div>
              <ul>
                {items.map((expense) => {
                  const category = getCategory(expense.category);
                  const Icon = category.icon;
                  return (
                    <li key={expense.id} className="group flex items-center gap-1 border-b border-line/70">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        aria-label={`Edit ${expense.description}, ${formatMoney(expense.amount, currency)}`}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-3 pr-2 text-left"
                      >
                        <span
                          className="grid size-9 shrink-0 place-items-center rounded-full"
                          style={{ background: category.color }}
                        >
                          <Icon aria-hidden="true" className="size-4 text-white" strokeWidth={2} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{expense.description}</span>
                          <span className="block text-sm text-muted">{category.name}</span>
                        </span>
                        <span className="font-semibold tabular-nums">{formatMoney(expense.amount, currency)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(expense)}
                        aria-label={`Delete ${expense.description}`}
                        className="icon-button text-muted hover:text-danger sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
