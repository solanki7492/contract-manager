# Quick Start Guide - TypeScript + Metronic Demo1 Theme

## ✅ Installation Complete!

All dependencies have been installed and your project is now using:
- ✨ TypeScript for type safety
- 🎨 Metronic Demo1 theme
- 🧩 50+ UI components from Radix UI
- 🎯 Lucide React icons

## 🚀 Getting Started

### 1. Start Development Server
```bash
npm run dev
```

This will start Vite and compile your TypeScript + React assets.

### 2. In Another Terminal, Start Laravel
```bash
php artisan serve
```

Visit: `http://localhost:8000`

## 📁 Project Structure

```
resources/js/
├── app.tsx                          # Main entry point (Inertia + Theme providers)
├── vite-env.d.ts                    # TypeScript definitions
├── Layouts/
│   ├── MainLayout.tsx              # Demo1 layout (sidebar + header)
│   └── AuthLayout.tsx              # Authentication layout
├── Pages/
│   ├── Dashboard/
│   │   └── Index.tsx               # ✅ Converted (example)
│   ├── Contracts/
│   │   ├── Index.tsx               # ⚠️ Needs type definitions
│   │   └── Create.tsx              # ⚠️ Needs type definitions
│   ├── Reminders/
│   │   ├── Index.tsx               # ⚠️ Needs type definitions
│   │   └── Create.tsx              # ⚠️ Needs type definitions
│   └── Auth/
│       ├── Login.tsx               # ⚠️ Needs type definitions
│       └── ChangePassword.tsx      # ⚠️ Needs type definitions
└── src/                            # Metronic theme source
    ├── components/ui/              # 50+ UI components
    ├── layouts/demo1/              # Demo1 layout components
    ├── hooks/                      # Custom hooks
    ├── lib/                        # Utilities
    └── css/                        # Theme styles
```

## 🎨 Using Theme Components

### Import Components
```typescript
import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
```

### Use Icons
```typescript
import { FileCheck, Bell, Users, Home } from 'lucide-react';

<Button>
    <FileCheck className="mr-2 h-4 w-4" />
    Create Contract
</Button>
```

### Create Cards
```typescript
<Card>
    <CardHeader>
        <CardTitle>My Title</CardTitle>
        <CardDescription>Description here</CardDescription>
    </CardHeader>
    <CardContent>
        <p>Content goes here</p>
    </CardContent>
</Card>
```

## 📝 TypeScript Patterns

### Define Props Interface
```typescript
interface MyPageProps {
    data: {
        id: number;
        name: string;
    }[];
    filters: {
        search?: string;
        status?: string;
    };
}

export default function MyPage({ data, filters }: MyPageProps) {
    // Your component logic
}
```

### Use with Inertia
```typescript
import { Link, useForm } from '@inertiajs/react';

interface FormData {
    title: string;
    description: string;
}

export default function CreatePage() {
    const { data, setData, post, errors } = useForm<FormData>({
        title: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contracts');
    };

    // Rest of component
}
```

## 🎯 Next Steps - Converting Remaining Pages

### Priority Order:
1. **Auth Pages** (Login, ChangePassword)
2. **Contracts Pages** (Index, Create)
3. **Reminders Pages** (Index, Create)

### Example Conversion Pattern

#### Before (JSX):
```jsx
export default function MyPage({ data }) {
    return (
        <MainLayout>
            <div className="bg-white p-4">
                <h1>{data.title}</h1>
            </div>
        </MainLayout>
    );
}
```

#### After (TSX):
```typescript
import MainLayout from '@/Layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

interface PageData {
    title: string;
}

interface MyPageProps {
    data: PageData;
}

export default function MyPage({ data }: MyPageProps) {
    return (
        <MainLayout>
            <Card>
                <CardHeader>
                    <CardTitle>{data.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Content */}
                </CardContent>
            </Card>
        </MainLayout>
    );
}
```

## 🧩 Available UI Components

### Layout
- Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter

### Forms
- Button, Input, Label, Textarea, Select, Checkbox, RadioGroup, Switch

### Data Display
- Table, TableHeader, TableBody, TableRow, TableCell, TableHead
- Badge, Avatar, Separator

### Overlays
- Dialog, Sheet, Popover, DropdownMenu, Tooltip, AlertDialog

### Feedback
- Alert, Toast (via useToast hook), Progress, Skeleton

### Navigation
- Tabs, Accordion, Breadcrumb, Menubar

And 30+ more!

## 🎨 Theme Features

### Demo1 Layout Features:
- ✅ Collapsible sidebar
- ✅ Fixed header
- ✅ Responsive design
- ✅ User dropdown menu
- ✅ Notifications bell
- ✅ Search button
- ✅ Dark mode ready
- ✅ Smooth animations

### Customization:
Sidebar width and behavior is controlled via CSS variables in the demo1.css file.

## 🔧 Common Tasks

### Add a New Page
1. Create file in `resources/js/Pages/YourFolder/PageName.tsx`
2. Define TypeScript interfaces for props
3. Import and use UI components
4. Export default component

### Add Icons
All Lucide icons are available: https://lucide.dev/icons/
```typescript
import { IconName } from 'lucide-react';
```

### Style Components
Use Tailwind classes and the `cn()` utility:
```typescript
import { cn } from '@/src/lib/utils';

<div className={cn(
    "base-classes",
    condition && "conditional-classes",
    "more-classes"
)} />
```

### Show Toasts
```typescript
import { useToast } from '@/src/components/ui/use-toast';

export default function MyPage() {
    const { toast } = useToast();

    const showNotification = () => {
        toast({
            title: 'Success!',
            description: 'Operation completed successfully.',
        });
    };

    // Use in your component
}
```

## 🐛 Troubleshooting

### TypeScript Errors
```bash
npm run typecheck
```

### Rebuild Assets
```bash
npm run build
```

### Clear Cache
```bash
php artisan cache:clear
php artisan view:clear
npm run build
```

### Hot Reload Not Working
1. Stop `npm run dev`
2. Clear browser cache
3. Restart `npm run dev`

## 📚 Resources

- **Component Documentation**: Check files in `resources/js/src/components/ui/`
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Radix UI**: https://www.radix-ui.com/
- **Lucide Icons**: https://lucide.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Inertia.js**: https://inertiajs.com/

## ✨ Tips

1. **Use Path Aliases**: Import with `@/src/...` instead of relative paths
2. **Type Everything**: Add interfaces for all props and data structures
3. **Reuse Components**: Check `src/components/ui/` before creating custom components
4. **Follow Patterns**: Look at Dashboard/Index.tsx for examples
5. **Use cn()**: For conditional className logic

## 🎉 You're Ready!

Your project is now fully set up with TypeScript and the Metronic Demo1 theme. Start the dev server and begin building!

```bash
npm run dev
```

Happy coding! 🚀
