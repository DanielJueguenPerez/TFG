import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    coverage: {
      reporter: ["text", "html"],
      include: [
        "src/components/**/*.{js,jsx,ts,tsx}",
        "src/pages/**/*.{js,jsx,ts,tsx}",
      ],
    },
  },
});
