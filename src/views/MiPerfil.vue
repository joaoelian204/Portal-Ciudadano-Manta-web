<template>
  <div class="min-h-screen p-6 bg-gray-50">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-4">{{ $t("perfil.title") }}</h1>

      <div v-if="!usuario" class="text-center py-8 text-gray-600">
        {{ $t("perfil.noUserData") }}
      </div>

      <div v-else class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-500">{{ $t("perfil.name") }}</label>
            <div class="mt-1">{{ usuario.nombres }}</div>
          </div>
          <div>
            <label class="text-xs text-gray-500">{{
              $t("perfil.lastName")
            }}</label>
            <div class="mt-1">{{ usuario.apellidos }}</div>
          </div>

          <div>
            <label class="text-xs text-gray-500">{{
              $t("perfil.email")
            }}</label>
            <div class="mt-1">{{ usuario.email }}</div>
          </div>
          <div>
            <label class="text-xs text-gray-500">{{
              $t("perfil.cedula")
            }}</label>
            <div class="mt-1">{{ usuario.cedula }}</div>
          </div>

          <div>
            <label class="text-xs text-gray-500">{{
              $t("perfil.parish")
            }}</label>
            <div class="mt-1">{{ usuario.parroquia }}</div>
          </div>
          <div>
            <label class="text-xs text-gray-500">{{
              $t("perfil.neighborhood")
            }}</label>
            <div class="mt-1">{{ usuario.barrio }}</div>
          </div>

          <div>
            <label class="text-xs text-gray-500">{{
              $t("perfil.userType")
            }}</label>
            <div class="mt-1">
              {{
                usuario.tipo === "administrador"
                  ? $t("perfil.administrator")
                  : $t("perfil.citizen")
              }}
            </div>
          </div>
          <div>
            <label class="text-xs text-gray-500">{{
              $t("common.activo")
            }}</label>
            <div class="mt-1">
              {{ usuario.activo ? $t("common.si") : $t("common.no") }}
            </div>
          </div>
        </div>

        <div class="pt-4 border-t">
          <div class="text-xs text-gray-400">
            {{ $t("perfil.accountCreated") }}:
          </div>
          <div class="text-sm text-gray-700">{{ usuario.created_at }}</div>
          <div class="text-xs text-gray-400 mt-2">
            {{ $t("perfil.lastUpdate") }}:
          </div>
          <div class="text-sm text-gray-700">{{ usuario.updated_at }}</div>
        </div>

        <div class="pt-4 flex space-x-2">
          <button @click="volver" class="px-3 py-1 bg-gray-200 rounded">
            ← {{ $t("common.volver") }}
          </button>
          <button
            @click="editar"
            class="px-3 py-1 bg-blue-600 text-white rounded"
          >
            {{ $t("perfil.edit") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { computed } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const usuario = computed(() => authStore.usuario);

const volver = () => router.back();
const editar = () => {
  // Placeholder: ir a una ruta de edición en el futuro
  router.push({ name: "Dashboard" });
};
</script>

<style scoped></style>
