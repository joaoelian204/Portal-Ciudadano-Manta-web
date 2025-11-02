<template>
  <div v-if="isSpeechSupported">
    <!-- Mensaje de advertencia si no soporta síntesis de voz -->
    <div v-if="showUnsupportedMsg" class="fixed bottom-24 right-6 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-shake">
      <i class="fas fa-exclamation-triangle mr-2"></i>
      Tu navegador no soporta síntesis de voz. Prueba en Chrome, Firefox o Safari.
    </div>

    <div
      class="fixed bottom-6 right-6 z-50"
      @mouseenter="showControls = true"
      @mouseleave="showControls = false"
    >
      <!-- Botón principal -->
      <button
        @click="toggleSpeech"
        :class="[
          'group relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4',
          isReading
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:ring-cyan-500/50'
            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:ring-blue-500/50',
        ]"
        :aria-label="
          isReading ? 'Detener lectura de voz' : 'Activar lectura de voz'
        "
        :title="
          isReading ? 'Detener lectura (Clic)' : 'Leer página en voz alta (Clic)'
        "
      >
        <!-- Animación de onda cuando está hablando -->
        <div
          v-if="isReading"
          class="absolute inset-0 rounded-full bg-cyan-300 animate-ping opacity-75"
        ></div>

        <!-- Icono -->
        <div class="relative z-10 flex items-center justify-center h-full">
          <i
            v-if="!isReading"
            class="fas fa-volume-up text-white text-2xl group-hover:scale-110 transition-transform"
            aria-hidden="true"
          ></i>
          <i
            v-else
            class="fas fa-stop text-white text-xl group-hover:scale-110 transition-transform"
            aria-hidden="true"
          ></i>
        </div>

        <!-- Badge de estado -->
        <span v-if="isReading" class="absolute -top-2 -right-2 flex h-5 w-5">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-cyan-500 to-blue-500"
          ></span>
        </span>
      </button>

      <!-- Tooltip informativo -->
      <div
        class="absolute bottom-20 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        {{ isReading ? "🔊 Hablando..." : "🔈 Clic para escuchar" }}
        <div
          class="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"
        ></div>
      </div>

      <!-- Panel de controles expandido (se muestra solo al hacer hover) -->
      <transition name="slide-up">
        <div
          v-if="isReading && showControls"
          class="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-4 w-64 border border-gray-200"
        >
          <!-- Indicador de progreso -->
          <div class="mb-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-gray-700">Leyendo...</span>
              <span class="text-xs text-gray-500">{{ currentLanguage }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: progress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Controles de velocidad -->
          <div class="mb-3">
            <label class="text-xs font-semibold text-gray-700 mb-1 block">
              Velocidad: {{ rate }}x
            </label>
            <input
              v-model.number="rate"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              @change="updateRate"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Lento</span>
              <span>Rápido</span>
            </div>
          </div>

          <!-- Controles de volumen -->
          <div>
            <label class="text-xs font-semibold text-gray-700 mb-1 block">
              Volumen: {{ Math.round(volume * 100) }}%
            </label>
            <input
              v-model.number="volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              @change="updateVolume"
            />
          </div>

          <!-- Botones de control -->
          <div class="flex gap-2 mt-4">
            <button
              @click="pauseResumeSpeech"
              class="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <i
                :class="isPaused ? 'fas fa-play' : 'fas fa-pause'"
                class="mr-1"
              ></i>
              {{ isPaused ? "Reanudar" : "Pausar" }}
            </button>
            <button
              @click="stopSpeech"
              class="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <i class="fas fa-stop mr-1"></i>
              Detener
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

// Estado
const isReading = ref(false);
const isPaused = ref(false);
const showControls = ref(false);
const rate = ref(1.0);
const volume = ref(1.0);
const progress = ref(0);

// Detección robusta de soporte de síntesis de voz
function isSpeechReallySupported() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  try {
    return true;
  } catch {
    return false;
  }
}
const isSpeechSupported = ref(isSpeechReallySupported());
const showUnsupportedMsg = ref(false);

