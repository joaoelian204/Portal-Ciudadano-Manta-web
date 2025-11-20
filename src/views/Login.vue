<script setup lang="ts">
import loginBg from "@/assets/login/login.jpg";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";

import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

// Verificar si viene desde registro o después de verificar email
const showEmailVerificationNotice = ref(false);
const showEmailVerifiedSuccess = ref(false);
const showPasswordResetSuccess = ref(false);

// Debug: Verificar que la imagen se carga
onMounted(() => {
  console.log("🖼️ URL de imagen de fondo:", loginBg);

  // Cargar datos de bloqueo
  cargarDatosBloqueo();

  // Mostrar notificación si viene desde registro
  const registered = router.currentRoute.value.query.registered;
  if (registered === "true") {
    showEmailVerificationNotice.value = true;
    // Limpiar el query param
    router.replace({ name: "Login" });
    // La notificación se cierra solo manualmente
  }

  // Mostrar éxito si viene después de verificar email
  const verified = router.currentRoute.value.query.verified;
  if (verified === "true") {
    showEmailVerifiedSuccess.value = true;
    // Limpiar el query param
    router.replace({ name: "Login" });
    // Cierre automático después de 6 segundos
    setTimeout(() => {
      showEmailVerifiedSuccess.value = false;
    }, 6000);
  }

  // Mostrar éxito si viene después de resetear contraseña
  const passwordReset = router.currentRoute.value.query.passwordReset;
  if (passwordReset === "true") {
    showPasswordResetSuccess.value = true;
    // Limpiar el query param
    router.replace({ name: "Login" });
    // Cierre automático después de 6 segundos
    setTimeout(() => {
      showPasswordResetSuccess.value = false;
    }, 6000);
  }
});

// Estado del formulario
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);

// Modal de recuperación de contraseña
const showForgotPasswordModal = ref(false);
const recoveryEmail = ref("");
const isRecoveringPassword = ref(false);
const passwordRecoveryError = ref("");
const passwordRecoverySuccess = ref(false);

// Modal de recuperación de correo
const showForgotEmailModal = ref(false);
const cedula = ref("");
const isSearchingEmail = ref(false);
const emailSearchError = ref("");
const foundUserData = ref<any>(null);

// Usar el estado del store
const isLoading = computed(() => authStore.loading);
const errorMessage = ref("");

// Sistema de bloqueo por intentos fallidos
const INTENTOS_MAXIMOS = 3;
const intentosFallidos = ref(0);
const bloqueosAcumulados = ref(0);
const estaBloqueado = ref(false);
const tiempoRestanteBloqueo = ref(0);
let intervaloTiempo: number | null = null;

// Cargar datos de bloqueo desde localStorage y sessionStorage
const cargarDatosBloqueo = () => {
  // Intentar cargar desde localStorage primero
  let datosGuardados = localStorage.getItem("loginBloqueo");
  
  // Si no hay en localStorage, intentar desde sessionStorage (navegador)
  if (!datosGuardados) {
    datosGuardados = sessionStorage.getItem("loginBloqueo");
  }
  
  if (datosGuardados) {
    const datos = JSON.parse(datosGuardados);
    const ahora = Date.now();
    
    if (datos.tiempoDesbloqueo && ahora < datos.tiempoDesbloqueo) {
      // Aún está bloqueado
      estaBloqueado.value = true;
      intentosFallidos.value = datos.intentosFallidos || 0;
      bloqueosAcumulados.value = datos.bloqueosAcumulados || 0;
      tiempoRestanteBloqueo.value = Math.ceil((datos.tiempoDesbloqueo - ahora) / 1000);
      iniciarContadorBloqueo();
    } else {
      // El bloqueo ya expiró
      intentosFallidos.value = datos.intentosFallidos || 0;
      bloqueosAcumulados.value = datos.bloqueosAcumulados || 0;
    }
  }
};

// Guardar datos de bloqueo en localStorage y sessionStorage
const guardarDatosBloqueo = () => {
  const datos = {
    intentosFallidos: intentosFallidos.value,
    bloqueosAcumulados: bloqueosAcumulados.value,
    tiempoDesbloqueo: estaBloqueado.value ? Date.now() + (tiempoRestanteBloqueo.value * 1000) : null,
    // Agregar identificador de navegador para rastreo
    browserId: generarIdentificadorNavegador()
  };
  
  const datosString = JSON.stringify(datos);
  
  // Guardar en ambos almacenamientos para mayor persistencia
  localStorage.setItem("loginBloqueo", datosString);
  sessionStorage.setItem("loginBloqueo", datosString);
  
  // También intentar guardar en cookies como respaldo
  try {
    document.cookie = `loginBloqueo=${encodeURIComponent(datosString)}; max-age=${60 * 60 * 24}; path=/; SameSite=Strict`;
  } catch (e) {
    console.warn("No se pudo guardar cookie de bloqueo");
  }
};

