import { ImageStyle, TransformsStyle } from 'react-native';
import { hp } from '../utils/scale';

export const icons = {
  backIcon: require('./backIcon.png'),
};

export const iconTransforms = {
  left: undefined as TransformsStyle['transform'],
  right: [{ scaleX: -1 }] as TransformsStyle['transform'],
  toggleDown: [{ rotate: '-90deg' }] as TransformsStyle['transform'],
  toggleUp: [{ rotate: '90deg' }, { scaleY: -1 }] as TransformsStyle['transform'],
};

export const iconSize = {
  width: hp(12),
  height: hp(12),
};

export const navIconStyle = (
  transform?: TransformsStyle['transform'],
  tintColor?: string,
): ImageStyle => ({
  ...iconSize,
  tintColor,
  transform,
});