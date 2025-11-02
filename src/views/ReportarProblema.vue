<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-8">
    <div class="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {{ $t("reportes.titulo") }}
        </h1>
        <p class="text-sm sm:text-base text-gray-600">
          {{ $t("reportes.descripcion") }}
        </p>
      </div>

      <!-- Formulario -->
      <form
        @submit.prevent="submitReporte"
        class="bg-white rounded-lg shadow-sm p-4 sm:p-6"
      >
        <!-- Formulario reorganizado - Una sola columna -->
        <div class="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          <!-- Sección 1: Información del Problema -->
          <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
            <h2
              class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center"
            >
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 flex-shrink-0"
              >
                1
              </div>
              <span class="break-words">{{
                $t("reportes.informacion_problema")
              }}</span>
            </h2>

            <!-- Título del problema -->
            <div>
              <label
                for="titulo"
                class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                {{ $t("reportes.campos.titulo") }}
                <span class="text-red-500">*</span>
              </label>
              <input
                id="titulo"
                v-model="formData.titulo"
                type="text"
                required
                class="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="$t('reportes.placeholders.titulo')"
              />
            </div>

            <!-- Categoría -->
            <div>
              <label
                for="categoria"
                class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                {{ $t("reportes.campos.categoria") }}
                <span class="text-red-500">*</span>
              </label>
              <select
                id="categoria"
                v-model="formData.categoria"
                required
                class="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">
                  {{ $t("reportes.seleccionar_categoria") }}
                </option>
                <option value="alumbrado">
                  {{ $t("reportes.categorias.alumbrado") }}
                </option>
                <option value="baches">
                  {{ $t("reportes.categorias.baches") }}
                </option>
                <option value="limpieza">
                  {{ $t("reportes.categorias.limpieza") }}
                </option>
                <option value="agua">
                  {{ $t("reportes.categorias.agua") }}
                </option>
                <option value="alcantarillado">
                  {{ $t("reportes.categorias.alcantarillado") }}
                </option>
                <option value="parques">
                  {{ $t("reportes.categorias.parques") }}
                </option>
                <option value="señalizacion">
                  {{ $t("reportes.categorias.señalizacion") }}
                </option>
                <option value="seguridad">
                  {{ $t("reportes.categorias.seguridad") }}
                </option>
                <option value="ruido">
                  {{ $t("reportes.categorias.ruido") }}
                </option>
                <option value="otro">
                  {{ $t("reportes.categorias.otro") }}
                </option>
              </select>
            </div>

            <!-- Descripción -->
            <div>
              <label
                for="descripcion"
                class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                {{ $t("reportes.campos.descripcion") }}
                <span class="text-red-500">*</span>
              </label>
              <textarea
                id="descripcion"
                v-model="formData.descripcion"
                required
                rows="4"
                class="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="$t('reportes.placeholders.descripcion')"
              ></textarea>
            </div>

            <!-- Prioridad -->
            <div>
              <label
                for="prioridad"
                class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                {{ $t("reportes.campos.prioridad") }}
              </label>
              <select
                id="prioridad"
                v-model="formData.prioridad"
                class="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="baja">
                  {{ $t("reportes.prioridad.baja") }}
                </option>
                <option value="media">
                  {{ $t("reportes.prioridad.media") }}
                </option>
                <option value="alta">
                  {{ $t("reportes.prioridad.alta") }}
                </option>
                <option value="urgente">
                  {{ $t("reportes.prioridad.urgente") }}
                </option>
              </select>
            </div>

            <!-- Subir Imagen -->
            <div>
              <label
                for="imagen"
                class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                {{ $t("reportes.campos.imagen") }} (opcional)
              </label>
              <div
                class="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
              >
                <div class="space-y-1 text-center">
                  <svg
                    class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div
                    class="flex flex-col sm:flex-row text-xs sm:text-sm text-gray-600 justify-center items-center gap-1"
                  >
                    <label
                      for="imagen-input"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>{{ $t("reportes.subir_imagen") }}</span>
                      <input
                        id="imagen-input"
                        type="file"
                        class="sr-only"
                        accept="image/*"
                        @change="handleImageUpload"
                      />
                    </label>
                    <p class="sm:pl-1">{{ $t("reportes.o_arrastrar") }}</p>
                  </div>
                  <p class="text-[10px] sm:text-xs text-gray-500">
                    {{ $t("reportes.formato_imagen") }}
                  </p>
                </div>
              </div>

              <!-- Previsualización de imagen -->
              <div v-if="selectedImage" class="mt-4">
                <div class="relative inline-block">
                  <img
                    :src="selectedImage.preview"
                    :alt="selectedImage.file.name"
                    class="h-24 sm:h-32 w-auto rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    @click="removeImage"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mt-2 break-all">
                  {{ selectedImage.file.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Sección 2: Datos de Contacto (prellenados automáticamente) -->
          <div class="bg-green-50 rounded-lg p-4 sm:p-6">
            <h2
              class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center"
            >
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 flex-shrink-0"
              >
                2
              </div>
              <span class="break-words">{{
                $t("reportes.datos_contacto")
              }}</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  for="nombre"
                  class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t("reportes.campos.nombre") }}
                </label>
                <div class="relative">
                  <input
                    id="nombre"
                    v-model="formData.ciudadanoNombre"
                    type="text"
                    readonly
                    class="w-full px-3 py-2 sm:py-2.5 pl-9 sm:pl-10 text-sm sm:text-base border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-gray-600"
                  />
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  for="email"
                  class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t("reportes.campos.email") }}
                </label>
                <div class="relative">
                  <input
                    id="email"
                    v-model="formData.ciudadanoEmail"
                    type="email"
                    readonly
                    class="w-full px-3 py-2 sm:py-2.5 pl-9 sm:pl-10 text-sm sm:text-base border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-gray-600"
                  />
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  for="barrio-usuario"
                  class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t("reportes.campos.barrio_registrado") }}
                </label>
                <div class="relative">
                  <input
                    id="barrio-usuario"
                    v-model="formData.ciudadanoBarrio"
                    type="text"
                    readonly
                    class="w-full px-3 py-2 sm:py-2.5 pl-9 sm:pl-10 text-sm sm:text-base border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-gray-600"
                  />
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  for="telefono"
                  class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t("reportes.campos.telefono") }} (Opcional)
                </label>
                <div class="relative">
                  <input
                    id="telefono"
                    v-model="formData.ciudadanoTelefono"
                    type="tel"
                    class="w-full px-3 py-2 sm:py-2.5 pl-9 sm:pl-10 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :placeholder="$t('reportes.placeholders.telefono')"
                  />
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección 3: Ubicación del Problema -->
          <div class="bg-yellow-50 rounded-lg p-4 sm:p-6">
            <h2
              class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center"
            >
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 flex-shrink-0"
              >
                3
              </div>
              <span class="break-words">{{
                $t("reportes.ubicacion_problema")
              }}</span>
            </h2>

            <!-- Selector de ubicación -->
            <div class="mb-4 sm:mb-6">
              <BasicMapSelector
                :ubicacion="formData.ubicacion"
                @update:ubicacion="updateMapLocation"
              />
            </div>

            <!-- Detalles de ubicación -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  for="direccion"
                  class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t("reportes.campos.direccion") }}
                </label>
                <input
                  id="direccion"
                  v-model="formData.ubicacion.direccion"
                  type="text"
                  class="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('reportes.placeholders.direccion')"
                />
              </div>

              <div>
                <label
                  for="referencias"
                  class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  {{ $t("reportes.campos.referencias") }}
                </label>
                <input
                  id="referencias"
                  v-model="formData.ubicacion.referencias"
                  type="text"
                  class="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="$t('reportes.placeholders.referencias')"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div
          class="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end"
        >
          <button
            type="button"
            @click="resetForm"
            class="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {{ $t("common.limpiar") }}
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">{{ $t("common.enviando") }}...</span>
            <span v-else>{{ $t("reportes.enviar_reporte") }}</span>
          </button>
        </div>
      </form>

      <!-- Mensaje de éxito/error -->
      <div
        v-if="message"
        :class="{
          'bg-green-50 border-green-200 text-green-800':
            messageType === 'success',
          'bg-red-50 border-red-200 text-red-800': messageType === 'error',
        }"
        class="mt-4 sm:mt-6 p-3 sm:p-4 text-sm sm:text-base border rounded-lg"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useReportesStore } from "@/stores/reportes.store";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import BasicMapSelector from "../components/maps/BasicMapSelector.vue";

