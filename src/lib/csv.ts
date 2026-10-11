import { getCategory } from "./categories";
import type { Expense } from "../types";

function escape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function downloadCsv(expenses: Expense[], fileName: string) {
  const rows = [
    ["Date", "Description", "Category", "Amount"],
    ...[...expenses]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((expense) => [
        expense.date,
        expense.description,
        getCategory(expense.category).name,
        (expense.amount / 100).toFixed(2),
      ]),
  ];
  const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
