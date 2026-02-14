import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
            {/* Logo */}
            <div className="mb-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Contract Manager
                    </div>
                </Link>
            </div>

            {/* Auth Card */}
            <Card className="w-full max-w-md shadow-lg">
                {(title || description) && (
                    <CardHeader className="space-y-1 text-center">
                        {title && <CardTitle className="text-2xl font-bold">{title}</CardTitle>}
                        {description && (
                            <CardDescription className="text-sm text-muted-foreground">
                                {description}
                            </CardDescription>
                        )}
                    </CardHeader>
                )}
                <CardContent className={cn(!title && !description && "pt-6")}>
                    {children}
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Contract Manager. All rights reserved.</p>
            </div>
        </div>
    );
}
