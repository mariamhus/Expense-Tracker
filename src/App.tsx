import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { CategoryBreakdown } from "./components/CategoryBreakdown";
import type { DayTotal } from "./components/DailyChart";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";
import { MonthSwitcher } from "./components/MonthSwitcher";
import { SpendingSummary, type CategoryTotal } from "./components/SpendingSummary";
import { Toast } from "./components/Toast";
import { useExpenses } from "./hooks/useExpenses";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getCategory } from "./lib/categories";
import { downloadCsv } from "./lib/csv";
import { daysInMonth, formatMonth, monthOf, parseDateKey, shiftMonth, todayKey } from "./lib/dates";
import { CURRENCIES, type Currency } from "./lib/money";
import type { CategoryId, Expense, ExpenseDraft } from "./types";

const DailyChart = lazy(() => import("./components/DailyChart").then((module) => ({ default: module.DailyChart })));

type FormState = { open: false } | { open: true; expense: Expense | null };

interface ToastState {
  message: string;
  undo?: Expense;
}

function sum(items: Expense[]): number {
  return items.reduce((total, item) => total + item.amount, 0);
}

export default function App() {
  const { expenses, add, update, remove, restore, loadSample, clearAll } = useExpenses();
  const [currency, setCurrency] = useLocalStorage<Currency>("expenses:currency", "USD");
  const [budget, setBudget] = useLocalStorage<number>("expenses:budget", 250000);
  const today = todayKey();
  const currentMonth = monthOf(today);
  const [month, setMonth] = useState(currentMonth);
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState>({ open: false });
  const [toast, setToast] = useState<ToastState | null>(null);

  const isCurrentMonth = month === currentMonth;
  const monthDays = daysInMonth(month);
  const daysElapsed = isCurrentMonth ? parseDateKey(today).getDate() : monthDays;
  const previousMonth = shiftMonth(month, -1);

  const monthExpenses = useMemo(() => expenses.filter((item) => monthOf(item.date) === month), [expenses, month]);
  const previousTotal = useMemo(
    () => sum(expenses.filter((item) => monthOf(item.date) === previousMonth && Number(item.date.slice(8)) <= daysElapsed)),
    [expenses, previousMonth, daysElapsed],
  );
  const total = sum(monthExpenses);

  const categoryTotals = useMemo<CategoryTotal[]>(() => {
    const totals = new Map<CategoryId, number>();
    for (const item of monthExpenses) totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
    return [...totals.entries()].map(([id, value]) => ({ id, total: value })).sort((a, b) => b.total - a.total);
  }, [monthExpenses]);

  const effectiveCategory = activeCategory && categoryTotals.some((item) => item.id === activeCategory) ? activeCategory : null;

  const visibleExpenses = useMemo(() => {
    const term = query.trim().toLowerCase();
    return monthExpenses.filter(
      (item) =>
        (effectiveCategory === null || item.category === effectiveCategory) &&
        (term === "" ||
          item.description.toLowerCase().includes(term) ||
          getCategory(item.category).name.toLowerCase().includes(term)),
    );
  }, [monthExpenses, effectiveCategory, query]);

  const dayTotals = useMemo<DayTotal[]>(() => {
    const source = effectiveCategory ? monthExpenses.filter((item) => item.category === effectiveCategory) : monthExpenses;
    return Array.from({ length: monthDays }, (_, index) => {
      const day = index + 1;
      const date = `${month}-${String(day).padStart(2, "0")}`;
      return { date, day, total: sum(source.filter((item) => item.date === date)) };
    });
  }, [monthExpenses, effectiveCategory, month, monthDays]);

  const openAdd = () => setForm({ open: true, expense: null });
  const closeForm = useCallback(() => setForm({ open: false }), []);
  const dismissToast = useCallback(() => setToast(null), []);

  function handleSubmit(draft: ExpenseDraft) {
    if (form.open && form.expense) {
      update(form.expense.id, draft);
      setToast({ message: "Changes saved" });
    } else {
      add(draft);
      setToast({ message: "Expense added" });
    }
    if (monthOf(draft.date) !== month) setMonth(monthOf(draft.date));
    closeForm();
  }

  function handleDelete(expense: Expense) {
    remove(expense.id);
    setToast({ message: `Deleted “${expense.description}”`, undo: expense });
  }

  function handleClearAll() {
    if (window.confirm("Delete every expense? This can't be undone.")) {
      clearAll();
      setActiveCategory(null);
      setToast({ message: "All expenses deleted" });
    }
  }

  const defaultDate = isCurrentMonth ? today : `${month}-01`;

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pt-5 pb-10 sm:px-8 sm:pt-8">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <MonthSwitcher month={month} currentMonth={currentMonth} onChange={setMonth} />
        <div className="flex items-center gap-2">
          <label htmlFor="currency" className="sr-only">
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
            className="field h-10 pr-8 pl-3 text-sm"
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => downloadCsv(monthExpenses, `expenses-${month}.csv`)}
            disabled={monthExpenses.length === 0}
            aria-label={`Export ${formatMonth(month)} as CSV`}
            title="Export as CSV"
            className="icon-button size-10 border border-line bg-surface"
          >
            <Download aria-hidden="true" className="size-4" />
          </button>
          <button type="button" onClick={openAdd} className="button-primary h-10 gap-1.5">
            <Plus aria-hidden="true" className="size-4" />
            Add expense
          </button>
        </div>
      </header>

      <main className="mt-10 flex-1 sm:mt-14">
        <SpendingSummary
          total={total}
          totals={categoryTotals}
          budget={budget}
          currency={currency}
          previousTotal={previousTotal}
          previousLabel={isCurrentMonth ? `this point last month` : formatMonth(previousMonth).split(" ")[0]}
          daysElapsed={daysElapsed}
          daysInMonth={monthDays}
          isCurrentMonth={isCurrentMonth}
          activeCategory={effectiveCategory}
          onBudgetChange={setBudget}
          onSelectCategory={setActiveCategory}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <div className="order-2 lg:order-1">
            <ExpenseList
              expenses={visibleExpenses}
              monthHasExpenses={monthExpenses.length > 0}
              currency={currency}
              query={query}
              activeCategory={effectiveCategory}
              onQueryChange={setQuery}
              onClearCategory={() => setActiveCategory(null)}
              onEdit={(expense) => setForm({ open: true, expense })}
              onDelete={handleDelete}
              onAdd={openAdd}
            />
          </div>
          <aside className="order-1 space-y-10 lg:order-2">
            <CategoryBreakdown
              totals={categoryTotals}
              total={total}
              currency={currency}
              activeCategory={effectiveCategory}
              onSelect={setActiveCategory}
            />
            <Suspense fallback={<div className="h-64 rounded-xl bg-line/50" />}>
              <DailyChart
                days={dayTotals}
                currency={currency}
                label={effectiveCategory ? `${getCategory(effectiveCategory).name} by day` : "Spending by day"}
              />
            </Suspense>
          </aside>
        </div>
      </main>

      <footer className="mt-16 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5 text-sm text-muted">
        <p>Your expenses are saved in this browser only.</p>
        <button type="button" onClick={loadSample} className="underline underline-offset-4 hover:text-ink">
          Load sample data
        </button>
        <button type="button" onClick={handleClearAll} className="underline underline-offset-4 hover:text-danger">
          Delete all expenses
        </button>
      </footer>

      <ExpenseForm
        open={form.open}
        expense={form.open ? form.expense : null}
        defaultDate={defaultDate}
        currency={currency}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      {toast && (
        <Toast
          key={toast.message + (toast.undo?.id ?? "")}
          message={toast.message}
          actionLabel={toast.undo ? "Undo" : undefined}
          onAction={() => {
            if (toast.undo) restore(toast.undo);
            setToast(null);
          }}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
}