// Generar un identificador único del navegador
const generarIdentificadorNavegador = () => {
  // Intentar obtener identificador existente
  let browserId = localStorage.getItem("browserId") || sessionStorage.getItem("browserId");
  
  if (!browserId) {
    // Crear identificador basado en características del navegador
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const txt = 'Portal Ciudadano Manta';
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText(txt, 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      canvas.toDataURL()
    ].join('|');
    
    // Generar hash simple
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    browserId = 'browser_' + Math.abs(hash).toString(36);
    
    // Guardar en ambos almacenamientos
    localStorage.setItem("browserId", browserId);
    sessionStorage.setItem("browserId", browserId);
  }
  
  return browserId;
};

// Iniciar contador de tiempo de bloqueo
const iniciarContadorBloqueo = () => {
  if (intervaloTiempo) clearInterval(intervaloTiempo);
  
  intervaloTiempo = setInterval(() => {
    tiempoRestanteBloqueo.value--;
    
    if (tiempoRestanteBloqueo.value <= 0) {
      desbloquearFormulario();
    }
  }, 1000);
};

// Desbloquear el formulario
const desbloquearFormulario = () => {
  estaBloqueado.value = false;
  tiempoRestanteBloqueo.value = 0;
  if (intervaloTiempo) {
    clearInterval(intervaloTiempo);
    intervaloTiempo = null;
  }
  guardarDatosBloqueo();
};

// Bloquear el formulario
const bloquearFormulario = () => {
  bloqueosAcumulados.value++;
  const tiempoBloqueoMinutos = bloqueosAcumulados.value * 5;
  tiempoRestanteBloqueo.value = tiempoBloqueoMinutos * 60;
  estaBloqueado.value = true;
  
  errorMessage.value = t("login.errors.accountLocked", { 
    minutos: tiempoBloqueoMinutos,
    intentos: INTENTOS_MAXIMOS 
  });
  
  guardarDatosBloqueo();
  iniciarContadorBloqueo();
};

// Registrar intento fallido
const registrarIntentoFallido = () => {
  intentosFallidos.value++;
  
  if (intentosFallidos.value >= INTENTOS_MAXIMOS) {
    intentosFallidos.value = 0;
    bloquearFormulario();
  } else {
    const intentosRestantes = INTENTOS_MAXIMOS - intentosFallidos.value;
    errorMessage.value = t("login.errors.invalidCredentialsWithAttempts", { 
      intentos: intentosRestantes 
    });
  }
  
  guardarDatosBloqueo();
};

// Resetear intentos fallidos (al login exitoso)
const resetearIntentos = () => {
  intentosFallidos.value = 0;
  bloqueosAcumulados.value = 0;
  estaBloqueado.value = false;
  tiempoRestanteBloqueo.value = 0;
  if (intervaloTiempo) {
    clearInterval(intervaloTiempo);
    intervaloTiempo = null;
  }
  
  // Limpiar todos los almacenamientos
  localStorage.removeItem("loginBloqueo");
  sessionStorage.removeItem("loginBloqueo");
  
  // Limpiar cookie
  try {
    document.cookie = "loginBloqueo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } catch (e) {
    console.warn("No se pudo limpiar cookie de bloqueo");
  }
};

// Formatear tiempo restante
const tiempoFormateado = computed(() => {
  const minutos = Math.floor(tiempoRestanteBloqueo.value / 60);
  const segundos = tiempoRestanteBloqueo.value % 60;
  return `${minutos}:${segundos.toString().padStart(2, '0')}`;
});

// Validación del formulario
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (): boolean => {
  if (!email.value || !password.value) {
    errorMessage.value = t("login.errors.emptyFields");
    return false;
  }

  if (!validateEmail(email.value)) {
    errorMessage.value = t("login.errors.invalidEmail");
    return false;
  }

  if (password.value.length < 6) {
    errorMessage.value = t("login.errors.shortPassword");
    return false;
  }

  return true;
};

