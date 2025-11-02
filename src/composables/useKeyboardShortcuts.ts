import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useLanguage } from "./useLanguage";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { changeLanguage } = useLanguage();
  const showKeyboardShortcuts = ref(false);

  const handleKeyboardShortcuts = (event: KeyboardEvent) => {
    // Panel de ayuda con ? o F1
    if (event.key === "?" || event.key === "F1") {
      event.preventDefault();
      showKeyboardShortcuts.value = !showKeyboardShortcuts.value;
      return;
    }

    // Cerrar panel de ayuda con Escape
    if (event.key === "Escape") {
      if (showKeyboardShortcuts.value) {
        event.preventDefault();
        showKeyboardShortcuts.value = false;
        return;
      }
    }

    // Navegación entre opciones con flechas
    const navElements = Array.from(
      document.querySelectorAll("[data-nav-item]")
    ) as HTMLElement[];
    const currentFocused = document.activeElement as HTMLElement;
    const currentIndex = navElements.indexOf(currentFocused);

    // Flecha Derecha = Siguiente opción
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (currentIndex >= 0 && currentIndex < navElements.length - 1) {
        navElements[currentIndex + 1]?.focus();
      } else if (currentIndex === -1 && navElements.length > 0) {
        navElements[0]?.focus();
      }
      return;
    }

    // Flecha Izquierda = Opción anterior
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (currentIndex > 0) {
        navElements[currentIndex - 1]?.focus();
      } else if (currentIndex === -1 && navElements.length > 0) {
        navElements[navElements.length - 1]?.focus();
      }
      return;
    }

    // Flecha Abajo = Siguiente opción (alternativa)
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (currentIndex >= 0 && currentIndex < navElements.length - 1) {
        navElements[currentIndex + 1]?.focus();
      } else if (navElements.length > 0) {
        navElements[0]?.focus();
      }
      return;
    }

    // Flecha Arriba = Opción anterior (alternativa)
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (currentIndex > 0) {
        navElements[currentIndex - 1]?.focus();
      } else if (navElements.length > 0) {
        navElements[navElements.length - 1]?.focus();
      }
      return;
    }

    // Enter o Espacio = Activar elemento enfocado
    if (
      (event.key === "Enter" || event.key === " ") &&
      currentFocused &&
      currentFocused.hasAttribute("data-nav-item")
    ) {
      event.preventDefault();
      currentFocused.click();
      return;
    }

    // Solo procesar atajos con Alt
    if (!event.altKey) return;

    event.preventDefault();

    // Navegación principal (Alt + tecla)
    switch (event.key.toLowerCase()) {
      case "h":
        router.push("/");
        break;
      case "l":
        router.push("/login");
        break;
      case "r":
        router.push("/register");
        break;
      case "s":
        router.push("/sobre-nosotros");
        break;
      case "b":
        focusSearchInput();
        break;
      case "i":
        changeLanguage("es");
        break;
      case "z":
        changeLanguage("en");
        break;
      case "m":
        changeLanguage("qu");
        break;
      case "u":
        toggleUserMenuShortcut();
        break;
    }

    // Zoom con Ctrl
    if (event.ctrlKey) {
      switch (event.key) {
        case "+":
        case "=":
          adjustZoom(0.1);
          break;
        case "-":
          adjustZoom(-0.1);
          break;
        case "0":
          resetZoom();
          break;
      }
    }
  };

  const focusSearchInput = () => {
    const searchInput = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const toggleUserMenuShortcut = () => {
    const userMenuButton = document.querySelector(
      '[aria-label*="usuario"]'
    ) as HTMLButtonElement;
    if (userMenuButton) {
      userMenuButton.click();
    }
  };

  const adjustZoom = (delta: number) => {
    const currentZoom = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    document.documentElement.style.fontSize = `${currentZoom + delta * 16}px`;
  };

  const resetZoom = () => {
    document.documentElement.style.fontSize = "16px";
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyboardShortcuts);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyboardShortcuts);
  });

  return {
    showKeyboardShortcuts,
  };
}