// Tipo para ubicación
interface IUbicacion {
  latitud: number;
  longitud: number;
  direccion: string;
  barrio?: string;
  sector?: string;
  referencias?: string;
}

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const reportesStore = useReportesStore();

// Estado reactivo
const loading = ref(false);
const message = ref("");
const messageType = ref<"success" | "error">("success");

// Manejo de imágenes
const selectedImage = ref<{
  file: File;
  preview: string;
} | null>(null);

// Datos del formulario
const formData = ref({
  titulo: "",
  descripcion: "",
  categoria: "",
  prioridad: "media" as "baja" | "media" | "alta" | "urgente",
  ubicacion: {
    latitud: -0.9536,
    longitud: -80.7217,
    direccion: "",
    barrio: "",
    sector: "",
    referencias: "",
  } as IUbicacion,
  ciudadanoNombre: "",
  ciudadanoEmail: "",
  ciudadanoTelefono: "",
  ciudadanoBarrio: "",
});

// Validación del formulario
const isFormValid = computed(() => {
  const form = formData.value;
  return (
    form.titulo.trim() !== "" &&
    form.descripcion.trim() !== "" &&
    form.categoria !== "" &&
    form.ubicacion.direccion.trim() !== ""
  );
});

// Inicializar datos del usuario
onMounted(async () => {
  if (authStore.user) {
    // Datos básicos del usuario
    formData.value.ciudadanoNombre =
      authStore.user.user_metadata?.full_name ||
      authStore.user.email?.split("@")[0] ||
      "";
    formData.value.ciudadanoEmail = authStore.user.email || "";
    formData.value.ciudadanoTelefono =
      authStore.user.user_metadata?.phone || "";

    // Cargar datos del usuario desde la base de datos
    if (authStore.usuario) {
      formData.value.ciudadanoNombre =
        `${authStore.usuario.nombres} ${authStore.usuario.apellidos}`.trim();
      formData.value.ciudadanoBarrio =
        authStore.usuario.barrio || t("reportes.no_especificado");

      // Pre-llenar ubicación con barrio del usuario si no hay ubicación seleccionada
      if (!formData.value.ubicacion.barrio) {
        formData.value.ubicacion.barrio = authStore.usuario.barrio || "";
        formData.value.ubicacion.sector =
          authStore.usuario.parroquia || "Manta";
      }
    }
  }
});

