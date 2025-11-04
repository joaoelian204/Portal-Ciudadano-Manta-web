<script setup lang="ts">
import loginBg from "@/assets/login/login.jpg";
import { supabase } from "@/lib/supabase";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

// Estado del formulario
const newPassword = ref("");
const confirmPassword = ref("");
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showForm = ref(false); // Controla si se muestra el formulario
const recoveryCode = ref(""); // Código de recuperación de la URL

// Validaciones de contraseña
const hasMinLength = computed(() => newPassword.value.length >= 8);
const hasUpperCase = computed(() => /[A-Z]/.test(newPassword.value));
const hasNumber = computed(() => /[0-9]/.test(newPassword.value));
const hasSpecialChar = computed(() =>
  /[!@#$%^&*(),.?":{}|<>]/.test(newPassword.value)
);
const passwordsMatch = computed(
  () =>
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value
);

const isValidPassword = computed(
  () =>
    hasMinLength.value &&
    hasUpperCase.value &&
    hasNumber.value &&
    hasSpecialChar.value &&
    passwordsMatch.value
);

// Verificar si hay un código de recuperación válido en la URL
onMounted(async () => {
  try {
    // Verificar si hay un código de recuperación en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log('🔑 Código de recuperación detectado en URL');
      // Guardar el código sin establecer sesión
      recoveryCode.value = code;
      // Mostrar el formulario inmediatamente
      showForm.value = true;
    } else {
      // Si no hay código, error
      errorMessage.value = t("resetPassword.errors.noSession");
      setTimeout(() => {
        router.push({ name: "Login" });
      }, 3000);
    }
  } catch (error) {
    console.error('❌ Error al verificar código de recuperación:', error);
    errorMessage.value = t("resetPassword.errors.noSession");
    setTimeout(() => {
      router.push({ name: "Login" });
    }, 3000);
  }
});

