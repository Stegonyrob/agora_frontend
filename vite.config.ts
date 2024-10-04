import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    "process.env": process.env,
    "process.env.VITE_LOVE_ICON_FILLED": JSON.stringify(
      process.env.VITE_LOVE_ICON_FILLED
    ),
    "process.env.VITE_LOVE_ICON": JSON.stringify(process.env.VITE_LOVE_ICON),
    "process.env.VITE_ARCHIVE_ICON": JSON.stringify(
      process.env.VITE_ARCHIVE_ICON
    ),
    "process.env.VITE_UNARCHIVE_ICON": JSON.stringify(
      process.env.VITE_UNARCHIVE_ICON
    ),
    "process.env.VITE_EDIT_ICON": JSON.stringify(process.env.VITE_EDIT_ICON),
    "process.env.VITE_REPLY_ICON": JSON.stringify(process.env.VITE_REPLY_ICON),
  },
});
