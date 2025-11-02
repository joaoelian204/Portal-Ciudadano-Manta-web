<template>
  <div class="min-h-screen bg-gray-50">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      Saltar al contenido principal
    </a>

    <header class="bg-white shadow-md border-b-4 border-blue-600" role="banner">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div class="flex-1">
            <h1
              class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800"
            >
              {{ $t("admin.title") }}
            </h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              {{ $t("admin.subtitle") }}
            </p>
          </div>
          <div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div class="text-left sm:text-right flex-1 sm:flex-none">
              <p class="text-xs sm:text-sm text-gray-600">Administrador</p>
              <p
                class="font-semibold text-sm sm:text-base text-gray-800 truncate max-w-[150px] sm:max-w-none"
              >
                {{ adminName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main
      id="main-content"
      class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      role="main"
    >
      <!-- Banner de Bienvenida -->
      <div
        class="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-white mb-6 sm:mb-8"
      >
        <h2 class="text-xl sm:text-2xl font-bold mb-2">
          {{ $t("admin.welcome") }} {{ adminName }}!
        </h2>
        <p class="text-sm sm:text-base text-blue-50">
          {{ $t("admin.welcomeMessage") }}
        </p>
      </div>

      <!-- Tarjetas de Estadísticas -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <!-- Total Encuestas -->
        <div
          class="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 hover:shadow-xl transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-xs sm:text-sm text-gray-600 mb-1">
                {{ $t("admin.stats.totalSurveys") }}
              </p>
              <p class="text-2xl sm:text-3xl font-bold text-blue-600">
                {{ encuestas.length }}
              </p>
            </div>
            <div class="bg-blue-100 rounded-full p-2 sm:p-3">
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Encuestas Activas -->
        <div
          class="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 hover:shadow-xl transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-xs sm:text-sm text-gray-600 mb-1">
                {{ $t("admin.stats.activeSurveys") }}
              </p>
              <p class="text-2xl sm:text-3xl font-bold text-green-600">
                {{ encuestasActivas }}
              </p>
            </div>
            <div class="bg-green-100 rounded-full p-2 sm:p-3">
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Panel Activo -->
        <div
          class="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-xs sm:text-sm text-gray-600 mb-1">Gestión</p>
              <p class="text-base sm:text-lg font-semibold text-gray-800">
                Panel Activo
              </p>
            </div>
            <div class="bg-purple-100 rounded-full p-2 sm:p-3">
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjetas de Gestión -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <!-- Gestionar Encuestas -->
        <div
          class="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
        >
          <div class="text-center">
            <div class="mb-4 flex justify-center" aria-hidden="true">
              <svg
                class="w-12 h-12 sm:w-16 sm:h-16 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
              {{ $t("admin.sections.surveys.title") }}
            </h3>
            <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
              {{ $t("admin.sections.surveys.description") }}
            </p>
            <router-link
              to="/admin/encuestas"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
              :aria-label="$t('admin.sections.surveys.title')"
            >
              {{ $t("admin.sections.surveys.button") }}
            </router-link>
          </div>
        </div>

        <!-- Gestionar Noticias -->
        <div
          class="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
        >
          <div class="text-center">
            <div class="mb-4 flex justify-center" aria-hidden="true">
              <svg
                class="w-12 h-12 sm:w-16 sm:h-16 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
              {{ $t("admin.sections.news.title") }}
            </h3>
            <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
              {{ $t("admin.sections.news.description") }}
            </p>
            <router-link
              to="/admin/noticias"
              class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm sm:text-base"
              :aria-label="$t('admin.sections.news.title')"
            >
              {{ $t("admin.sections.news.button") }}
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLanguage } from "../composables/useLanguage";
import { useAuthStore } from "../stores/auth.store";
import { useEncuestasStore } from "../stores/encuestas.store";

const authStore = useAuthStore();
const encuestasStore = useEncuestasStore();
const router = useRouter();

// Inicializar sistema de idiomas (para sincronización global)
const { loadSavedLanguage } = useLanguage();

const adminName = computed(() => {
  return authStore.usuario?.nombres || "Administrador";
});

const encuestas = computed(() => encuestasStore.encuestas);

const encuestasActivas = computed(() => {
  return encuestas.value.filter((e) => e.activa).length;
});

onMounted(async () => {
  console.log("🏠 AdminPanel: Montado", {
    isAuthenticated: authStore.isAuthenticated(),
    isAdmin: authStore.isAdministrador(),
    hasUser: !!authStore.user,
    hasUsuario: !!authStore.usuario,
    usuarioTipo: authStore.usuario?.tipo,
  });

  // Cargar idioma guardado
  loadSavedLanguage();

  // Esperar a que el store esté listo
  if (authStore.loading) {
    console.log("⏳ AdminPanel: Esperando a que termine la carga del auth...");
    await new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (!authStore.loading) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout de 5 segundos
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 5000);
    });
  }

  console.log("🔍 AdminPanel: Después de esperar", {
    isAuthenticated: authStore.isAuthenticated(),
    isAdmin: authStore.isAdministrador(),
    hasUsuario: !!authStore.usuario,
    usuarioTipo: authStore.usuario?.tipo,
  });

  if (!authStore.isAuthenticated() || !authStore.isAdministrador()) {
    console.warn("🚫 AdminPanel: Usuario no autorizado, redirigiendo...");
    router.push("/login");
    return;
  }

  // Solo cargar si no hay encuestas ya cargadas
  if (encuestasStore.encuestas.length > 0) {
    console.log("✓ AdminPanel: Estadísticas ya cargadas, reutilizando datos");
    return;
  }

  // Cargar estadísticas de encuestas
  try {
    console.log("📊 AdminPanel: Cargando estadísticas de encuestas...");
    const result = await encuestasStore.fetchEncuestas(false);

    if (result.success) {
      console.log(
        "✅ AdminPanel: Estadísticas cargadas:",
        encuestasStore.encuestas.length,
        "encuestas"
      );
    } else {
      console.warn(
        "⚠️ AdminPanel: Error al cargar estadísticas:",
        result.error
      );
    }
  } catch (error: any) {
    console.error("❌ AdminPanel: Error al cargar encuestas:", error);
    // No redirigir, solo mostrar estadísticas en 0
  }
});
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus,
.focus\:not-sr-only:focus {
  position: fixed;
  width: auto;
  height: auto;
  padding: 1rem 1.5rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
</style>
