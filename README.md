# react-native-calendar-view

A fully-animated, draggable React Native month calendar with:

- **Expand / collapse** with smooth spring animation
- **Drag-to-toggle** via `react-native-gesture-handler` — swipe down to expand, up to collapse
- **Slide + fade** animation on open/close
- **Per-day count badges** (e.g. appointment counts)
- **Full theme customisation** via the `theme` prop
- **Controlled API** — you own the state, the component stays predictable

---

## Installation

```sh
npm install react-native-calendar-view
# peer deps
npm install react-native-gesture-handler
```

For `react-native-gesture-handler` native setup see the [official docs](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation).

Wrap your root component (or `App.tsx`) with `GestureHandlerRootView`:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* your app */}
    </GestureHandlerRootView>
  );
}
```

---

## Quick start

```tsx
import React, { useState } from 'react';
import { MonthCalendar, useCalendarState } from 'react-native-calendar-view';

export default function MyScreen() {
  const calendar = useCalendarState();

  return (
    <MonthCalendar
      selectedDateISO={calendar.selectedDateISO}
      onSelectDateISO={calendar.selectDate}
      visibleMonthDate={calendar.visibleMonthDate}
      onChangeVisibleMonthDate={calendar.setVisibleMonthDate}
      isExpanded={calendar.isExpanded}
      onToggleExpand={calendar.toggleExpand}
    />
  );
}
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectedDateISO` | `string` | — | Currently selected date as `YYYY-MM-DD` |
| `onSelectDateISO` | `(iso: string) => void` | — | Called when user taps a day |
| `visibleMonthDate` | `Date` | today | Month shown in the header |
| `onChangeVisibleMonthDate` | `(date: Date) => void` | — | Called when user navigates months |
| `isExpanded` | `boolean` | `true` | Controls open/closed state |
| `onToggleExpand` | `() => void` | — | Called when toggle button or drag crosses threshold |
| `countsByDate` | `Record<string, number>` | — | Optional badge count per ISO date |
| `showToggleButton` | `boolean` | `true` | Show/hide the chevron toggle button |
| `dragToToggle` | `boolean` | `true` | Enable drag gesture to expand/collapse |
| `dragThreshold` | `number` | `40` | Pixels of drag needed to trigger toggle |
| `animationDuration` | `number` | `300` | Spring animation duration hint (ms) |
| `theme` | `Partial<CalendarTheme>` | — | Override any colour, radius, or font size |
| `renderLeftArrow` | `() => React.ReactNode` | — | Custom left nav arrow |
| `renderRightArrow` | `() => React.ReactNode` | — | Custom right nav arrow |
| `renderToggleIcon` | `(expanded: boolean) => React.ReactNode` | — | Custom chevron / toggle icon |

---

## Theme

```tsx
<MonthCalendar
  // ...
  theme={{
    primary: '#6C63FF',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#1A1A2E',
    textSecondary: '#9E9E9E',
    border: '#E0E0E0',
    selectedBackground: '#FFFFFF',
    selectedBorder: '#6C63FF',
    badgeBackground: '#6C63FF',
    badgeText: '#FFFFFF',
    borderRadius: 12,
    cellRadius: 10,
    fontSize: 14,
    headerFontSize: 16,
  }}
/>
```

---

## `useCalendarState` hook

A convenience hook that manages all calendar state for you:

```tsx
const {
  selectedDateISO,   // string
  selectDate,        // (iso: string) => void
  visibleMonthDate,  // Date
  setVisibleMonthDate,
  isExpanded,        // boolean
  toggleExpand,      // () => void
  setExpanded,       // (v: boolean) => void
} = useCalendarState({ defaultExpanded: true });
```

---

## License

MIT
