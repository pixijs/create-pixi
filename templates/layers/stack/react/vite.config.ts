import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Relative URLs so the build works from any folder, e.g. GitHub Pages
  base: "./",
  plugins: [react()],
  server: {
    port: 8080,
    open: true,
  },
  build: {
    // PixiJS and React together are larger than Vite's 500 kB default
    chunkSizeWarningLimit: 1000,
  },
});
