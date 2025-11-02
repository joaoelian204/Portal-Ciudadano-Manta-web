<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Skip to main content (WCAG 2.4.1) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      {{ $t("common.skipToMain") }}
    </a>

    <!-- Header -->
    <header class="bg-white shadow-md border-b-4 border-blue-600" role="banner">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800">
              {{ $t("admin.encuestas.title") }}
            </h1>
            <p class="text-gray-600 mt-2">
              {{ $t("admin.sections.surveys.description") }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/admin"
              class="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
              {{ $t("common.back") }}
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="container mx-auto px-4 py-8" role="main">
      <!-- Botón Crear Nueva Encuesta -->
      <div class="mb-8">
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
          :aria-label="$t('admin.encuestas.createNew')"
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
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          {{ $t("admin.encuestas.createNew") }}
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex justify-center items-center py-12"
        role="status"
        aria-live="polite"
      >
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"
        ></div>
        <span class="sr-only">{{ $t("encuestas.loading") }}</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md mb-8"
        role="alert"
        aria-live="assertive"
      >
        <div class="flex items-center">
          <svg
            class="w-6 h-6 text-red-500 mr-3"
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
          <p class="text-red-800 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Encuestas List -->
      <div v-else class="space-y-6">
        <!-- Empty State -->
        <div
          v-if="encuestas.length === 0"
          class="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200"
        >
          <div class="text-6xl mb-4">📋</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">
            No hay encuestas creadas
          </h3>
          <p class="text-gray-600 mb-6">
            Comienza creando tu primera encuesta ciudadana
          </p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Crear Primera Encuesta
          </button>
        </div>

        <!-- Encuestas Cards -->
        <div
          v-else
          class="grid grid-cols-1 lg:grid-cols-2 gap-6"
          role="list"
          aria-label="Lista de encuestas"
        >
          <article
            v-for="encuesta in encuestas"
            :key="encuesta.id"
            class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden"
            role="listitem"
          >
            <!-- Header de la encuesta -->
            <div
              class="p-6"
              :class="
                encuesta.activa
                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50'
                  : 'bg-gray-50'
              "
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3
                    :id="`encuesta-title-${encuesta.id}`"
                    class="text-xl font-bold text-gray-800 mb-2"
                  >
                    {{ encuesta.titulo }}
                  </h3>
                  <span
                    class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    {{ getTipoLabel(encuesta.tipo) }}
                  </span>
                </div>
                <span
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                  :class="
                    encuesta.activa
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-300 text-gray-700'
                  "
                  role="note"
                >
                  {{ encuesta.activa ? "✓ Activa" : "✕ Inactiva" }}
                </span>
              </div>
            </div>

            <!-- Body de la encuesta -->
            <div class="p-6">
              <p
                class="text-gray-700 mb-4"
                :aria-describedby="`encuesta-title-${encuesta.id}`"
              >
                {{ encuesta.descripcion }}
              </p>

              <!-- Fechas -->
              <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div class="flex items-center text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2"
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
                  <span>Inicio: {{ formatDate(encuesta.fecha_inicio) }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2"
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
                  <span>Fin: {{ formatDate(encuesta.fecha_fin) }}</span>
                </div>
              </div>

              <!-- Opciones (si aplica) -->
              <div
                v-if="encuesta.opciones && Array.isArray(encuesta.opciones)"
                class="mb-4"
              >
                <p class="text-sm font-medium text-gray-700 mb-2">Opciones:</p>
                <ul class="space-y-1" role="list">
                  <li
                    v-for="(opcion, index) in encuesta.opciones"
                    :key="index"
                    class="text-sm text-gray-600 pl-4 border-l-2 border-blue-300"
                  >
                    {{ opcion }}
                  </li>
                </ul>
              </div>

              <!-- Acciones -->
              <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <button
                  @click="viewStats(encuesta)"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  :aria-label="`Ver estadísticas de ${encuesta.titulo}`"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                  Estadísticas
                </button>
                <button
                  @click="editEncuesta(encuesta)"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :aria-label="`Editar ${encuesta.titulo}`"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                  Editar
                </button>
                <button
                  @click="confirmDelete(encuesta)"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  :aria-label="`Eliminar ${encuesta.titulo}`"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>

    <!-- Modal Crear/Editar Encuesta -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div
          class="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-t-2xl"
        >
          <div class="flex items-center justify-between">
            <h2 id="modal-title" class="text-2xl font-bold text-white">
              {{ isEditing ? "Editar Encuesta" : "Nueva Encuesta" }}
            </h2>
            <button
              @click="closeModal"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Cerrar modal"
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
        <form @submit.prevent="submitForm" class="p-6 space-y-6">
          <!-- Título -->
          <div>
            <label
              for="titulo"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              Título de la Encuesta *
            </label>
            <input
              id="titulo"
              v-model="formData.titulo"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Ej: Satisfacción con servicios públicos"
              aria-required="true"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label
              for="descripcion"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              Descripción *
            </label>
            <textarea
              id="descripcion"
              v-model="formData.descripcion"
              required
              rows="3"
              maxlength="500"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Describe el objetivo de la encuesta..."
              aria-required="true"
              aria-describedby="descripcion-hint"
            ></textarea>
            <p id="descripcion-hint" class="text-xs text-gray-500 mt-1">
              {{ formData.descripcion.length }}/500 caracteres
            </p>
          </div>

          <!-- Tipo -->
          <div>
            <label
              for="tipo"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              Tipo de Encuesta *
            </label>
            <select
              id="tipo"
              v-model="formData.tipo"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              aria-required="true"
              @change="handleTipoChange"
            >
              <option value="opcion_multiple">Opción Múltiple</option>
              <option value="calificacion">Calificación (1-5)</option>
            </select>
          </div>

          <!-- Opciones (solo para opción múltiple) -->
          <div v-if="formData.tipo === 'opcion_multiple'">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Opciones de Respuesta *
            </label>
            <div class="space-y-2">
              <div
                v-for="(_opcion, index) in formData.opciones"
                :key="index"
                class="flex items-center gap-2"
              >
                <input
                  v-model="formData.opciones[index]"
                  type="text"
                  required
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="`Opción ${index + 1}`"
                  :aria-label="`Opción ${index + 1}`"
                />
                <button
                  v-if="formData.opciones.length > 2"
                  @click="removeOpcion(index)"
                  type="button"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  :aria-label="`Eliminar opción ${index + 1}`"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <button
              @click="addOpcion"
              type="button"
              class="mt-3 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Agregar Opción
            </button>
          </div>

          <!-- Fechas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="fecha_inicio"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                Fecha de Inicio *
              </label>
              <input
                id="fecha_inicio"
                v-model="formData.fecha_inicio"
                type="datetime-local"
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-required="true"
                aria-describedby="fecha-inicio-hint"
              />
              <p id="fecha-inicio-hint" class="text-xs text-gray-500 mt-1">
                Formato: DD/MM/AAAA HH:MM
              </p>
            </div>
            <div>
              <label
                for="fecha_fin"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                Fecha de Fin *
              </label>
              <input
                id="fecha_fin"
                v-model="formData.fecha_fin"
                type="datetime-local"
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-required="true"
                aria-describedby="fecha-fin-hint"
              />
              <p id="fecha-fin-hint" class="text-xs text-gray-500 mt-1">
                Formato: DD/MM/AAAA HH:MM
              </p>
            </div>
          </div>

          <!-- Estado Activo -->
          <div class="flex items-center">
            <input
              id="activa"
              v-model="formData.activa"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label
              for="activa"
              class="ml-3 text-sm font-semibold text-gray-700"
            >
              Encuesta Activa
            </label>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{
                submitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Estadísticas -->
    <div
      v-if="showStatsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeStatsModal"
      role="dialog"
      aria-labelledby="stats-modal-title"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div
          class="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-t-2xl"
        >
          <div class="flex items-center justify-between">
            <h2 id="stats-modal-title" class="text-2xl font-bold text-white">
              Estadísticas de Encuesta
            </h2>
            <button
              @click="closeStatsModal"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Cerrar modal de estadísticas"
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
        <div class="p-6">
          <div
            v-if="loadingStats"
            class="flex justify-center py-12"
            role="status"
          >
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"
            ></div>
            <span class="sr-only">Cargando estadísticas...</span>
          </div>

          <div v-else-if="currentStats">
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              {{ selectedEncuesta?.titulo }}
            </h3>
            <p class="text-gray-600 mb-6">
              {{ selectedEncuesta?.descripcion }}
            </p>

            <!-- Total de respuestas -->
            <div
              class="bg-green-50 rounded-lg p-4 mb-6 border border-green-200"
            >
              <p class="text-sm text-green-800 font-medium">
                Total de Respuestas
              </p>
              <p class="text-3xl font-bold text-green-600">
                {{ currentStats.total }}
              </p>
            </div>

            <!-- Gráfico de respuestas -->
            <div
              v-if="Object.keys(currentStats.data).length > 0"
              class="space-y-4"
            >
              <h4 class="text-lg font-semibold text-gray-800 mb-4">
                Distribución de Respuestas
              </h4>
              <div
                v-for="(count, opcion) in currentStats.data"
                :key="opcion"
                class="space-y-2"
              >
                <div class="flex justify-between text-sm">
                  <span class="font-medium text-gray-700">{{ opcion }}</span>
                  <span class="text-gray-600">
                    {{ count }} ({{
                      getPercentage(count, currentStats.total)
                    }}%)
                  </span>
                </div>
                <div
                  class="w-full bg-gray-200 rounded-full h-4 overflow-hidden"
                >
                  <div
                    class="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                    :style="{
                      width: `${getPercentage(count, currentStats.total)}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <p class="text-gray-600">No hay respuestas registradas aún</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmación Eliminar -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeDeleteModal"
      role="alertdialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
      aria-modal="true"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="bg-red-100 rounded-full p-3 mr-4">
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
            <h3 id="delete-modal-title" class="text-xl font-bold text-gray-900">
              Confirmar Eliminación
            </h3>
          </div>
          <p id="delete-modal-desc" class="text-gray-600 mb-6">
            ¿Estás seguro de que deseas eliminar la encuesta
            <strong>"{{ encuestaToDelete?.titulo }}"</strong>? Esta acción no se
            puede deshacer y se eliminarán todas las respuestas asociadas.
          </p>
          <div class="flex gap-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              @click="deleteEncuesta"
              :disabled="submitting"
              class="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {{ submitting ? "Eliminando..." : "Eliminar" }}
            </button>
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
import { useAuthStore } from "../stores/auth.store";
import { useEncuestasStore } from "../stores/encuestas.store";
import type { Database } from "../types/database.types";

type Encuesta = Database["public"]["Tables"]["encuestas"]["Row"];

const authStore = useAuthStore();
const encuestasStore = useEncuestasStore();
const router = useRouter();

// Estado
const showModal = ref(false);
const showStatsModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const loadingStats = ref(false);
const selectedEncuesta = ref<Encuesta | null>(null);
const encuestaToDelete = ref<Encuesta | null>(null);
const currentStats = ref<{
  data: Record<string, number>;
  total: number;
} | null>(null);

// Notificaciones
const notification = ref<{ type: "success" | "error"; message: string } | null>(
  null
);

// Form Data
const formData = ref({
  titulo: "",
  descripcion: "",
  tipo: "opcion_multiple" as "opcion_multiple" | "abierta" | "calificacion",
  opciones: ["", ""],
  fecha_inicio: "",
  fecha_fin: "",
  activa: true,
});

// Computed
const loading = computed(() => encuestasStore.loading);
const error = computed(() => encuestasStore.error);
const encuestas = computed(() => encuestasStore.encuestas);

// Métodos
const showNotification = (type: "success" | "error", message: string) => {
  notification.value = { type, message };
  setTimeout(() => {
    notification.value = null;
  }, 5000);
};

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    opcion_multiple: "Opción Múltiple",
    abierta: "Pregunta Abierta",
    calificacion: "Calificación",
  };
  return labels[tipo] || tipo;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-EC", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getPercentage = (count: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
};

const openCreateModal = () => {
  isEditing.value = false;
  formData.value = {
    titulo: "",
    descripcion: "",
    tipo: "opcion_multiple",
    opciones: ["", ""],
    fecha_inicio: "",
    fecha_fin: "",
    activa: true,
  };
  showModal.value = true;
};

const editEncuesta = (encuesta: Encuesta) => {
  isEditing.value = true;
  selectedEncuesta.value = encuesta;

  const fechaInicio = new Date(encuesta.fecha_inicio);
  const fechaFin = new Date(encuesta.fecha_fin);

  formData.value = {
    titulo: encuesta.titulo,
    descripcion: encuesta.descripcion,
    tipo: encuesta.tipo as any,
    opciones: Array.isArray(encuesta.opciones)
      ? [...encuesta.opciones]
      : ["", ""],
    fecha_inicio: fechaInicio.toISOString().slice(0, 16),
    fecha_fin: fechaFin.toISOString().slice(0, 16),
    activa: encuesta.activa ?? true,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  selectedEncuesta.value = null;
};

const handleTipoChange = () => {
  if (
    formData.value.tipo === "opcion_multiple" &&
    formData.value.opciones.length === 0
  ) {
    formData.value.opciones = ["", ""];
  }
};

const addOpcion = () => {
  formData.value.opciones.push("");
};

const removeOpcion = (index: number) => {
  formData.value.opciones.splice(index, 1);
};

const submitForm = async () => {
  submitting.value = true;

  try {
    const encuestaData = {
      titulo: formData.value.titulo,
      descripcion: formData.value.descripcion,
      tipo: formData.value.tipo,
      opciones:
        formData.value.tipo === "opcion_multiple"
          ? formData.value.opciones.filter((o) => o.trim() !== "")
          : null,
      fecha_inicio: new Date(formData.value.fecha_inicio).toISOString(),
      fecha_fin: new Date(formData.value.fecha_fin).toISOString(),
      activa: formData.value.activa,
    };

    let result;
    if (isEditing.value && selectedEncuesta.value) {
      result = await encuestasStore.actualizarEncuesta(
        selectedEncuesta.value.id,
        encuestaData
      );
      if (result.success) {
        showNotification("success", "Encuesta actualizada exitosamente");
      }
    } else {
      result = await encuestasStore.crearEncuesta(encuestaData as any);
      if (result.success) {
        showNotification("success", "Encuesta creada exitosamente");
      }
    }

    if (result.success) {
      closeModal();
      await encuestasStore.fetchEncuestas(false);
    } else {
      showNotification("error", result.error || "Error al guardar la encuesta");
    }
  } catch (err: any) {
    showNotification("error", err.message || "Error al guardar la encuesta");
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = (encuesta: Encuesta) => {
  encuestaToDelete.value = encuesta;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  encuestaToDelete.value = null;
};

const deleteEncuesta = async () => {
  if (!encuestaToDelete.value) return;

  submitting.value = true;

  try {
    const result = await encuestasStore.eliminarEncuesta(
      encuestaToDelete.value.id
    );

    if (result.success) {
      showNotification("success", "Encuesta eliminada exitosamente");
      closeDeleteModal();
      await encuestasStore.fetchEncuestas(false);
    } else {
      showNotification(
        "error",
        result.error || "Error al eliminar la encuesta"
      );
    }
  } catch (err: any) {
    showNotification("error", err.message || "Error al eliminar la encuesta");
  } finally {
    submitting.value = false;
  }
};

const viewStats = async (encuesta: Encuesta) => {
  selectedEncuesta.value = encuesta;
  showStatsModal.value = true;
  loadingStats.value = true;

  try {
    const result = await encuestasStore.obtenerEstadisticas(encuesta.id);
    if (result.success) {
      currentStats.value = {
        data: result.data || {},
        total: result.total || 0,
      };
    }
  } catch (err: any) {
    showNotification("error", "Error al cargar estadísticas");
  } finally {
    loadingStats.value = false;
  }
};

const closeStatsModal = () => {
  showStatsModal.value = false;
  selectedEncuesta.value = null;
  currentStats.value = null;
};

// Lifecycle
onMounted(async () => {
  // Verificar autenticación
  if (!authStore.isAuthenticated() || !authStore.isAdministrador()) {
    router.push("/login");
    return;
  }

  // Solo cargar si no hay encuestas ya cargadas
  if (encuestasStore.encuestas.length > 0) {
    console.log("✓ AdminEncuestas: Encuestas ya cargadas, reutilizando datos");
    return;
  }

  // Cargar encuestas con manejo de errores
  try {
    console.log("📊 AdminEncuestas: Cargando encuestas...");
    const result = await encuestasStore.fetchEncuestas(false);

    if (result.success) {
      console.log(
        "✅ AdminEncuestas: Encuestas cargadas:",
        encuestasStore.encuestas.length
      );
    } else {
      console.warn("⚠️ AdminEncuestas: Error al cargar:", result.error);
    }
  } catch (error: any) {
    console.error("❌ AdminEncuestas: Error en carga:", error);
    // Continuar - la interfaz mostrará lista vacía
  }
});
</script>

<style scoped>
/* Animaciones */
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

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* Scrollbar personalizado */
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

/* Accesibilidad */
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
</style>
