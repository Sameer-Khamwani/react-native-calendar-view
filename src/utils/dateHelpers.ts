export type ISODate = string; // YYYY-MM-DD

export interface CalendarCell {
  key: string;
  iso: ISODate | null;
  day: number | null;
}

/**
 * Returns today's date as a YYYY-MM-DD string.
 */
export const todayISO = (): ISODate => {
  const d = new Date();
  return toISO(d);
};

/**
 * Converts a Date to a YYYY-MM-DD string using local time.
 */
export const toISO = (date: Date): ISODate => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Returns a new Date shifted by `delta` months, always normalised to the 1st.
 */
export const addMonths = (date: Date, delta: number): Date => {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + delta);
  return d;
};

/**
 * Builds the full Sun-Sat grid of cells for a given month.
 * Leading and trailing empty cells pad to complete weeks.
 */
export const buildCells = (year: number, month: number): CalendarCell[] => {
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = 0; i < startDay; i++) {
    cells.push({ key: `pre-${i}`, iso: null, day: null });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    cells.push({ key: `${year}-${mm}-${dd}`, iso: `${year}-${mm}-${dd}`, day: d });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `post-${cells.length}`, iso: null, day: null });
  }

  return cells;
};

/**
 * Returns a localised month + year label, e.g. "May 2026".
 */
export const monthLabel = (date: Date): string =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

/** Long month name for the header, e.g. "May". */
export const headerMonthName = (date: Date): string =>
  date.toLocaleDateString(undefined, { month: 'long' });

/** All 12 long month names in calendar order (Jan–Dec). */
export const getMonthNames = (): string[] =>
  Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleDateString(undefined, { month: 'long' }),
  );

/** Inclusive year range for the year picker. */
export const buildYearRange = (
  minYear: number,
  maxYear: number,
): number[] => {
  const length = maxYear - minYear + 1;
  return Array.from({ length }, (_, i) => minYear + i);
};

/**
 * Updates the visible month while keeping the day when valid for the target month.
 */
export const setVisibleMonth = (
  date: Date,
  year: number,
  month: number,
): Date => {
  const next = new Date(date);
  next.setFullYear(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  next.setDate(Math.min(date.getDate(), daysInMonth));
  return next;
};
