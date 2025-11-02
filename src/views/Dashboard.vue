<template>
  <div class="min-h-screen bg-white">
    <!-- Skip to main content (WCAG 2.4.1) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      Saltar al contenido principal
    </a>

    <!-- Contenido Principal -->
    <main
      id="main-content"
      class="container mx-auto px-4 py-12 transition-all duration-300"
      role="main"
    >
      <div class="max-w-4xl mx-auto">
        <!-- Banner de Modo Administrador (solo visible para admins) -->
        <div
          v-if="authStore.isAdministrador()"
          class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-6 mb-8 border-2 border-purple-400 animate-pulse-soft"
          role="alert"
          aria-live="polite"
        >
          <div class="flex items-center space-x-4">
            <div
              class="bg-white/20 backdrop-blur-sm rounded-full p-3 flex-shrink-0"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </div>
            <div class="flex-1">
              <h3
                class="text-white font-bold text-lg mb-1 flex items-center gap-2"
              >
                <span>👁️</span> {{ $t("dashboard.adminPreview.title") }}
              </h3>
              <p class="text-white/90 text-sm">
                {{ $t("dashboard.adminPreview.description") }}
              </p>
            </div>
            <router-link
              to="/admin"
              class="hidden sm:flex items-center gap-2 bg-white hover:bg-gray-100 text-purple-600 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 flex-shrink-0 shadow-lg"
              :aria-label="$t('dashboard.adminPreview.backToPanel')"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              <span>{{ $t("dashboard.adminPreview.backToPanel") }}</span>
            </router-link>
          </div>
          <!-- Botón móvil -->
          <router-link
            to="/admin"
            class="sm:hidden mt-4 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-purple-600 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg w-full"
            :aria-label="$t('dashboard.adminPreview.backToPanel')"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            <span>{{ $t("dashboard.adminPreview.backToPanel") }}</span>
          </router-link>
        </div>

        <!-- Saludo Principal -->
        <div
          class="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 border-t-4 border-blue-600"
        >
          <div class="flex items-center space-x-4 mb-4">
            <!-- Avatar con inicial -->
            <div
              class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
              aria-hidden="true"
              role="img"
              :aria-label="`Avatar de ${userName}`"
            >
              {{ userInitial }}
            </div>

            <!-- Saludo -->
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                {{ $t("dashboard.greeting") }}
                <span class="text-blue-600">{{ userName }}</span
                >!
              </h1>
              <p class="text-lg text-gray-600">
                {{ $t("dashboard.welcome") }}
              </p>
            </div>
          </div>

          <!-- Info adicional sutil -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex items-center space-x-2 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ $t("dashboard.location") }}</span>
            </div>
          </div>
        </div>

        <!-- Servicios Ciudadanos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- Reportar Problema -->
          <div
            class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div class="text-center">
              <div class="text-5xl mb-4" aria-hidden="true">📢</div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">
                {{ $t("dashboard.sections.reports.title") }}
              </h3>
              <p class="text-gray-600 mb-6">
                {{ $t("dashboard.sections.reports.description") }}
              </p>
              <router-link
                to="/reportar-problema"
                class="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                :aria-label="$t('dashboard.sections.reports.title')"
              >
                {{ $t("dashboard.sections.reports.button") }}
              </router-link>
            </div>
          </div>

          <!-- Encuestas -->
          <div
            class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div class="text-center">
              <div class="text-5xl mb-4" aria-hidden="true">📋</div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">
                {{ $t("dashboard.sections.surveys.title") }}
              </h3>
              <p class="text-gray-600 mb-6">
                {{ $t("dashboard.sections.surveys.subtitle") }}
              </p>
              <router-link
                to="/encuestas"
                class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :aria-label="$t('dashboard.sections.surveys.title')"
              >
                {{ $t("dashboard.sections.surveys.participate") }} ({{
                  encuestasActivas.length
                }})
              </router-link>
            </div>
          </div>

          <!-- Noticias -->
          <div
            class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div class="text-center">
              <div class="text-5xl mb-4" aria-hidden="true">📰</div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">
                {{ $t("dashboard.sections.news.title") }}
              </h3>
              <p class="text-gray-600 mb-6">
                {{ $t("dashboard.sections.news.subtitle") }}
              </p>
              <router-link
                to="/noticias"
                class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                :aria-label="$t('dashboard.sections.news.title')"
              >
                {{ $t("dashboard.sections.news.readMore") }} ({{
                  noticiasStore.noticias.length
                }})
              </router-link>
            </div>
          </div>
        </div>

        <!-- Mensaje de Bienvenida -->
        <div
          class="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-8 text-white text-center"
          role="complementary"
          aria-label="Mensaje de bienvenida"
        >
          <div class="text-6xl mb-4" aria-hidden="true">🏛️</div>
          <h2 class="text-2xl md:text-3xl font-bold mb-3">
            Tu voz, tu ciudad, tu futuro
          </h2>
          <p class="text-lg opacity-90 max-w-2xl mx-auto">
            Gracias por ser parte de nuestra comunidad digital. Juntos
            construimos un Manta mejor.
          </p>
        </div>
      </div>
    </main>

    <!-- Modal Encuestas -->
    <div
      v-if="showEncuestasModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeEncuestasModal"
      role="dialog"
      aria-labelledby="encuestas-modal-title"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div
          class="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-t-2xl sticky top-0 z-10"
        >
          <div class="flex items-center justify-between">
            <h2
              id="encuestas-modal-title"
              class="text-2xl font-bold text-white"
            >
              {{
                selectedEncuesta
                  ? selectedEncuesta.titulo
                  : "Encuestas Disponibles"
              }}
            </h2>
            <button
              @click="closeEncuestasModal"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Cerrar modal de encuestas"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6" :aria-busy="encuestasStore.loading">
          <!-- Loading State -->
          <div
            v-if="encuestasStore.loading"
            class="text-center py-12"
            role="status"
            aria-live="polite"
          >
            <div class="flex justify-center mb-4">
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"
              ></div>
            </div>
            <p class="text-gray-700 font-semibold mb-2">
              Cargando encuestas...
            </p>
            <p class="text-gray-500 text-sm mb-4">
              Si la carga tarda, puede deberse a la conexión a la base de datos.
              <br />Por favor espera un momento.
            </p>
            <button
              @click="closeEncuestasModal"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cerrar
            </button>
            <span class="sr-only">Cargando encuestas...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="encuestasStore.error" class="text-center py-12">
            <div class="text-red-600 mb-4">
              <svg
                class="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 class="text-xl font-bold mb-2">Error al cargar</h3>
              <p class="text-gray-600">{{ encuestasStore.error }}</p>
            </div>
            <button
              @click="toggleEncuestas"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>

          <!-- Vista de Encuesta Individual -->
          <div v-else-if="selectedEncuesta" class="space-y-6">
            <!-- Botón Volver -->
            <button
              @click="volverALista"
              class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
              aria-label="Volver a la lista de encuestas"
            >
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
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Volver a la lista
            </button>

            <!-- Información de la encuesta -->
            <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <p class="text-gray-700 mb-4">
                {{ selectedEncuesta.descripcion }}
              </p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                <span class="inline-flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    ></path>
                  </svg>
                  {{ getTipoLabel(selectedEncuesta.tipo) }}
                </span>
                <span class="inline-flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Finaliza: {{ formatDate(selectedEncuesta.fecha_fin) }}
                </span>
              </div>
            </div>

            <!-- Formulario de respuesta -->
            <form @submit.prevent="enviarRespuesta" class="space-y-6">
              <!-- Opción Múltiple -->
              <div
                v-if="
                  selectedEncuesta.tipo === 'opcion_multiple' &&
                  Array.isArray(selectedEncuesta.opciones)
                "
              >
                <fieldset>
                  <legend
                    class="block text-lg font-semibold text-gray-800 mb-4"
                  >
                    Selecciona una opción:
                  </legend>
                  <div class="space-y-3">
                    <label
                      v-for="(opcion, index) in selectedEncuesta.opciones"
                      :key="index"
                      class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                      :class="
                        respuestaEncuesta.respuesta === opcion
                          ? 'border-blue-600 bg-blue-50'
                          : ''
                      "
                    >
                      <input
                        v-model="respuestaEncuesta.respuesta"
                        :value="opcion"
                        type="radio"
                        name="respuesta"
                        class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <span class="ml-3 text-gray-700 font-medium">{{
                        opcion
                      }}</span>
                    </label>
                  </div>
                </fieldset>
              </div>

              <!-- Calificación -->
              <div v-else-if="selectedEncuesta.tipo === 'calificacion'">
                <fieldset>
                  <legend
                    class="block text-lg font-semibold text-gray-800 mb-4"
                  >
                    Califica del 1 al 5:
                  </legend>
                  <div class="flex justify-center gap-4">
                    <label
                      v-for="n in 5"
                      :key="n"
                      class="flex flex-col items-center cursor-pointer group"
                    >
                      <input
                        v-model.number="respuestaEncuesta.calificacion"
                        :value="n"
                        type="radio"
                        name="calificacion"
                        class="sr-only"
                        required
                      />
                      <div
                        class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200 border-2"
                        :class="
                          respuestaEncuesta.calificacion === n
                            ? 'bg-blue-600 text-white border-blue-600 scale-110'
                            : 'bg-white text-gray-600 border-gray-300 group-hover:border-blue-400 group-hover:bg-blue-50'
                        "
                      >
                        {{ n }}
                      </div>
                      <span class="text-xs text-gray-600 mt-2">
                        {{
                          n === 1
                            ? "Muy malo"
                            : n === 2
                            ? "Malo"
                            : n === 3
                            ? "Regular"
                            : n === 4
                            ? "Bueno"
                            : "Excelente"
                        }}
                      </span>
                    </label>
                  </div>
                </fieldset>
              </div>

              <!-- Pregunta Abierta -->
              <div v-else-if="selectedEncuesta.tipo === 'abierta'">
                <label
                  for="respuesta-abierta"
                  class="block text-lg font-semibold text-gray-800 mb-4"
                >
                  Tu respuesta:
                </label>
                <textarea
                  id="respuesta-abierta"
                  v-model="respuestaEncuesta.texto"
                  required
                  rows="6"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Escribe tu respuesta aquí..."
                  aria-required="true"
                ></textarea>
              </div>

              <!-- Botón Enviar -->
              <div class="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  @click="volverALista"
                  class="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="submittingRespuesta"
                  class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ submittingRespuesta ? "Enviando..." : "Enviar Respuesta" }}
                </button>
              </div>
            </form>
          </div>

          <!-- Lista de Encuestas -->
          <div v-else>
            <!-- Empty State -->
            <div v-if="encuestasActivas.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📋</div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">
                No hay encuestas disponibles
              </h3>
              <p class="text-gray-600">
                Por el momento no hay encuestas activas. Vuelve pronto para
                participar.
              </p>
            </div>

            <!-- Encuestas Cards -->
            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 gap-6"
              role="list"
            >
              <article
                v-for="encuesta in encuestasActivas"
                :key="encuesta.id"
                class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-400 overflow-hidden"
                role="listitem"
              >
                <div
                  class="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-gray-200"
                >
                  <h3 class="text-lg font-bold text-gray-800 mb-2">
                    {{ encuesta.titulo }}
                  </h3>
                  <span
                    class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    {{ getTipoLabel(encuesta.tipo) }}
                  </span>
                </div>
                <div class="p-6">
                  <p class="text-gray-700 mb-4 line-clamp-3">
                    {{ encuesta.descripcion }}
                  </p>
                  <div class="flex items-center text-sm text-gray-600 mb-4">
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    Finaliza: {{ formatDate(encuesta.fecha_fin) }}
                  </div>
                  <button
                    @click="seleccionarEncuesta(encuesta)"
                    class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    :aria-label="`Responder encuesta: ${encuesta.titulo}`"
                  >
                    Responder Encuesta
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Noticias -->
    <div
      v-if="showNoticiasModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeNoticiasModal"
      role="dialog"
      aria-labelledby="noticias-modal-title"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div
          class="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-t-2xl sticky top-0 z-10"
        >
          <div class="flex items-center justify-between">
            <h2 id="noticias-modal-title" class="text-2xl font-bold text-white">
              {{
                selectedNoticia ? selectedNoticia.titulo : "Noticias de Manta"
              }}
            </h2>
            <button
              @click="closeNoticiasModal"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Cerrar modal de noticias"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6" :aria-busy="noticiasStore.loading">
          <!-- Loading State -->
          <div
            v-if="noticiasStore.loading"
            class="text-center py-12"
            role="status"
            aria-live="polite"
          >
            <div class="flex justify-center mb-4">
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"
              ></div>
            </div>
            <p class="text-gray-700 font-semibold mb-2">Cargando noticias...</p>
            <p class="text-gray-500 text-sm mb-4">
              Si la carga tarda, puede deberse a la conexión a la base de datos.
              <br />Por favor espera un momento.
            </p>
            <button
              @click="closeNoticiasModal"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cerrar
            </button>
            <span class="sr-only">Cargando noticias...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="noticiasStore.error" class="text-center py-12">
            <div class="text-red-600 mb-4">
              <svg
                class="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 class="text-xl font-bold mb-2">Error al cargar</h3>
              <p class="text-gray-600">{{ noticiasStore.error }}</p>
            </div>
            <button
              @click="toggleNoticias"
              class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>

          <!-- Vista de Noticia Individual -->
          <div v-else-if="selectedNoticia" class="space-y-6">
            <!-- Botón Volver -->
            <button
              @click="volverAListaNoticias"
              class="inline-flex items-center text-green-600 hover:text-green-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-2"
              aria-label="Volver a la lista de noticias"
            >
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
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Volver a la lista
            </button>

            <!-- Imagen de la noticia (si existe) -->
            <div
              v-if="selectedNoticia.imagen_url"
              class="rounded-xl overflow-hidden shadow-lg"
            >
              <img
                :src="selectedNoticia.imagen_url"
                :alt="`Imagen de ${selectedNoticia.titulo}`"
                class="w-full h-64 object-cover"
                @error="(e: any) => e.target.style.display = 'none'"
              />
            </div>

            <!-- Metadatos de la noticia -->
            <div class="bg-green-50 rounded-lg p-4 border border-green-200">
              <div class="flex flex-wrap gap-4 text-sm text-gray-700">
                <span class="inline-flex items-center font-medium">
                  <svg
                    class="w-4 h-4 mr-1 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  {{ getAmbitoNoticia(selectedNoticia) }}
                </span>
                <span class="inline-flex items-center">
                  <svg
                    class="w-4 h-4 mr-1 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  {{ formatDate(selectedNoticia.created_at) }}
                </span>
              </div>
            </div>

            <!-- Contenido completo de la noticia -->
            <div class="prose prose-lg max-w-none">
              <div class="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {{ selectedNoticia.contenido }}
              </div>
            </div>
          </div>

          <!-- Lista de Noticias -->
          <div v-else>
            <!-- Empty State -->
            <div
              v-if="noticiasStore.noticias.length === 0"
              class="text-center py-12"
            >
              <div class="text-6xl mb-4">📰</div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">
                No hay noticias disponibles
              </h3>
              <p class="text-gray-600">
                Por el momento no hay noticias para tu área. Vuelve pronto para
                estar informado.
              </p>
            </div>

            <!-- Noticias Cards -->
            <div v-else class="space-y-6" role="list">
              <article
                v-for="noticia in noticiasStore.noticias"
                :key="noticia.id"
                class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-green-400 overflow-hidden cursor-pointer"
                role="listitem"
                @click="seleccionarNoticia(noticia)"
              >
                <div class="flex flex-col md:flex-row">
                  <!-- Imagen (si existe) -->
                  <div v-if="noticia.imagen_url" class="md:w-1/3">
                    <img
                      :src="noticia.imagen_url"
                      :alt="`Imagen de ${noticia.titulo}`"
                      class="w-full h-48 md:h-full object-cover"
                      @error="(e: any) => e.target.style.display = 'none'"
                    />
                  </div>

                  <!-- Contenido -->
                  <div class="flex-1 p-6">
                    <div class="flex items-start justify-between mb-3">
                      <h3 class="text-xl font-bold text-gray-800 flex-1">
                        {{ noticia.titulo }}
                      </h3>
                    </div>

                    <p class="text-gray-700 mb-4 line-clamp-3">
                      {{ noticia.contenido }}
                    </p>

                    <div class="flex flex-wrap gap-3 text-sm">
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium"
                      >
                        <svg
                          class="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        {{ getAmbitoNoticia(noticia) }}
                      </span>
                      <span class="inline-flex items-center text-gray-600">
                        <svg
                          class="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        {{ formatDate(noticia.created_at) }}
                      </span>
                    </div>

                    <div class="mt-4 pt-4 border-t border-gray-200">
                      <span
                        class="text-green-600 font-semibold inline-flex items-center"
                      >
                        Leer más
                        <svg
                          class="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div
      v-if="notification"
      class="fixed bottom-4 right-4 z-50 animate-slide-up"
      role="alert"
      aria-live="polite"
    >
      <div
        class="rounded-lg shadow-2xl p-4 flex items-center space-x-3 max-w-md"
        :class="
          notification.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        "
      >
        <svg
          v-if="notification.type === 'success'"
          class="w-6 h-6 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        <svg
          v-else
          class="w-6 h-6 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
        <p class="font-medium">{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useLanguage } from "../composables/useLanguage";
