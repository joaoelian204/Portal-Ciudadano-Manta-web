<template>
  <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
    <!-- Imagen del servicio -->
    <div class="flex justify-center mb-5">
      <div class="">
        <img :src="imageUrl" :alt="title" class="w-70 h-70 object-cover" />
      </div>
    </div>

    <!-- Contenido -->
    <div class="text-center space-y-3">
      <!-- Badge de categoría -->
      <div class="flex justify-center mb-3">
        <span :class="['px-3 py-1 text-xs font-semibold rounded-full uppercase', badgeClass]">
          {{ categoryText }}
        </span>
      </div>

      <!-- Título -->
      <h3 class="text-xl font-bold text-gray-800">
        {{ title }}
      </h3>

      <!-- Descripción -->
      <p class="text-gray-600 text-sm leading-relaxed">
        {{ description }}
      </p>

      <!-- Línea decorativa -->
      <div class="flex justify-center pt-3">
        <div :class="['h-1 w-20 rounded-full', lineClass]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  gradientColor: "blue" | "green" | "purple";
  isVisible: boolean;
}

const props = defineProps<Props>();


// Badge color
const badgeClass = computed(() => {
  const badges = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return badges[props.gradientColor];
});

// Línea decorativa
const lineClass = computed(() => {
  const lines = {
    blue: "bg-gradient-to-r from-blue-500 to-cyan-500",
    green: "bg-gradient-to-r from-emerald-500 to-teal-500",
    purple: "bg-gradient-to-r from-purple-500 to-pink-500",
  };
  return lines[props.gradientColor];
});

// Texto de categoría
const categoryText = computed(() => {
  const categories = {
    blue: "SERVICIOS",
    green: "PARTICIPACIÓN",
    purple: "INNOVACIÓN",
  };
  return categories[props.gradientColor];
});
</script>