// Manejo del submit con Supabase
const handleLogin = async () => {
  errorMessage.value = "";

  // Verificar si está bloqueado
  if (estaBloqueado.value) {
    errorMessage.value = t("login.errors.accountLocked", { 
      minutos: Math.ceil(bloqueosAcumulados.value * 5),
      intentos: INTENTOS_MAXIMOS 
    });
    return;
  }

  if (!validateForm()) {
    return;
  }

  try {
    // Login con Supabase
    const result = await authStore.login(email.value, password.value);

    // Validación de usuario y contraseña incorrectos
    if (result?.error) {
      // Registrar intento fallido
      registrarIntentoFallido();
      
      if (result.error.message?.toLowerCase().includes("user")) {
        return;
      }
      if (result.error.message?.toLowerCase().includes("password")) {
        return;
      }
      if (result.error.message?.toLowerCase().includes("credentials")) {
        errorMessage.value =
          t("login.errors.invalidCredentials") || "Credenciales incorrectas";
        return;
      }
      if (result.error.message?.toLowerCase().includes("email not confirmed")) {
        // Consultar si es administrador
        const userId = authStore.user?.id;
        if (userId) {
          const { data: admin } = await supabase
            .from("administradores")
            .select("nombres")
            .eq("id", userId)
            .single();
          if (admin) {
            // Permitir acceso aunque el correo no esté confirmado
            const nombreAdmin = (admin as { nombres?: string }).nombres || "";
            router.push({ name: "AdminPanel", query: { nombre: nombreAdmin } });
            return;
          }
        }
        errorMessage.value =
          t("login.errors.emailNotConfirmed") || "Correo no confirmado";
        return;
      }
      errorMessage.value =
        result.error.message || t("login.errors.loginFailed");
      return;
    }

    // Si el login es exitoso, verificar si es administrador
    if (authStore.isAuthenticated()) {
      // Resetear intentos fallidos al login exitoso
      resetearIntentos();
      
      // Verificar si hay una ruta guardada para redirigir después del login
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");

      // Obtener el id del usuario autenticado
      const userId = authStore.user?.id;
      if (userId) {
        // Consultar si existe en la tabla administradores
        const { data: admin, error: adminError } = await supabase
          .from("administradores")
          .select("nombres")
          .eq("id", userId)
          .single();
        if (admin && !adminError) {
          // Limpiar la ruta guardada
          sessionStorage.removeItem("redirectAfterLogin");

          // Si hay ruta guardada y es administrador, ir a esa ruta si es permitida
          if (redirectPath) {
            router.push(redirectPath);
            return;
          }

          const nombreAdmin = (admin as { nombres?: string }).nombres || "";
          router.push({ name: "AdminPanel", query: { nombre: nombreAdmin } });
          return;
        }
      }

      // Si no es administrador
      // Limpiar la ruta guardada
      sessionStorage.removeItem("redirectAfterLogin");

      // Si hay ruta guardada, redirigir allí
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        // Si no hay ruta guardada, ir al dashboard
        router.push("/dashboard");
      }
    }
  } catch (error: any) {
    // Registrar intento fallido
    registrarIntentoFallido();
    
    // Mostrar error amigable
    if (error.message?.toLowerCase().includes("user")) {
      errorMessage.value =
        t("login.errors.invalidUser") || "Usuario incorrecto";
    } else if (error.message?.toLowerCase().includes("password")) {
      errorMessage.value =
        t("login.errors.invalidPassword") || "Contraseña incorrecta";
    } else if (error.message?.toLowerCase().includes("credentials")) {
      errorMessage.value =
        t("login.errors.invalidCredentials") || "Credenciales incorrectas";
    } else if (error.message?.toLowerCase().includes("email not confirmed")) {
      errorMessage.value =
        t("login.errors.emailNotConfirmed") || "Correo no confirmado";
    } else {
      errorMessage.value = authStore.error || t("login.errors.loginFailed");
    }
  }
};

// Limpiar mensaje de error al escribir
const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = "";
  }
};

