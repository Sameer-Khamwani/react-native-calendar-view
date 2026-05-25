import { StyleSheet } from 'react-native';
import { CalendarTheme } from '../../theme/defaultTheme';
import { hp, wp } from '../../utils/scale';

const cardShadow = {
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
};

export const makeCardStyles = (theme: CalendarTheme) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    card: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: theme.borderRadius,
      padding: hp(14),
      backgroundColor: theme.background,
      // ...cardShadow,
    },
    toggleButton: {
      alignSelf: 'center',
      marginTop: hp(12),
      paddingVertical: hp(6),
      paddingHorizontal: wp(14),
    },
  });
