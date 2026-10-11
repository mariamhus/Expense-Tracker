import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { createId } from "../lib/id";
import { createSampleExpenses } from "../lib/sample";
import type { Expense, ExpenseDraft } from "../types";

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses:items", () => createSampleExpenses());

  const add = useCallback(
    (draft: ExpenseDraft) => setExpenses((items) => [...items, { ...draft, id: createId() }]),
    [setExpenses],
  );

  const update = useCallback(
    (id: string, draft: ExpenseDraft) =>
      setExpenses((items) => items.map((item) => (item.id === id ? { ...draft, id } : item))),
    [setExpenses],
  );

  const remove = useCallback(
    (id: string) => setExpenses((items) => items.filter((item) => item.id !== id)),
    [setExpenses],
  );

  const restore = useCallback(
    (expense: Expense) =>
      setExpenses((items) => (items.some((item) => item.id === expense.id) ? items : [...items, expense])),
    [setExpenses],
  );

  const loadSample = useCallback(() => setExpenses(createSampleExpenses()), [setExpenses]);
  const clearAll = useCallback(() => setExpenses([]), [setExpenses]);

  return { expenses, add, update, remove, restore, loadSample, clearAll };
}
