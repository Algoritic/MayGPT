import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Define a type for environment variables

export default defineConfig({
    base: './', // Using the value from the environment variable or default to '/'
    plugins: [
        react(),
    ],
    build: {
        outDir: "../static",
        emptyOutDir: true,
        sourcemap: true,
    },
    server: {
        proxy: {
            "/ask": "http://localhost:5000",
            "/chat": "http://localhost:5000"
        },
        open: './', // Using the value from the environment variable or default to '/'
    }
});
