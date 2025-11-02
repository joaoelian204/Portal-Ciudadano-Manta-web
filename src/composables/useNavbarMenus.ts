import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLanguage } from "./useLanguage";

export function useNavbarMenus() {
  const router = useRouter();
  const { changeLanguage: changeGlobalLanguage } = useLanguage();

  // Estados de menús
  const isLanguageMenuOpen = ref(false);
  const isMobileMenuOpen = ref(false);
  const isToolsMenuOpen = ref(false);
  const currentPage = ref("inicio");

  // Control de zoom
  const currentZoom = ref(100);
  const minZoom = 80;
  const maxZoom = 150;

  const toggleLanguageMenu = () => {
    isLanguageMenuOpen.value = !isLanguageMenuOpen.value;
  };

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  };

  const toggleToolsMenu = () => {
    isToolsMenuOpen.value = !isToolsMenuOpen.value;
  };

  const changeLanguage = (lang: string) => {
    changeGlobalLanguage(lang);
    isLanguageMenuOpen.value = false;
  };

  const updateCurrentPage = (page: string) => {
    currentPage.value = page;
  };

  const zoomIn = () => {
    if (currentZoom.value < maxZoom) {
      currentZoom.value += 10;
      applyZoom();
    }
  };

  const zoomOut = () => {
    if (currentZoom.value > minZoom) {
      currentZoom.value -= 10;
      applyZoom();
    }
  };

  const resetZoom = () => {
    currentZoom.value = 100;
    applyZoom();
  };

  const applyZoom = () => {
    document.documentElement.style.fontSize = `${
      (currentZoom.value / 100) * 16
    }px`;
  };

  const navigateTo = (route: string, page: string) => {
    updateCurrentPage(page);
    isMobileMenuOpen.value = false;
    router.push(route);
  };

  return {
    // Estados
    isLanguageMenuOpen,
    isMobileMenuOpen,
    isToolsMenuOpen,
    currentPage,
    currentZoom,
    minZoom,
    maxZoom,

    // Métodos
    toggleLanguageMenu,
    toggleMobileMenu,
    toggleToolsMenu,
    changeLanguage,
    updateCurrentPage,
    zoomIn,
    zoomOut,
    resetZoom,
    navigateTo,
  };
}
