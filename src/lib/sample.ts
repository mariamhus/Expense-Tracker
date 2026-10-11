import { createId } from "./id";
import { toDateKey } from "./dates";
import type { CategoryId, Expense } from "../types";

interface Template {
  description: string;
  category: CategoryId;
  min: number;
  max: number;
}

const MONTHLY: (Template & { day: number })[] = [
  { day: 1, description: "Rent", category: "housing", min: 120000, max: 120000 },
  { day: 3, description: "Phone plan", category: "bills", min: 3500, max: 3500 },
  { day: 6, description: "Electricity", category: "bills", min: 5400, max: 8900 },
  { day: 12, description: "Internet", category: "bills", min: 4500, max: 4500 },
  { day: 15, description: "Gym membership", category: "health", min: 3000, max: 3000 },
  { day: 20, description: "Streaming subscriptions", category: "fun", min: 2299, max: 2299 },
];

const OCCASIONAL: Template[] = [
  { description: "Groceries", category: "food", min: 2800, max: 9600 },
  { description: "Coffee", category: "food", min: 350, max: 650 },
  { description: "Lunch with coworkers", category: "food", min: 1200, max: 2600 },
  { description: "Dinner out", category: "food", min: 2400, max: 6800 },
  { description: "Metro card top-up", category: "transport", min: 2000, max: 4000 },
  { description: "Taxi home", category: "transport", min: 900, max: 2400 },
  { description: "Fuel", category: "transport", min: 3500, max: 6000 },
  { description: "New sneakers", category: "shopping", min: 6500, max: 12000 },
  { description: "Books", category: "shopping", min: 1500, max: 4200 },
  { description: "Household supplies", category: "shopping", min: 1200, max: 3800 },
  { description: "Pharmacy", category: "health", min: 800, max: 3200 },
  { description: "Cinema tickets", category: "fun", min: 1600, max: 3000 },
  { description: "Concert", category: "fun", min: 4500, max: 9000 },
  { description: "Birthday gift", category: "other", min: 2500, max: 6000 },
];

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function createSampleExpenses(today = new Date()): Expense[] {
  const random = seededRandom(20261011);
  const expenses: Expense[] = [];

  for (let offset = 2; offset >= 0; offset--) {
    const year = today.getFullYear();
    const month = today.getMonth() - offset;
    const lastDay = offset === 0 ? today.getDate() : new Date(year, month + 1, 0).getDate();

    const amountFor = (template: Template) =>
      Math.round((template.min + random() * (template.max - template.min)) / 10) * 10;

    for (const item of MONTHLY) {
      if (item.day > lastDay) continue;
      expenses.push({
        id: createId(),
        description: item.description,
        category: item.category,
        amount: amountFor(item),
        date: toDateKey(new Date(year, month, item.day)),
      });
    }

    const count = Math.round(lastDay * 0.9);
    for (let i = 0; i < count; i++) {
      const template = OCCASIONAL[Math.floor(random() * OCCASIONAL.length)];
      const day = 1 + Math.floor(random() * lastDay);
      expenses.push({
        id: createId(),
        description: template.description,
        category: template.category,
        amount: amountFor(template),
        date: toDateKey(new Date(year, month, day)),
      });
    }
  }

  return expenses;
}