// Función de validación de cédula local
const validarCedulaEcuatoriana = (cedula: string): boolean => {
  if (cedula.length !== 10) return false;
  const digitoRegion = Number(cedula.substring(0, 2));
  if (digitoRegion < 1 || digitoRegion > 24) return false;
  const ultimoDigito = Number(cedula.substring(9, 10));
  const pares =
    Number(cedula.substring(1, 2)) +
    Number(cedula.substring(3, 4)) +
    Number(cedula.substring(5, 6)) +
    Number(cedula.substring(7, 8));
  let numeroUno: any = cedula.substring(0, 1);
  let numeroUno1 = Number(numeroUno) * 2;
  if (numeroUno1 > 9) numeroUno1 -= 9;
  let numeroTres: any = cedula.substring(2, 3);
  let numeroTres1 = Number(numeroTres) * 2;
  if (numeroTres1 > 9) numeroTres1 -= 9;
  let numeroCinco: any = cedula.substring(4, 5);
  let numeroCinco1 = Number(numeroCinco) * 2;
  if (numeroCinco1 > 9) numeroCinco1 -= 9;
  let numeroSiete: any = cedula.substring(6, 7);
  let numeroSiete1 = Number(numeroSiete) * 2;
  if (numeroSiete1 > 9) numeroSiete1 -= 9;
  let numeroNueve: any = cedula.substring(8, 9);
  let numeroNueve1 = Number(numeroNueve) * 2;
  if (numeroNueve1 > 9) numeroNueve1 -= 9;
  const impares =
    numeroUno1 + numeroTres1 + numeroCinco1 + numeroSiete1 + numeroNueve1;
  const sumaTotal = pares + impares;
  const primerDigitoSuma = String(sumaTotal).substring(0, 1);
  const decena = (Number(primerDigitoSuma) + 1) * 10;
  let digitoValidador = decena - sumaTotal;
  if (digitoValidador === 10) digitoValidador = 0;
  return digitoValidador === ultimoDigito;
};

const validateCedula = (cedula: string): boolean => {
  try {
    return validarCedulaEcuatoriana(cedula);
  } catch (error) {
    return false;
  }
};

// Buscar usuario por cédula en Supabase
const searchUserByCedula = async () => {
  emailSearchError.value = "";
  foundUserData.value = null;

  // Validar que la cédula tenga 10 dígitos
  if (cedula.value.length !== 10) {
    emailSearchError.value = t("login.forgotEmail.errors.invalidLength");
    return;
  }

  // Validar cédula con algoritmo ecuatoriano
  if (!validateCedula(cedula.value)) {
    emailSearchError.value = t("login.forgotEmail.errors.invalidCedula");
    return;
  }

  isSearchingEmail.value = true;

  try {
    console.log("🔍 Buscando usuario con cédula:", cedula.value);

    // Llamar a la función RPC de Supabase (más seguro que consulta directa)
    const { data, error } = await supabase.rpc("buscar_email_por_cedula", {
      cedula_input: cedula.value,
    } as any) as { data: any[] | null; error: any };

    console.log("📊 Resultado de búsqueda:", { data, error });

    if (error) {
      console.error("❌ Error en búsqueda:", error);
      emailSearchError.value = t("login.forgotEmail.errors.searchFailed");
      return;
    }

    // La función RPC retorna un array, tomar el primer elemento
    const usuario = data && data.length > 0 ? data[0] : null;

    if (!usuario) {
      console.warn("⚠️ No se encontró ningún usuario con esta cédula");
      emailSearchError.value = t("login.forgotEmail.errors.notFound");
      return;
    }

    // Usuario encontrado
    console.log("✅ Usuario encontrado:", usuario);
    foundUserData.value = usuario;
  } catch (error) {
    console.error("💥 Excepción en búsqueda:", error);
    emailSearchError.value = t("login.forgotEmail.errors.searchFailed");
  } finally {
    isSearchingEmail.value = false;
  }
};

// Cerrar modal de recuperación de correo
const closeForgotEmailModal = () => {
  showForgotEmailModal.value = false;
  cedula.value = "";
  emailSearchError.value = "";
  foundUserData.value = null;
};

// Recuperar contraseña con Supabase
const recoverPassword = async () => {
  passwordRecoveryError.value = "";
  passwordRecoverySuccess.value = false;

  // Validar email
  if (!recoveryEmail.value || !validateEmail(recoveryEmail.value)) {
    passwordRecoveryError.value = t("login.forgotPassword.errors.invalidEmail");
    return;
  }

  isRecoveringPassword.value = true;

  try {
    // Usar Supabase para enviar email de recuperación
    const { error } = await supabase.auth.resetPasswordForEmail(
      recoveryEmail.value,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      passwordRecoveryError.value = t("login.forgotPassword.errors.failed");
      return;
    }

    // Éxito
    passwordRecoverySuccess.value = true;
  } catch (error) {
    passwordRecoveryError.value = t("login.forgotPassword.errors.failed");
  } finally {
    isRecoveringPassword.value = false;
  }
};

