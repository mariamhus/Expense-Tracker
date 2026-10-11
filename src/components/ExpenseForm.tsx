import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "../lib/categories";
import { amountInput, parseAmount, type Currency } from "../lib/money";
import type { CategoryId, Expense, ExpenseDraft } from "../types";

interface ExpenseFormProps {
  open: boolean;
  expense: Expense | null;
  defaultDate: string;
  currency: Currency;
  onClose: () => void;
  onSubmit: (draft: ExpenseDraft) => void;
}

interface Errors {
  amount?: string;
  description?: string;
  date?: string;
}

export function ExpenseForm({ open, expense, defaultDate, currency, onClose, onSubmit }: ExpenseFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId>("food");
  const [date, setDate] = useState(defaultDate);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setAmount(expense ? amountInput(expense.amount) : "");
      setDescription(expense?.description ?? "");
      setCategory(expense?.category ?? "food");
      setDate(expense?.date ?? defaultDate);
      setErrors({});
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, expense, defaultDate]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const cents = parseAmount(amount);
    const next: Errors = {};
    if (cents === null) next.amount = "Enter an amount greater than zero, like 12.50.";
    if (description.trim() === "") next.description = "Add a short description, like “Groceries”.";
    if (!date) next.date = "Pick the date you spent it.";
    setErrors(next);
    if (cents === null || next.description || next.date) return;
    onSubmit({ amount: cents, description: description.trim(), category, date });
  }

  const editing = expense !== null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="expense-form-title"
      className="sheet"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between">
          <h2 id="expense-form-title" className="text-xl font-semibold tracking-tight">
            {editing ? "Edit expense" : "Add expense"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="icon-button -mr-2">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div>
          <label htmlFor="amount" className="label">
            Amount ({currency})
          </label>
          <input
            id="amount"
            inputMode="decimal"
            autoComplete="off"
            autoFocus
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setErrors((current) => ({ ...current, amount: undefined }));
            }}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "amount-error" : undefined}
            placeholder="0.00"
            className="field mt-1.5 h-14 w-full text-3xl font-semibold tabular-nums"
          />
          {errors.amount && <p id="amount-error" className="error">{errors.amount}</p>}
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <input
            id="description"
            value={description}
            maxLength={80}
            onChange={(event) => {
              setDescription(event.target.value);
              setErrors((current) => ({ ...current, description: undefined }));
            }}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
            placeholder="What was it for?"
            className="field mt-1.5 h-11 w-full"
          />
          {errors.description && <p id="description-error" className="error">{errors.description}</p>}
        </div>

        <fieldset>
          <legend className="label">Category</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORIES.map((option) => {
              const Icon = option.icon;
              const selected = option.id === category;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center text-xs font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${
                    selected ? "border-ink bg-paper" : "border-line hover:border-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={option.id}
                    checked={selected}
                    onChange={() => setCategory(option.id)}
                    className="sr-only"
                  />
                  <span className="grid size-8 place-items-center rounded-full" style={{ background: option.color }}>
                    <Icon aria-hidden="true" className="size-4 text-white" strokeWidth={2} />
                  </span>
                  {option.name}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="date" className="label">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setErrors((current) => ({ ...current, date: undefined }));
            }}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "date-error" : undefined}
            className="field mt-1.5 h-11 w-full"
          />
          {errors.date && <p id="date-error" className="error">{errors.date}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="button-quiet h-11">
            Cancel
          </button>
          <button type="submit" className="button-primary h-11">
            {editing ? "Save changes" : "Add expense"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
