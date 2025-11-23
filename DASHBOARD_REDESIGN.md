# Dashboard Redesign - Three Section Layout

## Overview
The dashboard has been completely redesigned with a modern three-section layout matching the provided design image. All sections are vertically scrollable, with responsive design and dark mode support.

## Components Created

### 1. **StatCard** (`components/StatCard.tsx`)
Reusable component for the "In Focus" section statistics cards.

**Features:**
- Displays label, numeric value, and optional subtitle
- Icon with background circle
- Customizable background colors for different metrics
- Dark mode support
- Fixed width (160px) for horizontal scroll consistency

**Props:**
```typescript
interface StatCardProps {
  label: string;           // e.g., "Total Orders"
  value: string | number;  // e.g., 15
  subtitle?: string;       // e.g., "This month"
  icon?: string;          // Ionicons name
  iconColor?: string;     // Color for icon
  backgroundColor?: string; // Card background color
}
```

**Usage:**
```tsx
<StatCard
  label="Total Orders"
  value={orders.length}
  subtitle="This month"
  icon="list"
  backgroundColor="#F3E8FF"
/>
```

---

### 2. **CategoryCard** (`components/CategoryCard.tsx`)
Reusable component for the "Popular Categories" section.

**Features:**
- Displays icon and category name
- Responsive flex layout for grid
- TouchableOpacity for tap interactions
- Customizable colors and icons
- Dark mode support

**Props:**
```typescript
interface CategoryCardProps {
  name: string;           // e.g., "Marriage Cards"
  icon: string;          // Ionicons name
  backgroundColor?: string; // Card background
  textColor?: string;    // Icon/text color
  onPress?: () => void;  // Tap handler
}
```

**Usage:**
```tsx
<CategoryCard
  name="Marriage Cards"
  icon="heart"
  backgroundColor="#F3E8FF"
  onPress={() => setActiveTab('orders')}
/>
```

---

### 3. **OrderStatusTile** (`components/OrderStatusTile.tsx`)
Reusable component for the "At a Glance" section order status tiles.

**Features:**
- Displays label, count, and status icon
- Color-coded backgrounds and icons
- TouchableOpacity for interactions
- Flexible sizing for grid layouts
- Dark mode support

**Props:**
```typescript
interface OrderStatusTileProps {
  label: string;      // e.g., "Order Placed"
  count: number;      // Count of orders
  icon: string;       // Ionicons name
  color: string;      // Color theme
  onPress?: () => void; // Tap handler
}
```

**Usage:**
```tsx
<OrderStatusTile
  label="Order Placed"
  count={3}
  icon="document-text"
  color="#3B82F6"
/>
```

---

## Dashboard Sections

### SECTION 1: "In Focus" (Horizontal Scrollable)
**Location:** Top of dashboard

**Features:**
- Horizontally scrollable row of 6 stat cards
- First 3 cards: Total Orders, Active Orders, Pending Today
- Scroll right to see: Total Amount, Amount Received, Pending Amount
- Each card shows label, main value, and subtitle

**Data Array (Customizable):**
```typescript
const inFocusStats = [
  { label: 'Total Orders', value: orders.length, subtitle: 'This month', icon: 'list', backgroundColor: '#F3E8FF' },
  { label: 'Active Orders', value: activeCount, subtitle: 'In progress', icon: 'timer', backgroundColor: '#DBEAFE' },
  // ... more stats
];
```

---

### SECTION 2: "At a Glance" (Order Status Summary)
**Location:** Middle of dashboard

**Features:**
- Section title with "See All" button on the right
- **Compact View (default):** Shows first 3 order statuses (Order Placed, Active Orders, Delivered)
- **Expanded View (when "See All" tapped):** Shows all 7 statuses in a grid with a Close button
  - Order Placed (Blue)
  - Active Orders (Amber)
  - Deleted (Red)
  - Delivered (Green)
  - Composing (Purple)
  - Printing (Pink)
  - Proofing (Cyan)

**Interaction:**
- Tap "See All" → Shows expanded grid with all statuses
- Tap "Close" → Returns to compact view