// Cerrar modal de recuperación de contraseña
const closeForgotPasswordModal = () => {
  showForgotPasswordModal.value = false;
  recoveryEmail.value = "";
  passwordRecoveryError.value = "";
  passwordRecoverySuccess.value = false;
};
</script>

<template>
  <!-- Sidebar eliminado: no se muestra en Login -->
  <div
    class="relative flex items-center justify-center min-h-screen py-4 px-4 sm:py-6 sm:px-6 lg:px-8"
  >
    <!-- Imagen de fondo con overlay gradiente elegante -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${loginBg})` }"
    >
      <!-- Overlay gradiente para mejor contraste -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-900/35 via-indigo-900/25 to-purple-900/35"
      ></div>
    </div>

    <!-- Contenido del formulario -->
    <div class="relative z-10 w-full max-w-md space-y-3 sm:space-y-4 md:space-y-6">
      <!-- Formulario-->
      <form
        class="space-y-4 sm:space-y-5 bg-white/95 backdrop-blur-xl p-5 sm:p-8 rounded-2xl shadow-2xl border border-white/20"
        @submit.prevent="handleLogin"
        role="form"
        aria-label="Formulario de inicio de sesión"
      >
        <!-- Región de anuncios para lectores de pantalla -->
        <div
          aria-live="polite"
          aria-atomic="true"
          class="sr-only"
          role="status"
        >
          <span v-if="errorMessage">Error: {{ errorMessage }}</span>
          <span v-if="isLoading">Procesando inicio de sesión</span>
        </div>

        <!-- Notificación de verificación de email -->
        <div
          v-if="showEmailVerificationNotice"
          class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm animate-fade-in"
          role="alert"
          aria-live="polite"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-bold text-blue-800 mb-1">
                📧 ¡Registro Exitoso!
              </h3>
              <p class="text-sm text-blue-700 leading-relaxed">
                Antes de iniciar sesión, debes
                <strong>verificar tu correo electrónico</strong>. Revisa tu
                bandeja de entrada y haz clic en el enlace de confirmación que
                te enviamos.
              </p>
              <button
                @click="showEmailVerificationNotice = false"
                class="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
                type="button"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        </div>

        <!-- Notificación de email verificado exitosamente -->
        <div
          v-if="showEmailVerifiedSuccess"
          class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in"
          role="alert"
          aria-live="polite"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-bold text-green-800 mb-1">
                ✅ ¡Email Verificado Correctamente!
              </h3>
              <p class="text-sm text-green-700 leading-relaxed">
                Tu correo electrónico ha sido confirmado exitosamente. Ahora
                puedes <strong>iniciar sesión</strong> con tu cuenta.
              </p>
              <button
                @click="showEmailVerifiedSuccess = false"
                class="mt-2 text-xs text-green-600 hover:text-green-800 font-semibold underline"
                type="button"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        </div>

        <!-- Notificación de contraseña restablecida exitosamente -->
        <div
          v-if="showPasswordResetSuccess"
          class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in"
          role="alert"
          aria-live="polite"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-bold text-green-800 mb-1">
                🔐 ¡Contraseña Restablecida Exitosamente!
              </h3>
              <p class="text-sm text-green-700 leading-relaxed">
                Tu contraseña ha sido cambiada correctamente. Ahora puedes
                <strong>iniciar sesión</strong> con tu nueva contraseña.
              </p>
              <button
                @click="showPasswordResetSuccess = false"
                class="mt-2 text-xs text-green-600 hover:text-green-800 font-semibold underline"
                type="button"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        </div>

        <!-- Mensaje de cuenta bloqueada -->
        <div
          v-if="estaBloqueado"
          class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-fade-in"
          role="alert"
          aria-live="assertive"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-bold text-red-800 mb-2">
                🔒 Cuenta Bloqueada Temporalmente
              </h3>
              <p class="text-sm text-red-700 leading-relaxed mb-2">
                Has excedido el número máximo de intentos de inicio de sesión ({{ INTENTOS_MAXIMOS }} intentos).
              </p>
              <div class="bg-red-100 rounded-lg p-3 mb-2">
                <p class="text-sm font-bold text-red-900">
                  ⏱️ Tiempo restante: <span class="text-lg font-mono">{{ tiempoFormateado }}</span>
                </p>
              </div>
              <p class="text-xs text-red-600">
                Por tu seguridad, el formulario se ha bloqueado por {{ bloqueosAcumulados * 5 }} minutos.
                Después de este tiempo, tendrás {{ INTENTOS_MAXIMOS }} intentos más.
              </p>
            </div>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div
          v-if="errorMessage"
          class="bg-red-50 border-l-4 border-red-500 p-4 rounded"
          role="alert"
          aria-live="assertive"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Email con diseño mejorado -->
          <div>
            <label
              for="email"
              class="block text-sm font-semibold text-gray-700 mb-2"
              id="email-label"
            >
              {{ t("login.email") }}
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-blue-600"
              >
                <i
                  class="fas fa-envelope text-gray-400 group-focus-within:text-blue-600"
                  aria-hidden="true"
                ></i>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="estaBloqueado"
                aria-required="true"
                aria-labelledby="email-label"
                aria-describedby="email-desc"
                class="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                :placeholder="t('login.emailPlaceholder')"
                @input="clearError"
              />
              <span id="email-desc" class="sr-only"
                >Ingrese su dirección de correo electrónico</span
              >
            </div>
          </div>

          <!-- Password con diseño mejorado -->
          <div>
            <label
              for="password"
              class="block text-sm font-semibold text-gray-700 mb-2"
              id="password-label"
            >
              {{ t("login.password") }}
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-blue-600"
              >
                <i
                  class="fas fa-lock text-gray-400 group-focus-within:text-blue-600"
                  aria-hidden="true"
                ></i>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="estaBloqueado"
                aria-required="true"
                aria-labelledby="password-label"
                aria-describedby="password-desc"
                class="appearance-none block w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                :placeholder="t('login.passwordPlaceholder')"
                @input="clearError"
              />
              <span id="password-desc" class="sr-only"
                >Ingrese su contraseña</span
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 hover:scale-110 transform"
                :aria-label="
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                "
                @click="showPassword = !showPassword"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  class="text-gray-400 hover:text-blue-600"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Remember me y Forgot password mejorado -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-1"
        >
          <div class="flex items-center gap-2">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer transition-colors duration-200"
              />
              <label
                for="remember-me"
                class="ml-2 block text-xs sm:text-sm text-gray-700 cursor-pointer font-medium"
              >
                {{ t("login.rememberMe") }}
              </label>
            </div>
            <!-- Ícono de ayuda con tooltip (oculto en móvil) -->
            <div class="relative group hidden sm:block">
              <svg
                class="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-help transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <!-- Tooltip -->
              <div
                class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10"
              >
                <p class="font-semibold mb-1">
                  {{ t("login.rememberMeHelp.title") }}
                </p>
                <p>{{ t("login.rememberMeHelp.description") }}</p>
                <!-- Flecha del tooltip -->
                <div
                  class="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900"
                ></div>
              </div>
            </div>
          </div>

          <!-- Enlaces de recuperación -->
          <div class="flex flex-col sm:items-end gap-1.5">
            <a
              href="#"
              @click.prevent="showForgotPasswordModal = true"
              class="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition duration-150 hover:underline flex items-center gap-1"
            >
              <svg
                class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
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
              <span class="break-words">{{
                t("login.forgotPassword.link")
              }}</span>
            </a>

            <a
              href="#"
              @click.prevent="showForgotEmailModal = true"
              class="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 transition duration-150 hover:underline flex items-center gap-1"
            >
              <svg
                class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span class="break-words">{{ t("login.forgotEmail.link") }}</span>
            </a>
          </div>
        </div>

        <!-- Botón de login mejorado -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isLoading || estaBloqueado"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span v-if="!isLoading" class="flex items-center">
              <i class="fas fa-sign-in-alt mr-2"></i>
              {{ t("login.submit") }}
            </span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              {{ t("login.loading") }}
            </span>
          </button>
        </div>

        <!-- Registro -->
        <div class="text-center pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            {{ t("login.noAccount") }}
            <router-link
              to="/register"
              class="font-semibold text-blue-600 hover:text-blue-700 transition duration-150 hover:underline"
            >
              {{ t("login.registerLink") }}
            </router-link>
          </p>
        </div>
      </form>

      <!-- Opciones adicionales mejoradas -->
      <div class="text-center">
        <p class="text-xs text-blue-100 drop-shadow-lg">
          {{ t("login.termsText") }}
          <a
            href="#"
            class="text-white hover:text-blue-200 font-semibold underline"
            >{{ t("footer.terms") }}</a
          >
          {{ t("login.and") }}
          <a
            href="#"
            class="text-white hover:text-blue-200 font-semibold underline"
            >{{ t("footer.privacy") }}</a
          >
        </p>
      </div>
    </div>
  </div>

  <!-- Modal de recuperación de contraseña -->
  <Transition name="modal">
    <div
      v-if="showForgotPasswordModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      @click.self="closeForgotPasswordModal"
    >
      <div
        class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-scale-in max-h-[95vh] overflow-y-auto"
      >
        <!-- Botón cerrar -->
        <button
          @click="closeForgotPasswordModal"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition z-10"
          aria-label="Cerrar modal"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Título del modal -->
        <div class="mb-4 sm:mb-6 pr-8">
          <h3
            class="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2"
          >
            <svg
              class="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 flex-shrink-0"
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
            <span class="break-words">{{
              t("login.forgotPassword.title")
            }}</span>
          </h3>
          <p class="text-gray-600 mt-2 text-xs sm:text-sm">
            {{ t("login.forgotPassword.subtitle") }}
          </p>
        </div>

        <!-- Vista de éxito -->
        <div v-if="passwordRecoverySuccess" class="space-y-3 sm:space-y-4">
          <div
            class="bg-green-50 border-l-4 border-green-500 p-2.5 sm:p-4 rounded-lg"
          >
            <p class="text-xs sm:text-sm text-green-700 flex items-start gap-2">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="break-words">{{
                t("login.forgotPassword.success")
              }}</span>
            </p>
          </div>

          <div
            class="bg-blue-50 border-l-4 border-blue-500 p-2.5 sm:p-4 rounded-lg"
          >
            <p class="text-xs sm:text-sm text-blue-700 flex items-start gap-2">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="break-words">{{
                t("login.forgotPassword.checkEmail")
              }}</span>
            </p>
          </div>

          <button
            @click="closeForgotPasswordModal"
            class="w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          >
            {{ t("login.forgotPassword.closeButton") }}
          </button>
        </div>

        <!-- Formulario de recuperación -->
        <div v-else class="space-y-3 sm:space-y-4">
          <!-- Input de email -->
          <div>
            <label
              for="recovery-email"
              class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
            >
              {{ t("login.forgotPassword.emailLabel") }}
            </label>
            <div class="relative">
              <input
                id="recovery-email"
                v-model="recoveryEmail"
                type="email"
                :placeholder="t('login.forgotPassword.emailPlaceholder')"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition outline-none"
                @input="passwordRecoveryError = ''"
                @keyup.enter="recoverPassword"
              />
              <div
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ t("login.forgotPassword.emailHint") }}
            </p>
          </div>

          <!-- Mensaje de error -->
          <div
            v-if="passwordRecoveryError"
            class="bg-red-50 border-l-4 border-red-500 p-2.5 sm:p-3 rounded-lg"
          >
            <p class="text-xs sm:text-sm text-red-700 flex items-start gap-2">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="break-words">{{ passwordRecoveryError }}</span>
            </p>
          </div>

          <!-- Botón de envío -->
          <button
            @click="recoverPassword"
            :disabled="isRecoveringPassword || !recoveryEmail"
            class="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <svg
              v-if="!isRecoveringPassword"
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <svg
              v-else
              class="animate-spin w-4 h-4 sm:w-5 sm:h-5"
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
            <span>{{
              isRecoveringPassword
                ? t("login.forgotPassword.sending")
                : t("login.forgotPassword.sendButton")
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de recuperación de correo -->
  <Transition name="modal">
    <div
      v-if="showForgotEmailModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      @click.self="closeForgotEmailModal"
    >
      <div
        class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-scale-in max-h-[95vh] overflow-y-auto"
      >
        <!-- Botón cerrar -->
        <button
          @click="closeForgotEmailModal"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition z-10"
          aria-label="Cerrar modal"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Título del modal -->
        <div class="mb-4 sm:mb-6 pr-8">
          <h3
            class="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2"
          >
            <svg
              class="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span class="break-words">{{ t("login.forgotEmail.title") }}</span>
          </h3>
          <p class="text-gray-600 mt-2 text-xs sm:text-sm">
            {{ t("login.forgotEmail.subtitle") }}
          </p>
        </div>

        <!-- Formulario de búsqueda -->
        <div v-if="!foundUserData" class="space-y-3 sm:space-y-4">
          <!-- Input de cédula -->
          <div>
            <label
              for="cedula-search"
              class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
            >
              {{ t("login.forgotEmail.cedulaLabel") }}
            </label>
            <div class="relative">
              <input
                id="cedula-search"
                v-model="cedula"
                type="text"
                maxlength="10"
                :placeholder="t('login.forgotEmail.cedulaPlaceholder')"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition outline-none"
                @input="emailSearchError = ''"
                @keyup.enter="searchUserByCedula"
              />
              <div
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ t("login.forgotEmail.cedulaHint") }}
            </p>
          </div>

          <!-- Mensaje de error -->
          <div
            v-if="emailSearchError"
            class="bg-red-50 border-l-4 border-red-500 p-2.5 sm:p-3 rounded-lg"
          >
            <p class="text-xs sm:text-sm text-red-700 flex items-start gap-2">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="break-words">{{ emailSearchError }}</span>
            </p>
          </div>

          <!-- Botón de búsqueda -->
          <button
            @click="searchUserByCedula"
            :disabled="isSearchingEmail || cedula.length !== 10"
            class="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <svg
              v-if="!isSearchingEmail"
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <svg
              v-else
              class="animate-spin w-4 h-4 sm:w-5 sm:h-5"
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
            <span>{{
              isSearchingEmail
                ? t("login.forgotEmail.searching")
                : t("login.forgotEmail.searchButton")
            }}</span>
          </button>
        </div>

        <!-- Resultado de la búsqueda -->
        <div v-else class="space-y-3 sm:space-y-4">
          <!-- Mensaje de éxito -->
          <div
            class="bg-green-50 border-l-4 border-green-500 p-2.5 sm:p-4 rounded-lg"
          >
            <p class="text-xs sm:text-sm text-green-700 flex items-start gap-2">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="break-words">{{
                t("login.forgotEmail.found")
              }}</span>
            </p>
          </div>

          <!-- Datos del usuario -->
          <div
            class="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2.5 sm:space-y-3"
          >
            <div class="flex items-start gap-2 sm:gap-3">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                  {{ t("login.forgotEmail.cedulaLabel") }}
                </p>
                <p
                  class="font-semibold text-sm sm:text-base text-gray-900 break-words"
                >
                  {{ foundUserData.cedula }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-2 sm:gap-3">
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                  {{ t("login.forgotEmail.nameLabel") }}
                </p>
                <p
                  class="font-semibold text-sm sm:text-base text-gray-900 break-words"
                >
                  {{ foundUserData.nombres }} {{ foundUserData.apellidos }}
                </p>
              </div>
            </div>

            <!-- Email destacado -->
            <div
              class="flex items-start gap-2 sm:gap-3 bg-purple-50 -mx-3 sm:-mx-4 -mb-3 sm:-mb-4 p-3 sm:p-4 rounded-b-xl border-t-2 border-purple-200"
            >
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div class="flex-1 min-w-0">
                <p
                  class="text-xs text-purple-700 uppercase tracking-wide font-semibold"
                >
                  {{ t("login.forgotEmail.emailLabel") }}
                </p>
                <p
                  v-text="foundUserData.email"
                  class="font-bold text-purple-900 text-base sm:text-lg break-all select-all"
                ></p>
              </div>
            </div>
          </div>

          <!-- Advertencia -->
          <div
            class="bg-yellow-50 border-l-4 border-yellow-500 p-2.5 sm:p-4 rounded-lg"
          >
            <p
              class="text-xs sm:text-sm text-yellow-800 flex items-start gap-2"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="break-words">{{
                t("login.forgotEmail.warning")
              }}</span>
            </p>
          </div>

          <!-- Botón cerrar -->
          <button
            @click="closeForgotEmailModal"
            class="w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition"
          >
            {{ t("login.forgotEmail.closeButton") }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Animaciones */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}

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

form {
  animation: slideIn 0.3s ease-out;
}

.animate-shake {
  animation: shake 0.5s;
}

/* Efectos de hover */
input:focus {
  transform: scale(1.01);
}

/* Accesibilidad: solo visible para lectores de pantalla */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Animación del modal */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

/* Transiciones del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
