// Component
export { default as Calendar } from './components/Calendar';
export type {
  CalendarProps,
  CalendarCountsByDate,
} from './components/Calendar';

// Hook
export { default as useCalendarState } from './hooks/useCalendarState';
export type {
  UseCalendarStateOptions,
  UseCalendarStateResult,
} from './hooks/useCalendarState';

// Theme
export { defaultTheme, resolveTheme } from './theme/defaultTheme';
export type { CalendarTheme } from './theme/defaultTheme';

// Utils (useful for consumers building on top)
export {
  todayISO,
  toISO,
  addMonths,
  buildCells,
  buildYearRange,
  getMonthNames,
  headerMonthName,
  monthLabel,
  setVisibleMonth,
} from './utils/dateHelpers';
export type { ISODate, CalendarCell } from './utils/dateHelpers';
