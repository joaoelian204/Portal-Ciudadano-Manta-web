<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-6">
    <div class="max-w-3xl mx-auto px-3 sm:px-4 lg:px-8">
      <!-- Back Button -->
      <button 
        @click="volver" 
        class="mb-3 sm:mb-4 inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition-all hover:bg-gray-50 text-sm sm:text-base"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ $t("common.back") }}
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div class="flex flex-col items-center justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-3"></div>
          <p class="text-gray-600 text-sm sm:text-base">{{ $t("encuestaDetalle.loading") }}</p>
        </div>
      </div>

      <!-- Survey Content -->
      <div v-else-if="encuesta" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header compacto y responsive -->
        <div class="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 sm:p-6">
          <div class="flex items-start sm:items-center gap-3">
            <span class="text-3xl sm:text-4xl flex-shrink-0">📊</span>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight break-words text-balance">
                {{ encuesta.titulo }}
              </h1>
              <p class="text-blue-50 text-xs sm:text-sm mt-1 line-clamp-3 text-pretty">
                {{ encuesta.descripcion }}
              </p>
            </div>
            <span class="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap">
              {{ $t("encuestas.active") }}
            </span>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-4 sm:p-6">
          <!-- Mensaje de ya respondido -->
          <div v-if="yaRespondio" class="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div class="flex items-center gap-2 text-blue-800">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-xs sm:text-sm font-medium">{{ $t("encuestaDetalle.alreadyResponded") }}</span>
            </div>
          </div>

          <!-- Opción Múltiple -->
          <div v-if="encuesta.tipo === 'opcion_multiple'" class="space-y-4 sm:space-y-5">
            <!-- Múltiples preguntas -->
            <div
              v-for="(pregunta, preguntaIndex) in encuesta.opciones"
              :key="preguntaIndex"
              class="bg-gray-50 rounded-lg p-3 sm:p-4 border-2 border-gray-200"
            >
              <!-- Texto de la pregunta -->
              <h3 class="text-sm sm:text-base font-bold text-gray-800 mb-3 flex items-start gap-2 leading-relaxed">
                <span class="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm mt-0.5">
                  {{ preguntaIndex + 1 }}
                </span>
                <span class="break-words text-pretty flex-1">{{ pregunta.pregunta }}</span>
              </h3>
              
              <!-- Opciones de esta pregunta -->
              <div class="space-y-2 pl-0 sm:pl-2">
                <div
                  v-for="(opcion, opcionIndex) in pregunta.opciones"
                  :key="opcionIndex"
                  class="flex items-center p-2.5 sm:p-3 border-2 rounded-lg transition-all min-h-[48px]"
                  :class="[
                    opcionSeleccionada[preguntaIndex] === opcion ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white',
                    !yaRespondio ? 'cursor-pointer hover:border-blue-400 hover:bg-blue-50 active:scale-[0.98]' : 'opacity-75'
                  ]"
                  @click="!yaRespondio && seleccionarOpcionDePregunta(preguntaIndex, opcion)"
                >
                  <input
                    type="radio"
                    :id="`pregunta-${preguntaIndex}-opcion-${opcionIndex}`"
                    :name="`pregunta-${preguntaIndex}`"
                    :value="opcion"
                    v-model="opcionSeleccionada[preguntaIndex]"
                    :disabled="yaRespondio"
                    class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-75 flex-shrink-0"
                  />
                  <label
                    :for="`pregunta-${preguntaIndex}-opcion-${opcionIndex}`"
                    class="ml-2 sm:ml-3 text-gray-700 font-medium flex-1 text-sm sm:text-base break-words text-pretty leading-relaxed"
                    :class="!yaRespondio ? 'cursor-pointer' : 'cursor-not-allowed'"
                  >
                    <span class="text-blue-600 font-bold mr-1 sm:mr-2">{{ String.fromCharCode(65 + opcionIndex) }}.</span>
                    {{ opcion }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Calificación (1-5) -->
          <div v-else-if="encuesta.tipo === 'calificacion'">
            <!-- Mostrar la pregunta específica si existe -->
            <div v-if="encuesta.opciones && typeof encuesta.opciones === 'string'" class="mb-4 sm:mb-6">
              <h3 class="text-base sm:text-lg font-semibold text-gray-800 text-pretty leading-relaxed">
                {{ encuesta.opciones }}
              </h3>
            </div>
            <!-- Grid de estrellas optimizado para móvil -->
            <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4">
              <button
                v-for="num in 5"
                :key="num"
                @click="!yaRespondio && seleccionarCalificacion(num)"
                :disabled="yaRespondio"
                class="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg transition-all border-2 disabled:opacity-75 disabled:cursor-not-allowed min-w-[56px] sm:min-w-[64px] active:scale-95"
                :class="calificacion === num 
                  ? 'border-blue-500 bg-blue-50 scale-105 sm:scale-110 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'"
              >
                <svg
                  class="w-8 h-8 sm:w-10 sm:h-10 transition-colors"
                  :class="calificacion === num ? 'text-blue-600' : 'text-gray-400'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span
                  class="text-xs sm:text-sm font-semibold"
                  :class="calificacion === num ? 'text-blue-600' : 'text-gray-500'"
                >
                  {{ num }}
                </span>
              </button>
            </div>
            <div class="flex justify-between text-xs sm:text-sm text-gray-600 px-1 sm:px-2 mt-2">
              <span>Muy malo</span>
              <span>Excelente</span>
            </div>
          </div>

          <!-- Pregunta Abierta (fallback) -->
          <div v-else>
            <!-- Mostrar la pregunta específica si existe -->
            <div v-if="encuesta.opciones && typeof encuesta.opciones === 'string'" class="mb-3 sm:mb-4">
              <h3 class="text-base sm:text-lg font-semibold text-gray-800 text-pretty leading-relaxed">
                {{ encuesta.opciones }}
              </h3>
            </div>
            <textarea
              v-model="respuestaLibre"
              rows="5"
              :disabled="yaRespondio"
              class="w-full border-2 border-gray-200 rounded-lg p-3 sm:p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-gray-700 text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-75 leading-relaxed"
              :placeholder="yaRespondio ? '' : $t('encuestaDetalle.placeholder')"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ respuestaLibre.length }} {{ $t("encuestaDetalle.characters") }}
            </p>
          </div>

          <!-- Success/Error Message -->
          <div v-if="message" class="mt-4 p-3 rounded-lg" :class="messageClass">
            <div class="flex items-start gap-2">
              <svg v-if="messageType === 'success'" class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-xs sm:text-sm font-medium break-words text-pretty flex-1 leading-relaxed">{{ message }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button
              v-if="!yaRespondio"
              @click="enviarRespuesta"
              :disabled="submitting || !puedeEnviar"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 text-sm sm:text-base min-h-[48px] active:scale-[0.98]"
            >
              <svg v-if="!submitting" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <div v-else class="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              {{ submitting ? $t("encuestaDetalle.submitting") : $t("encuestaDetalle.submitResponse") }}
            </button>
            
            <button
              @click="volver"
              class="px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm sm:text-base min-h-[48px] active:scale-[0.98]"
              :class="yaRespondio ? 'flex-1' : ''"
            >
              {{ $t("common.back") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div class="text-center py-6 sm:py-8">
          <div class="text-5xl sm:text-6xl mb-4">🔍</div>
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-balance">{{ $t("encuestaDetalle.notFound") }}</h2>
          <p class="text-sm sm:text-base text-gray-600 mb-6 text-pretty max-w-md mx-auto">La encuesta que buscas no existe o fue eliminada.</p>
          <button 
            @click="volver" 
            class="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[48px] active:scale-[0.98]"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a encuestas
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useEncuestasStore } from "@/stores/encuestas.store";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const encuestasStore = useEncuestasStore();
const authStore = useAuthStore();

const id = String(route.params.id || "");

// Usar computed para mantener la reactividad
const encuesta = computed(() => encuestasStore.encuestaActual);
const loading = computed(() => encuestasStore.loading);

const respuestaLibre = ref("");
const opcionSeleccionada = ref<string[]>([]); // Array para múltiples respuestas
const calificacion = ref(0);
const submitting = ref(false);
const message = ref("");
const messageType = ref<'success' | 'error'>('success');
const yaRespondio = ref(false);
const respuestaAnterior = ref<any>(null);

// Computed para la clase del mensaje
const messageClass = computed(() => {
  if (messageType.value === 'success') {
    return 'bg-green-100 text-green-800 border border-green-300';
  }
  return 'bg-red-100 text-red-800 border border-red-300';
});

// Computed para validar si se puede enviar la respuesta
const puedeEnviar = computed(() => {
  if (!encuesta.value) return false;
  
  if (encuesta.value.tipo === 'opcion_multiple') {
    // Verificar que todas las preguntas estén respondidas
    return opcionSeleccionada.value.length === encuesta.value.opciones?.length &&
           opcionSeleccionada.value.every(r => r && r.trim() !== '');
  } else if (encuesta.value.tipo === 'calificacion') {
    return calificacion.value > 0;
  } else {
    return respuestaLibre.value.trim() !== '';
  }
});

const volver = () => router.back();

const seleccionarOpcionDePregunta = (preguntaIndex: number, opcion: string) => {
  opcionSeleccionada.value[preguntaIndex] = opcion;
};

const seleccionarCalificacion = (num: number) => {
  calificacion.value = num;
};

onMounted(async () => {
  if (!id) return;
  await encuestasStore.fetchEncuesta(id);
  
  // Inicializar array de respuestas para opción múltiple
  if (encuesta.value?.tipo === 'opcion_multiple' && encuesta.value.opciones) {
    opcionSeleccionada.value = new Array(encuesta.value.opciones.length).fill('');
  }
  
  // Verificar si el usuario ya respondió esta encuesta
  if (authStore.user) {
    yaRespondio.value = await encuestasStore.verificarYaRespondio(id);
    
    if (yaRespondio.value) {
      // Obtener la respuesta anterior
      respuestaAnterior.value = await encuestasStore.obtenerRespuestaUsuario(id);
      
      // Cargar la respuesta anterior en los campos correspondientes
      if (respuestaAnterior.value) {
        const respuestaData = respuestaAnterior.value.respuestaLibre || respuestaAnterior.value;
        
        if (encuesta.value?.tipo === 'opcion_multiple') {
          // Si es un array, usarlo directamente; si no, convertirlo
          opcionSeleccionada.value = Array.isArray(respuestaData) ? respuestaData : [respuestaData];
        } else if (encuesta.value?.tipo === 'calificacion') {
          calificacion.value = Number(respuestaData);
        } else {
          respuestaLibre.value = respuestaData;
        }
      }
    }
  }
});

const enviarRespuesta = async () => {
  if (!authStore.user) {
    // Redirigir a login manteniendo redirect
    return router.push({ name: "Login", query: { redirect: route.fullPath } });
  }

  submitting.value = true;
  message.value = "";

  try {
    let payload: any = {};
    
    // Determinar qué tipo de respuesta enviar según el tipo de encuesta
    if (encuesta.value?.tipo === 'opcion_multiple') {
      payload = { respuestaLibre: opcionSeleccionada.value };
    } else if (encuesta.value?.tipo === 'calificacion') {
      payload = { respuestaLibre: String(calificacion.value) };
    } else {
      payload = { respuestaLibre: respuestaLibre.value };
    }
    
    const result = await encuestasStore.responderEncuesta(id, payload);
    if (result.success) {
      messageType.value = 'success';
      message.value = t("encuestaDetalle.responseSuccess");
      
      // Marcar como ya respondido
      yaRespondio.value = true;
      respuestaAnterior.value = payload;
    } else {
      messageType.value = 'error';
      message.value = result.error || t("encuestaDetalle.responseError");
    }
  } catch (err: any) {
    messageType.value = 'error';
    message.value = t("encuestaDetalle.responseError");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped></style>
