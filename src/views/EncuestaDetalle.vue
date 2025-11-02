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
          {{ $t("encuestaDetalle.loading") }}
        </div>
      </div>

      <div v-else-if="encuesta">
        <h1 class="text-2xl font-bold mb-2">{{ encuesta.titulo }}</h1>
        <div class="text-gray-700 mb-4">{{ encuesta.descripcion }}</div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
            $t("encuestaDetalle.yourResponse")
          }}</label>
          <textarea
            v-model="respuestaLibre"
            rows="5"
            class="w-full border rounded p-2"
          ></textarea>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="enviarRespuesta"
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {{ $t("encuestaDetalle.submitResponse") }}
          </button>
          <div v-if="message" class="text-sm text-green-600">{{ message }}</div>
        </div>
      </div>

      <div v-else class="text-center text-gray-600 py-8">
        {{ $t("encuestaDetalle.notFound") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useEncuestasStore } from "@/stores/encuestas.store";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const encuestasStore = useEncuestasStore();
const authStore = useAuthStore();

const id = String(route.params.id || "");
const encuesta = encuestasStore.encuestaActual;
const loading = encuestasStore.loading;

const respuestaLibre = ref("");
const submitting = ref(false);
const message = ref("");

const volver = () => router.back();

onMounted(async () => {
  if (!id) return;
  await encuestasStore.fetchEncuesta(id);
});

const enviarRespuesta = async () => {
  if (!authStore.user) {
    // Redirigir a login manteniendo redirect
    return router.push({ name: "Login", query: { redirect: route.fullPath } });
  }

  submitting.value = true;
  message.value = "";

  try {
    const payload = { respuestaLibre: respuestaLibre.value };
    const result = await encuestasStore.responderEncuesta(id, payload);
    if (result.success) {
      message.value = t("encuestaDetalle.responseSuccess");
      respuestaLibre.value = "";
    } else {
      message.value = t("encuestaDetalle.responseError");
    }
  } catch (err: any) {
    message.value = t("encuestaDetalle.responseError");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped></style>
