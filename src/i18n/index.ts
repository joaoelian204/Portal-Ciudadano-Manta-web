import { createI18n } from "vue-i18n";

// Importar los mensajes de traducción ..
import enJson from "./locales/en.json";
import esJson from "./locales/es.json";
import quJson from "./locales/qu.json";

// Evitar errores de tipo con imports JSON
const en = enJson as Record<string, any>;
const es = esJson as Record<string, any>;
const qu = quJson as Record<string, any>;

// Obtener idioma guardado de manera segura
const getSavedLanguage = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("userLanguage") || "es";
  }
  return "es";
};

const i18n = createI18n({
  legacy: false, // Usar Composition API
  globalInjection: true, // Permitir $t en templates
  locale: getSavedLanguage(), // Idioma inicial
  fallbackLocale: "es",

  // 🚫❗ DESACTIVAR PARSER DE LINKED MESSAGES
  messageResolver: (obj: unknown, path: string) => {
    // Dividir el path por puntos y navegar por el objeto anidado
    const keys = path.split('.');
    let result: any = obj;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return null;
      }
    }

    return result;
  },

  // 🚫❗ Desactivar modificadores como @.upper o @.lower
  modifiers: {},

  // Opcional: desactivar warnings y compilación de mensajes
  warnHtmlMessage: 'off',
  missingWarn: false,
  fallbackWarn: false,

  // Desactivar compilación de mensajes para evitar errores con @ en emails
  warnHtmlInMessage: 'off',

  // Mensajes
  messages: {
    es,
    en,
    qu,
  },
});

export default i18n;
