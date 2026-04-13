import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("exceljs")) {
            return "vendor-excel";
          }

          if (id.includes("@tinymce")) {
            return "vendor-editor";
          }

          if (id.includes("@mui/icons-material")) {
            return "vendor-mui-icons";
          }

          if (id.includes("@mui/x-date-pickers")) {
            return "vendor-mui-pickers";
          }

          if (
            id.includes("@mui/material") ||
            id.includes("@mui/system") ||
            id.includes("@mui/base") ||
            id.includes("@emotion")
          ) {
            return "vendor-mui-core";
          }

          if (id.includes("react-bootstrap") || id.includes("bootstrap/")) {
            return "vendor-bootstrap";
          }

          if (id.includes("react-router") || id.includes("@remix-run")) {
            return "vendor-router";
          }

          if (
            id.includes("@reduxjs/toolkit") ||
            id.includes("react-redux") ||
            id.includes("redux") ||
            id.includes("immer") ||
            id.includes("reselect")
          ) {
            return "vendor-state";
          }

          if (id.includes("@tanstack") || id.includes("swr")) {
            return "vendor-data";
          }

          if (
            id.includes("date-fns") ||
            id.includes("dayjs") ||
            id.includes("moment")
          ) {
            return "vendor-date";
          }

          if (
            id.includes("axios") ||
            id.includes("zod") ||
            id.includes("dompurify") ||
            id.includes("uuid")
          ) {
            return "vendor-utils";
          }

          if (
            /node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/.test(
              id,
            ) ||
            id.includes("node_modules/react-is/")
          ) {
            return "vendor-react";
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"], // Agregado "html" para reporte visual
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "node_modules/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/vite-env.d.ts",
        "src/main.tsx",
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
