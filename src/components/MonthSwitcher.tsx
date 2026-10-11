import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonth, shiftMonth } from "../lib/dates";

interface MonthSwitcherProps {
  month: string;
  currentMonth: string;
  onChange: (month: string) => void;
}

export function MonthSwitcher({ month, currentMonth, onChange }: MonthSwitcherProps) {
  const atCurrent = month >= currentMonth;
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, -1))}
        aria-label="Previous month"
        className="icon-button"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      <p aria-live="polite" className="min-w-[9.5rem] text-center font-semibold">
        {formatMonth(month)}
      </p>
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, 1))}
        disabled={atCurrent}
        aria-label="Next month"
        className="icon-button"
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
      {!atCurrent && (
        <button
          type="button"
          onClick={() => onChange(currentMonth)}
          className="ml-1 rounded-full px-3 py-1.5 text-sm text-muted hover:text-ink"
        >
          This month
        </button>
      )}
    </div>
  );
}