// Restablecer contraseña usando el código de recuperación
const handleResetPassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!isValidPassword.value) {
    errorMessage.value = t("resetPassword.errors.invalidPassword");
    return;
  }

  if (!recoveryCode.value) {
    errorMessage.value = t("resetPassword.errors.noSession");
    return;
  }

  isLoading.value = true;

  try {
    // Primero verificar el código de recuperación e intercambiarlo por una sesión temporal
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: recoveryCode.value,
      type: 'recovery',
    });

    if (verifyError) {
      console.error('❌ Error al verificar código:', verifyError);
      errorMessage.value = t("resetPassword.errors.updateFailed");
      return;
    }

    // Ahora actualizar la contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (updateError) {
      console.error('❌ Error al actualizar contraseña:', updateError);
      errorMessage.value = t("resetPassword.errors.updateFailed");
      return;
    }

    // Éxito - cerrar sesión inmediatamente y redirigir al login
    successMessage.value = t("resetPassword.success");

    // Cerrar sesión inmediatamente para no quedar autenticado
    await supabase.auth.signOut();
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push({ name: "Login", query: { passwordReset: "true" } });
    }, 2000);
  } catch (error) {
    console.error('❌ Error general:', error);
    errorMessage.value = t("resetPassword.errors.updateFailed");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8"
  >
    <!-- Imagen de fondo con overlay gradiente -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${loginBg})` }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-900/35 via-indigo-900/25 to-purple-900/35"
      ></div>
    </div>

    <!-- Contenido del formulario -->
    <div v-if="showForm" class="relative z-10 max-w-md w-full space-y-6">
      <!-- Formulario -->
      <form
        class="space-y-5 bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20"
        @submit.prevent="handleResetPassword"
      >
        <!-- Título -->
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <div
              class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900">
            {{ t("resetPassword.title") }}
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ t("resetPassword.subtitle") }}
          </p>
        </div>

        <!-- Mensaje de error -->
        <div
          v-if="errorMessage"
          class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake"
          role="alert"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <p class="text-sm font-medium text-red-700">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Mensaje de éxito -->
        <div
          v-if="successMessage"
          class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg"
          role="alert"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <p class="text-sm font-medium text-green-700">
              {{ successMessage }}
            </p>
          </div>
        </div>

        <!-- Nueva contraseña -->
        <div>
          <label
            for="new-password"
            class="block text-sm font-semibold text-gray-700 mb-2"
          >
            {{ t("resetPassword.newPassword") }}
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <i class="fas fa-lock text-gray-400"></i>
            </div>
            <input
              id="new-password"
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              :placeholder="t('resetPassword.newPasswordPlaceholder')"
              class="block w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none"
              @input="errorMessage = ''"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            >
              <i
                :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                class="text-lg"
              ></i>
            </button>
          </div>
        </div>

        <!-- Confirmar contraseña -->
        <div>
          <label
            for="confirm-password"
            class="block text-sm font-semibold text-gray-700 mb-2"
          >
            {{ t("resetPassword.confirmPassword") }}
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <i class="fas fa-lock text-gray-400"></i>
            </div>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :placeholder="t('resetPassword.confirmPasswordPlaceholder')"
              class="block w-full pl-10 pr-12 py-3 border-2 rounded-xl transition-all duration-200 outline-none"
              :class="
                confirmPassword && passwordsMatch
                  ? 'border-green-500 focus:ring-4 focus:ring-green-500/20 focus:border-green-500'
                  : confirmPassword && !passwordsMatch
                  ? 'border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-gray-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500'
              "
              @input="errorMessage = ''"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            >
              <i
                :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                class="text-lg"
              ></i>
            </button>
          </div>
          <!-- Mensaje de coincidencia -->
          <div v-if="confirmPassword" class="mt-2">
            <p
              v-if="passwordsMatch"
              class="text-sm text-green-600 flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ t("resetPassword.passwordsMatch") }}
            </p>
            <p v-else class="text-sm text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ t("resetPassword.passwordsDontMatch") }}
            </p>
          </div>
        </div>

        <!-- Requisitos de contraseña -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p class="text-sm font-semibold text-blue-900 mb-2">
            {{ t("resetPassword.passwordRequirements") }}
          </p>
          <ul class="space-y-1.5">
            <li class="flex items-center gap-2 text-sm">
              <svg
                class="w-4 h-4"
                :class="hasMinLength ? 'text-green-600' : 'text-blue-600'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  v-if="hasMinLength"
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
                <path
                  v-else
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                :class="
                  hasMinLength ? 'text-green-700 font-medium' : 'text-blue-700'
                "
              >
                {{ t("resetPassword.minLength") }}
              </span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              <svg
                class="w-4 h-4"
                :class="hasUpperCase ? 'text-green-600' : 'text-blue-600'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  v-if="hasUpperCase"
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
                <path
                  v-else
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                :class="
                  hasUpperCase ? 'text-green-700 font-medium' : 'text-blue-700'
                "
              >
                {{ t("resetPassword.upperCase") }}
              </span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              <svg
                class="w-4 h-4"
                :class="hasNumber ? 'text-green-600' : 'text-blue-600'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  v-if="hasNumber"
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
                <path
                  v-else
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                :class="
                  hasNumber ? 'text-green-700 font-medium' : 'text-blue-700'
                "
              >
                {{ t("resetPassword.number") }}
              </span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              <svg
                class="w-4 h-4"
                :class="hasSpecialChar ? 'text-green-600' : 'text-blue-600'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  v-if="hasSpecialChar"
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
                <path
                  v-else
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                :class="
                  hasSpecialChar
                    ? 'text-green-700 font-medium'
                    : 'text-blue-700'
                "
              >
                {{ t("resetPassword.specialChar") }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Botón de submit -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isLoading || !isValidPassword"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span v-if="!isLoading" class="flex items-center">
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ t("resetPassword.submit") }}
            </span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ t("resetPassword.loading") }}
            </span>
          </button>
        </div>

        <!-- Volver al login -->
        <div class="text-center pt-2">
          <router-link
            :to="{ name: 'Login' }"
            class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition duration-150 hover:underline"
          >
            {{ t("resetPassword.backToLogin") }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Animación de shake para errores */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.5s;
}
</style>
