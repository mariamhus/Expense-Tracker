export type CategoryId =
  | "food"
  | "transport"
  | "housing"
  | "bills"
  | "shopping"
  | "health"
  | "fun"
  | "other";

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: CategoryId;
  date: string;
}

export type ExpenseDraft = Omit<Expense, "id">;
