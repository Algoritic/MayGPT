import react from "@vitejs/plugin-react";
import fs from 'fs';
import path from "path";
import { defineConfig } from "vite";

interface Environment {
    APP_BASE_PATH?: string;
}
// Function to read environment variables from .env file
function getEnv(): Environment {
    const env: Environment = {};
    const envFile = fs.readFileSync(path.resolve(__dirname, "../.env"), 'utf8');
    envFile.split('\n').forEach(line => {
        const kvs = line.split('=');
        if (kvs.length == 2) {
            env[kvs[0].trim()] = kvs[1].trim();
        }
    });
    return env;
}
const env = getEnv();

// https://vitejs.dev/config/
export default defineConfig({
    base: env.APP_BASE_PATH,
    plugins: [react()],
    build: {
        outDir: "../static",
        emptyOutDir: true,
        sourcemap: true
    },
    server: {
        proxy: {
            "/ask": "http://localhost:5000",
            "/chat": "http://localhost:5000"
        }
    }
});
