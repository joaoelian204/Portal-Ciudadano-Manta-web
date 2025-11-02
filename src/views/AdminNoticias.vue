<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Skip to main content (WCAG 2.4.1) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-green-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      {{ $t("common.skipToMain") }}
    </a>

    <!-- Header -->
    <header
      class="bg-white shadow-md border-b-4 border-green-600"
      role="banner"
    >
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800">
              {{ $t("admin.noticias.title") }}
            </h1>
            <p class="text-gray-600 mt-2">
              {{ $t("admin.sections.news.description") }}
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
      <!-- Botón Crear Nueva Noticia -->
      <div class="mb-8">
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105"
          :aria-label="$t('admin.noticias.createNew')"
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
          {{ $t("admin.noticias.createNew") }}
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
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"
        ></div>
        <span class="sr-only">{{ $t("noticias.loading") }}</span>
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

      <!-- Noticias List -->
      <div v-else class="space-y-6">
        <!-- Empty State -->
        <div
          v-if="noticias.length === 0"
          class="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200"
        >
          <div class="text-6xl mb-4">📰</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">
            {{ $t("noticias.noNews") }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ $t("noticias.createFirst") }}
          </p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
            {{ $t("admin.noticias.createNew") }}
          </button>
        </div>

        <!-- Noticias Cards -->
        <div
          v-else
          class="grid grid-cols-1 lg:grid-cols-2 gap-6"
          role="list"
          aria-label="Lista de noticias"
        >
          <article
            v-for="noticia in noticias"
            :key="noticia.id"
            class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden"
            role="listitem"
          >
            <!-- Imagen (si existe) -->
            <div
              v-if="noticia.imagen_url"
              class="h-48 bg-cover bg-center"
              :style="{ backgroundImage: `url(${noticia.imagen_url})` }"
              role="img"
              :aria-label="`Imagen de ${noticia.titulo}`"
            ></div>
            <div
              v-else
              class="h-48 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-center"
              role="img"
              aria-label="Imagen no disponible"
            >
              <svg
                class="w-20 h-20 text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                ></path>
              </svg>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Título y alcance -->
              <div class="mb-4">
                <h3 class="text-xl font-bold text-gray-800 mb-2">
                  {{ noticia.titulo }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-if="!noticia.parroquia_destino"
                    class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    🌍 Global
                  </span>
                  <span
                    v-else
                    class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    📍 {{ noticia.parroquia_destino }}
                    <span v-if="noticia.barrio_destino">
                      - {{ noticia.barrio_destino }}</span
                    >
                  </span>
                </div>
              </div>

              <!-- Contenido -->
              <p class="text-gray-700 mb-4 line-clamp-3">
                {{ noticia.contenido }}
              </p>

              <!-- Fecha -->
              <div class="flex items-center text-sm text-gray-600 mb-4">
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
                {{ formatDate(noticia.created_at) }}
              </div>

              <!-- Acciones -->
              <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <button
                  @click="viewNoticia(noticia)"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :aria-label="`Ver ${noticia.titulo}`"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  {{ $t("common.view") }}
                </button>
                <button
                  @click="editNoticia(noticia)"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  :aria-label="`${$t('common.edit')} ${noticia.titulo}`"
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
                  {{ $t("common.edit") }}
                </button>
                <button
                  @click="confirmDelete(noticia)"
                  class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  :aria-label="`${$t('common.delete')} ${noticia.titulo}`"
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
                  {{ $t("common.delete") }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>

    <!-- Modal Crear/Editar Noticia -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      @click.self="closeModal"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        <!-- Modal Header -->
        <div
          class="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-t-2xl sticky top-0 z-10"
        >
          <div class="flex items-center justify-between">
            <h2 id="modal-title" class="text-2xl font-bold text-white">
              {{
                isEditing
                  ? $t("admin.noticias.editNews")
                  : $t("admin.noticias.createNew")
              }}
            </h2>
            <button
              @click="closeModal"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              :aria-label="$t('common.close')"
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
        <form
          @submit.prevent="submitForm"
          class="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <!-- Título -->
          <div>
            <label
              for="titulo"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              {{ $t("admin.noticias.formLabels.title") }} *
            </label>
            <input
              id="titulo"
              v-model="formData.titulo"
              type="text"
              required
              maxlength="200"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Ej: Inauguración del nuevo parque comunitario"
              aria-required="true"
            />
          </div>

          <!-- Contenido -->
          <div>
            <label
              for="contenido"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              {{ $t("admin.noticias.formLabels.content") }} *
            </label>
            <textarea
              id="contenido"
              v-model="formData.contenido"
              required
              rows="8"
              maxlength="5000"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="Escribe el contenido completo de la noticia..."
              aria-required="true"
              :aria-describedby="'contenido-hint'"
            ></textarea>
            <p id="contenido-hint" class="text-sm text-gray-500 mt-1">
              {{ formData.contenido.length }}/5000 caracteres
            </p>
          </div>

          <!-- Subida de Imagen -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t("admin.noticias.formLabels.image") }}
            </label>

            <!-- Zona de arrastrar y soltar -->
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
              :class="[
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
                isDragging
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-green-400 hover:bg-gray-50',
              ]"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                @change="handleFileSelect"
                class="hidden"
                aria-label="Seleccionar imagen"
              />

              <div v-if="!formData.imagen_url && !uploadingImage">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400 mb-3"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p class="text-sm text-gray-600 mb-1">
                  <span class="font-semibold text-green-600"
                    >Haz clic para subir</span
                  >
                  o arrastra y suelta
                </p>
                <p class="text-xs text-gray-500">PNG, JPG, WEBP hasta 5MB</p>
              </div>

              <div
                v-else-if="uploadingImage"
                class="flex flex-col items-center"
              >
                <div
                  class="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mb-3"
                ></div>
                <p class="text-sm text-gray-600">Subiendo imagen...</p>
              </div>
            </div>

            <!-- Vista previa de imagen -->
            <div
              v-if="formData.imagen_url && !uploadingImage"
              class="mt-4 relative rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                :src="formData.imagen_url"
                alt="Vista previa"
                class="w-full h-48 object-cover"
                @error="imageError = true"
              />
              <button
                type="button"
                @click.stop="removeImage"
                class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                aria-label="Eliminar imagen"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <p v-if="imageError" class="p-4 text-sm text-red-600 bg-red-50">
                ⚠️ No se pudo cargar la imagen.
              </p>
            </div>
          </div>

          <!-- Alcance de la noticia -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              Alcance de la Noticia
            </h3>

            <!-- Tipo de alcance -->
            <div class="mb-4">
              <label class="flex items-center mb-3 cursor-pointer">
                <input
                  v-model="formData.esGlobal"
                  type="checkbox"
                  class="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
                <span class="ml-3 text-sm font-semibold text-gray-700">
                  🌍 Noticia Global (visible para todos los usuarios)
                </span>
              </label>
              <p class="text-sm text-gray-600 ml-8">
                Si no marcas esta opción, puedes seleccionar una parroquia
                específica
              </p>
            </div>

            <!-- Selección de parroquia (solo si no es global) -->
            <div v-if="!formData.esGlobal" class="space-y-4">
              <div>
                <label
                  for="parroquia"
                  class="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Parroquia *
                </label>
                <select
                  id="parroquia"
                  v-model="formData.parroquia_destino"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  @change="formData.barrio_destino = ''"
                >
                  <option value="">Selecciona una parroquia</option>
                  <option value="Manta">Manta</option>
                  <option value="Tarqui">Tarqui</option>
                  <option value="Eloy Alfaro">Eloy Alfaro</option>
                  <option value="Los Esteros">Los Esteros</option>
                  <option value="San Mateo">San Mateo</option>
                </select>
              </div>

              <!-- Selección de barrio (opcional) -->
              <div v-if="formData.parroquia_destino">
                <label
                  for="barrio"
                  class="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Barrio (opcional)
                </label>
                <input
                  id="barrio"
                  v-model="formData.barrio_destino"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Deja en blanco para toda la parroquia"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Si especificas un barrio, solo los usuarios de ese barrio
                  verán la noticia
                </p>
              </div>
            </div>
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
              class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{
                submitting
                  ? "Guardando..."
                  : isEditing
                  ? "Actualizar"
                  : "Publicar"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ver Noticia -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      @click.self="closeViewModal"
      role="dialog"
      aria-labelledby="view-modal-title"
      aria-modal="true"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <!-- Modal Header -->
        <div
          class="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-t-2xl"
        >
          <div class="flex items-center justify-between">
            <h2 id="view-modal-title" class="text-2xl font-bold text-white">
              Vista Previa
            </h2>
            <button
              @click="closeViewModal"
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
        <div
          v-if="selectedNoticia"
          class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <!-- Imagen -->
          <div
            v-if="selectedNoticia.imagen_url"
            class="mb-6 rounded-lg overflow-hidden"
          >
            <img
              :src="selectedNoticia.imagen_url"
              :alt="selectedNoticia.titulo"
              class="w-full h-64 object-cover"
            />
          </div>

          <!-- Metadata -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-if="!selectedNoticia.parroquia_destino"
              class="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800"
            >
              🌍 Global
            </span>
            <span
              v-else
              class="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800"
            >
              📍 {{ selectedNoticia.parroquia_destino }}
              <span v-if="selectedNoticia.barrio_destino">
                - {{ selectedNoticia.barrio_destino }}</span
              >
            </span>
            <span
              class="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-700"
            >
              📅 {{ formatDate(selectedNoticia.created_at) }}
            </span>
          </div>

          <!-- Título -->
          <h3 class="text-3xl font-bold text-gray-900 mb-4">
            {{ selectedNoticia.titulo }}
          </h3>

          <!-- Contenido -->
          <div class="prose max-w-none">
            <p
              class="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap"
            >
              {{ selectedNoticia.contenido }}
            </p>
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
            ¿Estás seguro de que deseas eliminar la noticia
            <strong>"{{ noticiaToDelete?.titulo }}"</strong>? Esta acción no se
            puede deshacer.
          </p>
          <div class="flex gap-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              @click="deleteNoticia"
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
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/auth.store";
import { useNoticiasStore } from "../stores/noticias.store";
import type { Database } from "../types/database.types";

type Noticia = Database["public"]["Tables"]["noticias"]["Row"];

const authStore = useAuthStore();
const noticiasStore = useNoticiasStore();
const router = useRouter();

// Estado
const showModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const selectedNoticia = ref<Noticia | null>(null);
const noticiaToDelete = ref<Noticia | null>(null);
const imageError = ref(false);

// Estado para subida de imágenes
const isDragging = ref(false);
const uploadingImage = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Notificaciones
const notification = ref<{ type: "success" | "error"; message: string } | null>(
  null
);

// Form Data
const formData = ref({
  titulo: "",
  contenido: "",
  imagen_url: "",
  esGlobal: true,
  parroquia_destino: "",
  barrio_destino: "",
});

// Computed
const loading = computed(() => noticiasStore.loading);
const error = computed(() => noticiasStore.error);
const noticias = computed(() => noticiasStore.noticias);

// Métodos
const showNotification = (type: "success" | "error", message: string) => {
  notification.value = { type, message };
  setTimeout(() => {
    notification.value = null;
  }, 5000);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Fecha no disponible";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Funciones para manejo de imágenes
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    uploadImage(file);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith("image/")) {
    uploadImage(file);
  } else {
    showNotification(
      "error",
      "Por favor, arrastra solo archivos de imagen (PNG, JPG, WEBP)"
    );
  }
};

