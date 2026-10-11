function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function monthOf(dateKey: string): string {
  return dateKey.slice(0, 7);
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day ?? 1);
}

export function shiftMonth(monthKey: string, delta: number): string {
  const date = parseDateKey(`${monthKey}-01`);
  date.setMonth(date.getMonth() + delta);
  return monthOf(toDateKey(date));
}

export function daysInMonth(monthKey: string): number {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

export function formatMonth(monthKey: string): string {
  return parseDateKey(`${monthKey}-01`).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function formatDayHeading(dateKey: string): string {
  const today = todayKey();
  if (dateKey === today) return "Today";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateKey === toDateKey(yesterday)) return "Yesterday";
  return parseDateKey(dateKey).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}
