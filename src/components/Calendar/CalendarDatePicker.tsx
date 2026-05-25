import React, { useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { CalendarTheme } from '../../theme/defaultTheme';
import { getMonthNames } from '../../utils/dateHelpers';
import { hp, wp } from '../../utils/scale';

export type DatePickerMode = 'month' | 'year';

interface CalendarDatePickerProps {
  mode: DatePickerMode;
  theme: CalendarTheme;
  selectedMonth: number;
  selectedYear: number;
  years: number[];
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
}

const YEAR_ROW_HEIGHT = hp(40);
const PICKER_MAX_HEIGHT = hp(200);

const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  mode,
  theme,
  selectedMonth,
  selectedYear,
  years,
  onSelectMonth,
  onSelectYear,
}) => {
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const monthNames = useMemo(() => getMonthNames(), []);
  const yearListRef = useRef<FlatList<number>>(null);

  const selectedYearIndex = years.indexOf(selectedYear);

  useEffect(() => {
    if (mode !== 'year' || selectedYearIndex < 0) {
      return;
    }
    const timer = setTimeout(() => {
      yearListRef.current?.scrollToIndex({
        index: selectedYearIndex,
        animated: false,
        viewPosition: 0.5,
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [mode, selectedYearIndex]);

  if (mode === 'month') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.monthGrid}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {monthNames.map((name, index) => {
          const isSelected = index === selectedMonth;
          return (
            <TouchableOpacity
              key={name}
              style={[styles.monthItem, isSelected && styles.itemSelected]}
              onPress={() => onSelectMonth(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.monthText, isSelected && styles.textSelected]}
                numberOfLines={1}
              >
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <FlatList
      ref={yearListRef}
      data={years}
      keyExtractor={item => String(item)}
      style={styles.container}
      contentContainerStyle={styles.yearList}
      showsVerticalScrollIndicator
      keyboardShouldPersistTaps="handled"
      getItemLayout={(_, index) => ({
        length: YEAR_ROW_HEIGHT,
        offset: YEAR_ROW_HEIGHT * index,
        index,
      })}
      onScrollToIndexFailed={({ index }) => {
        yearListRef.current?.scrollToOffset({
          offset: YEAR_ROW_HEIGHT * index,
          animated: false,
        });
      }}
      renderItem={({ item }) => {
        const isSelected = item === selectedYear;
        return (
          <TouchableOpacity
            style={[styles.yearItem, isSelected && styles.itemSelected]}
            onPress={() => onSelectYear(item)}
            activeOpacity={0.7}
          >
            <Text style={[styles.yearText, isSelected && styles.textSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const makeStyles = (theme: CalendarTheme) =>
  StyleSheet.create({
    container: {
      maxHeight: PICKER_MAX_HEIGHT,
      marginTop: hp(10),
    },
    monthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: hp(8),
      paddingBottom: hp(4),
    },
    monthItem: {
      width: '31%',
      paddingVertical: hp(10),
      borderRadius: theme.cellRadius,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      alignItems: 'center',
    },
    monthText: {
      fontSize: theme.fontSize,
      fontWeight: '500',
      color: theme.text,
    },
    yearList: {
      paddingBottom: hp(4),
    },
    yearItem: {
      height: YEAR_ROW_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.cellRadius,
      marginBottom: hp(4),
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    yearText: {
      fontSize: theme.fontSize,
      fontWeight: '500',
      color: theme.text,
    },
    itemSelected: {
      borderColor: theme.selectedBorder,
      backgroundColor: theme.selectedBackground,
    },
    textSelected: {
      color: theme.primary,
      fontWeight: '700',
    },
  });

export default CalendarDatePicker;
