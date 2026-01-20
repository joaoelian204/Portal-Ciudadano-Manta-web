<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-6 lg:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <!-- Back Button -->
      <button 
        @click="volver" 
        class="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition-all hover:bg-gray-50 text-sm sm:text-base"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ $t("common.back") }}
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-lg p-8 sm:p-12">
        <div class="flex flex-col items-center justify-center py-8 sm:py-12">
          <div class="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mb-4"></div>
          <p class="text-gray-600 text-base sm:text-lg">{{ $t("noticiaDetalle.loading") }}</p>
        </div>
      </div>

      <!-- Article Content - Layout de 2 columnas -->
      <article v-else-if="noticia" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="grid lg:grid-cols-2 gap-0">
          <!-- Columna Izquierda: Imagen + Noticias Relacionadas -->
          <div class="flex flex-col">
            <!-- Componente 1: Imagen Principal -->
            <div class="relative h-[400px] lg:h-[500px] bg-gradient-to-br from-blue-100 to-cyan-100">
              <img
                v-if="noticia.imagen_url"
                :src="noticia.imagen_url"
                :alt="noticia.titulo"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex items-center justify-center h-full">
                <span class="text-9xl">📰</span>
              </div>

              <!-- Overlay gradient sutil -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

              <!-- Badge de audiencia -->
              <div class="absolute top-6 left-6">
                <span 
                  class="px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm"
                  :class="noticia.parroquia_destino 
                    ? 'bg-purple-100/90 text-purple-900 border border-purple-300' 
                    : 'bg-green-100/90 text-green-900 border border-green-300'"
                >
                  {{ noticia.parroquia_destino 
                    ? '📍 ' + $t("noticiaDetalle.parish") + ": " + noticia.parroquia_destino 
                    : '🌍 ' + $t("noticiaDetalle.forAll") 
                  }}
                </span>
              </div>
            </div>

            <!-- Componente 2: Noticias Relacionadas (solo visible en desktop lg+) -->
            <div class="hidden lg:block p-8 bg-white border-t-2 border-blue-100">
              <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl shadow-lg">
                    📰
                  </div>
                  <span>{{ $t('noticiaDetalle.related') }}</span>
                </h2>
                <p class="text-sm text-gray-500 ml-13">Más noticias que podrían interesarte</p>
              </div>

              <!-- Loading de noticias relacionadas -->
              <div v-if="loading" class="space-y-4">
                <div v-for="i in 3" :key="i" class="animate-pulse">
                  <div class="h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl"></div>
                </div>
              </div>

              <!-- Lista de noticias relacionadas -->
              <div v-else-if="noticiasRelacionadas.length > 0" class="space-y-4">
                <article
                  v-for="n in noticiasRelacionadas"
                  :key="n.id"
                  @click="abrirNoticia(n.id)"
                  class="group cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-cyan-50 rounded-2xl overflow-hidden transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transform hover:scale-[1.02]"
                >
                  <div class="flex gap-0">
                    <!-- Imagen con efecto -->
                    <div class="w-40 h-36 flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 relative">
                      <img
                        v-if="n.imagen_url"
                        :src="n.imagen_url"
                        :alt="n.titulo"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div v-else class="flex items-center justify-center h-full text-5xl">
                        📰
                      </div>
                      <!-- Overlay gradient -->
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <!-- Contenido -->
                    <div class="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <h3 class="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                          {{ n.titulo }}
                        </h3>
                        <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                          {{ n.contenido }}
                        </p>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-gray-500">
                          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <time class="text-sm font-semibold text-gray-700">
                            {{ new Date(n.created_at || '').toLocaleDateString('es-EC', { 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric'
                            }) }}
                          </time>
                        </div>
                        
                        <div class="flex items-center gap-2 text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Leer más</span>
                          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <!-- Botón Ver Más Noticias -->
              <div v-if="hayMasNoticias" class="mt-6">
                <button
                  @click="verTodasLasNoticias"
                  class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <span>Ver más noticias</span>
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>

              <!-- Empty state -->
              <div v-else-if="noticiasRelacionadas.length === 0" class="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
                <div class="text-6xl mb-4">📭</div>
                <p class="text-base font-semibold text-gray-600">{{ $t('noticiaDetalle.noRelated') }}</p>
                <p class="text-sm text-gray-500 mt-2">No hay más noticias en este momento</p>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Contenido -->
          <div class="p-4 sm:p-6 lg:p-10 flex flex-col">
            <!-- Header -->
            <div class="mb-4 sm:mb-6">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight text-balance">
                {{ noticia.titulo }}
              </h1>

              <!-- Metadata -->
              <div class="flex flex-wrap items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
                <div class="flex items-center gap-2 text-gray-600">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs sm:text-sm font-medium">
                    {{ new Date(noticia.created_at || '').toLocaleDateString('es-EC', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    }) }}
                  </span>
                </div>
                
                <div class="flex items-center gap-2 text-gray-600">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-xs sm:text-sm font-medium">
                    {{ new Date(noticia.created_at || '').toLocaleTimeString('es-EC', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contenido -->
            <div class="flex-1 mb-6 sm:mb-8">
              <div class="prose prose-base sm:prose-lg lg:prose-xl max-w-none">
                <p class="text-gray-700 leading-relaxed whitespace-pre-line text-justify text-base sm:text-lg lg:text-xl hyphens-auto" lang="es">
                  {{ noticia.contenido }}
                </p>
              </div>
            </div>

            <!-- Noticias Relacionadas (solo visible en móvil/tablet, menor a lg) -->
            <div class="lg:hidden mb-6 sm:mb-8">
              <div class="mb-4">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg shadow-lg">
                    📰
                  </div>
                  <span>{{ $t('noticiaDetalle.related') }}</span>
                </h2>
                <p class="text-xs sm:text-sm text-gray-500 ml-11">Más noticias que podrían interesarte</p>
              </div>

              <!-- Loading de noticias relacionadas -->
              <div v-if="loading" class="space-y-3">
                <div v-for="i in 3" :key="i" class="animate-pulse">
                  <div class="h-32 sm:h-36 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl"></div>
                </div>
              </div>

              <!-- Lista de noticias relacionadas -->
              <div v-else-if="noticiasRelacionadas.length > 0" class="space-y-3">
                <article
                  v-for="n in noticiasRelacionadas"
                  :key="n.id"
                  @click="abrirNoticia(n.id)"
                  class="group cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-cyan-50 rounded-2xl overflow-hidden transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl active:scale-[0.98]"
                >
                  <div class="flex gap-0">
                    <!-- Imagen con efecto -->
                    <div class="w-32 sm:w-36 h-32 sm:h-36 flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 relative">
                      <img
                        v-if="n.imagen_url"
                        :src="n.imagen_url"
                        :alt="n.titulo"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div v-else class="flex items-center justify-center h-full text-4xl sm:text-5xl">
                        📰
                      </div>
                      <!-- Overlay gradient -->
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <!-- Contenido -->
                    <div class="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                      <div>
                        <h3 class="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight mb-1.5">
                          {{ n.titulo }}
                        </h3>
                        <p class="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2">
                          {{ n.contenido }}
                        </p>
                      </div>
                      
                      <div class="flex items-center gap-2 text-gray-500">
                        <div class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <time class="text-xs sm:text-sm font-semibold text-gray-700">
                          {{ new Date(n.created_at || '').toLocaleDateString('es-EC', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          }) }}
                        </time>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <!-- Botón Ver Más Noticias -->
              <div v-if="hayMasNoticias" class="mt-4">
                <button
                  @click="verTodasLasNoticias"
                  class="w-full px-5 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span>Ver más noticias</span>
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>

              <!-- Empty state -->
              <div v-else-if="noticiasRelacionadas.length === 0" class="text-center py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
                <div class="text-5xl sm:text-6xl mb-3">📭</div>
                <p class="text-sm sm:text-base font-semibold text-gray-600">{{ $t('noticiaDetalle.noRelated') }}</p>
                <p class="text-xs sm:text-sm text-gray-500 mt-2">No hay más noticias en este momento</p>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="pt-4 sm:pt-6 border-t border-gray-200 mt-auto">
              <button 
                @click="volver" 
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base min-h-[48px] active:scale-[0.98]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                {{ $t("common.back") }}
              </button>
            </div>
          </div>
        </div>
      </article>

      <!-- Not Found State -->
      <div v-else class="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-12">
        <div class="text-center py-8 sm:py-12">
          <div class="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6">{{ noticiasStore.error ? '⚠️' : '🔍' }}</div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-balance">
            {{ noticiasStore.error ? 'Error al cargar la noticia' : $t("noticiaDetalle.notFound") }}
          </h2>
          <p class="text-sm sm:text-base text-gray-600 mb-4 text-pretty max-w-md mx-auto">
            {{ noticiasStore.error || 'La noticia que buscas no existe o fue eliminada.' }}
          </p>
          <p v-if="id" class="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 font-mono bg-gray-100 px-3 py-1 rounded inline-block">
            ID: {{ id }}
          </p>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <button 
              @click="cargarNoticia(id)"
              class="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base min-h-[48px] active:scale-[0.98]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reintentar
            </button>
            <button 
              @click="volver" 
              class="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[48px] active:scale-[0.98]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver a noticias
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNoticiasStore } from "@/stores/noticias.store";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const noticiasStore = useNoticiasStore();

const id = computed(() => String(route.params.id || ""));
const cargando = ref(false);

// Usar computed para mantener la reactividad
const noticia = computed(() => noticiasStore.noticiaActual);
const loading = computed(() => noticiasStore.loading || cargando.value);

// Noticias relacionadas (excluyendo la actual, máximo 3)
const noticiasRelacionadas = computed(() => {
  if (!noticia.value) return [];
  
  return noticiasStore.noticias
    .filter(n => n.id !== noticia.value?.id)
    .slice(0, 3);
});

// Verificar si hay más noticias
const hayMasNoticias = computed(() => {
  if (!noticia.value) return false;
  
  const totalNoticias = noticiasStore.noticias
    .filter(n => n.id !== noticia.value?.id)
    .length;
  
  return totalNoticias > 3;
});

const volver = () => router.back();

const verTodasLasNoticias = () => {
  router.push('/noticias');
};

const abrirNoticia = async (noticiaId: string) => {
  // Navegar a la nueva noticia
  await router.push({ name: 'NoticiaDetalle', params: { id: noticiaId } });
  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cargarNoticia = async (noticiaId: string) => {
  if (!noticiaId || cargando.value) {
    console.log('⏭️ Omitiendo carga (id vacío o ya cargando)');
    return;
  }
  
  cargando.value = true;
  console.log('📰 Cargando noticia:', noticiaId);
  
  try {
    // Cargar la noticia actual
    const result = await noticiasStore.fetchNoticia(noticiaId);
    
    if (result.success) {
      console.log('✅ Noticia cargada correctamente:', result.data);
    } else {
      console.error('❌ Error al cargar noticia:', result.error);
    }
    
    // Si no hay noticias cargadas en la store, cargarlas para las relacionadas
    if (noticiasStore.noticias.length === 0) {
      console.log('📰 Cargando noticias relacionadas...');
      await noticiasStore.fetchNoticias();
    }
  } finally {
    cargando.value = false;
  }
};

// Watch para detectar cambios en el ID de la ruta
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      console.log('🔄 Route ID cambió a:', newId);
      await cargarNoticia(String(newId));
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log('🎯 NoticiaDetalle montado con ID:', id.value);
});

// Limpiar el estado al salir del componente
onBeforeUnmount(() => {
  console.log('👋 Limpiando estado de NoticiaDetalle');
  noticiasStore.noticiaActual = null;
});
</script>

<style scoped>
/* Custom scrollbar para la lista de noticias relacionadas */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
