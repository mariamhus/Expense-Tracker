import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { BudgetEditor } from "./BudgetEditor";
import { getCategory } from "../lib/categories";
import { formatMoney, type Currency } from "../lib/money";
import type { CategoryId } from "../types";

export interface CategoryTotal {
  id: CategoryId;
  total: number;
}

interface SpendingSummaryProps {
  total: number;
  totals: CategoryTotal[];
  budget: number;
  currency: Currency;
  previousTotal: number;
  previousLabel: string;
  daysElapsed: number;
  daysInMonth: number;
  isCurrentMonth: boolean;
  activeCategory: CategoryId | null;
  onBudgetChange: (budget: number) => void;
  onSelectCategory: (id: CategoryId | null) => void;
}

export function SpendingSummary({
  total,
  totals,
  budget,
  currency,
  previousTotal,
  previousLabel,
  daysElapsed,
  daysInMonth,
  isCurrentMonth,
  activeCategory,
  onBudgetChange,
  onSelectCategory,
}: SpendingSummaryProps) {
  const [hovered, setHovered] = useState<CategoryId | null>(null);
  const scale = Math.max(total, budget, 1);
  const budgetPosition = budget > 0 ? (budget / scale) * 100 : null;
  const remaining = budget - total;
  const over = budget > 0 && remaining < 0;
  const dailyAverage = daysElapsed > 0 ? Math.round(total / daysElapsed) : 0;
  const change = previousTotal > 0 ? Math.round(((total - previousTotal) / previousTotal) * 100) : null;
  const shown = hovered ?? activeCategory;
  const shownTotal = shown ? totals.find((item) => item.id === shown)?.total ?? 0 : 0;

  let budgetLine: string | null = null;
  if (budget > 0) {
    budgetLine = over
      ? `${formatMoney(-remaining, currency)} over budget`
      : `${formatMoney(remaining, currency)} left${isCurrentMonth ? ` for ${daysInMonth - daysElapsed + 1} more days` : ""}`;
  }

  return (
    <section aria-labelledby="summary-heading" className="summary-in">
      <h1 id="summary-heading" className="sr-only">
        Spending summary
      </h1>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <p className="text-muted">Spent</p>
          <p className="mt-1 text-[clamp(3.25rem,11vw,6.5rem)] leading-none font-semibold tracking-[-0.045em] tabular-nums">
            {formatMoney(total, currency)}
          </p>
          <div className="mt-3">
            <BudgetEditor budget={budget} currency={currency} onChange={onBudgetChange} />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:gap-x-10">
          <div>
            <dt className="text-sm text-muted">Daily average</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums">{formatMoney(dailyAverage, currency)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Compared with {previousLabel}</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums">
              {change === null ? "No data" : change === 0 ? "Same" : `${change > 0 ? "+" : "−"}${Math.abs(change)}%`}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8">
        <div className="relative pt-7">
          {budgetPosition !== null && (
            <div
              className="pointer-events-none absolute top-0 bottom-0 z-10 flex -translate-x-px flex-col items-center"
              style={{ left: `${budgetPosition}%` }}
            >
              <span
                className={`absolute top-0 text-xs whitespace-nowrap text-muted ${
                  budgetPosition > 85 ? "right-1" : "left-1/2 -translate-x-1/2"
                }`}
              >
                Budget
              </span>
              <span className="mt-5 h-full w-0.5 rounded-full bg-ink" />
            </div>
          )}

          <div
            role="group"
            aria-label="Spending by category"
            className="flex h-12 gap-0.5 overflow-hidden rounded-lg bg-line/70"
            onMouseLeave={() => setHovered(null)}
          >
            {totals.map((item) => {
              const category = getCategory(item.id);
              const dimmed = shown !== null && shown !== item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={activeCategory === item.id}
                  aria-label={`${category.name}: ${formatMoney(item.total, currency)}. Show only ${category.name}`}
                  onMouseEnter={() => setHovered(item.id)}
                  onFocus={() => setHovered(item.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => onSelectCategory(activeCategory === item.id ? null : item.id)}
                  className="h-full min-w-1 transition-opacity first:rounded-l-lg"
                  style={{
                    width: `${(item.total / scale) * 100}%`,
                    background: category.color,
                    opacity: dimmed ? 0.3 : 1,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex min-h-6 flex-wrap items-center justify-between gap-x-6 gap-y-1 text-sm">
          <p aria-live="polite" className="text-muted">
            {shown ? (
              <>
                <span className="font-medium text-ink">{getCategory(shown).name}</span>{" "}
                {formatMoney(shownTotal, currency)}, {total > 0 ? Math.round((shownTotal / total) * 100) : 0}% of spending
              </>
            ) : totals.length > 0 ? (
              "Select a category to filter your expenses."
            ) : null}
          </p>
          {budgetLine && (
            <p className={`flex items-center gap-1.5 font-medium ${over ? "text-danger" : "text-ink"}`}>
              {over && <TriangleAlert aria-hidden="true" className="size-4" />}
              {budgetLine}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