**Data Array (Customizable):**
```typescript
const orderStatusData = [
  { label: 'Order Placed', icon: 'document-text', color: '#3B82F6', status: 'Order Placed' },
  { label: 'Active Orders', icon: 'timer', color: '#F59E0B', status: 'Active' },
  // ... more statuses
];
```

---

### SECTION 3: "Popular Categories"
**Location:** Bottom of dashboard

**Features:**
- Grid layout with category cards
- Each card shows icon and category name
- Customizable categories via data array
- Tap to navigate to Orders tab

**Default Categories:**
- Marriage Cards
- Visiting Cards
- Flex
- Stickers
- Envelopes
- Labels

**Data Array (Customizable):**
```typescript
const categories = [
  { name: 'Marriage Cards', icon: 'heart' },
  { name: 'Visiting Cards', icon: 'card' },
  // ... more categories
];
```

---

## Styling & Theme

### Colors Used
- **Primary Purple:** `#7C3AED`
- **Light Backgrounds:** `#F3E8FF`, `#DBEAFE`, `#FCE7F3`, etc.
- **Dark Mode Background:** `#374151`
- **Text Dark:** `#111827` → `#FFFFFF` (dark mode)
- **Text Light:** `#6B7280` → `#9CA3AF` (dark mode)

### Responsiveness
- **Padding:** Uses 5% horizontal padding for responsive scaling
- **Cards:** Flex-based layouts that adapt to screen size
- **Gap:** Consistent 12px gaps between elements

### Dark Mode
All components have full dark mode support using `useTheme()` context:
```tsx
const { darkMode } = useTheme();
// Apply dark mode styles conditionally
```

---

## How to Customize

### 1. Change Statistics in "In Focus"
Edit the `inFocusStats` array in `DashboardScreen.tsx`:
```typescript
const inFocusStats = [
  { label: 'Your Label', value: yourData, subtitle: 'Optional', icon: 'icon-name', backgroundColor: '#COLOR' },
  // ...
];
```

### 2. Add/Remove Order Statuses
Edit the `orderStatusData` array in `DashboardScreen.tsx`:
```typescript
const orderStatusData = [
  { label: 'Status Name', icon: 'icon', color: '#COLOR', status: 'matching-key' },
  // ...
];
```

### 3. Add/Remove Categories
Edit the `categories` array in `DashboardScreen.tsx`:
```typescript
const categories = [
  { name: 'Category Name', icon: 'icon-name' },
  // ...
];
```

### 4. Adjust Card Sizes
- **StatCard width:** Modify `width: 160` in `StatCard.tsx`
- **Card spacing:** Modify `gap: 12` in relevant styles
- **Grid columns:** Adjust flex layout in `categoriesGrid`

---

## FAB (Floating Action Button)
- **Position:** Bottom right (above bottom nav bar)
- **Color:** Pink (`#EC4899`)
- **Action:** Opens "Add New Order" form
- **Always visible** when on home tab

---

## Integration with Existing Features

✅ **Maintained:**
- Header bar with notifications, language toggle, settings
- Bottom tab navigation (unchanged)
- Dark mode support throughout
- Responsive design for all screen sizes
- Hero section calendar (preserved for future use)

✅ **Preserved:**
- Header bar with title and controls
- Footer navigation with all tabs
- Settings and Notifications screens
- Translation support (i18n ready)

---

## File Structure
```
components/
  ├── StatCard.tsx (NEW)
  ├── CategoryCard.tsx (NEW)
  ├── OrderStatusTile.tsx (NEW)
  └── ... other components

app/
  └── DashboardScreen.tsx (UPDATED)
```

---

## Key Improvements
1. ✅ Clean separation of concerns with reusable components
2. ✅ Data-driven design - easily update with arrays
3. ✅ Full dark mode support
4. ✅ Responsive design for all screen sizes
5. ✅ Smooth scrolling for horizontal section
6. ✅ Interactive "See All" for order statuses
7. ✅ Consistent styling with purple theme
8. ✅ Shadow and border radius for depth
9. ✅ Accessibility-ready with proper touch targets

---

## Notes for Development
- All dummy data can be easily replaced with real API data
- Component props are fully typed with TypeScript
- Each component is self-contained and reusable elsewhere
- Colors follow the existing purple theme (`#7C3AED`)
- Spacing follows 8px grid system for consistency
