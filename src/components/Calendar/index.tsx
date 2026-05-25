import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  LayoutChangeEvent,
  PanResponder,
  TouchableOpacity,
  View,
} from 'react-native';
import { CalendarTheme, resolveTheme } from '../../theme/defaultTheme';
import { icons, iconTransforms, navIconStyle } from '../../icons';
import {
  ISODate,
  addMonths,
  buildCells,
  buildYearRange,
  headerMonthName,
  setVisibleMonth,
} from '../../utils/dateHelpers';
import { hp } from '../../utils/scale';
import CalendarDatePicker, { DatePickerMode } from './CalendarDatePicker';
import CalendarGrid from './CalendarGrid';
import CalendarHeader from './CalendarHeader';
import { makeCardStyles } from './styles';

const currentYear = new Date().getFullYear();
const DEFAULT_MIN_YEAR = currentYear - 100;
const DEFAULT_MAX_YEAR = currentYear + 20;

export type CalendarCountsByDate = Record<ISODate, number>;

export interface CalendarProps {
  /** Currently selected date as YYYY-MM-DD */
  selectedDateISO: ISODate;
  /** Called when the user taps a day cell */
  onSelectDateISO: (iso: ISODate) => void;
  /** The month currently visible in the header */
  visibleMonthDate?: Date;
  /** Called when the user navigates to a different month */
  onChangeVisibleMonthDate?: (date: Date) => void;
  /** Whether the full grid is visible */
  isExpanded?: boolean;
  /** Called when the toggle button is pressed or a drag crosses the threshold */
  onToggleExpand?: () => void;
  /** Optional per-day badge counts (e.g. appointment counts) */
  countsByDate?: CalendarCountsByDate;
  /** Show/hide the chevron toggle button at the bottom (default true) */
  showToggleButton?: boolean;
  /** Enable drag gesture to expand/collapse (default true) */
  dragToToggle?: boolean;
  /** Pixels of drag needed to trigger a toggle (default 40) */
  dragThreshold?: number;
  /** Allow tapping month/year in the header to open pickers (default true) */
  enableMonthYearPicker?: boolean;
  /** First year shown in the year picker */
  minSelectableYear?: number;
  /** Last year shown in the year picker */
  maxSelectableYear?: number;
  /** Override any theme token */
  theme?: Partial<CalendarTheme>;
  /** Custom left arrow render prop */
  renderLeftArrow?: () => React.ReactNode;
  /** Custom right arrow render prop */
  renderRightArrow?: () => React.ReactNode;
  /** Custom toggle icon render prop — receives current expanded state */
  renderToggleIcon?: (expanded: boolean) => React.ReactNode;
}

const COLLAPSED_HEIGHT = hp(170);

