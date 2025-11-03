<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
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

            <!-- Selector de Vista -->
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

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p class="text-gray-600 text-lg">{{ $t("encuestas.loading") }}</p>
      </div>

      <!-- Empty State -->
      <div 
        v-else-if="encuestas.length === 0" 
        class="bg-white rounded-xl shadow-lg p-12 text-center"
      >
        <div class="text-6xl mb-4">📋</div>
        <p class="text-gray-600 text-lg">{{ $t("encuestas.noSurveysDescription") }}</p>
      </div>

      <!-- Encuestas - Vista de Tarjetas (Compactas) -->
      <div v-else-if="vistaActual === 'tarjetas'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="encuesta in encuestas"
          :key="encuesta.id"
          class="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden"
        >
          <!-- Header compacto -->
          <div class="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📊</span>
                <span class="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                  {{ $t("encuestas.active") }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contenido compacto -->
          <div class="p-4">
            <h2 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {{ encuesta.titulo }}
            </h2>
            
            <p class="text-gray-600 text-sm line-clamp-2 mb-3">
              {{ encuesta.descripcion }}
            </p>

            <!-- Metadata compacta -->
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {{ new Date(encuesta.created_at || '').toLocaleDateString('es-EC', { 
                  day: '2-digit', 
                  month: 'short'
                }) }}
              </span>
            </div>

            <!-- Botón compacto -->
            <button
              @click="openEncuesta(encuesta.id)"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow hover:shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ $t("encuestas.participate") }}
            </button>
          </div>
        </article>
      </div>

      <!-- Encuestas - Vista de Lista -->
      <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold">Título</th>
                <th class="px-6 py-4 text-left text-sm font-semibold hidden md:table-cell">Descripción</th>
                <th class="px-6 py-4 text-left text-sm font-semibold hidden sm:table-cell">Fecha</th>
                <th class="px-6 py-4 text-center text-sm font-semibold">Acción</th>
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
                <td class="px-6 py-4 hidden md:table-cell">
                  <p class="text-sm text-gray-600 line-clamp-2">
                    {{ encuesta.descripcion }}
                  </p>
                </td>
                <td class="px-6 py-4 hidden sm:table-cell">
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
                <td class="px-6 py-4 text-center">
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
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useEncuestasStore } from "@/stores/encuestas.store";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

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
