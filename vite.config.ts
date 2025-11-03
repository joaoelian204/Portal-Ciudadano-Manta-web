import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  // Configuración para asegurar que los archivos públicos se copien
  publicDir: "public",
  build: {
    // Copiar todos los archivos de public al dist
    copyPublicDir: true,
    outDir: "dist",
  },
});