const Calendar: React.FC<CalendarProps> = ({
  selectedDateISO,
  onSelectDateISO,
  visibleMonthDate: visibleMonthDateProp,
  onChangeVisibleMonthDate,
  isExpanded = true,
  onToggleExpand,
  countsByDate,
  showToggleButton = true,
  dragToToggle = true,
  dragThreshold = 40,
  enableMonthYearPicker = true,
  minSelectableYear = DEFAULT_MIN_YEAR,
  maxSelectableYear = DEFAULT_MAX_YEAR,
  theme: themeProp,
  renderLeftArrow,
  renderRightArrow,
  renderToggleIcon,
}) => {
  const theme = useMemo(() => resolveTheme(themeProp), [themeProp]);
  const cardStyles = useMemo(() => makeCardStyles(theme), [theme]);

  const visibleMonthDate = visibleMonthDateProp ?? new Date(selectedDateISO);
  const [pickerMode, setPickerMode] = useState<DatePickerMode | null>(null);

  const years = useMemo(
    () => buildYearRange(minSelectableYear, maxSelectableYear),
    [minSelectableYear, maxSelectableYear],
  );

  const closePicker = useCallback(() => setPickerMode(null), []);

  const togglePicker = useCallback((mode: DatePickerMode) => {
    setPickerMode(prev => (prev === mode ? null : mode));
  }, []);

  // ─── Animation ────────────────────────────────────────────────────────────
  // `animValue` drives: height, translateY, opacity
  const animValue = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  // Extra offset while finger is dragging (added on top of animValue)
  const dragOffset = useRef(new Animated.Value(0)).current;

  // Full expanded height measured on first layout
  const expandedHeightRef = useRef<number>(0);

  const springTo = useCallback(
    (toValue: number) => {
      Animated.spring(animValue, {
        toValue,
        useNativeDriver: false,
        bounciness: 6,
        speed: 14,
      }).start();
    },
    [animValue],
  );

  useEffect(() => {
    springTo(isExpanded ? 1 : 0);
  }, [isExpanded, springTo]);

  const height = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLLAPSED_HEIGHT, expandedHeightRef.current || COLLAPSED_HEIGHT * 2.8],
    extrapolate: 'clamp',
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
    extrapolate: 'clamp',
  });

  // translateY: card slides down slightly as it opens (spring entrance feel)
  const translateY = Animated.add(
    animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-6, 0],
      extrapolate: 'clamp',
    }),
    dragOffset,
  );

  // ─── Full height measurement ──────────────────────────────────────────────
  const onFullLayout = useCallback((e: LayoutChangeEvent) => {
    const measured = e.nativeEvent.layout.height;
    if (measured > COLLAPSED_HEIGHT && measured !== expandedHeightRef.current) {
      expandedHeightRef.current = measured;
    }
  }, []);

  // ─── Drag gesture ─────────────────────────────────────────────────────────
  const resetDragOffset = useCallback(() => {
    Animated.spring(dragOffset, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 4,
      speed: 20,
    }).start();
  }, [dragOffset]);

  const finishDrag = useCallback(
    (translationY: number) => {
      const didCross =
        (isExpanded && translationY < -dragThreshold) ||
        (!isExpanded && translationY > dragThreshold);

      resetDragOffset();

      if (didCross) {
        onToggleExpand?.();
      }
    },
    [isExpanded, dragThreshold, resetDragOffset, onToggleExpand],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, { dx, dy }) =>
          Math.abs(dy) > 4 && Math.abs(dy) > Math.abs(dx),
        onPanResponderMove: (_, { dy }) => {
          if (isExpanded && dy < 0) {
            dragOffset.setValue(Math.max(dy, -80));
          } else if (!isExpanded && dy > 0) {
            dragOffset.setValue(Math.min(dy, 80));
          }
        },
        onPanResponderRelease: (_, { dy }) => {
          if (Math.abs(dy) < 10) {
            resetDragOffset();
            onToggleExpand?.();
            return;
          }
          finishDrag(dy);
        },
        onPanResponderTerminate: (_, { dy }) => {
          if (Math.abs(dy) < 10) {
            resetDragOffset();
            return;
          }
          finishDrag(dy);
        },
      }),
    [isExpanded, dragOffset, finishDrag, resetDragOffset, onToggleExpand],
  );

  // ─── Data ─────────────────────────────────────────────────────────────────
  const year = visibleMonthDate.getFullYear();
  const month = visibleMonthDate.getMonth();
  const cells = useMemo(() => buildCells(year, month), [year, month]);
  const monthName = useMemo(
    () => headerMonthName(visibleMonthDate),
    [visibleMonthDate],
  );

  const handlePrev = useCallback(() => {
    closePicker();
    onChangeVisibleMonthDate?.(addMonths(visibleMonthDate, -1));
  }, [visibleMonthDate, onChangeVisibleMonthDate, closePicker]);

  const handleNext = useCallback(() => {
    closePicker();
    onChangeVisibleMonthDate?.(addMonths(visibleMonthDate, 1));
  }, [visibleMonthDate, onChangeVisibleMonthDate, closePicker]);

  const handleSelectMonth = useCallback(
    (monthIndex: number) => {
      onChangeVisibleMonthDate?.(
        setVisibleMonth(visibleMonthDate, year, monthIndex),
      );
      closePicker();
    },
    [visibleMonthDate, year, onChangeVisibleMonthDate, closePicker],
  );

  const handleSelectYear = useCallback(
    (selectedYear: number) => {
      onChangeVisibleMonthDate?.(
        setVisibleMonth(visibleMonthDate, selectedYear, month),
      );
      closePicker();
    },
    [visibleMonthDate, month, onChangeVisibleMonthDate, closePicker],
  );

  const headerProps = {
    monthName,
    year,
    theme,
    activePicker: pickerMode,
    onPrev: handlePrev,
    onNext: handleNext,
    onPressMonth: enableMonthYearPicker
      ? () => togglePicker('month')
      : undefined,
    onPressYear: enableMonthYearPicker
      ? () => togglePicker('year')
      : undefined,
    renderLeftArrow,
    renderRightArrow,
  };

  const toggleIcon = renderToggleIcon ? (
    renderToggleIcon(isExpanded)
  ) : (
    <Image
      source={icons.backIcon}
      style={navIconStyle(
        isExpanded ? iconTransforms.toggleUp : iconTransforms.toggleDown,
        theme.primary,
      )}
    />
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  const inner = (
    <Animated.View style={[cardStyles.wrapper, { height, opacity }]}>
      <Animated.View style={[cardStyles.card, { transform: [{ translateY }] }]}>
        <CalendarHeader {...headerProps} />

        {pickerMode !== null && (
          <CalendarDatePicker
            mode={pickerMode}
            theme={theme}
            selectedMonth={month}
            selectedYear={year}
            years={years}
            onSelectMonth={handleSelectMonth}
            onSelectYear={handleSelectYear}
          />
        )}

        {isExpanded && pickerMode === null && (
          <CalendarGrid
            cells={cells}
            selectedDateISO={selectedDateISO}
            countsByDate={countsByDate}
            theme={theme}
            onSelectDateISO={onSelectDateISO}
          />
        )}

        {showToggleButton &&
          (dragToToggle ? (
            <View
              style={cardStyles.toggleButton}
              {...panResponder.panHandlers}
            >
              {toggleIcon}
            </View>
          ) : (
            <TouchableOpacity
              style={cardStyles.toggleButton}
              onPress={onToggleExpand}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              {toggleIcon}
            </TouchableOpacity>
          ))}
      </Animated.View>

      {/* Hidden full-height view to measure the expanded size */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', opacity: 0 }}
        onLayout={onFullLayout}
      >
        <View style={cardStyles.card}>
          <CalendarHeader {...headerProps} />
          <CalendarGrid
            cells={cells}
            selectedDateISO={selectedDateISO}
            countsByDate={countsByDate}
            theme={theme}
            onSelectDateISO={() => { }}
          />
          {showToggleButton && (
            <View style={cardStyles.toggleButton} />
          )}
        </View>
      </View>
    </Animated.View>
  );

  return inner;
};

export default Calendar;