import { useAuthStore } from "../stores/auth.store";
import { useEncuestasStore } from "../stores/encuestas.store";
import { useNoticiasStore } from "../stores/noticias.store";
import type { Database } from "../types/database.types";

type Encuesta = Database["public"]["Tables"]["encuestas"]["Row"];
type Noticia = Database["public"]["Tables"]["noticias"]["Row"];

const authStore = useAuthStore();
const encuestasStore = useEncuestasStore();
const noticiasStore = useNoticiasStore();
const router = useRouter();

// Inicializar sistema de idiomas (para sincronización global)
const { loadSavedLanguage } = useLanguage();

// Estado
const showEncuestasModal = ref(false);
const selectedEncuesta = ref<Encuesta | null>(null);
const respuestaEncuesta = ref<Record<string, any>>({});
const submittingRespuesta = ref(false);

// Estado de Noticias
const showNoticiasModal = ref(false);
const selectedNoticia = ref<Noticia | null>(null);

// Notificaciones
const notification = ref<{ type: "success" | "error"; message: string } | null>(
  null
);

// Computed properties para obtener datos del usuario
const userName = computed(() => {
  return authStore.usuario?.nombres || "Ciudadano";
});

const userInitial = computed(() => {
  const nombre = authStore.usuario?.nombres || "C";
  return nombre.charAt(0).toUpperCase();
});

