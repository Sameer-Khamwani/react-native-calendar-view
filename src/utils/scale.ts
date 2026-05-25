import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 / common design baseline)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale a horizontal pixel value relative to the device screen width.
 */
export const wp = (px: number): number =>
  Math.round(PixelRatio.roundToNearestPixel((px / BASE_WIDTH) * SCREEN_WIDTH));

/**
 * Scale a vertical pixel value relative to the device screen height.
 */
export const hp = (px: number): number =>
  Math.round(PixelRatio.roundToNearestPixel((px / BASE_HEIGHT) * SCREEN_HEIGHT));
