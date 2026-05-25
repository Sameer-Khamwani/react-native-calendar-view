import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { CalendarTheme } from '../../theme/defaultTheme';
import { icons, iconTransforms, navIconStyle } from '../../icons';
import { DatePickerMode } from './CalendarDatePicker';
import { hp, wp } from '../../utils/scale';

interface CalendarHeaderProps {
  monthName: string;
  year: number;
  theme: CalendarTheme;
  activePicker?: DatePickerMode | null;
  onPrev: () => void;
  onNext: () => void;
  onPressMonth?: () => void;
  onPressYear?: () => void;
  renderLeftArrow?: () => React.ReactNode;
  renderRightArrow?: () => React.ReactNode;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  monthName,
  year,
  theme,
  activePicker = null,
  onPrev,
  onNext,
  onPressMonth,
  onPressYear,
  renderLeftArrow,
  renderRightArrow,
}) => {
  const styles = makeStyles(theme);

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={onPrev}
        style={styles.arrowBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        {renderLeftArrow ? (
          renderLeftArrow()
        ) : (
          <Image
            source={icons.backIcon}
            style={navIconStyle(iconTransforms.left, theme.primary)}
          />
        )}
      </TouchableOpacity>

      <View style={styles.labelRow}>
        <TouchableOpacity
          onPress={onPressMonth}
          disabled={!onPressMonth}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.monthLabel,
              activePicker === 'month' && styles.labelActive,
            ]}
          >
            {monthName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressYear}
          disabled={!onPressYear}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.yearLabel,
              activePicker === 'year' && styles.labelActive,
            ]}
          >
            {year}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onNext}
        style={styles.arrowBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        {renderRightArrow ? (
          renderRightArrow()
        ) : (
          <Image
            source={icons.backIcon}
            style={navIconStyle(iconTransforms.right, theme.primary)}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (theme: CalendarTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    arrowBtn: {
      height: hp(28),
      width: wp(28),
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(6),
    },
    monthLabel: {
      fontSize: theme.headerFontSize,
      fontWeight: '700',
      color: theme.text,
    },
    yearLabel: {
      fontSize: theme.headerFontSize,
      fontWeight: '700',
      color: theme.primary,
    },
    labelActive: {
      textDecorationLine: 'underline',
    },
  });

export default CalendarHeader;