const encuestasActivas = computed(() => {
  console.log("📊 Total encuestas en store:", encuestasStore.encuestas.length);
  console.log("📊 Encuestas:", encuestasStore.encuestas);

  const activas = encuestasStore.encuestas.filter((e) => {
    // Si no está activa, filtrar
    if (!e.activa) {
      console.log("❌ Encuesta inactiva:", e.titulo);
      return false;
    }

    // Si no hay fechas, considerar válida (encuesta sin límites temporales)
    if (!e.fecha_inicio || !e.fecha_fin) {
      console.log("✅ Encuesta sin fechas límite:", e.titulo);
      return true;
    }

    const ahora = new Date();
    const inicio = new Date(e.fecha_inicio);
    const fin = new Date(e.fecha_fin);

    // Verificar si las fechas son válidas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      console.log("⚠️ Fechas inválidas, incluyendo encuesta:", e.titulo);
      return true;
    }

    const dentroDeRango = ahora >= inicio && ahora <= fin;

    console.log("🔍 Evaluando encuesta:", {
      titulo: e.titulo,
      activa: e.activa,
      ahora: ahora.toISOString(),
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
      dentroDeRango,
    });

    return dentroDeRango;
  });

  console.log("✅ Encuestas activas filtradas:", activas.length);
  return activas;
});

