import {
  Bus,
  Clapperboard,
  House,
  Package,
  ReceiptText,
  ShoppingBag,
  Stethoscope,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "../types";

export interface Category {
  id: CategoryId;
  name: string;
  color: string;
  icon: LucideIcon;
}

export const CATEGORIES: Category[] = [
  { id: "food", name: "Food & drink", color: "var(--cat-1)", icon: UtensilsCrossed },
  { id: "transport", name: "Transport", color: "var(--cat-2)", icon: Bus },
  { id: "housing", name: "Housing", color: "var(--cat-3)", icon: House },
  { id: "bills", name: "Bills", color: "var(--cat-4)", icon: ReceiptText },
  { id: "shopping", name: "Shopping", color: "var(--cat-5)", icon: ShoppingBag },
  { id: "health", name: "Health", color: "var(--cat-6)", icon: Stethoscope },
  { id: "fun", name: "Entertainment", color: "var(--cat-7)", icon: Clapperboard },
  { id: "other", name: "Other", color: "var(--cat-8)", icon: Package },
];

const BY_ID = new Map(CATEGORIES.map((category) => [category.id, category]));

export function getCategory(id: CategoryId): Category {
  return BY_ID.get(id) ?? CATEGORIES[CATEGORIES.length - 1];
}
