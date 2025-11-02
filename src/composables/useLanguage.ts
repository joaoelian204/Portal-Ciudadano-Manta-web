import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

// Estado global del idioma (compartido entre todos los componentes)
const currentLanguage = ref<string>("ES");

export function useLanguage() {
  const { locale } = useI18n();

  // Lista de idiomas disponibles
  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "qu", name: "Kichwa", flag: "🇪🇨" },
  ];

  // Cargar idioma guardado al inicializar
  const loadSavedLanguage = () => {
    const savedLanguage = localStorage.getItem("userLanguage");
    if (savedLanguage) {
      currentLanguage.value = savedLanguage.toUpperCase();
      locale.value = savedLanguage.toLowerCase();
    } else {
      // Si no hay idioma guardado, usar español por defecto
      currentLanguage.value = "ES";
      locale.value = "es";
    }
  };

  // Función para cambiar el idioma (global)
  const changeLanguage = (langCode: string) => {
    const normalizedCode = langCode.toLowerCase();
    currentLanguage.value = langCode.toUpperCase();
    locale.value = normalizedCode;

    // Guardar en localStorage para persistencia
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("userLanguage", normalizedCode);
    }

    console.log(`Idioma cambiado a: ${langCode} (${normalizedCode})`);
  };

  // Watch para sincronizar cambios de locale con currentLanguage
  watch(
    () => locale.value,
    (newLocale) => {
      currentLanguage.value = newLocale.toUpperCase();
    }
  );

  return {
    currentLanguage,
    languages,
    changeLanguage,
    loadSavedLanguage,
  };
}