// Instancia de síntesis de voz
let speechSynthesis: SpeechSynthesis | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Idioma currentLanguage mapeado a códigos de voz
const currentLanguage = computed(() => {
  const langMap: Record<string, string> = {
    es: "ES",
    en: "EN",
    qu: "QU",
  };
  return langMap[locale.value] || "ES";
});

const getVoiceLanguage = () => {
  const voiceMap: Record<string, string> = {
    es: "es-ES",
    en: "en-US",
    qu: "es-ES", // Kichwa usa voz en español
  };
  return voiceMap[locale.value] || "es-ES";
};

// Variables para control de voces
let voicesLoaded = false;
let retryCount = 0;
const MAX_RETRIES = 2;
const MAX_TEXT_LENGTH = 500; // Limitar texto para síntesis móvil

// Función para cargar voces
const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!speechSynthesis) {
      resolve([]);
      return;
    }

    let voices = speechSynthesis.getVoices();

    if (voices.length > 0) {
      voicesLoaded = true;
      resolve(voices);
      return;
    }

    // Esperar al evento voiceschanged
    speechSynthesis.onvoiceschanged = () => {
      if (speechSynthesis) {
        voices = speechSynthesis.getVoices();
        voicesLoaded = true;
        resolve(voices);
      }
    };

    // Timeout de seguridad (5 segundos)
    setTimeout(() => {
      if (speechSynthesis) {
        voices = speechSynthesis.getVoices();
        voicesLoaded = true;
        resolve(voices);
      }
    }, 5000);
  });
};

// Inicializar Web Speech API
onMounted(async () => {
  if ("speechSynthesis" in window) {
    speechSynthesis = window.speechSynthesis;
    // Precargar voces
    await loadVoices();
  } else {
    console.warn("Web Speech API no soportada en este navegador");
  }

  // Panel flotante: ocultar si se hace clic fuera en móvil
  if (window.innerWidth < 768) {
    document.addEventListener('touchstart', handleOutsideTouch);
  }
});

// Obtener texto de la página
const getPageText = (): string => {
  const mainContent = document.querySelector("main") || document.body;

  // Excluir elementos que no deben leerse
  const excludeSelectors = [
    "script",
    "style",
    "nav",
    "footer",
    ".sr-only",
    '[aria-hidden="true"]',
    "button",
    "input",
  ];

  const clone = mainContent.cloneNode(true) as HTMLElement;

  // Eliminar elementos excluidos
  excludeSelectors.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((el) => el.remove());
  });

  // Obtener texto limpio
  let text = clone.innerText || clone.textContent || "";

  // Limpiar espacios múltiples y saltos de línea
  text = text.replace(/\s+/g, " ").trim();

  return text;
};

// Función principal para leer
const toggleSpeech = () => {
  if (!isSpeechSupported) {
    showUnsupportedMsg.value = true;
    return;
  }
  if (isReading.value) {
    stopSpeech();
  } else {
    startSpeech();
  }
};

