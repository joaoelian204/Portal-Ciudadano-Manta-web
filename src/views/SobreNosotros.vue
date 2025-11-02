<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white" role="main">
    <!-- Hero Section con imagen mejorado - RESPONSIVO -->
    <section
      class="relative h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden"
      aria-label="Presentación sobre nosotros"
      role="banner"
    >
      <div class="absolute inset-0">
        <img
          src="@/assets/login/login.jpg"
          alt="Manta - Ciudad Puerto"
          class="w-full h-full object-cover animate-ken-burns"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"
        ></div>
        <!-- Efecto de partículas -->
        <div class="absolute inset-0 opacity-20">
          <div
            class="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float"
          ></div>
          <div
            class="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-300 rounded-full animate-float-delayed"
          ></div>
          <div
            class="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float-slow"
          ></div>
        </div>
      </div>

      <div
        class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center"
      >
        <div class="text-white w-full max-w-4xl">
          <div class="mb-4 sm:mb-6 animate-slide-down">
            <span
              class="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full text-xs sm:text-sm font-semibold text-cyan-300 mb-3 sm:mb-4"
            >
              💻 {{ $t("about.hero.badge") }}
            </span>
          </div>
          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200 leading-tight"
          >
            {{ $t("about.hero.title") }}
          </h1>
          <p
            class="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed font-light mb-6 sm:mb-8 md:mb-10 animate-fade-in-delayed max-w-3xl"
          >
            {{ $t("about.hero.subtitle") }}
          </p>
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 animate-fade-in-more-delayed"
          >
            <div
              class="h-1 w-16 sm:w-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
            ></div>
            <p
              class="text-base sm:text-lg md:text-xl text-gray-200 italic font-medium"
            >
              "{{ $t("about.hero.quote") }}"
            </p>
          </div>
          <!-- Botón CTA -->
          <div class="mt-6 sm:mt-8 md:mt-10">
            <a
              href="#contenido"
              class="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <span>{{ $t("about.hero.cta") }}</span>
              <svg
                class="h-4 w-4 sm:h-5 sm:w-5 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div
        id="contenido"
        class="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <svg
          class="h-6 w-6 sm:h-8 sm:w-8 text-white opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <!-- Banner informativo con imagen de Manta -->
      <div
        class="mb-20 relative overflow-hidden rounded-3xl shadow-2xl animate-fade-in"
      >
        <div class="grid md:grid-cols-2 gap-0">
          <div class="relative h-[400px] md:h-auto overflow-hidden group">
            <img
              src="@/assets/sobreNosotros/img7.jpg"
              alt="Vista aérea de Manta"
              class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            ></div>
            <div class="absolute bottom-6 left-6 text-white">
              <p
                class="text-sm font-semibold bg-cyan-500/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block mb-2"
              >
                📍 {{ $t("about.location.city") }}
              </p>
              <h3 class="text-2xl font-bold drop-shadow-lg">
                {{ $t("about.location.subtitle") }}
              </h3>
            </div>
          </div>
          <div
            class="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-10 md:p-12 text-white flex items-center"
          >
            <div>
              <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {{ $t("about.banner.title") }}
              </h2>
              <p class="text-lg md:text-xl leading-relaxed text-blue-50 mb-6">
                {{ $t("about.banner.description") }}
              </p>
              <div class="flex flex-wrap gap-3">
                <span
                  class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
                >
                  📋 {{ $t("about.banner.badge1") }}
                </span>
                <span
                  class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
                >
                  📊 {{ $t("about.banner.badge2") }}
                </span>
                <span
                  class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
                >
                  ℹ️ {{ $t("about.banner.badge3") }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Misión Compacta - Mejorada y Responsiva -->
      <div class="mb-16 text-center max-w-4xl mx-auto px-4">
        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6"
        >
          {{ $t("about.mission.title") }}
        </h2>
        <p
          class="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8"
        >
          {{ $t("about.mission.description") }}
        </p>
        <img
          src="@/assets/sobreNosotros/img6.jpg"
          alt="Ciudad de Manta"
          class="w-full rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-shadow duration-300"
        />
      </div>

      <!-- Funcionalidades Principales -->
      <div class="mb-20" role="region" aria-label="Funcionalidades del portal">
        <div class="text-center mb-12">
          <span
            class="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-bold mb-4"
            role="doc-subtitle"
          >
            🚀 {{ $t("about.features.badge") }}
          </span>
          <h2
            class="text-5xl font-bold text-gray-800 mb-4"
            role="heading"
            aria-level="2"
          >
            {{ $t("about.features.title") }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t("about.features.subtitle") }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8" role="list">
          <!-- Reportar Problemas -->
          <div
            class="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <!-- Decoración de fondo -->
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"
            ></div>
            <div
              class="relative bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform"
            >
              <svg
                class="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 class="relative text-2xl font-bold text-gray-800 mb-4">
              📋 {{ $t("about.features.report.title") }}
            </h3>
            <p class="relative text-gray-600 leading-relaxed mb-6">
              {{ $t("about.features.report.description") }}
            </p>
            <div class="relative flex items-center text-blue-600 font-semibold">
              <svg
                class="h-5 w-5 mr-2"
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
              <span>{{ $t("about.features.report.badge") }}</span>
            </div>
          </div>

          <!-- Responder Encuestas -->
          <div
            class="group relative bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <!-- Decoración de fondo -->
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"
            ></div>
            <div
              class="relative bg-gradient-to-br from-cyan-500 to-cyan-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform"
            >
              <svg
                class="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 class="relative text-2xl font-bold text-gray-800 mb-4">
              📊 {{ $t("about.features.survey.title") }}
            </h3>
            <p class="relative text-gray-600 leading-relaxed mb-6">
              {{ $t("about.features.survey.description") }}
            </p>
            <div class="relative flex items-center text-cyan-600 font-semibold">
              <svg
                class="h-5 w-5 mr-2"
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
              <span>{{ $t("about.features.survey.badge") }}</span>
            </div>
          </div>

          <!-- Consultar Información -->
          <div
            class="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <!-- Decoración de fondo -->
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"
            ></div>
            <div
              class="relative bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform"
            >
              <svg
                class="h-8 w-8 text-white"
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
            </div>
            <h3 class="relative text-2xl font-bold text-gray-800 mb-4">
              ℹ️ {{ $t("about.features.info.title") }}
            </h3>
            <p class="relative text-gray-600 leading-relaxed mb-6">
              {{ $t("about.features.info.description") }}
            </p>
            <div
              class="relative flex items-center text-green-600 font-semibold"
            >
              <svg
                class="h-5 w-5 mr-2"
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
              <span>{{ $t("about.features.info.badge") }}</span>
            </div>
          </div>
        </div>

        <!-- Proceso de Registro -->
        <div
          class="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-10 border-2 border-blue-100"
        >
          <div class="text-center mb-8">
            <h3 class="text-3xl font-bold text-gray-800 mb-3">
              🔐 {{ $t("about.registration.title") }}
            </h3>
            <p class="text-gray-600 text-lg">
              {{ $t("about.registration.subtitle") }}
            </p>
          </div>
          <div class="grid md:grid-cols-4 gap-6">
            <div class="text-center">
              <div
                class="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
              >
                1
              </div>
              <h4 class="font-bold text-gray-800 mb-2">
                {{ $t("about.registration.step1.title") }}
              </h4>
              <p class="text-sm text-gray-600">
                {{ $t("about.registration.step1.description") }}
              </p>
            </div>
            <div class="text-center">
              <div
                class="bg-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
              >
                2
              </div>
              <h4 class="font-bold text-gray-800 mb-2">
                {{ $t("about.registration.step2.title") }}
              </h4>
              <p class="text-sm text-gray-600">
                {{ $t("about.registration.step2.description") }}
              </p>
            </div>
            <div class="text-center">
              <div
                class="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
              >
                3
              </div>
              <h4 class="font-bold text-gray-800 mb-2">
                {{ $t("about.registration.step3.title") }}
              </h4>
              <p class="text-sm text-gray-600">
                {{ $t("about.registration.step3.description") }}
              </p>
            </div>
            <div class="text-center">
              <div
                class="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
              >
                4
              </div>
              <h4 class="font-bold text-gray-800 mb-2">
                {{ $t("about.registration.step4.title") }}
              </h4>
              <p class="text-sm text-gray-600">
                {{ $t("about.registration.step4.description") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Página Sobre Nosotros - Portal Ciudadano Manta
</script>

<style scoped>
/* Animaciones principales */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-delayed {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  50% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-more-delayed {
  0%,
  70% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ken-burns {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-30px) translateX(-15px);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-15px) translateX(20px);
  }
}

/* Aplicar animaciones */
.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-fade-in-delayed {
  animation: fade-in-delayed 1.5s ease-out;
}

.animate-fade-in-more-delayed {
  animation: fade-in-more-delayed 2s ease-out;
}

.animate-slide-down {
  animation: slide-down 0.8s ease-out;
}

.animate-ken-burns {
  animation: ken-burns 20s ease-in-out infinite alternate;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

/* Scroll suave */
html {
  scroll-behavior: smooth;
}

/* Mejoras en hover */
.group:hover .group-hover\:rotate-12 {
  transform: rotate(12deg);
}

.group:hover .group-hover\:rotate-\[360deg\] {
  transform: rotate(360deg);
}

/* Efecto glassmorphism mejorado */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Gradientes de texto */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
