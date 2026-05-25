export interface CalendarTheme {
  /** Primary accent — selected border, badge, arrows */
  primary: string;
  /** Card background */
  background: string;
  /** Day cell background */
  surface: string;
  /** Primary text (day numbers, header) */
  text: string;
  /** Secondary text (weekday labels) */
  textSecondary: string;
  /** Card and cell border colour */
  border: string;
  /** Background of a selected cell */
  selectedBackground: string;
  /** Border colour of a selected cell */
  selectedBorder: string;
  /** Count badge background */
  badgeBackground: string;
  /** Count badge text colour */
  badgeText: string;
  /** Toggle button background */
  toggleBackground: string;
  /** Card border radius */
  borderRadius: number;
  /** Day cell border radius */
  cellRadius: number;
  /** Day number font size */
  fontSize: number;
  /** Month header font size */
  headerFontSize: number;
}

export const defaultTheme: CalendarTheme = {
  primary: '#2563EB',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#9CA3AF',
  border: '#E5E7EB',
  selectedBackground: '#FFFFFF',
  selectedBorder: '#2563EB',
  badgeBackground: '#2563EB',
  badgeText: '#FFFFFF',
  toggleBackground: '#EFF6FF',
  borderRadius: 12,
  cellRadius: 10,
  fontSize: 14,
  headerFontSize: 16,
};


/**
 * Merges a partial theme override on top of the defaults.
 */
export const resolveTheme = (override?: Partial<CalendarTheme>): CalendarTheme => ({
  ...defaultTheme,
  ...override,
});