const uploadImage = async (file: File) => {
  // Validar tipo de archivo
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    showNotification(
      "error",
      "Formato no válido. Solo se permiten PNG, JPG y WEBP"
    );
    return;
  }

  // Validar tamaño (5MB máximo)
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (file.size > maxSize) {
    showNotification(
      "error",
      "La imagen es muy grande. El tamaño máximo es 5MB"
    );
    return;
  }

  uploadingImage.value = true;
  imageError.value = false;

  try {
    // Generar nombre único para la imagen
    const fileExt = file.name.split(".").pop();
    const fileName = `noticia_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `noticias/${fileName}`;

    console.log("📤 Subiendo imagen:", filePath);

    // Subir imagen a Supabase Storage
    const { data, error } = await supabase.storage
      .from("imagenes")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Error al subir imagen:", error);
      throw error;
    }

    console.log("✅ Imagen subida:", data);

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from("imagenes")
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      formData.value.imagen_url = publicUrlData.publicUrl;
      showNotification("success", "Imagen subida exitosamente");
      console.log("🔗 URL pública:", publicUrlData.publicUrl);
    } else {
      throw new Error("No se pudo obtener la URL pública");
    }
  } catch (error: any) {
    console.error("❌ Error en uploadImage:", error);
    showNotification("error", error.message || "Error al subir la imagen");
    imageError.value = true;
  } finally {
    uploadingImage.value = false;
  }
};

const removeImage = async () => {
  if (!formData.value.imagen_url) return;

  try {
    // Extraer el path de la URL pública
    const url = new URL(formData.value.imagen_url);
    const pathParts = url.pathname.split("/");
    const bucketIndex = pathParts.findIndex((part) => part === "imagenes");

    if (bucketIndex !== -1) {
      const filePath = pathParts.slice(bucketIndex + 1).join("/");

      console.log("🗑️ Eliminando imagen:", filePath);

      // Eliminar de Storage
      const { error } = await supabase.storage
        .from("imagenes")
        .remove([filePath]);

      if (error) {
        console.warn("⚠️ Error al eliminar imagen del storage:", error);
        // Continuar de todos modos, la imagen quedará huérfana pero no es crítico
      } else {
        console.log("✅ Imagen eliminada del storage");
      }
    }
  } catch (error) {
    console.warn("⚠️ No se pudo eliminar la imagen del storage:", error);
    // No es crítico, continuar
  }

  // Limpiar la URL del formulario
  formData.value.imagen_url = "";
  imageError.value = false;
};

const openCreateModal = () => {
  isEditing.value = false;
  imageError.value = false;
  formData.value = {
    titulo: "",
    contenido: "",
    imagen_url: "",
    esGlobal: true,
    parroquia_destino: "",
    barrio_destino: "",
  };
  showModal.value = true;
};

const editNoticia = (noticia: Noticia) => {
  isEditing.value = true;
  selectedNoticia.value = noticia;
  imageError.value = false;

  formData.value = {
    titulo: noticia.titulo,
    contenido: noticia.contenido,
    imagen_url: noticia.imagen_url || "",
    esGlobal: !noticia.parroquia_destino,
    parroquia_destino: noticia.parroquia_destino || "",
    barrio_destino: noticia.barrio_destino || "",
  };
  showModal.value = true;
};

const viewNoticia = (noticia: Noticia) => {
  selectedNoticia.value = noticia;
  showViewModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  selectedNoticia.value = null;
  imageError.value = false;
  isDragging.value = false;
  uploadingImage.value = false;

  // Limpiar input de archivo
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedNoticia.value = null;
};

const submitForm = async () => {
  submitting.value = true;

  try {
    const noticiaData = {
      titulo: formData.value.titulo.trim(),
      contenido: formData.value.contenido.trim(),
      imagen_url: formData.value.imagen_url.trim() || null,
      parroquia_destino: formData.value.esGlobal
        ? null
        : formData.value.parroquia_destino,
      barrio_destino: formData.value.esGlobal
        ? null
        : formData.value.barrio_destino.trim() || null,
    };

    let result;
    if (isEditing.value && selectedNoticia.value) {
      result = await noticiasStore.actualizarNoticia(
        selectedNoticia.value.id,
        noticiaData
      );
      if (result.success) {
        showNotification("success", "Noticia actualizada exitosamente");
      }
    } else {
      result = await noticiasStore.crearNoticia(noticiaData as any);
      if (result.success) {
        showNotification("success", "Noticia publicada exitosamente");
      }
    }

    if (result.success) {
      closeModal();
      await noticiasStore.fetchNoticias();
    } else {
      showNotification("error", result.error || "Error al guardar la noticia");
    }
  } catch (err: any) {
    showNotification("error", err.message || "Error al guardar la noticia");
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = (noticia: Noticia) => {
  noticiaToDelete.value = noticia;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  noticiaToDelete.value = null;
};

const deleteNoticia = async () => {
  if (!noticiaToDelete.value) return;

  submitting.value = true;

  try {
    const result = await noticiasStore.eliminarNoticia(
      noticiaToDelete.value.id
    );

    if (result.success) {
      showNotification("success", "Noticia eliminada exitosamente");
      closeDeleteModal();
      await noticiasStore.fetchNoticias();
    } else {
      showNotification("error", result.error || "Error al eliminar la noticia");
    }
  } catch (err: any) {
    showNotification("error", err.message || "Error al eliminar la noticia");
  } finally {
    submitting.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  // Verificar autenticación
  if (!authStore.isAuthenticated() || !authStore.isAdministrador()) {
    router.push("/login");
    return;
  }

  // Solo cargar si no hay noticias ya cargadas o si no está cargando
  if (noticiasStore.noticias.length > 0) {
    console.log("✓ AdminNoticias: Noticias ya cargadas, reutilizando datos");
    return;
  }

  // Cargar noticias con manejo de errores
  try {
    console.log("📰 AdminNoticias: Cargando noticias...");
    const result = await noticiasStore.fetchNoticias();

    if (result.success) {
      console.log(
        "✅ AdminNoticias: Noticias cargadas:",
        noticiasStore.noticias.length
      );
    } else {
      console.warn("⚠️ AdminNoticias: Error al cargar:", result.error);
    }
  } catch (error: any) {
    console.error("❌ AdminNoticias: Error en carga:", error);
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

/* Truncar texto en múltiples líneas */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

/* Estilos para prose */
.prose {
  color: #374151;
}

.prose p {
  margin-bottom: 1.25em;
}
</style>
