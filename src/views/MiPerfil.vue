<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header con navegación -->
      <div class="mb-8 flex items-center justify-between">
        <button 
          @click="volver" 
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-white group"
        >
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-semibold">{{ $t("common.volver") }}</span>
        </button>

        <div v-if="!modoEdicion && usuario" class="flex gap-2">
          <button
            @click="activarModoEdicion"
            class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2 hover:from-purple-700 hover:to-pink-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Perfil
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!usuario" class="flex flex-col items-center justify-center py-32">
        <div class="relative">
          <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600"></div>
          <div class="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-purple-400 opacity-20"></div>
        </div>
        <p class="text-gray-600 text-lg mt-6 font-medium">Cargando perfil...</p>
      </div>

      <!-- Perfil Content -->
      <div v-else>
        <!-- Vista de Lectura -->
        <div v-if="!modoEdicion" class="space-y-6">
          <!-- Header del Perfil -->
          <div class="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-xl overflow-hidden">
          <div class="p-8 sm:p-10">
            <div class="flex flex-col sm:flex-row items-center gap-6">
              <!-- Avatar -->
              <div class="relative">
                <div class="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center ring-4 ring-white/30">
                  <span class="text-5xl">
                    {{ usuario.tipo === 'administrador' ? '👨‍💼' : '👤' }}
                  </span>
                </div>
                <div class="absolute -bottom-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg">
                  <span class="text-xs font-bold text-blue-600">
                    {{ usuario.tipo === 'administrador' ? '⭐ ADMIN' : '✓ CIUDADANO' }}
                  </span>
                </div>
              </div>

              <!-- Info Principal -->
              <div class="flex-1 text-center sm:text-left">
                <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {{ usuario.nombres }} {{ usuario.apellidos }}
                </h1>
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-white/90">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm">{{ usuario.email }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <span class="text-sm">{{ usuario.cedula }}</span>
                  </div>
                </div>
              </div>

              <!-- Estado -->
              <div class="sm:ml-auto">
                <div :class="[
                  'px-4 py-2 rounded-full font-semibold text-sm shadow-lg',
                  usuario.activo 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                ]">
                  {{ usuario.activo ? '✓ ' + $t("common.activo") : '✗ Inactivo' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Detallada -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Información Personal -->
          <div class="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ $t("perfil.title") }}
              </h2>
            </div>
            <div class="p-6 space-y-4">
              <!-- Nombres y Apellidos -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <label class="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                    {{ $t("perfil.name") }}
                  </label>
                  <div class="mt-2 text-lg font-semibold text-gray-900">{{ usuario.nombres }}</div>
                </div>
                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-cyan-500">
                  <label class="text-xs font-semibold text-cyan-700 uppercase tracking-wide">
                    {{ $t("perfil.lastName") }}
                  </label>
                  <div class="mt-2 text-lg font-semibold text-gray-900">{{ usuario.apellidos }}</div>
                </div>
              </div>

              <!-- Email y Cédula -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <label class="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                    {{ $t("perfil.email") }}
                  </label>
                  <div class="mt-2 text-sm font-medium text-gray-900 break-all">{{ usuario.email }}</div>
                </div>
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-pink-500">
                  <label class="text-xs font-semibold text-pink-700 uppercase tracking-wide">
                    {{ $t("perfil.cedula") }}
                  </label>
                  <div class="mt-2 text-lg font-semibold text-gray-900">{{ usuario.cedula }}</div>
                </div>
              </div>

              <!-- Tipo de Usuario -->
              <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <label class="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                  {{ $t("perfil.userType") }}
                </label>
                <div class="mt-2 flex items-center gap-2">
                  <span class="text-2xl">{{ usuario.tipo === 'administrador' ? '👨‍💼' : '👤' }}</span>
                  <span class="text-lg font-bold text-gray-900">
                    {{ usuario.tipo === 'administrador' ? $t("perfil.administrator") : $t("perfil.citizen") }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ubicación y Fechas -->
          <div class="space-y-6">
            <!-- Ubicación -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  📍 Ubicación
                </h2>
              </div>
              <div class="p-6 space-y-4">
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
                  <label class="text-xs font-semibold text-green-700 uppercase tracking-wide">
                    {{ $t("perfil.parish") }}
                  </label>
                  <div class="mt-2 text-lg font-semibold text-gray-900">🏘️ {{ usuario.parroquia }}</div>
                </div>
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500">
                  <label class="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                    {{ $t("perfil.neighborhood") }}
                  </label>
                  <div class="mt-2 text-lg font-semibold text-gray-900">🏠 {{ usuario.barrio }}</div>
                </div>
              </div>
            </div>

            <!-- Información de Cuenta -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ⏰ Cuenta
                </h2>
              </div>
              <div class="p-6 space-y-4">
                <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4">
                  <label class="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ $t("perfil.accountCreated") }}
                  </label>
                  <div class="mt-2 text-sm font-medium text-gray-900">
                    {{ formatDate(usuario.created_at) }}
                  </div>
                </div>
                <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4">
                  <label class="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ $t("perfil.lastUpdate") }}
                  </label>
                  <div class="mt-2 text-sm font-medium text-gray-900">
                    {{ formatDate(usuario.updated_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Modo Edición -->
        <div v-else class="space-y-6">
          <form @submit.prevent="guardarCambios" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-purple-200">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editando Perfil
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nombres -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  Nombres *
                </label>
                <input
                  v-model="formData.nombres"
                  type="text"
                  required
                  class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Ingresa tus nombres"
                />
              </div>

              <!-- Apellidos -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  v-model="formData.apellidos"
                  type="text"
                  required
                  class="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="Ingresa tus apellidos"
                />
              </div>

              <!-- Parroquia -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  Parroquia *
                </label>
                <select
                  v-model="formData.parroquia"
                  required
                  class="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                >
                  <option value="">Selecciona una parroquia</option>
                  <option value="Tarqui">Tarqui</option>
                  <option value="Eloy Alfaro">Eloy Alfaro</option>
                  <option value="Manta">Manta</option>
                  <option value="Los Esteros">Los Esteros</option>
                  <option value="San Mateo">San Mateo</option>
                </select>
              </div>

              <!-- Barrio -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  Barrio *
                </label>
                <input
                  v-model="formData.barrio"
                  type="text"
                  required
                  class="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Ingresa tu barrio"
                />
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="cancelarEdicion"
                :disabled="guardando"
                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="guardando"
                class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!guardando" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const usuario = computed(() => authStore.usuario);
const modoEdicion = ref(false);
const guardando = ref(false);

// Formulario de edición
const formData = ref({
  nombres: "",
  apellidos: "",
  parroquia: "",
  barrio: ""
});

const volver = () => router.back();

const activarModoEdicion = () => {
  if (usuario.value) {
    formData.value = {
      nombres: usuario.value.nombres,
      apellidos: usuario.value.apellidos,
      parroquia: usuario.value.parroquia,
      barrio: usuario.value.barrio
    };
    modoEdicion.value = true;
  }
};

const cancelarEdicion = () => {
  modoEdicion.value = false;
};

const guardarCambios = async () => {
  if (!usuario.value) return;
  
  guardando.value = true;
  
  try {
    const { error } = await supabase
      .from('usuarios')
      // @ts-ignore - Problema temporal con tipos de Supabase
      .update({
        nombres: formData.value.nombres,
        apellidos: formData.value.apellidos,
        parroquia: formData.value.parroquia,
        barrio: formData.value.barrio
      })
      .eq('id', usuario.value.id);

    if (error) throw error;

    // Recargar la página para actualizar los datos
    window.location.reload();
  } catch (error: any) {
    console.error('Error al actualizar perfil:', error);
    alert('❌ Error al actualizar el perfil: ' + error.message);
  } finally {
    guardando.value = false;
  }
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}
</style>
