import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [viteReact(), TanStackRouterVite()],
    server: {
        host: "0.0.0.0", // Listen on all interfaces
        port: 3000, // Ensure the port matches
    },
    preview: {
        host: "0.0.0.0", // Listen on all interfaces
        port: 3000, // Ensure the port matches
    },
});
