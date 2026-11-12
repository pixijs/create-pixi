import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Relative URLs so the build works from any folder, e.g. GitHub Pages
  base: "./",
  server: {
    port: 8080,
    open: true,
  },
});
