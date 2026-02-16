import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { MENU_SUPERADMIN, MENU_COMPANY } from '@/config/menu.config';
import { MenuItem } from '@/config/types';
import { cn } from '@/lib/utils';
import { useMenu } from '@/hooks/use-menu';

interface PageProps {
  auth?: {
    user?: {
      role?: string;
    };
  };
  [key: string]: unknown;
}

export function Breadcrumb() {
  const page = usePage<PageProps>();
  const { url: pathname } = page;
  const { getBreadcrumb, isActive } = useMenu(pathname);

  // Get user role and select appropriate menu
  const userRole = page.props.auth?.user?.role;
  const isSuperAdmin = userRole === 'superadmin';
  const menuItems = isSuperAdmin ? MENU_SUPERADMIN : MENU_COMPANY;

  const items: MenuItem[] = getBreadcrumb(menuItems);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.25 text-xs lg:text-sm font-medium mb-2.5 lg:mb-0">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        const active = item.path ? isActive(item.path) : false;

        return (
          <Fragment key={`root-${index}`}>
            <span
              className={cn(active ? 'text-mono' : 'text-secondary-foreground')}
              key={`item-${index}`}
            >
              {item.title}
            </span>
            {!last && (
              <ChevronRight
                className="size-3.5 text-muted-foreground"
                key={`separator-${index}`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
