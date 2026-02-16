import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => {
    // Dev mode configuration
    if (command === 'serve') {
        return {
            plugins: [react(), tailwindcss()],
            server: {
                port: 3000,
                open: true,
            },
        };
    }

    // Build mode configuration (library)
    return {
        plugins: [
            react(),
            tailwindcss(),
            dts({
                insertTypesEntry: true,
                include: ['src'],
            }),
        ],
        build: {
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                name: 'ReactCalendar',
                formats: ['es', 'cjs'],
                fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
            },
            cssCodeSplit: false,
            rollupOptions: {
                external: ['react', 'react-dom', 'react/jsx-runtime'],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        'react/jsx-runtime': 'jsxRuntime',
                    },
                },
            },
        },
    };
});