<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <button @click="volver" class="mb-4 px-3 py-1 bg-gray-200 rounded">
        ← {{ $t("common.back") }}
      </button>

      <div v-if="loading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
        ></div>
        <div class="text-sm text-gray-600">
          {{ $t("noticiaDetalle.loading") }}
        </div>
      </div>

      <div v-else-if="noticia">
        <h1 class="text-2xl font-bold mb-2">{{ noticia.titulo }}</h1>
        <div class="text-xs text-gray-400 mb-4">
          {{
            noticia.parroquia_destino
              ? $t("noticiaDetalle.parish") + ": " + noticia.parroquia_destino
              : $t("noticiaDetalle.forAll")
          }}
        </div>
        <img
          v-if="noticia.imagen_url"
          :src="noticia.imagen_url"
          alt="imagen"
          class="w-full h-48 object-cover rounded mb-4"
        />
        <div class="text-gray-700">{{ noticia.contenido }}</div>
      </div>

      <div v-else class="text-center text-gray-600 py-8">
        {{ $t("noticiaDetalle.notFound") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNoticiasStore } from "@/stores/noticias.store";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const noticiasStore = useNoticiasStore();

const id = String(route.params.id || "");

const noticia = noticiasStore.noticiaActual;
const loading = noticiasStore.loading;

const volver = () => router.back();

onMounted(async () => {
  if (!id) return;
  await noticiasStore.fetchNoticia(id);
});
</script>

<style scoped></style>
