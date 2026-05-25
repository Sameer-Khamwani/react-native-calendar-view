import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { CalendarTheme } from '../../theme/defaultTheme';
import { CalendarCell } from '../../utils/dateHelpers';
import { hp, wp } from '../../utils/scale';

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface CalendarGridProps {
  cells: CalendarCell[];
  selectedDateISO: string;
  countsByDate?: Record<string, number>;
  theme: CalendarTheme;
  onSelectDateISO: (iso: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  cells,
  selectedDateISO,
  countsByDate,
  theme,
  onSelectDateISO,
}) => {
  const styles = makeStyles(theme);

  return (
    <View>
      {/* Weekday header row */}
      <View style={styles.weekHeader}>
        {WEEK_DAYS.map(d => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {cells.map(cell => {
          if (!cell.iso) {
            return <View key={cell.key} style={styles.cell} />;
          }

          const isSelected = cell.iso === selectedDateISO;
          const count = countsByDate?.[cell.iso] ?? 0;

          return (
            <TouchableOpacity
              key={cell.key}
              activeOpacity={0.8}
              onPress={() => onSelectDateISO(cell.iso!)}
              style={[
                styles.cell,
                isSelected ? styles.cellSelected : styles.cellDefault,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {String(cell.day)}
              </Text>

              {count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{String(count)}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const cardShadow = {
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
};

const makeStyles = (theme: CalendarTheme) =>
  StyleSheet.create({
    weekHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(10),
      marginBottom: hp(6),
    },
    weekDay: {
      width: wp(40),
      textAlign: 'center',
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '600',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    cell: {
      width: wp(38),
      height: hp(46),
      borderRadius: theme.cellRadius,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: hp(4),
      marginHorizontal: wp(2),
    },
    cellDefault: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      ...cardShadow,
    },
    cellSelected: {
      backgroundColor: theme.selectedBackground,
      borderWidth: 1.5,
      borderColor: theme.selectedBorder,
      ...cardShadow,
    },
    dayText: {
      fontSize: theme.fontSize,
      color: theme.text,
      fontWeight: '400',
    },
    dayTextSelected: {
      fontWeight: '700',
      color: theme.primary,
    },
    badge: {
      position: 'absolute',
      top: hp(2),
      right: wp(2),
      minWidth: wp(16),
      height: hp(16),
      borderRadius: hp(8),
      backgroundColor: theme.badgeBackground,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: wp(3),
    },
    badgeText: {
      fontSize: 9,
      color: theme.badgeText,
      fontWeight: '700',
    },
  });

export default CalendarGrid;
