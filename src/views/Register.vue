<script setup lang="ts">
import loginBg from "@/assets/login/login.jpg";
import { useAuthStore } from "@/stores/auth.store";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";


const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();

// Estado del formulario
const nombres = ref("");
const apellidos = ref("");
const cedula = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const parroquia = ref("");
const barrio = ref("");
const acceptTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref("");
const shakeTerms = ref(false);

// Reglas de contraseña en tiempo real
// mínimo 8 caracteres (sin límite máximo)
const passwordHasMinMax = computed(() => password.value.length >= 8);
const passwordHasUpper = computed(() => /[A-ZÁÉÍÓÚÑÜ]/.test(password.value));
const passwordHasNumber = computed(() => /\d/.test(password.value));
const passwordHasSpecial = computed(() =>
  /[!@#$%^&*(),.?":{}|<>_\-\\\[\]\/~`+=;']/.test(password.value)
);

const passwordCriteria = computed(() => ({
  length: passwordHasMinMax.value,
  upper: passwordHasUpper.value,
  number: passwordHasNumber.value,
  special: passwordHasSpecial.value,
}));

const isPasswordValid = computed(() =>
  Object.values(passwordCriteria.value).every((v) => v === true)
);

// Confirmación de contraseña en tiempo real (null = aún vacío)
const passwordsMatch = computed<boolean | null>(() => {
  if (!confirmPassword.value) return null;
  return password.value === confirmPassword.value;
});

// Usar el estado del store
const isLoading = computed(() => authStore.loading);

// Validación en tiempo real de cédula
const isCedulaValid = computed(() => {
  if (cedula.value.length === 10) {
    return validateCedula(cedula.value);
  }
  return null; // null = no mostrar nada aún
});

// Parroquias y sus barrios
const parroquiasData = {
  "Eloy Alfaro": [
    "10 de Agosto",
    "10 de Septiembre",
    "15 de Abril",
    "26 de Septiembre",
    "Amazonas",
    "El Chaparral",
    "La Lorena",
    "Florestal N°1",
    "San Pedro",
    "Simón Bolívar",
    "Juan Montalvo",
    "La Floreana",
    "La Gulf",
    "Las Colinas",
    "Las Vegas",
    "2 de Agosto",
    "2 de Agosto (Alto)",
    "Nueva Esperanza",
    "Santa Ana",
    "15 de Abril N°2",
    "La Aurora",
    "Ricardo Paredes",
    "Santa Clara N°1",
    "La Floresta",
    "San Ignacio de Loyola",
    "9 de Octubre",
    "El Progreso",
    "Florestal N°2",
    "Lomillas de Colorado",
    "Santa Elena",
    "Mazato",
    "Horacio Hidrovo",
    "Los Ángeles",
    "San Antonio",
    "María Auxiliadora",
    "1° de Mayo",
    "Jipijapa",
    "Santa Lucía",
    "San Pedro",
    "Santa Clara N°2",
    "María Auxiliadora",
    "Los Laureles",
    "Paquisha",
    "San José N°1",
    "San José N°2",
    "Cdla. La Aurora 2",
  ],
  "Los Esteros": [
    "Los Esteros Alto",
    "Miramar",
    "Cdla. 9 de Octubre",
    "Las Brisas",
    "Manta Beach",
    "Costa Azul",
    "Urbanización Aeropuerto",
    "Las Vegas Playa",
    "Urbanización Las Cumbres",
    "Mirador Los Esteros",
    "Balcones del Pacífico",
    "More barrios en catastro municipal",
  ],
  Tarqui: [
    "12 de Octubre",
    "5 de Agosto",
    "10 de Noviembre",
    "Cristo Rey",
    "Nuevo Manta",
    "San Francisco",
    "San José",
    "Urb. Urbirrios N°2",
    "Cdla. Lomas del Porvenir",
    "Colinas del Jocay",
    "Las Cumbres N°2",
    "Nueva Comunidad Río Manta",
    "Rumiñahui",
    "Miraflores",
    "24 de Mayo (Jocay)",
    "Jocay",
    "Los Geranios",
    "20 de Mayo",
    "4 de Noviembre",
    "La Victoria",
    "Cenepa",
    "California",
    "24 de Septiembre",
    "Las Cumbres",
    "Rosario de Tarqui",
    "15 de Septiembre",
    "Cristo del Consuelo",
    "Palo Santo",
    "Los Bosques de Urbirrios",
    "San Valentín",
    "30 de Agosto",
    "Cdla. La Azteca",
    "La Revancha N°2",
    "Riveras del Río",
    "Bellavista",
    "Bellavista 2",
    "Buenos Aires",
    "Cdla. Villas del Seguro",
    "9 de Octubre",
    "Urbirrios 1",
    "1° de Mayo",
    "María Auxiliadora N°1",
    "La Paz",
    "María Auxiliadora (sector bajo)",
    "Porvenir Alto",
    "El Porvenir",
    "San Antonio N°1",
    "Ursa",
    "Colinas de Rocafuerte",
    "Oswaldo Álvarez",
    "La Revancha Popular",
    "La Pochita",
    "Cdla. Villa María",
    "San Pedro",
    "La Reina",
    "San Antonio N°2",
    "Las Palmitas",
    "Cdla. Si Vivienda",
    "Nuevo Manta (Vía San Juan de Manta)",
    "Los Senderos N°2",
    "Tarqui Central",
    "Ceibos Renacer",
    "La Carmelita",
    "Villas de Circunvalación",
    "Los Corrales",
    "Nuevo Manta 1 (vía a La Revancha)",
    "Nuevo Manta 2 (vía Sandino)",
    "Vista Hermosa",
    "María Auxiliadora (del barrio 12 de Octubre)",
    "Villas del Mall",
  ],
  Manta: [
    "Ciudadela Manta",
    "Sitio El Abra",
    "Comunas El Aromo",
    "Ligüiqui",
    "San Pablo",
    "Cdla. Bolívar",
    "Cdla. Rocafuerte",
    "Cdla. Universitaria",
    "Cdla. Bellavista",
    "San Roque",
    "Cdla. Eloy Alfaro",
    "Cdla. Los Azules",
    "Cdla. Los Almendros",
    "Cdla. Las Brisas",
    "San Luis",
    "Cdla. La Pradera",
    "Cdla. Barbasquillo",
    "Mirador del Mar",
    "Cdla. Los Rosales",
    "San José",
    "Urbanizaciones nuevas y otros",
  ],
  "San Mateo": [
    "Bellavista",
    "Cristo Rey",
    "Jome",
    "Las Flores",
    "Los Sauces",
    "Virgen del Mar",
    "Vista al Mar",
  ],
  "San Lorenzo": [
    "Santa Rosa",
    "Ligüiqui",
    "Río Caña",
    "San Lorenzo",
    "Las Piñas",
    "El Aromo",
    "El Abra",
  ],
  "Santa Marianita": ["Comuna Pacoche"],
};

// Computed para obtener los barrios según la parroquia seleccionada
const barriosDisponibles = computed(() => {
  if (
    parroquia.value &&
    parroquiasData[parroquia.value as keyof typeof parroquiasData]
  ) {
    return parroquiasData[parroquia.value as keyof typeof parroquiasData];
  }
  return [];
});

// Limpiar barrio cuando cambia la parroquia
const handleParroquiaChange = () => {
  barrio.value = "";
};

// Validación del formulario
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función de validación de cédula local para evitar problemas con librería externa
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

const validateForm = (): boolean => {
  if (
    !nombres.value ||
    !apellidos.value ||
    !cedula.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value ||
    !parroquia.value ||
    !barrio.value
  ) {
    errorMessage.value = t("register.errors.emptyFields");
    return false;
  }

  if (!validateCedula(cedula.value)) {
    errorMessage.value = t("register.errors.invalidCedula");
    return false;
  }

  if (!validateEmail(email.value)) {
    errorMessage.value = t("register.errors.invalidEmail");
    return false;
  }

  if (password.value.length < 8) {
    errorMessage.value = t("register.errors.shortPassword");
    return false;
  }

  // Validar requisitos adicionales (8-12, mayúscula, número, especial)
  if (!isPasswordValid.value) {
    errorMessage.value = t("register.errors.passwordRequirements");
    return false;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = t("register.errors.passwordMismatch");
    return false;
  }

  if (!acceptTerms.value) {
    errorMessage.value = t("register.errors.termsRequired");
    // Activar animación de shake
    shakeTerms.value = true;
    setTimeout(() => {
      shakeTerms.value = false;
    }, 500);
    return false;
  }

  return true;
};

// Manejo del submit con Supabase
const handleRegister = async () => {
  errorMessage.value = "";

  if (!validateForm()) {
    return;
  }

  try {
    // Registro con Supabase
    await authStore.register(email.value, password.value, {
      nombres: nombres.value,
      apellidos: apellidos.value,
      cedula: cedula.value,
      parroquia: parroquia.value,
      barrio: barrio.value,
      tipo: "ciudadano", // Especificando el tipo de usuario
    });

    // Si el registro es exitoso, redirigir al login con parámetro
    router.push({
      name: "Login",
      query: { registered: "true" },
    });
  } catch (error: any) {
    // Mostrar error amigable
    if (error.message?.includes("User already registered")) {
      errorMessage.value = t("register.errors.emailExists");
    } else if (error.message?.includes("Password should be")) {
      errorMessage.value = t("register.errors.weakPassword");
    } else {
      errorMessage.value =
        authStore.error || t("register.errors.registerFailed");
    }
  }
};

// Limpiar mensaje de error al escribir
const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = "";
  }
};
</script>

