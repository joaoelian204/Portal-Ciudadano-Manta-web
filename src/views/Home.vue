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
          <div
            ref="card1Wrapper"
            class="scroll-fade-in"
            :class="{ 'is-visible': cardVisibility.card1 }"
          >
            <ServiceCard
              ref="card1"
              :imageUrl="'/img1.jpg'"
              :imageAlt="'Servicios de barrio en Manta'"
              :title="$t('home.services.card1.title')"
              :description="$t('home.services.card1.description')"
              gradientColor="blue"
              :isVisible="cardVisibility.card1"
            />
          </div>

          <!-- Tarjeta 2 -->
          <div
            ref="card2Wrapper"
            class="scroll-fade-in"
            :class="{ 'is-visible': cardVisibility.card2 }"
          >
            <ServiceCard
              ref="card2"
              :imageUrl="'/img2.jpg'"
              :imageAlt="'Participación ciudadana activa'"
              :title="$t('home.services.card2.title')"
              :description="$t('home.services.card2.description')"
              gradientColor="green"
              :isVisible="cardVisibility.card2"
            />
          </div>

          <!-- Tarjeta 3 -->
          <div
            ref="card3Wrapper"
            class="scroll-fade-in"
            :class="{ 'is-visible': cardVisibility.card3 }"
          >
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

// Referencias para los wrappers de las tarjetas (card1, card2, card3 removidos - no utilizados)
const card1Wrapper = ref<HTMLElement | null>(null);
const card2Wrapper = ref<HTMLElement | null>(null);
const card3Wrapper = ref<HTMLElement | null>(null);

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
          if (element === card1Wrapper.value) {
            cardVisibility.card1 = true;
          } else if (element === card2Wrapper.value) {
            cardVisibility.card2 = true;
          } else if (element === card3Wrapper.value) {
            cardVisibility.card3 = true;
          }
          
          // Agregar clase para animar imágenes dentro de las tarjetas
          const images = element.querySelectorAll("img");
          images.forEach((img, index) => {
            setTimeout(() => {
              img.classList.add("image-visible");
            }, index * 100);
          });
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px",
    }
  );

  // Observar los wrappers de las tarjetas
  setTimeout(() => {
    if (card1Wrapper.value) observer.observe(card1Wrapper.value);
  }, 100);

  setTimeout(() => {
    if (card2Wrapper.value) observer.observe(card2Wrapper.value);
  }, 200);

  setTimeout(() => {
    if (card3Wrapper.value) observer.observe(card3Wrapper.value);
  }, 300);

  return observer;
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  // Scroll al inicio de la página al cargar
  window.scrollTo({ top: 0, behavior: 'instant' });
  
  // También asegurar que el scroll esté en el top
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

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

/* Animaciones de scroll para contenido */
.scroll-fade-in {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-fade-in.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Animación escalonada para las tarjetas */
.scroll-fade-in:nth-child(1) {
  transition-delay: 0.1s;
}

.scroll-fade-in:nth-child(2) {
  transition-delay: 0.2s;
}

.scroll-fade-in:nth-child(3) {
  transition-delay: 0.3s;
}

/* Animaciones para imágenes dentro de las tarjetas */
.scroll-fade-in img {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.2s;
}

.scroll-fade-in.is-visible img.image-visible,
.scroll-fade-in.is-visible img {
  opacity: 1;
  transform: scale(1);
}

/* Efecto de hover mejorado para las tarjetas */
.scroll-fade-in.is-visible:hover {
  transform: translateY(-8px) scale(1.02);
  transition: all 0.3s ease-out;
}

/* Animación para el contenido de texto dentro de las tarjetas */
.scroll-fade-in h3,
.scroll-fade-in p {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.scroll-fade-in.is-visible h3 {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.3s;
}

.scroll-fade-in.is-visible p {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.4s;
}

/* Responsive para animaciones */
@media (max-width: 768px) {
  .scroll-fade-in {
    transform: translateY(30px) scale(0.98);
  }

  .scroll-fade-in.is-visible {
    transform: translateY(0) scale(1);
  }
}

/* Respetar preferencias de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  .scroll-fade-in {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .scroll-fade-in img {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .scroll-fade-in h3,
  .scroll-fade-in p {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

</style>
