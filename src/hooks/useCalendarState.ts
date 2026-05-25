import { useCallback, useMemo, useState } from 'react';
import { ISODate, todayISO } from '../utils/dateHelpers';

export interface UseCalendarStateOptions {
  /** Initial selected date as YYYY-MM-DD (defaults to today) */
  defaultSelectedISO?: ISODate;
  /** Initial expanded state (defaults to true) */
  defaultExpanded?: boolean;
}

export interface UseCalendarStateResult {
  selectedDateISO: ISODate;
  selectDate: (iso: ISODate) => void;
  visibleMonthDate: Date;
  setVisibleMonthDate: (date: Date) => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  setExpanded: (value: boolean) => void;
}

/**
 * Convenience hook that manages all state required by `MonthCalendar`.
 * Selecting a date automatically syncs the visible month.
 */
const useCalendarState = (
  options: UseCalendarStateOptions = {},
): UseCalendarStateResult => {
  const { defaultSelectedISO, defaultExpanded = true } = options;

  const initialISO = defaultSelectedISO ?? todayISO();

  const [selectedDateISO, setSelectedDateISO] = useState<ISODate>(initialISO);
  const [visibleMonthDate, setVisibleMonthDate] = useState<Date>(
    () => new Date(initialISO),
  );
  const [isExpanded, setExpanded] = useState<boolean>(defaultExpanded);

  const selectDate = useCallback((iso: ISODate) => {
    setSelectedDateISO(iso);
    // Keep visible month in sync when the selected date is in a different month
    setVisibleMonthDate(prev => {
      const selected = new Date(iso);
      if (
        selected.getFullYear() !== prev.getFullYear() ||
        selected.getMonth() !== prev.getMonth()
      ) {
        return selected;
      }
      return prev;
    });
  }, []);

  const toggleExpand = useCallback(() => setExpanded(v => !v), []);

  return useMemo(
    () => ({
      selectedDateISO,
      selectDate,
      visibleMonthDate,
      setVisibleMonthDate,
      isExpanded,
      toggleExpand,
      setExpanded,
    }),
    [selectedDateISO, selectDate, visibleMonthDate, isExpanded, toggleExpand],
  );
};

export default useCalendarState;
