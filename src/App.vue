<script setup lang="ts">
import { onMounted } from "vue";
import TextToSpeech from "./components/accessibility/TextToSpeech.vue";
import Footer from "./components/footer/Footer.vue";
import Navbar from "./components/nav/Navbar.vue";
import { useLanguage } from "./composables/useLanguage";

// Cargar idioma guardado al iniciar la aplicación
const { loadSavedLanguage } = useLanguage();

onMounted(() => {
  loadSavedLanguage();
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar Principal (siempre visible) -->
    <Navbar />
    <!-- Contenedor principal sin Sidebar -->
    <div class="flex flex-1 min-h-0" style="height: 100%; min-height: 0">
      <main
        class="flex-1 transition-all duration-300 bg-white"
        style="min-height: 100%"
      >
        <router-view />
      </main>
    </div>
    <!-- Footer (siempre visible) -->
    <Footer />
    <!-- TextToSpeech global (disponible en todas las páginas) -->
    <TextToSpeech />
  </div>
</template>

<style>
body.sidebar-open {
  overflow: hidden !important;
}
/* Estilos globales - ISO 9241-11 Compliance */
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}

/* Sidebar altura para no tapar el footer */
.sidebar-no-footer {
  position: relative;
  top: 0;
  height: calc(
    100vh - 5rem - 64px
  ); /* Ocupa todo el alto disponible, sin scroll */
  min-height: calc(100vh - 5rem - 64px);
  max-height: calc(100vh - 5rem - 64px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  z-index: 10;
  overflow: hidden; /* Sin barra de desplazamiento */
}

.main-content {
  flex: 1;
  overflow-y: auto;
  min-height: calc(100vh - 5rem - 64px);
}

/* Modo de accesibilidad */
body.accessibility-mode {
  font-size: 18px;
  line-height: 1.8;
  letter-spacing: 0.05em;
}

body.accessibility-mode * {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

body.accessibility-mode *:focus {
  outline-color: #3b82f6;
  outline-width: 3px;
}

/* Mejoras de contraste para accesibilidad */
body.accessibility-mode button,
body.accessibility-mode a {
  font-weight: 600;
}

/* Transiciones suaves */
* {
  transition: color 0.2s ease, background-color 0.2s ease,
    border-color 0.2s ease;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