// Métodos
const showNotification = (type: "success" | "error", message: string) => {
  notification.value = { type, message };
  setTimeout(() => {
    notification.value = null;
  }, 5000);
};

const toggleEncuestas = async () => {
  // Si ya está abierto, solo cerrar
  if (showEncuestasModal.value) {
    closeEncuestasModal();
    return;
  }

  // Si está cargando, no hacer nada (evita clics múltiples)
  if (encuestasStore.loading) {
    console.log("⚠️ Ya hay una carga en progreso");
    return;
  }

  // Abrir modal
  showEncuestasModal.value = true;

  console.log("🔄 Cargando encuestas...");
  const timerId = "⏱️ Tiempo de carga encuestas";

  try {
    console.time(timerId);

    const result = await encuestasStore.fetchEncuestas(true);

    console.timeEnd(timerId);

    if (!result.success) {
      throw new Error(result.error || "Error al cargar encuestas");
    }

    console.log(
      "✅ Encuestas cargadas:",
      encuestasStore.encuestas.length,
      "encuestas"
    );
  } catch (error: any) {
    console.error("❌ Error cargando encuestas:", error);

    // Intentar terminar el timer (si existe)
    try {
      console.timeEnd(timerId);
    } catch {
      // Timer no existe, ignorar
    }

    showNotification("error", error.message || "Error al cargar encuestas.");

    // Asegurar que loading se ponga en false
    encuestasStore.loading = false;
  }
};

