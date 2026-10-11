import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import { parseDateKey } from "../lib/dates";
import { formatMoney, type Currency } from "../lib/money";

export interface DayTotal {
  date: string;
  day: number;
  total: number;
}

interface DailyChartProps {
  days: DayTotal[];
  currency: Currency;
  label: string;
}

function ChartTooltip({ active, payload, currency }: TooltipContentProps & { currency: Currency }) {
  const point = payload?.[0]?.payload as DayTotal | undefined;
  if (!active || !point) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-lg shadow-black/10">
      <p className="text-muted">
        {parseDateKey(point.date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
      </p>
      <p className="font-semibold tabular-nums">{formatMoney(point.total, currency)}</p>
    </div>
  );
}

export function DailyChart({ days, currency, label }: DailyChartProps) {
  const [showTable, setShowTable] = useState(false);
  const hasData = days.some((day) => day.total > 0);

  return (
    <section aria-labelledby="daily-heading">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="daily-heading" className="section-title">
          {label}
        </h2>
        {hasData && (
          <button type="button" onClick={() => setShowTable((value) => !value)} className="text-sm text-muted underline underline-offset-4 hover:text-ink">
            {showTable ? "Show chart" : "Show as table"}
          </button>
        )}
      </div>

      {!hasData ? (
        <p className="mt-3 text-sm text-muted">No spending recorded for this month yet.</p>
      ) : showTable ? (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface text-left text-muted">
              <tr>
                <th scope="col" className="px-3 py-2 font-normal">Day</th>
                <th scope="col" className="px-3 py-2 text-right font-normal">Spent</th>
              </tr>
            </thead>
            <tbody>
              {days
                .filter((day) => day.total > 0)
                .map((day) => (
                  <tr key={day.date} className="border-t border-line">
                    <td className="px-3 py-1.5">
                      {parseDateKey(day.date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{formatMoney(day.total, currency)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-3 h-52" role="img" aria-label={`${label}. Use "Show as table" for exact values.`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap={2}>
              <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="0" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={({ x, y, payload }) =>
                  payload.value === 1 || payload.value % 5 === 0 ? (
                    <text x={x} y={Number(y) + 12} textAnchor="middle" fontSize={11} fill="var(--color-muted)">
                      {payload.value}
                    </text>
                  ) : (
                    <g />
                  )
                }
              />
              <YAxis
                width={44}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted)" }}
                tickFormatter={(value: number) => formatMoney(value, currency, true)}
                tickCount={4}
              />
              <Tooltip
                cursor={{ fill: "var(--color-line)", opacity: 0.6 }}
                content={(props) => <ChartTooltip {...props} currency={currency} />}
              />
              <Bar dataKey="total" fill="var(--cat-1)" radius={[4, 4, 0, 0]} maxBarSize={14} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
