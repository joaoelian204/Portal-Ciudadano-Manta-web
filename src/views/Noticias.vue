<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-4">{{ $t("noticias.title") }}</h1>
      <p class="text-gray-600 mb-6">{{ $t("noticias.subtitle") }}</p>
      <div class="mb-4">
        <button @click="volver" class="px-3 py-1 bg-gray-200 rounded">
          ← {{ $t("common.volver") }}
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
        ></div>
        <div class="text-sm text-gray-600">{{ $t("noticias.loading") }}</div>
      </div>

      <div v-else>
        <div
          v-if="noticias.length === 0"
          class="text-center text-gray-600 py-8"
        >
          {{ $t("noticias.noNewsDescription") }}
        </div>

        <div class="space-y-4">
          <div
            v-for="n in noticias"
            :key="n.id"
            class="p-4 border rounded-lg flex items-start space-x-4"
          >
            <div class="flex-1">
              <div class="font-semibold text-lg">{{ n.titulo }}</div>
              <div class="text-sm text-gray-600 mt-1">{{ n.contenido }}</div>
              <div class="text-xs text-gray-400 mt-2">
                {{
                  n.parroquia_destino
                    ? "Parroquia: " + n.parroquia_destino
                    : "Para todos"
                }}
              </div>
              <div class="mt-3">
                <button
                  @click="openNoticia(n.id)"
                  class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                >
                  {{ $t("noticias.readMore") }}
                </button>
              </div>
            </div>
            <div class="w-28">
              <img
                v-if="n.imagen_url"
                :src="n.imagen_url"
                alt="imagen"
                class="w-full h-16 object-cover rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useNoticiasStore } from "@/stores/noticias.store";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const noticiasStore = useNoticiasStore();
const authStore = useAuthStore();
const router = useRouter();

const volver = () => router.back();

const noticias = noticiasStore.noticias;
const loading = noticiasStore.loading;

onMounted(async () => {
  // Si hay usuario con parroquia, cargar noticias filtradas por usuario
  const parroquia = authStore.usuario?.parroquia || undefined;
  const barrio = authStore.usuario?.barrio || undefined;
  if (parroquia) {
    await noticiasStore.fetchNoticiasUsuario(parroquia, barrio);
  } else {
    await noticiasStore.fetchNoticias();
  }
});

const openNoticia = (id: string) => {
  // Navegar a detalle de noticia
  router.push({ name: "NoticiaDetalle", params: { id } });
};
</script>

<style scoped></style>