const toggleNoticias = async () => {
  // Si ya está abierto, solo cerrar
  if (showNoticiasModal.value) {
    closeNoticiasModal();
    return;
  }

  // Si está cargando, no hacer nada (evita clics múltiples)
  if (noticiasStore.loading) {
    console.log("⚠️ Ya hay una carga en progreso");
    return;
  }

  // Abrir modal
  showNoticiasModal.value = true;

  console.log("🔄 Cargando noticias...");
  const timerId = "⏱️ Tiempo de carga noticias";

  try {
    console.time(timerId);

    const parroquia = authStore.usuario?.parroquia || "";
    const barrio = authStore.usuario?.barrio || undefined;

    const result = await noticiasStore.fetchNoticiasUsuario(parroquia, barrio);

    console.timeEnd(timerId);

    if (!result.success) {
      throw new Error(result.error || "Error al cargar noticias");
    }

    console.log(
      "✅ Noticias cargadas:",
      noticiasStore.noticias.length,
      "noticias"
    );
  } catch (error: any) {
    console.error("❌ Error cargando noticias:", error);

    // Intentar terminar el timer (si existe)
    try {
      console.timeEnd(timerId);
    } catch {
      // Timer no existe, ignorar
    }

    showNotification("error", error.message || "Error al cargar noticias.");

    // Asegurar que loading se ponga en false
    noticiasStore.loading = false;
  }
};

