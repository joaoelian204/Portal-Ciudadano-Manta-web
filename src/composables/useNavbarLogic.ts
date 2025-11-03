import { useAuthStore } from "@/stores/auth.store";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useLanguage } from "./useLanguage";
import { useSearchOptions } from "./useSearchOptions";

export function useNavbarLogic() {
  const router = useRouter();
  const { t } = useI18n();
  const authStore = useAuthStore();
  const { ciudadanoSearchOptions, adminSearchOptions } = useSearchOptions();

  // Usar el composable global de idioma
  const { currentLanguage, languages, changeLanguage } = useLanguage();

  // Estado para menú de usuario
  const isUserMenuOpen = ref(false);
  const isUserMenuMobileOpen = ref(false);

  // Variables de búsqueda
  const searchQuery = ref("");
  const showSearchSuggestions = ref(false);
  const isSearchExpanded = ref(false);
  const searchInput = ref<HTMLInputElement | null>(null);

  // Inicial del usuario autenticado
  const userInitial = computed(() => {
    if (!authStore.usuario) return "?";
    const nombre = authStore.usuario.nombres || "";
    return nombre.charAt(0).toUpperCase();
  });

  const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
  };

  const toggleUserMenuMobile = () => {
    isUserMenuMobileOpen.value = !isUserMenuMobileOpen.value;
  };

  // Zoom
  const zoomLevel = ref(100);
  const isZoomMenuOpen = ref(false);

  // Accesibilidad
  const accessibilityEnabled = ref(false);

  // Detectar si estamos en la página principal
  // Si estamos en reset-password, forzar a mostrar como no autenticado
  const isAuthenticated = computed(() => {
    const currentPath = router.currentRoute.value?.path;
    if (currentPath === "/reset-password") {
      return false;
    }
    return authStore.isAuthenticated();
  });
  const isHome = computed(() => router.currentRoute.value?.path === "/");

  // Opciones de búsqueda computadas
  const searchOptions = computed(() => {
    if (authStore.isAdministrador()) {
      // Admin solo ve opciones de admin
      return adminSearchOptions.value;
    }
    // Ciudadano solo ve opciones de ciudadano
    return ciudadanoSearchOptions.value;
  });

  // Filtrado de opciones de búsqueda
  const filteredSearchOptions = computed(() => {
    if (!searchQuery.value.trim()) {
      return [];
    }

    const query = searchQuery.value.toLowerCase().trim();
    return searchOptions.value.filter((option) => {
      return (
        option.title.toLowerCase().includes(query) ||
        option.description.toLowerCase().includes(query) ||
        option.keywords.some((keyword) => keyword.includes(query))
      );
    });
  });

  // Manejar búsqueda
  const handleSearch = () => {
    showSearchSuggestions.value = searchQuery.value.trim().length > 0;
  };

  // Expandir barra de búsqueda
  const expandSearch = () => {
    isSearchExpanded.value = true;
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
    showSearchSuggestions.value = searchQuery.value.trim().length > 0;
  };

  // Contraer barra de búsqueda
  const collapseSearch = () => {
    isSearchExpanded.value = false;
    searchQuery.value = "";
    showSearchSuggestions.value = false;
  };

  // Manejar blur del input de búsqueda
  const handleSearchBlur = () => {
    setTimeout(() => {
      showSearchSuggestions.value = false;
    }, 200);
  };

  // Seleccionar una opción de búsqueda
  const selectSearchOption = (option: any) => {
    if (option.requiresAuth && !authStore.isAuthenticated()) {
      sessionStorage.setItem("redirectAfterLogin", option.route);
      router.push("/login");
    } else {
      router.push(option.route);
    }
    searchQuery.value = "";
    showSearchSuggestions.value = false;
  };

  // Toggle zoom menu
  const toggleZoomMenu = () => {
    isZoomMenuOpen.value = !isZoomMenuOpen.value;
  };

  // Funciones de zoom
  const zoomIn = () => {
    if (zoomLevel.value < 150) {
      zoomLevel.value += 10;
      applyZoom(zoomLevel.value);
      localStorage.setItem("zoomLevel", zoomLevel.value.toString());
    }
  };

  const zoomOut = () => {
    if (zoomLevel.value > 80) {
      zoomLevel.value -= 10;
      applyZoom(zoomLevel.value);
      localStorage.setItem("zoomLevel", zoomLevel.value.toString());
    }
  };

  const resetZoom = () => {
    zoomLevel.value = 100;
    applyZoom(100);
    localStorage.setItem("zoomLevel", "100");
  };

  const applyZoom = (level: number) => {
    document.documentElement.style.fontSize = `${(level / 100) * 16}px`;
  };

  // Breadcrumb dinámico
  const currentPage = ref("inicio");
  const breadcrumb = computed(() => {
    const breadcrumbKeys: Record<string, string> = {
      inicio: "navbar.breadcrumb.home",
      "iniciar-sesion": "navbar.breadcrumb.login",
      registrarse: "navbar.breadcrumb.register",
      "sobre-nosotros": "navbar.about",
      servicios: "navbar.breadcrumb.services",
      tramites: "navbar.breadcrumb.procedures",
    };
    const key = breadcrumbKeys[currentPage.value] || "navbar.breadcrumb.home";
    return t(key);
  });

  // Navegación
  const navigateTo = (page: string) => {
    currentPage.value = page;
    const routeMap: Record<string, string> = {
      inicio: "/",
      "iniciar-sesion": "/login",
      registrarse: "/register",
      "sobre-nosotros": "/sobre-nosotros",
      servicios: "/services",
      tramites: "/procedures",
      dashboard: "/dashboard",
      "reportar-problema": "/reportar-problema",
      encuestas: "/encuestas",
      noticias: "/noticias",
      admin: "/admin",
      perfil: "/mi-perfil",
    };
    const route = routeMap[page] || "/";
    router.push(route);
  };

  // Accesibilidad
  const toggleAccessibility = () => {
    accessibilityEnabled.value = !accessibilityEnabled.value;
    console.log(
      `Accesibilidad: ${
        accessibilityEnabled.value ? "Activada" : "Desactivada"
      }`
    );
    if (accessibilityEnabled.value) {
      document.body.classList.add("accessibility-mode");
    } else {
      document.body.classList.remove("accessibility-mode");
    }
  };

  // Manejo de clics en móvil
  const handleMobileClick = (page: string) => {
    if (page === "dashboard") {
      router.push("/dashboard");
    } else if (page === "admin") {
      router.push("/admin");
    } else {
      navigateTo(page);
    }
  };

  // Cerrar menús al hacer clic fuera
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) {
      isZoomMenuOpen.value = false;
      showSearchSuggestions.value = false;
    }
  };

  // Cargar configuraciones guardadas
  onMounted(() => {
    const savedZoom = localStorage.getItem("zoomLevel");
    if (savedZoom) {
      zoomLevel.value = parseInt(savedZoom);
      applyZoom(zoomLevel.value);
    }

    document.addEventListener("click", handleClickOutside);
  });

  return {
    // Estados
    isUserMenuOpen,
    isUserMenuMobileOpen,
    searchQuery,
    showSearchSuggestions,
    isSearchExpanded,
    searchInput,
    currentLanguage,
    languages,
    zoomLevel,
    isZoomMenuOpen,
    accessibilityEnabled,
    currentPage,

    // Computadas
    userInitial,
    isAuthenticated,
    isHome,
    searchOptions,
    filteredSearchOptions,
    breadcrumb,

    // Métodos
    toggleUserMenu,
    toggleUserMenuMobile,
    handleSearch,
    expandSearch,
    collapseSearch,
    handleSearchBlur,
    selectSearchOption,
    toggleZoomMenu,
    zoomIn,
    zoomOut,
    resetZoom,
    navigateTo,
    toggleAccessibility,
    handleMobileClick,
    changeLanguage,
  };
}
