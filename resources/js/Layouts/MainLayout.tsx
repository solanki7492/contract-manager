import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, ReactNode } from 'react';
import {
    Home,
    FileText,
    Bell,
    Users,
    User,
    Building,
    LogOut,
    Menu,
    Search,
    ChevronDown,
    X,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { useToast } from '@/src/components/ui/use-toast';

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
            company?: {
                name: string;
            };
        };
    };
    flash: {
        success?: string;
        error?: string;
    };
    unreadNotifications?: number;
}

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { auth, flash, unreadNotifications = 0 } = usePage<PageProps>().props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (flash.success) {
            toast({
                title: 'Success',
                description: flash.success,
            });
        }
        if (flash.error) {
            toast({
                title: 'Error',
                description: flash.error,
                variant: 'destructive',
            });
        }
    }, [flash, toast]);

    useEffect(() => {
        // Add demo1 body classes
        const bodyClass = document.body.classList;
        bodyClass.add('demo1', 'sidebar-fixed', 'header-fixed');

        if (sidebarCollapsed) {
            bodyClass.add('sidebar-collapse');
        } else {
            bodyClass.remove('sidebar-collapse');
        }

        const timer = setTimeout(() => {
            bodyClass.add('layout-initialized');
        }, 100);

        return () => {
            bodyClass.remove('demo1', 'sidebar-fixed', 'sidebar-collapse', 'header-fixed', 'layout-initialized');
            clearTimeout(timer);
        };
    }, [sidebarCollapsed]);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Contracts', href: '/contracts', icon: FileText },
        { name: 'Reminders', href: '/reminders', icon: Bell },
        { name: 'Contacts', href: '/contacts', icon: Users },
        {
            name: 'Users',
            href: '/users',
            icon: User,
            condition: auth.user && (auth.user.role === 'company_admin' || auth.user.role === 'superadmin')
        },
        {
            name: 'Companies',
            href: '/companies',
            icon: Building,
            condition: auth.user && auth.user.role === 'superadmin'
        },
    ];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            {/* Sidebar */}
            <div className={cn(
                "sidebar bg-background border-e border-border fixed top-0 bottom-0 z-20 flex flex-col items-stretch shrink-0 transition-all duration-300",
                sidebarCollapsed ? "w-[--sidebar-collapse-width]" : "w-[--sidebar-default-width]"
            )}>
                {/* Sidebar Header */}
                <div className="sidebar-header flex items-center justify-between px-5 py-4 border-b border-border">
                    {!sidebarCollapsed && (
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <div className="text-lg font-bold text-primary">Contract Manager</div>
                            </div>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="h-8 w-8"
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                </div>

                {/* Sidebar Menu */}
                <div className="sidebar-menu flex-1 overflow-y-auto px-3 py-4">
                    <div className="menu flex flex-col gap-1">
                        {navigation.map((item) => {
                            if (item.condition === false) return null;
                            const Icon = item.icon;
                            const isActive = window.location.pathname === item.href ||
                                window.location.pathname.startsWith(item.href + '/');

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "menu-link flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {!sidebarCollapsed && (
                                        <span className="menu-title text-sm font-medium">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="sidebar-footer border-t border-border px-3 py-4">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className={cn(
                            "menu-link flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-lg transition-colors",
                            "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                        )}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {!sidebarCollapsed && (
                            <span className="menu-title text-sm font-medium">
                                Logout
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Main Wrapper */}
            <div className="wrapper flex grow flex-col">
                {/* Header */}
                <header className="header fixed top-0 z-10 start-0 flex items-stretch shrink-0 border-b border-border bg-background end-0">
                    <div className="container-fluid flex justify-between items-center h-16 px-6">
                        {/* Left side - Company name */}
                        <div className="flex items-center gap-4">
                            {auth.user?.company && (
                                <div className="text-sm text-muted-foreground">
                                    {auth.user.company.name}
                                </div>
                            )}
                        </div>

                        {/* Right side - Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search Button */}
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Search className="h-4 w-4" />
                            </Button>

                            {/* Notifications */}
                            <div className="relative">
                                <Link href="/reminders">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                                        <Bell className="h-4 w-4" />
                                        {unreadNotifications > 0 && (
                                            <span className="absolute top-1 right-1 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                            </div>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-9 gap-2">
                                        <Avatar className="h-7 w-7">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden md:inline-block text-sm font-medium">
                                            {auth.user.name}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{auth.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            <Home className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/logout" method="post" as="button" className="w-full">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="grow pt-5" role="content">
                    <div className="container-fluid px-6 py-6">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="footer border-t border-border">
                    <div className="container-fluid px-6 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
                            <div>
                                © {new Date().getFullYear()} Contract Manager. All rights reserved.
                            </div>
                            <div className="flex gap-4">
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    Privacy
                                </Link>
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    Terms
                                </Link>
                                <Link href="#" className="hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
