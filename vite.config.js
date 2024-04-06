import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { terser } from "rollup-plugin-terser"; // Import terser for minification

export default defineConfig({
  // base: "/your-base-path/", // Specify the base URL for your production build
  build: {
    outDir: "dist", // Specify the output directory for the production build
    assetsDir: ".", // Optionally specify the directory for static assets
    minify: "terser", // Enable minification using terser
    sourcemap: false, // Disable source maps in production
    // target: "es2015", // Optionally specify the target environment for transpilation
    rollupOptions: {
      plugins: [terser()], // Apply terser plugin for minification
    },
  },
  plugins: [react(), eslint()], // Add React and eslint plugins
});
