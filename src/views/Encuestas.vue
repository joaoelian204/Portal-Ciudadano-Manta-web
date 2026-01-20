<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <button 
          @click="volver" 
          class="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition-all hover:bg-gray-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ $t("common.volver") }}
        </button>

        <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-3">
              <span class="text-4xl">📊</span>
              <div>
                <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">{{ $t("encuestas.title") }}</h1>
                <p class="text-gray-600 text-sm sm:text-base mt-1">{{ $t("encuestas.subtitle") }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                @click="vistaActual = 'tarjetas'"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-all',
                  vistaActual === 'tarjetas'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                @click="vistaActual = 'lista'"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-all',
                  vistaActual === 'lista'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p class="text-gray-600 text-lg">{{ $t("encuestas.loading") }}</p>
      </div>

      <div v-else-if="encuestas.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
        <span class="text-6xl mb-4">📭</span>
        <h3 class="text-xl font-medium text-gray-900">No hay encuestas disponibles</h3>
        <p class="text-gray-500 mt-2">No se encontraron encuestas para tu ubicación actual.</p>
      </div>

      <div v-else>
        
        <div v-if="vistaActual === 'tarjetas'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article 
            v-for="encuesta in encuestas" 
            :key="encuesta.id"
            class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100"
          >
            <!-- Header con imagen de fondo -->
            <div class="relative h-40 bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden">
              <!-- Imagen de fondo -->
              <img 
                :src="encuestaImage" 
                alt=""
                class="absolute inset-0 w-full h-full object-cover"
                aria-hidden="true"
              />
              <!-- Overlay gradiente más sutil -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-blue-800/50"></div>
              <div class="relative h-full flex items-start justify-between p-4 z-10">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <span class="text-lg">📊</span>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg animate-pulse">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  ACTIVA
                </span>
              </div>
            </div>
            
            <!-- Contenido -->
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{{ encuesta.titulo }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{{ encuesta.descripcion }}</p>
              
              <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span class="text-xs text-gray-500 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ new Date(encuesta.created_at || '').toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }) }}
                </span>
                <button
                  @click="openEncuesta(encuesta.id)"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow hover:shadow-lg"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ $t("encuestas.participate") }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Título</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Descripción</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Fecha</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="encuesta in encuestas"
                  :key="encuesta.id"
                  class="hover:bg-blue-50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">📊</span>
                      <div>
                        <p class="font-semibold text-gray-900">{{ encuesta.titulo }}</p>
                        <span class="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium mt-1">
                          {{ $t("encuestas.active") }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell max-w-xs">
                    <p class="text-sm text-gray-600 line-clamp-2">
                      {{ encuesta.descripcion }}
                    </p>
                  </td>
                  <td class="px-6 py-4 hidden sm:table-cell whitespace-nowrap">
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ new Date(encuesta.created_at || '').toLocaleDateString('es-EC', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      }) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      @click="openEncuesta(encuesta.id)"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow hover:shadow-lg"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span class="hidden sm:inline">{{ $t("encuestas.participate") }}</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useEncuestasStore } from "@/stores/encuestas.store";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const encuestaImage = new URL('@/assets/encuenta/encuesta.jpg', import.meta.url).href;

const encuestasStore = useEncuestasStore();
const authStore = useAuthStore();
const router = useRouter();

const volver = () => router.back();

// Vista actual con persistencia en localStorage
const vistaActual = ref<'tarjetas' | 'lista'>(
  (localStorage.getItem('encuestas_vista') as 'tarjetas' | 'lista') || 'tarjetas'
);

// Obtener usuario actual
const usuario = computed(() => authStore.usuario);

// Filtrar encuestas según la ubicación del usuario
const encuestas = computed(() => {
  const todasLasEncuestas = encuestasStore.encuestas;
  const userParroquia = usuario.value?.parroquia?.trim();
  const userBarrio = usuario.value?.barrio?.trim();

  return todasLasEncuestas.filter((encuesta) => {
    const encuestaParroquia = encuesta.parroquia_destino?.trim();
    const encuestaBarrio = encuesta.barrio_destino?.trim();

    // Caso 1: Encuesta global (sin parroquia) - visible para todos
    if (!encuestaParroquia) {
      return true;
    }

    // Caso 2: Usuario no tiene parroquia - solo ve globales
    if (!userParroquia) {
      return false;
    }

    // Caso 3: Encuesta es de otra parroquia - no visible
    if (encuestaParroquia !== userParroquia) {
      return false;
    }

    // Caso 4: Encuesta es de la parroquia del usuario
    // 4a: Encuesta para toda la parroquia (sin barrio específico) - visible
    if (!encuestaBarrio) {
      return true;
    }

    // 4b: Encuesta para un barrio específico
    // Solo visible si el usuario está en ese barrio
    return encuestaBarrio === userBarrio;
  });
});

const loading = computed(() => encuestasStore.loading);

const openEncuesta = (id: string) => {
  // Navegar a detalle de encuesta
  router.push({ name: "EncuestaDetalle", params: { id } });
};

onMounted(async () => {
  // Cargar encuestas activas
  await encuestasStore.fetchEncuestas(true);
});

// Guardar preferencia de vista en localStorage
watch(vistaActual, (nuevaVista) => {
  localStorage.setItem('encuestas_vista', nuevaVista);
});
</script>

<style scoped></style>