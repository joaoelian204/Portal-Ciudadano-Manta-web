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
    // Mejorar el chunking para producción
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'i18n': ['vue-i18n'],
          'supabase': ['@supabase/supabase-js'],
          'leaflet': ['leaflet', 'vue3-leaflet'],
        },
      },
    },
    // Aumentar el límite de advertencia de tamaño
    chunkSizeWarningLimit: 1000,
    // Asegurar que los source maps se generen para debugging
    sourcemap: false,
    // Minificar para producción
    minify: 'esbuild',
    // Optimizar dependencias
    target: 'es2015',
  },
  // Optimizar dependencias
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@supabase/supabase-js'],
  },
});
