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
          <p class="text-gray-600 text-lg">{{ $t("noticias.subtitle") }}</p>
        </div>
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
          v-for="n in noticias"
          :key="n.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
          @click="openNoticia(n.id)"
        >
          <!-- Imagen -->
          <div class="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden">
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
          <div class="p-5">
            <h2 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {{ n.titulo }}
            </h2>
            
            <p class="text-gray-600 text-sm line-clamp-3 mb-4">
              {{ n.contenido }}
            </p>

            <!-- Footer con botón -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <span class="text-xs text-gray-400">
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
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const noticiasStore = useNoticiasStore();
const authStore = useAuthStore();
const router = useRouter();

const volver = () => router.back();

// Hacer reactivos los valores con computed
const noticias = computed(() => noticiasStore.noticias);
const loading = computed(() => noticiasStore.loading);

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
