import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            '@/src': path.resolve(__dirname, './resources/js/src'),
            '@/components': path.resolve(__dirname, './resources/js/src/components'),
            '@/layouts': path.resolve(__dirname, './resources/js/src/layouts'),
            '@/pages': path.resolve(__dirname, './resources/js/src/pages'),
            '@/hooks': path.resolve(__dirname, './resources/js/src/hooks'),
            '@/lib': path.resolve(__dirname, './resources/js/src/lib'),
            '@/config': path.resolve(__dirname, './resources/js/src/config'),
            '@/providers': path.resolve(__dirname, './resources/js/src/providers'),
        },
    },
});