<template>
  <div
    class="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[600px]"
  >
    <!-- Imagen de fondo con overlay gradiente elegante -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${loginBg})` }"
    >
      <!-- Overlay gradiente para mejor contraste -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-green-900/35 via-emerald-900/25 to-teal-900/35"
      ></div>
    </div>

    <!-- Contenido del formulario -->
    <div class="relative z-10 max-w-2xl w-full space-y-6">
      <!-- Formulario con glassmorphism -->
      <form
        class="space-y-5 bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20"
        @submit.prevent="handleRegister"
        role="form"
        aria-label="Formulario de registro de usuario"
      >
        <!-- Región de anuncios para lectores de pantalla -->
        <div
          aria-live="polite"
          aria-atomic="true"
          class="sr-only"
          role="status"
        >
          <span v-if="errorMessage">Error: {{ errorMessage }}</span>
          <span v-if="isCedulaValid === true">Cédula válida</span>
          <span v-if="isCedulaValid === false">Cédula inválida</span>
        </div>

        <!-- Mensaje de error -->
        <div
          v-if="errorMessage"
          class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake"
          role="alert"
          aria-live="assertive"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <i
                class="fas fa-exclamation-circle text-red-500"
                aria-hidden="true"
              ></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 font-medium">
                {{ errorMessage }}
              </p>
            </div>
          </div>
        </div>

        <!-- Campos del formulario en dos columnas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nombres -->
          <div>
            <label
              for="nombres"
              class="block text-sm font-semibold text-gray-700 mb-2"
              id="nombres-label"
            >
              {{ $t("register.firstName") }}
              <span class="text-red-500" aria-label="campo requerido">{{
                $t("register.required")
              }}</span>
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-user text-gray-400 group-focus-within:text-green-600 transition-colors duration-200"
                  aria-hidden="true"
                ></i>
              </div>
              <input
                id="nombres"
                v-model="nombres"
                type="text"
                autocomplete="given-name"
                required
                aria-required="true"
                aria-labelledby="nombres-label"
                aria-describedby="nombres-desc"
                class="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                placeholder="Pérez García"
                @input="clearError"
              />
              <span id="nombres-desc" class="sr-only"
                >Ingrese sus nombres completos</span
              >
            </div>
          </div>

          <!-- Apellidos -->
          <div>
            <label
              for="apellidos"
              class="block text-sm font-semibold text-gray-700 mb-2"
              id="apellidos-label"
            >
              {{ $t("register.lastName") }}
              <span class="text-red-500" aria-label="campo requerido">{{
                $t("register.required")
              }}</span>
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-user text-gray-400 group-focus-within:text-green-600 transition-colors duration-200"
                  aria-hidden="true"
                ></i>
              </div>
              <input
                id="apellidos"
                v-model="apellidos"
                type="text"
                autocomplete="family-name"
                required
                aria-required="true"
                aria-labelledby="apellidos-label"
                aria-describedby="apellidos-desc"
                class="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                :placeholder="$t('register.lastNamePlaceholder')"
                @input="clearError"
              />
              <span id="apellidos-desc" class="sr-only"
                >Ingrese sus apellidos completos</span
              >
            </div>
          </div>

          <!-- Cédula -->
          <div>
            <label
              for="cedula"
              class="block text-sm font-semibold text-gray-700 mb-2"
              id="cedula-label"
            >
              {{ $t("register.cedula") }}
              <span class="text-red-500" aria-label="campo requerido">{{
                $t("register.required")
              }}</span>
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-id-card text-gray-400 group-focus-within:text-green-600 transition-colors duration-200"
                  aria-hidden="true"
                ></i>
              </div>
              <input
                id="cedula"
                v-model="cedula"
                type="text"
                maxlength="10"
                autocomplete="off"
                required
                aria-required="true"
                aria-labelledby="cedula-label"
                aria-describedby="cedula-desc cedula-validation"
                :aria-invalid="isCedulaValid === false ? 'true' : 'false'"
                :class="[
                  'appearance-none block w-full pl-12 pr-12 py-3.5 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-200',
                  isCedulaValid === true
                    ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
                    : isCedulaValid === false
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-200 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300',
                ]"
                :placeholder="$t('register.cedulaPlaceholder')"
                @input="clearError"
              />
              <span id="cedula-desc" class="sr-only"
                >Ingrese su número de cédula ecuatoriana de 10 dígitos</span
              >
              <!-- Ícono de validación -->
              <div
                v-if="isCedulaValid !== null"
                class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
                :aria-label="
                  isCedulaValid ? 'Cédula válida' : 'Cédula inválida'
                "
              >
                <i
                  v-if="isCedulaValid === true"
                  class="fas fa-check-circle text-green-500 text-xl animate-scale-in"
                  aria-hidden="true"
                ></i>
                <i
                  v-else
                  class="fas fa-times-circle text-red-500 text-xl animate-shake"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
            <!-- Mensaje de ayuda -->
            <p
              v-if="isCedulaValid === false && cedula.length === 10"
              class="mt-2 text-sm text-red-600 animate-slide-in"
              id="cedula-validation"
              role="alert"
              aria-live="assertive"
            >
              <i
                class="fas fa-exclamation-triangle mr-1"
                aria-hidden="true"
              ></i>
              {{ $t("register.errors.invalidCedula") }}
            </p>
            <p
              v-if="isCedulaValid === true"
              class="mt-2 text-sm text-green-600 animate-slide-in"
              id="cedula-validation"
              role="status"
              aria-live="polite"
            >
              <i class="fas fa-check mr-1" aria-hidden="true"></i>
              Cédula válida
            </p>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              {{ $t("register.email") }}
              <span class="text-red-500">{{ $t("register.required") }}</span>
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-envelope text-gray-400 group-focus-within:text-green-600 transition-colors duration-200"
                ></i>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                :placeholder="$t('register.emailPlaceholder')"
                @input="clearError"
              />
            </div>
          </div>

          <!-- Parroquia -->
          <div>
            <label
              for="parroquia"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              {{ $t("register.parroquia") }}
              <span class="text-red-500">{{ $t("register.required") }}</span>
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-map-marker-alt text-gray-400 group-focus-within:text-green-600 transition-colors duration-200"
                ></i>
              </div>
              <select
                id="parroquia"
                v-model="parroquia"
                required
                class="appearance-none block w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:border-gray-300 cursor-pointer"
                @change="handleParroquiaChange"
                @input="clearError"
              >
                <option value="" disabled>Selecciona una parroquia</option>
                <option value="Manta">Manta</option>
                <option value="Tarqui">Tarqui</option>
                <option value="Eloy Alfaro">Eloy Alfaro</option>
                <option value="Los Esteros">Los Esteros</option>
                <option value="San Mateo">San Mateo</option>
                <option value="San Lorenzo">San Lorenzo</option>
                <option value="Santa Marianita">Santa Marianita</option>
              </select>
              <div
                class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
              >
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Barrio -->
          <div>
            <label
              for="barrio"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              {{ $t("register.barrio") }}
              <span class="text-red-500">{{ $t("register.required") }}</span>
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-home text-gray-400 group-focus-within:text-green-600 transition-colors duration-200"
                ></i>
              </div>
              <select
                id="barrio"
                v-model="barrio"
                :disabled="!parroquia"
                required
                class="appearance-none block w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:border-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                @input="clearError"
              >
                <option value="" disabled>
                  {{
                    parroquia
                      ? "Selecciona un barrio"
                      : "Primero selecciona una parroquia"
                  }}
                </option>
                <option
                  v-for="barrioItem in barriosDisponibles"
                  :key="barrioItem"
                  :value="barrioItem"
                >
                  {{ barrioItem }}
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
              >
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              {{ $t("register.password") }}
              <span class="text-red-500">{{ $t("register.required") }}</span>
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-lock text-gray-400 group-focus-within:text-green-600 transition-colors duration-200"
                ></i>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="appearance-none block w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                :placeholder="$t('register.passwordPlaceholder')"
                @input="clearError"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 hover:scale-110 transform"
                @click="showPassword = !showPassword"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  class="text-gray-400 hover:text-green-600"
                ></i>
              </button>
            </div>
            <!-- Leyenda de requisitos de contraseña compacta -->
            <div class="mt-2 px-2 py-1 rounded bg-green-50">
              <div class="flex items-center mb-1">
                <i
                  class="fas fa-info-circle text-green-500 text-xs mr-1 animate-scale-in"
                  aria-hidden="true"
                ></i>
                <span class="font-semibold text-green-700 text-xs"
                  >Tu contraseña debe tener:</span
                >
              </div>
              <ul class="space-y-1" aria-live="polite">
                <li
                  class="flex items-center gap-1"
                  :class="
                    passwordCriteria.length ? 'text-green-700' : 'text-gray-500'
                  "
                >
                  <span
                    class="flex items-center justify-center w-4 h-4 rounded-full"
                    :class="
                      passwordCriteria.length ? 'bg-green-100' : 'bg-gray-100'
                    "
                  >
                    <i
                      :class="
                        passwordCriteria.length
                          ? 'fas fa-check text-green-600 text-xs animate-scale-in'
                          : 'fas fa-times text-gray-400 text-xs'
                      "
                      aria-hidden="true"
                    ></i>
                  </span>
                  <span class="ml-1 text-xs">{{
                    $t("register.passwordRules.length")
                  }}</span>
                </li>
                <li
                  class="flex items-center gap-1"
                  :class="
                    passwordCriteria.upper ? 'text-green-700' : 'text-gray-500'
                  "
                >
                  <span
                    class="flex items-center justify-center w-4 h-4 rounded-full"
                    :class="
                      passwordCriteria.upper ? 'bg-green-100' : 'bg-gray-100'
                    "
                  >
                    <i
                      :class="
                        passwordCriteria.upper
                          ? 'fas fa-check text-green-600 text-xs animate-scale-in'
                          : 'fas fa-times text-gray-400 text-xs'
                      "
                      aria-hidden="true"
                    ></i>
                  </span>
                  <span class="ml-1 text-xs">{{
                    $t("register.passwordRules.upper")
                  }}</span>
                </li>
                <li
                  class="flex items-center gap-1"
                  :class="
                    passwordCriteria.number ? 'text-green-700' : 'text-gray-500'
                  "
                >
                  <span
                    class="flex items-center justify-center w-4 h-4 rounded-full"
                    :class="
                      passwordCriteria.number ? 'bg-green-100' : 'bg-gray-100'
                    "
                  >
                    <i
                      :class="
                        passwordCriteria.number
                          ? 'fas fa-check text-green-600 text-xs animate-scale-in'
                          : 'fas fa-times text-gray-400 text-xs'
                      "
                      aria-hidden="true"
                    ></i>
                  </span>
                  <span class="ml-1 text-xs">{{
                    $t("register.passwordRules.number")
                  }}</span>
                </li>
                <li
                  class="flex items-center gap-1"
                  :class="
                    passwordCriteria.special
                      ? 'text-green-700'
                      : 'text-gray-500'
                  "
                >
                  <span
                    class="flex items-center justify-center w-4 h-4 rounded-full"
                    :class="
                      passwordCriteria.special ? 'bg-green-100' : 'bg-gray-100'
                    "
                  >
                    <i
                      :class="
                        passwordCriteria.special
                          ? 'fas fa-check text-green-600 text-xs animate-scale-in'
                          : 'fas fa-times text-gray-400 text-xs'
                      "
                      aria-hidden="true"
                    ></i>
                  </span>
                  <span class="ml-1 text-xs">{{
                    $t("register.passwordRules.special")
                  }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              {{ $t("register.confirmPassword") }}
              <span class="text-red-500">{{ $t("register.required") }}</span>
            </label>
            <div class="relative group">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <i
                  class="fas fa-lock text-gray-400 group-focus-within:text-green-600 transition-colors duration-200"
                ></i>
              </div>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="appearance-none block w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                :placeholder="$t('register.confirmPasswordPlaceholder')"
                @input="clearError"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 hover:scale-110 transform"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i
                  :class="
                    showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                  "
                  class="text-gray-400 hover:text-green-600"
                ></i>
              </button>
            </div>
            <!-- Feedback en tiempo real de coincidencia -->
            <p
              v-if="passwordsMatch !== null"
              :class="[
                'mt-2 text-sm animate-slide-in',
                passwordsMatch ? 'text-green-600' : 'text-red-600',
              ]"
              role="status"
              aria-live="polite"
            >
              <i
                :class="
                  passwordsMatch ? 'fas fa-check mr-1' : 'fas fa-times mr-1'
                "
                aria-hidden="true"
              ></i>
              <span v-if="passwordsMatch">{{
                $t("register.passwordsMatch")
              }}</span>
              <span v-else>{{ $t("register.passwordsDoNotMatch") }}</span>
            </p>
          </div>
        </div>

        <!-- Términos y condiciones -->
        <div
          :class="[
            'flex items-start pt-1 p-4 rounded-xl border-2 transition-all duration-200',
            acceptTerms
              ? 'bg-green-50 border-green-300'
              : 'bg-gray-50 border-gray-300 hover:border-green-400',
            shakeTerms ? 'animate-shake border-red-400 bg-red-50' : '',
          ]"
        >
          <div class="flex items-center h-5 mt-0.5">
            <input
              id="acceptTerms"
              v-model="acceptTerms"
              type="checkbox"
              required
              aria-required="true"
              aria-describedby="terms-desc"
              class="h-5 w-5 text-green-600 border-gray-400 rounded cursor-pointer transition-all duration-200 focus:ring-4 focus:ring-green-500/20"
            />
          </div>
          <div class="ml-3 text-sm">
            <label
              for="acceptTerms"
              class="text-gray-700 cursor-pointer font-medium"
            >
              <span class="text-red-500 font-bold" aria-label="campo requerido"
                >*</span
              >
              {{ $t("register.acceptTerms") }}
              <a
                href="#"
                class="font-semibold text-green-600 hover:text-green-700 underline"
                >{{ $t("register.terms") }}</a
              >
              {{ $t("register.and") }}
              <a
                href="#"
                class="font-semibold text-green-600 hover:text-green-700 underline"
                >{{ $t("register.privacy") }}</a
              >
            </label>
            <p id="terms-desc" class="text-xs text-gray-600 mt-1">
              <i class="fas fa-info-circle mr-1" aria-hidden="true"></i>
              Debes aceptar los términos para poder registrarte
            </p>
          </div>
        </div>

        <!-- Botón de registro mejorado -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isLoading || !acceptTerms"
            :aria-busy="isLoading"
            :aria-label="
              !acceptTerms
                ? 'Debe aceptar los términos y condiciones para continuar'
                : isLoading
                ? 'Procesando registro, por favor espere'
                : 'Crear cuenta nueva'
            "
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span v-if="!isLoading" class="flex items-center">
              <i class="fas fa-user-plus mr-2" aria-hidden="true"></i>
              {{ $t("register.submit") }}
            </span>
            <span
              v-else
              class="flex items-center"
              role="status"
              aria-live="polite"
            >
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
              {{ $t("register.creating") }}
            </span>
          </button>
        </div>

        <!-- Login -->
        <div class="text-center pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            {{ $t("register.hasAccount") }}
            <router-link
              to="/login"
              class="font-semibold text-green-600 hover:text-green-700 transition duration-150 hover:underline"
            >
              {{ $t("register.loginLink") }}
            </router-link>
          </p>
        </div>
      </form>

      <!-- Opciones adicionales mejoradas -->
      <div class="text-center">
        <p class="text-xs text-green-100 drop-shadow-lg">
          {{ $t("register.termsText") }}
          <a
            href="#"
            class="text-white hover:text-green-200 font-semibold underline"
            >{{ $t("register.terms") }}</a
          >
          {{ $t("register.and") }}
          <a
            href="#"
            class="text-white hover:text-green-200 font-semibold underline"
            >{{ $t("register.privacy") }}</a
          >
        </p>
      </div>
    </div>
  </div>
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

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

form {
  animation: slideIn 0.3s ease-out;
}

.animate-shake {
  animation: shake 0.5s;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

.animate-slide-in {
  animation: slideInDown 0.3s ease-out;
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

/* Efectos de hover */
input:focus,
select:focus {
  transform: scale(1.01);
}

button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Estilo para el select */
select {
  background-image: none;
}
</style>
