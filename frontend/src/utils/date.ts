export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return 'No due date';
  const date = new Date(dueDate);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isDueToday(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return isSameDay(new Date(dueDate), new Date());
}

export function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status === 'Completed') return false;
  return new Date(dueDate).getTime() < Date.now();
}

/**
 * Converts an ISO due date to a `<input type="date">` value using LOCAL calendar
 * date parts. Slicing the raw ISO string instead would use the UTC calendar date,
 * which silently shifts by a day for any timezone east of UTC.
 */
export function toDateInputValue(dueDate: string | null): string {
  if (!dueDate) return '';
  const date = new Date(dueDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toIsoDueDate(dateInputValue: string): string | null {
  if (!dateInputValue) return null;
  return new Date(`${dateInputValue}T00:00:00`).toISOString();
}
