import { useEffect, useRef, useState, type FormEvent } from "react";
import { amountInput, formatMoney, parseAmount, type Currency } from "../lib/money";

interface BudgetEditorProps {
  budget: number;
  currency: Currency;
  onChange: (budget: number) => void;
}

export function BudgetEditor({ budget, currency, onChange }: BudgetEditorProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function start() {
    setValue(budget > 0 ? amountInput(budget) : "");
    setInvalid(false);
    setEditing(true);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (value.trim() === "") {
      onChange(0);
      setEditing(false);
      return;
    }
    const cents = parseAmount(value);
    if (cents === null) {
      setInvalid(true);
      return;
    }
    onChange(cents);
    setEditing(false);
  }

  if (editing) {
    return (
      <form onSubmit={save} className="flex flex-wrap items-center gap-2">
        <label htmlFor="budget-input" className="text-muted">
          Monthly budget
        </label>
        <input
          ref={inputRef}
          id="budget-input"
          inputMode="decimal"
          value={value}
          aria-invalid={invalid}
          aria-describedby={invalid ? "budget-error" : undefined}
          onChange={(event) => {
            setValue(event.target.value);
            setInvalid(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setEditing(false);
          }}
          className="field h-9 w-32"
        />
        <button type="submit" className="button-primary h-9">
          Save
        </button>
        <button type="button" onClick={() => setEditing(false)} className="button-quiet h-9">
          Cancel
        </button>
        {invalid && (
          <p id="budget-error" className="w-full text-sm text-danger">
            Enter a positive amount, like 2500 or 2500.50. Leave it empty to remove the budget.
          </p>
        )}
      </form>
    );
  }

  return (
    <button type="button" onClick={start} className="text-muted underline decoration-line underline-offset-4 hover:text-ink">
      {budget > 0 ? `of ${formatMoney(budget, currency, true)} budget` : "Set a monthly budget"}
    </button>
  );
}
