<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-4">{{ $t("encuestas.title") }}</h1>
      <p class="text-gray-600 mb-6">{{ $t("encuestas.subtitle") }}</p>
      <div class="mb-4">
        <button @click="volver" class="px-3 py-1 bg-gray-200 rounded">
          ← {{ $t("common.volver") }}
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
        ></div>
        <div class="text-sm text-gray-600">{{ $t("encuestas.loading") }}</div>
      </div>

      <div v-else>
        <div
          v-if="encuestas.length === 0"
          class="text-center text-gray-600 py-8"
        >
          {{ $t("encuestas.noSurveysDescription") }}
        </div>

        <div class="space-y-4">
          <div
            v-for="encuesta in encuestas"
            :key="encuesta.id"
            class="p-4 border rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="font-semibold text-lg">{{ encuesta.titulo }}</div>
                <div class="text-sm text-gray-600 mt-1">
                  {{ encuesta.descripcion }}
                </div>
              </div>
              <div>
                <button
                  @click="openEncuesta(encuesta.id)"
                  class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                >
                  {{ $t("encuestas.participate") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEncuestasStore } from "@/stores/encuestas.store";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const encuestasStore = useEncuestasStore();
const router = useRouter();

const volver = () => router.back();

const encuestas = encuestasStore.encuestas;
const loading = encuestasStore.loading;

const openEncuesta = (id: string) => {
  // Navegar a detalle de encuesta
  router.push({ name: "EncuestaDetalle", params: { id } });
};

onMounted(async () => {
  // Cargar encuestas activas
  await encuestasStore.fetchEncuestas(true);
});
</script>

<style scoped></style>