// Manejo de archivos - simplificado por ahora
// const handleFiles = (event: Event) => {
//   const target = event.target as HTMLInputElement
//   if (target.files) {
//     const newFiles = Array.from(target.files)
//     selectedFiles.value.push(...newFiles)
//   }
// }

// const removeFile = (index: number) => {
//   selectedFiles.value.splice(index, 1)
// }

// Enviar reporte
const submitReporte = async () => {
  console.log("submitReporte ejecutado", {
    isValid: isFormValid.value,
    formData: formData.value,
  });

  if (!isFormValid.value) {
    console.log("Formulario no válido");
    message.value = t("reportes.completar_campos");
    messageType.value = "error";
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    // Combinar título y descripción en el campo descripcion
    const descripcionCompleta = formData.value.titulo.trim()
      ? `${formData.value.titulo}\n\n${formData.value.descripcion}`
      : formData.value.descripcion;

    const reporteData = {
      categoria: formData.value.categoria as any,
      descripcion: descripcionCompleta,
      ubicacion_parroquia: formData.value.ubicacion.sector || "Manta",
      ubicacion_barrio:
        formData.value.ubicacion.barrio || t("reportes.sin_especificar"),
      ubicacion_direccion:
        formData.value.ubicacion.direccion || t("reportes.sin_especificar"),
      ubicacion_lat: formData.value.ubicacion.latitud,
      ubicacion_lng: formData.value.ubicacion.longitud,
      prioridad: formData.value.prioridad as any,
      imagen_url: null,
      respuesta_admin: null,
      fecha_resolucion: null,
    };

    console.log("Enviando reporteData:", reporteData);
    const result = await reportesStore.crearReporte(reporteData);
    console.log("Resultado del store:", result);

    if (result.success) {
      message.value = t("reportes.exito_envio");
      messageType.value = "success";
      resetForm();

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      console.error("Error del store:", result.error);
      message.value = result.error || t("reportes.error_envio");
      messageType.value = "error";
    }
  } catch (error) {
    console.error("Error enviando reporte:", error);
    const errorMessage =
      error instanceof Error ? error.message : t("reportes.error_desconocido");
    message.value = `${t("common.error")}: ${errorMessage}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
    console.log("Proceso de envío terminado");
  }
};

// Actualizar ubicación desde el selector
const updateMapLocation = (nuevaUbicacion: IUbicacion) => {
  formData.value.ubicacion = { ...nuevaUbicacion };
};

// Manejo de imágenes
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // Validar tamaño (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      message.value = t("reportes.error_tamano_imagen");
      messageType.value = "error";
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      message.value = t("reportes.error_tipo_imagen");
      messageType.value = "error";
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage.value = {
        file,
        preview: e.target?.result as string,
      };
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  selectedImage.value = null;
  // Limpiar el input
  const input = document.getElementById("imagen-input") as HTMLInputElement;
  if (input) input.value = "";
};

// Limpiar formulario
const resetForm = () => {
  formData.value.titulo = "";
  formData.value.descripcion = "";
  formData.value.categoria = "";
  formData.value.prioridad = "media";
  formData.value.ubicacion.direccion = "";
  formData.value.ubicacion.barrio = "";
  formData.value.ubicacion.sector = "";
  formData.value.ubicacion.referencias = "";
  // Resetear ubicación a Manta
  formData.value.ubicacion.latitud = -0.9536;
  formData.value.ubicacion.longitud = -80.7217;
  // Limpiar imagen
  selectedImage.value = null;
  const input = document.getElementById("imagen-input") as HTMLInputElement;
  if (input) input.value = "";
};
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