const closeEncuestasModal = () => {
  showEncuestasModal.value = false;
  selectedEncuesta.value = null;
  respuestaEncuesta.value = {};
  // Limpiar estado de error
  encuestasStore.error = null;
  encuestasStore.loading = false;
};

const closeNoticiasModal = () => {
  showNoticiasModal.value = false;
  selectedNoticia.value = null;
  // Limpiar estado de error
  noticiasStore.error = null;
  noticiasStore.loading = false;
};

const seleccionarEncuesta = (encuesta: Encuesta) => {
  selectedEncuesta.value = encuesta;
  respuestaEncuesta.value = {};
};

const volverALista = () => {
  selectedEncuesta.value = null;
  respuestaEncuesta.value = {};
};

const seleccionarNoticia = (noticia: Noticia) => {
  selectedNoticia.value = noticia;
};

const volverAListaNoticias = () => {
  selectedNoticia.value = null;
};

const enviarRespuesta = async () => {
  if (!selectedEncuesta.value) return;

  // Validar respuesta
  if (Object.keys(respuestaEncuesta.value).length === 0) {
    showNotification("error", "Por favor, completa tu respuesta");
    return;
  }

  submittingRespuesta.value = true;

  try {
    const result = await encuestasStore.responderEncuesta(
      selectedEncuesta.value.id,
      respuestaEncuesta.value
    );

    if (result.success) {
      showNotification("success", "¡Gracias por tu participación!");
      closeEncuestasModal();
      await encuestasStore.fetchEncuestas(true);
    } else {
      showNotification("error", result.error || "Error al enviar respuesta");
    }
  } catch (err: any) {
    showNotification("error", err.message || "Error al enviar respuesta");
  } finally {
    submittingRespuesta.value = false;
  }
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Fecha no disponible";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getAmbitoNoticia = (noticia: Noticia) => {
  if (!noticia.parroquia_destino) return "📢 Global - Todo Manta";
  if (!noticia.barrio_destino) return `📍 ${noticia.parroquia_destino}`;
  return `📍 ${noticia.parroquia_destino} - ${noticia.barrio_destino}`;
};

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    opcion_multiple: "Opción Múltiple",
    abierta: "Pregunta Abierta",
    calificacion: "Calificación",
  };
  return labels[tipo] || tipo;
};

