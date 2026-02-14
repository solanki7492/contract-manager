# TypeScript + Metronic Theme Integration

## Overview
This project has been successfully migrated to TypeScript and integrated with the Metronic Demo1 theme. All components now use the professional UI components from the src folder with proper TypeScript typing.

## Key Changes

### 1. TypeScript Configuration
- Added `tsconfig.json` and `tsconfig.node.json` for proper TypeScript support
- Configured path aliases for easy imports:
  - `@/*` → `resources/js/*`
  - `@/src/*` → `resources/js/src/*`
  - `@/components/*` → `resources/js/src/components/*`
  - `@/layouts/*` → `resources/js/src/layouts/*`
  - `@/hooks/*` → `resources/js/src/hooks/*`
  - `@/lib/*` → `resources/js/src/lib/*`
  - `@/config/*` → `resources/js/src/config/*`

### 2. Build Configuration
- Updated `vite.config.ts` (renamed from .js) to support TypeScript
- Added path alias resolution
- Updated entry point to `app.tsx`

### 3. Dependencies Added
**UI Components (Radix UI):**
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-popover
- @radix-ui/react-select
- @radix-ui/react-tabs
- @radix-ui/react-toast
- And more...

**Utilities:**
- class-variance-authority
- clsx
- tailwind-merge
- lucide-react (icons)
- react-hook-form
- date-fns
- recharts

**Dev Dependencies:**
- typescript
- @types/react
- @types/react-dom
- @types/node

### 4. Layout Structure

#### MainLayout.tsx
- Implements Demo1 theme with sidebar and header
- Features:
  - Collapsible sidebar with smooth transitions
  - Fixed header with user dropdown
  - Notification bell with indicator
  - Search functionality
  - Responsive design
  - Dark mode support via theme classes
  - Lucide icons throughout

#### AuthLayout.tsx
- Clean authentication layout
- Centered card-based design
- Gradient background
- Responsive and modern

### 5. Demo1 Theme Integration
The Demo1 layout includes:
- **Sidebar**: Fixed, collapsible sidebar with menu items
- **Header**: Fixed header with company info, search, notifications, and user menu
- **Footer**: Professional footer with links
- **Styling**: Uses CSS custom properties for theming
- **Body Classes**: Automatically adds demo1-specific classes:
  - `demo1`
  - `sidebar-fixed`
  - `header-fixed`
  - `layout-initialized`
  - `sidebar-collapse` (when collapsed)

### 6. Component Architecture
All UI components from `src/components/ui/` are available:
- Button, Card, Badge, Avatar
- Table, Dialog, Dropdown Menu
- Toast notifications
- Form components
- And 50+ more components

### 7. Icons
Using **Lucide React** icons instead of Heroicons:
- More consistent styling
- Better tree-shaking
- Matches Metronic theme
- Example: `<FileCheck />`, `<Bell />`, `<Users />`

### 8. Example Pages Converted

#### Dashboard (Index.tsx)
- Fully TypeScript with proper interfaces
- Uses Card, Table, Badge, Button components
- Stats cards with trend indicators
- Responsive grid layout
- Modern, clean design matching Demo1 theme

## File Structure
```
resources/js/
├── app.tsx (main entry point)
├── vite-env.d.ts
├── Layouts/
│   ├── MainLayout.tsx (Demo1 implementation)
│   └── AuthLayout.tsx
├── Pages/
│   ├── Dashboard/
│   │   └── Index.tsx (TypeScript example)
│   ├── Contracts/ (to be converted)
│   ├── Reminders/ (to be converted)
│   └── Auth/ (to be converted)
└── src/ (Metronic theme source)
    ├── components/
    │   ├── ui/ (Shadcn-style components)
    │   ├── keenicons/
    │   └── common/
    ├── layouts/
    │   └── demo1/
    ├── hooks/
    ├── lib/
    ├── css/
    └── providers/
```

## Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Assets
```bash
npm run dev    # Development
npm run build  # Production
```

### 3. Convert Remaining Pages
You still need to convert these pages to TypeScript:
- `Pages/Auth/*.jsx` → `*.tsx`
- `Pages/Contracts/*.jsx` → `*.tsx`
- `Pages/Reminders/*.jsx` → `*.tsx`

### 4. Pattern for Converting Pages
```typescript
// Add proper TypeScript interfaces
interface PageProps {
    // Define your props
    data: SomeType;
}

// Use typed component
export default function MyPage({ data }: PageProps) {
    // Component logic
}
```

### 5. Using Theme Components
```typescript
import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { FileCheck, Bell } from 'lucide-react';

// Use in your component
<Card>
    <CardHeader>
        <CardTitle>My Title</CardTitle>
    </CardHeader>
    <CardContent>
        <Button>
            <FileCheck className="mr-2 h-4 w-4" />
            Action
        </Button>
    </CardContent>
</Card>
```

## Benefits

### Developer Experience
- ✅ Type safety with TypeScript
- ✅ IntelliSense and autocomplete
- ✅ Compile-time error checking
- ✅ Better refactoring support

### UI/UX
- ✅ Professional Metronic theme
- ✅ Consistent design system
- ✅ 50+ pre-built components
- ✅ Responsive layouts
- ✅ Dark mode support
- ✅ Smooth animations

### Code Quality
- ✅ Component reusability
- ✅ Clean separation of concerns
- ✅ Easy to maintain
- ✅ Scalable architecture

## Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run typecheck  # Run TypeScript type checking
```

## Important Notes

1. **CSS Loading**: The main app.tsx now imports the Metronic styles:
   ```typescript
   import '@/src/components/keenicons/assets/styles.css';
   import '@/src/css/styles.css';
   ```

2. **Path Aliases**: Use the configured aliases for imports:
   ```typescript
   import { cn } from '@/src/lib/utils';
   import { Button } from '@/src/components/ui/button';
   ```

3. **Inertia.js**: The integration preserves Inertia.js functionality while adding theme support

4. **Body Classes**: The MainLayout automatically manages demo1 body classes for proper theme behavior

5. **Providers**: The app.tsx wraps the Inertia app with necessary providers:
   - QueryClientProvider (React Query)
   - SettingsProvider (Theme settings)
   - ThemeProvider (Dark/Light mode)
   - TooltipsProvider (Tooltips)

## Troubleshooting

### If TypeScript errors appear:
```bash
npm run typecheck
```

### If styles don't load:
1. Check that CSS imports are in app.tsx
2. Ensure Vite is running
3. Clear browser cache

### If components are not found:
1. Verify path aliases in tsconfig.json
2. Check vite.config.ts resolve.alias
3. Restart Vite dev server

## Resources
- Metronic Components: `resources/js/src/components/`
- UI Components Docs: Check individual component files
- TypeScript Docs: https://www.typescriptlang.org/
- Radix UI Docs: https://www.radix-ui.com/
- Lucide Icons: https://lucide.dev/

---
**Migration completed on**: February 14, 2026
**Theme**: Metronic Demo1
**Framework**: React + TypeScript + Inertia.js + Laravel
