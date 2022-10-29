import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:4000",
                secure: false,
                ws: true,
            },
        },
    },
    plugins: [react(), eslint({ fix: true, overrideConfigFile: './.eslintrc.cjs' })],
    base: process.env.NODE_ENV === "production" ? "/webapp/" : "/"
})
