import { createI18n } from "vue-i18n";

// Importar los mensajes de traducción
import en from "./locales/en.json";
import es from "./locales/es.json";
import qu from "./locales/qu.json";

// Obtener idioma guardado de manera segura
const getSavedLanguage = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("userLanguage") || "es";
  }
  return "es";
};

const i18n = createI18n({
  legacy: false, // Volver a false para usar Composition API
  globalInjection: true, // Permitir usar $t en template sin importar useI18n
  locale: getSavedLanguage(), // Idioma por defecto
  fallbackLocale: "es",
  messages: {
    es,
    en,
    qu,
  },
});

export default i18n;
