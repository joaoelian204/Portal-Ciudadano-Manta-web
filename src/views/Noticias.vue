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
          <div class="flex items-center gap-3 mb-2">
            <span class="text-4xl">📰</span>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">{{ $t("noticias.title") }}</h1>
          </div>
          <p class="text-gray-600 text-lg mb-6">{{ $t("noticias.subtitle") }}</p>
          
          <!-- Barra de Búsqueda -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar noticias por título o contenido..."
              class="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Resultados de Búsqueda -->
      <div v-if="searchQuery && noticiasFiltradas.length === 0 && !loading" class="bg-white rounded-xl shadow-lg p-12 text-center mb-6">
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-gray-600 text-lg font-semibold">No se encontraron noticias</p>
        <p class="text-gray-500 mt-2">Intenta con otras palabras clave</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p class="text-gray-600 text-lg">{{ $t("noticias.loading") }}</p>
      </div>

      <!-- Empty State -->
      <div 
        v-else-if="noticias.length === 0" 
        class="bg-white rounded-xl shadow-lg p-12 text-center"
      >
        <div class="text-6xl mb-4">📭</div>
        <p class="text-gray-600 text-lg">{{ $t("noticias.noNewsDescription") }}</p>
      </div>

      <!-- Noticias Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="n in noticiasFiltradas"
          :key="n.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
          @click="openNoticia(n.id)"
        >
          <!-- Imagen -->
          <div class="relative h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden">
            <img
              v-if="n.imagen_url"
              :src="n.imagen_url"
              :alt="n.titulo"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="flex items-center justify-center h-full text-6xl">
              📰
            </div>
            
            <!-- Badge de audiencia -->
            <div class="absolute top-3 right-3">
              <span 
                class="px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                :class="n.parroquia_destino 
                  ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                  : 'bg-green-100 text-green-800 border border-green-300'"
              >
                {{ n.parroquia_destino ? '📍 ' + n.parroquia_destino : '🌍 ' + $t("noticias.forAll") }}
              </span>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-4 sm:p-5">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {{ n.titulo }}
            </h2>
            
            <p class="text-gray-700 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 leading-relaxed">
              {{ n.contenido }}
            </p>

            <!-- Footer con botón -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <span class="text-sm text-gray-600 font-semibold">
                {{ new Date(n.created_at || '').toLocaleDateString('es-EC', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                }) }}
              </span>
              
              <button
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                @click.stop="openNoticia(n.id)"
              >
                {{ $t("noticias.readMore") }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useNoticiasStore } from "@/stores/noticias.store";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const noticiasStore = useNoticiasStore();
const authStore = useAuthStore();
const router = useRouter();

const volver = () => router.back();

// Estado de búsqueda
const searchQuery = ref("");

// Hacer reactivos los valores con computed
const noticias = computed(() => noticiasStore.noticias);
const loading = computed(() => noticiasStore.loading);

// Filtrar noticias según búsqueda
const noticiasFiltradas = computed(() => {
  if (!searchQuery.value.trim()) {
    return noticias.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return noticias.value.filter(noticia => 
    noticia.titulo.toLowerCase().includes(query) ||
    noticia.contenido.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  console.log('🎯 Noticias.vue montado');
  
  // Verificar si el usuario es administrador
  const esAdmin = authStore.isAdministrador();
  
  if (esAdmin) {
    // Administradores ven TODAS las noticias sin filtros
    console.log('👤 Usuario administrador: cargando TODAS las noticias');
    await noticiasStore.fetchTodasLasNoticias();
  } else {
    // Ciudadanos ven noticias filtradas por su ubicación
    const parroquia = authStore.usuario?.parroquia || undefined;
    const barrio = authStore.usuario?.barrio || undefined;
    
    if (parroquia) {
      console.log('📍 Cargando noticias para parroquia:', parroquia, barrio ? `- barrio: ${barrio}` : '');
      await noticiasStore.fetchNoticiasUsuario(parroquia, barrio);
    } else {
      console.log('🌍 Cargando solo noticias globales');
      await noticiasStore.fetchNoticias();
    }
  }
  
  console.log('✅ Noticias cargadas:', noticias.value.length);
});

const openNoticia = (id: string) => {
  console.log('🔗 Navegando a noticia:', id);
  // Navegar a detalle de noticia
  router.push({ name: "NoticiaDetalle", params: { id } });
};
</script>

<style scoped></style>
