import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/auth/context/auth-context';
import { I18nProvider } from '@/providers/i18n-provider';
import { SettingsProvider } from '@/providers/settings-provider';

const appName = import.meta.env.VITE_APP_NAME || 'Contract Manager';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <AuthProvider>
                    <I18nProvider>
                        <SettingsProvider>
                            <App {...props} />
                        </SettingsProvider>
                    </I18nProvider>
                </AuthProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