const startSpeech = async () => {
  if (!speechSynthesis) {
    alert("Tu navegador no soporta síntesis de voz");
    return;
  }

  let text = getPageText();
  if (!text) {
    alert("No hay texto para leer");
    return;
  }
  // Limitar texto para síntesis móvil
  if (text.length > MAX_TEXT_LENGTH) {
    text = text.slice(0, MAX_TEXT_LENGTH) + "...";
  }

  // Asegurar que las voces estén cargadas
  let voices: SpeechSynthesisVoice[] = [];
  if (!voicesLoaded) {
    voices = await loadVoices();
  } else {
    voices = speechSynthesis.getVoices();
  }

  // Crear nueva instancia de utterance
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = getVoiceLanguage();
  currentUtterance.rate = rate.value;
  currentUtterance.volume = volume.value;

  // Seleccionar voz apropiada
  const targetLang = getVoiceLanguage();
  const langPrefix = targetLang.split("-")[0] || "es";
  const selectedVoice =
    voices.find((voice) => voice.lang.startsWith(targetLang)) ||
    voices.find((voice) => voice.lang.startsWith(langPrefix)) ||
    voices[0];

  if (selectedVoice) {
    currentUtterance.voice = selectedVoice;
  }

  // Eventos
  currentUtterance.onstart = () => {
    isReading.value = true;
    isPaused.value = false;
    progress.value = 0;
    retryCount = 0;
  };

  currentUtterance.onend = () => {
    stopSpeech();
  };

  currentUtterance.onerror = (event) => {
    if (event.error === "interrupted" || event.error === "canceled") {
      stopSpeech();
      return;
    }
    console.error("Error en síntesis de voz:", {
      error: event.error,
      charIndex: event.charIndex,
      elapsedTime: event.elapsedTime,
    });
    if (event.error === "not-allowed") {
      console.warn("⚠️ Permiso de audio denegado. El usuario debe interactuar con la página primero.");
    } else if (event.error === "network") {
      console.warn("⚠️ Error de red al cargar voces.");
    } else if (event.error === "synthesis-failed") {
      retryCount++;
      if (retryCount <= MAX_RETRIES) {
        console.warn(`⚠️ Fallo en la síntesis de voz. Reintentando (${retryCount}/${MAX_RETRIES})...`);
        setTimeout(() => {
          if (speechSynthesis) {
            speechSynthesis.cancel();
            startSpeech();
          }
        }, 500);
        return;
      } else {
        alert("No se pudo reproducir la síntesis de voz en este dispositivo. Intenta con otro navegador o reduce el texto.");
      }
    }
    stopSpeech();
  };

  // Simular progreso
  let progressInterval: number;
  currentUtterance.onboundary = () => {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = window.setInterval(() => {
      if (progress.value < 95) {
        progress.value += 1;
      }
    }, 200);
  };

  // Cancelar cualquier síntesis anterior
  speechSynthesis.cancel();

  // Pequeño delay para asegurar que todo esté listo
  setTimeout(() => {
    if (speechSynthesis && currentUtterance) {
      speechSynthesis.speak(currentUtterance);
    }
  }, 100);
};

const stopSpeech = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
  isReading.value = false;
  isPaused.value = false;
  progress.value = 0;
  currentUtterance = null;
};

const pauseResumeSpeech = () => {
  if (!speechSynthesis) return;

  if (isPaused.value) {
    speechSynthesis.resume();
    isPaused.value = false;
  } else {
    speechSynthesis.pause();
    isPaused.value = true;
  }
};

const updateRate = () => {
  if (currentUtterance && isReading.value) {
    stopSpeech();
    setTimeout(startSpeech, 100);
  }
};

const updateVolume = () => {
  if (currentUtterance) {
    currentUtterance.volume = volume.value;
  }
};

// Limpieza
onUnmounted(() => {
  stopSpeech();
});

// Atajos de teclado
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl + Shift + S para activar/desactivar
    if (e.ctrlKey && e.shiftKey && e.key === "S") {
      e.preventDefault();
      toggleSpeech();
    }
  };

  window.addEventListener("keydown", handleKeyPress);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyPress);
  });
});

// Panel flotante: ocultar si se hace clic fuera en móvil
function handleOutsideTouch(e: TouchEvent) {
  const panel = document.querySelector('.absolute.bottom-20.right-0');
  if (panel && !panel.contains(e.target as Node)) {
    showControls.value = false;
  }
}
</script>

<style scoped>
/* Animación para el panel */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Estilos para el rango de entrada */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #06b6d4, #2563eb);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(6, 182, 212, 0.4);
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(6, 182, 212, 0.6);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #06b6d4, #2563eb);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(6, 182, 212, 0.4);
  transition: all 0.2s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(6, 182, 212, 0.6);
}

/* Animación de pulso */
@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Animación de sacudida */
@keyframes shake {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-shake {
  animation: shake 0.6s ease-in-out infinite;
}
</style>