// Verificar autenticación al montar
onMounted(async () => {
  console.log("🚀 Dashboard montado");

  // Cargar idioma guardado
  loadSavedLanguage();

  if (!authStore.isAuthenticated()) {
    console.log("❌ Usuario no autenticado");
    router.push("/login");
    return;
  }

  console.log("✅ Usuario autenticado:", authStore.usuario);

  // Cargar encuestas activas
  console.log("📥 Iniciando carga de encuestas...");
  const result = await encuestasStore.fetchEncuestas(true);
  console.log("📊 Resultado de carga:", result);
  console.log(
    "📊 Encuestas en store después de cargar:",
    encuestasStore.encuestas
  );

  // Cargar noticias para la ubicación del usuario
  console.log("📰 Iniciando carga de noticias...");
  const parroquia = authStore.usuario?.parroquia || "";
  const barrio = authStore.usuario?.barrio || undefined;
  const noticiasResult = await noticiasStore.fetchNoticiasUsuario(
    parroquia,
    barrio
  );
  console.log("📰 Resultado de carga de noticias:", noticiasResult);
  console.log(
    "📰 Noticias en store después de cargar:",
    noticiasStore.noticias
  );
});
</script>

<style scoped>
/* Animaciones suaves */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse-soft {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(147, 51, 234, 0);
  }
}

.animate-pulse-soft {
  animation: pulse-soft 3s ease-in-out infinite;
}

main > div > div {
  animation: fadeIn 0.6s ease-out;
}

main > div > div:nth-child(2) {
  animation-delay: 0.2s;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* Truncar texto en múltiples líneas */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Accesibilidad: Skip links ocultos visualmente pero disponibles para lectores de pantalla */
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

/* Skip link visible en foco (WCAG 2.4.1) */
.sr-only:focus,
.focus\:not-sr-only:focus {
  position: fixed;
  width: auto;
  height: auto;
  padding: 1rem 1.5rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Scrollbar personalizado para modales */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
