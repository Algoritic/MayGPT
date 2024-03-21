import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';

// Define a type for environment variables
interface Environment {
    VITE_BASE?: string;
}

// Function to read environment variables from .env file
function getEnv(): Environment {
    const env: Environment = {};
    const envFile = fs.readFileSync('.env', 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        env[key.trim()] = value.trim();
    });
    return env;
}

const env = getEnv();

export default defineConfig({
    base: env.VITE_BASE || '/', // Using the value from the environment variable or default to '/'
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
        open: env.VITE_BASE || '/', // Using the value from the environment variable or default to '/'
    }
});
