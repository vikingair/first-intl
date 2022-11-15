/// <reference types="vitest" />

import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            formats: ['cjs', 'es'],
            entry: resolve(__dirname, 'src/index.tsx'),
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['react'],
            output: {
                dir: 'dist',
            },
        },
    },
    test: {
        setupFiles: './tests/setupTests.ts',
        environment: 'jsdom',
        watch: false,
        globals: true,
        coverage: {
            reporter: ['text-summary', 'lcov', 'html'],
            lines: 100,
            functions: 100,
            statements: 100,
            branches: 100,
        },
    },
});
