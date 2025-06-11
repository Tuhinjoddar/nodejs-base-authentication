import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0", // Allows access from Docker
    port: 3238, // Ensure this is the frontend port
    strictPort: true, // Prevents auto-changing ports
    watch: {
      usePolling: true, // Fixes file change detection inside Docker
    },
  },
});

//This is a Docker network address ----  http://172.20.0.1:3238/
