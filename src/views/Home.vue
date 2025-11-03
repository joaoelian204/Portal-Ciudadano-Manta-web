<template>
  <main
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
    role="main"
    aria-label="Página principal del Portal Ciudadano"
  >
    <!-- Hero Section -->
    <section class="relative overflow-hidden" aria-label="Bienvenida al portal">
      <!-- Imagen aérea de Manta con efectos modernos -->
      <div class="relative h-screen overflow-hidden">
        <img
          :src="imageSrc"
          alt="Vista aérea panorámica de la ciudad de Manta, Ecuador"
          class="w-full h-full object-cover transition-transform duration-[3000ms] ease-out will-change-transform"
          :class="[isImageLoaded ? 'scale-105 hover:scale-110' : 'scale-100']"
          @load="handleImageLoad"
          @error="handleImageError"
          loading="eager"
          fetchpriority="high"
        />

        <!-- Overlay con gradiente optimizado -->
        <div class="absolute inset-0 bg-hero-overlay"></div>

        <!-- Partículas flotantes decorativas -->
        <div
          class="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            v-for="particle in particles"
            :key="particle.id"
            :class="['particle', `particle-${particle.id}`]"
          ></div>
        </div>

        <!-- Contenido principal del hero -->
        <div class="absolute inset-0 flex items-center justify-center px-4">
          <header
            class="text-center text-white max-w-5xl mx-auto hero-content"
            role="banner"
          >
            <!-- Título principal con efectos -->
            <h1
              class="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight"
              role="heading"
              aria-level="1"
            >
              <span
                class="inline-block animate-fade-in-up"
                style="animation-delay: 0.2s"
              >
                {{ $t("home.hero.titleWord1") }}
              </span>
              <span
                class="inline-block animate-fade-in-up text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text"
                style="animation-delay: 0.4s"
              >
                {{ $t("home.hero.titleWord2") }}
              </span>
              <br />
              <span
                class="inline-block animate-fade-in-up text-gradient-gold"
                style="animation-delay: 0.6s"
              >
                {{ $t("home.hero.titleWord3") }}
              </span>
            </h1>

            <!-- Subtítulo elegante -->
            <p
              class="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed opacity-90 max-w-4xl mx-auto animate-fade-in-up"
              style="animation-delay: 0.8s"
            >
              <span class="inline-block" role="img" aria-label="ola">🌊</span>
              {{ $t("home.hero.subtitlePart1") }}
              <span class="font-semibold text-cyan-300">{{
                $t("home.hero.subtitlePart2")
              }}</span>
              {{ $t("home.hero.subtitlePart3") }}
              <span class="font-semibold text-blue-300">{{
                $t("home.hero.subtitlePart4")
              }}</span>
            </p>
          </header>
        </div>
      </div>
    </section>

    <!-- Sección de Servicios -->
    <section
      class="py-20 px-4 relative"
      aria-label="Nuestros servicios principales"
    >
      <div class="max-w-7xl mx-auto">
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          role="list"
        >
          <!-- Tarjeta 1 -->
          <ServiceCard
            ref="card1"
            :imageUrl="'/img1.jpg'"
            :imageAlt="'Servicios de barrio en Manta'"
            :title="$t('home.services.card1.title')"
            :description="$t('home.services.card1.description')"
            gradientColor="blue"
            :isVisible="cardVisibility.card1"
          />

          <!-- Tarjeta 2 -->
          <ServiceCard
            ref="card2"
            :imageUrl="'/img2.jpg'"
            :imageAlt="'Participación ciudadana activa'"
            :title="$t('home.services.card2.title')"
            :description="$t('home.services.card2.description')"
            gradientColor="green"
            :isVisible="cardVisibility.card2"
          />

          <!-- Tarjeta 3 -->
          <ServiceCard
            ref="card3"
            :imageUrl="'/img3.jpg'"
            :imageAlt="'Mejora continua de servicios'"
            :title="$t('home.services.card3.title')"
            :description="$t('home.services.card3.description')"
            gradientColor="purple"
            :isVisible="cardVisibility.card3"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import ServiceCard from "../components/cards/ServiceCard.vue";

// Variables reactivas
const imageSrc = ref("/manta.jpg");
const isImageLoaded = ref(false);

// Referencias para las tarjetas
const card1 = ref<any>(null);
const card2 = ref<any>(null);
const card3 = ref<any>(null);

// Estado de visibilidad de las tarjetas
const cardVisibility = reactive({
  card1: false,
  card2: false,
  card3: false,
});

// Configuración de partículas
const particles = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);

// Manejar carga exitosa de la imagen
const handleImageLoad = () => {
  isImageLoaded.value = true;
};

// Manejar error si la imagen no carga
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/placeholder-city.jpg";
  console.warn("Error cargando imagen de Manta, usando imagen de respaldo");
};

// Intersection Observer para animaciones al scroll
const setupScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          // Identificar qué tarjeta es y actualizar su visibilidad
          if (element === card1.value?.$el) {
            cardVisibility.card1 = true;
          } else if (element === card2.value?.$el) {
            cardVisibility.card2 = true;
          } else if (element === card3.value?.$el) {
            cardVisibility.card3 = true;
          }
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  setTimeout(() => {
    if (card1.value?.$el) observer.observe(card1.value.$el);
  }, 100);

  setTimeout(() => {
    if (card2.value?.$el) observer.observe(card2.value.$el);
  }, 300);

  setTimeout(() => {
    if (card3.value?.$el) observer.observe(card3.value.$el);
  }, 500);

  return observer;
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  // Animación inicial de la página
  console.log("Portal Ciudadano Manta - Experiencia mejorada cargada ✨");

  // Configurar animaciones de scroll
  observer = setupScrollAnimations();
});

onUnmounted(() => {
  // Limpiar observer
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
/* Gradiente optimizado del hero */
.bg-hero-overlay {
  background: linear-gradient(
    135deg,
    rgba(30, 58, 138, 0.7) 0%,
    rgba(30, 64, 175, 0.5) 50%,
    rgba(22, 78, 99, 0.6) 100%
  );
}

/* Animaciones optimizadas */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 60px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -20px, 0);
  }
}

/* Clases de utilidad */
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out both;
}

.hero-content {
  animation: fadeInUp 1.2s ease-out both;
}

.text-gradient-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #fbbf24 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent; /* Fallback para navegadores que no soportan background-clip */
}

/* Partículas flotantes optimizadas */
.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  will-change: transform;
}

.particle-1 {
  width: 8px;
  height: 8px;
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.particle-2 {
  width: 12px;
  height: 12px;
  top: 60%;
  right: 30%;
  animation-delay: 2s;
}

.particle-3 {
  width: 6px;
  height: 6px;
  bottom: 30%;
  left: 70%;
  animation-delay: 4s;
}

.particle-4 {
  width: 10px;
  height: 10px;
  top: 40%;
  left: 60%;
  animation-delay: 1s;
}

/* Optimizaciones para dispositivos móviles */
@media (max-width: 768px) {
  .particle {
    display: none;
  }

  .hero-content h1 {
    font-size: clamp(2.5rem, 8vw, 3.5rem);
  }

  .hero-content p {
    font-size: clamp(1.125rem, 4vw, 1.5rem);
  }
}

/* Optimizaciones para dispositivos con preferencia de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .hero-content,
  .particle {
    animation: none;
  }

  .transition-transform {
    transition: none;
  }
}

/* Mejoras de rendimiento */
.will-change-transform {
  will-change: transform;
}

/* Estados de carga */
img:not([src]),
img[src=""] {
  opacity: 0;
}

img {
  transition: opacity 0.3s ease-in-out;
}
</style>
