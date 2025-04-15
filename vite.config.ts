import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths({ loose: true })],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src/", import.meta.url)),
      },
    ],
  },
});
