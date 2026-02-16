import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="mb-8 text-center">
                {title && <div className="mt-2 text-sm text-gray-600">{title}</div>}
                {description && <div className="mt-1 text-xs text-gray-500">{description}</div>}
            </div>

            <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
                {children}
            </div>

            <div className="mt-6 text-sm text-gray-600">© {new Date().getFullYear()} Contract Manager. All rights reserved.</div>
        </div>
    );
}
