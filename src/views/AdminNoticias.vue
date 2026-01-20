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
      class="bg-white shadow-md border-b-4 border-green-600 sticky top-0 z-40"
      role="banner"
    >
      <div class="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
        <div class="flex items-center justify-between gap-2 sm:gap-3">
          <div class="min-w-0 flex-1">
            <h1 class="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
              Panel de Gestión de Noticias
            </h1>
            <p class="text-gray-600 mt-0.5 sm:mt-1 text-xs sm:text-sm truncate">
              Administra y publica noticias para la comunidad de Manta
            </p>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <!-- Selector de Vista - Optimizado para móvil -->
            <div class="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
              <button
                @click="vistaActual = 'tarjetas'"
                :class="[
                  'p-1.5 sm:p-2 rounded transition-all',
                  vistaActual === 'tarjetas'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
                :aria-label="$t('admin.noticias.viewCards')"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                @click="vistaActual = 'lista'"
                :class="[
                  'p-1.5 sm:p-2 rounded transition-all',
                  vistaActual === 'lista'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
                :aria-label="$t('admin.noticias.viewList')"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <router-link
              to="/admin"
              class="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              <span class="hidden sm:inline ml-1">{{ $t("common.back") }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8" role="main">
      <!-- Barra de Acciones Superior -->
      <div class="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <!-- Botón Crear Nueva Noticia -->
        <button
          @click="openCreateModal"
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm sm:text-base font-semibold rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform active:scale-95"
          :aria-label="$t('admin.noticias.createNew')"
          title="Crear una nueva noticia"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          {{ $t("admin.noticias.createNew") }}
        </button>

        <!-- Buscador y Filtros -->
        <div class="space-y-2 sm:space-y-3">
          <!-- Buscador de texto -->
          <div class="relative w-full">
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por título o contenido..."
              class="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              :class="{ 'border-green-500 bg-green-50': busqueda }"
            />
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 transition-colors"
              :class="busqueda ? 'text-green-600' : 'text-gray-400'"
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
            <!-- Botón limpiar búsqueda -->
            <button
              v-if="busqueda"
              @click="busqueda = ''"
              class="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              title="Limpiar búsqueda"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Filtros en grid responsivo -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            <!-- Filtro por tipo de alcance -->
            <select
              v-model="filtroAlcance"
              class="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all text-sm sm:text-base"
              :class="{ 'border-green-500 bg-green-50': filtroAlcance !== 'todas' }"
            >
              <option value="todas">Todas las noticias</option>
              <option value="globales">🌍 Solo globales</option>
              <option value="parroquias">Solo parroquias</option>
              <option value="barrios">Solo barrios</option>
            </select>

            <!-- Filtro por parroquia específica -->
            <select
              v-if="filtroAlcance === 'parroquias' || filtroAlcance === 'barrios'"
              v-model="filtroParroquia"
              class="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all text-sm sm:text-base"
              :class="{ 'border-green-500 bg-green-50': filtroParroquia }"
            >
              <option value="">Todas las parroquias</option>
              <option v-for="parroquia in parroquiasUnicas" :key="parroquia" :value="parroquia">
                {{ parroquia }}
              </option>
            </select>

            <!-- Botón limpiar todos los filtros -->
            <button
              v-if="busqueda || filtroAlcance !== 'todas' || filtroParroquia"
              @click="limpiarFiltros"
              class="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 border border-red-200 rounded-lg transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
              title="Limpiar todos los filtros"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Limpiar filtros</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Contador de resultados y filtros activos -->
      <div v-if="busqueda || filtroAlcance !== 'todas' || filtroParroquia" class="mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-gray-50 border border-gray-300 rounded-lg p-3 sm:p-4">
          <!-- Contador -->
          <div class="text-xs sm:text-sm text-gray-700">
            <span class="font-bold text-green-600 text-base sm:text-lg">{{ noticiasFiltradas.length }}</span> 
            <span class="ml-1">{{ noticiasFiltradas.length === 1 ? 'noticia encontrada' : 'noticias encontradas' }}</span>
            <span class="text-gray-500 ml-1">de {{ noticias.length }}</span>
          </div>
          
          <!-- Badges de filtros activos -->
          <div class="flex flex-wrap gap-1.5 sm:gap-2">
            <!-- Badge búsqueda -->
            <span 
              v-if="busqueda"
              class="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="max-w-[100px] sm:max-w-[150px] truncate">{{ busqueda }}</span>
            </span>
            
            <!-- Badge alcance -->
            <span 
              v-if="filtroAlcance !== 'todas'"
              class="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
            >
              <svg v-if="filtroAlcance === 'globales'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span>{{ filtroAlcance === 'globales' ? 'Globales' : filtroAlcance === 'parroquias' ? 'Parroquias' : 'Barrios' }}</span>
            </span>
            
            <!-- Badge parroquia -->
            <span 
              v-if="filtroParroquia"
              class="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
            >
              <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span class="max-w-[80px] sm:max-w-[120px] truncate">{{ filtroParroquia }}</span>
            </span>
          </div>
        </div>
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
        <!-- Empty State - Sin resultados de filtrado -->
        <div
          v-if="noticiasFiltradas.length === 0 && (busqueda || filtroAlcance !== 'todas' || filtroParroquia)"
          class="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200"
        >
          <svg class="w-20 h-20 mb-4 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z"></path>
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clip-rule="evenodd"></path>
          </svg>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">
            No se encontraron resultados
          </h3>
          <p class="text-gray-600 mb-6">
            No hay noticias que coincidan con los filtros seleccionados
          </p>
          <button
            @click="limpiarFiltros"
            class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </button>
        </div>

        <!-- Empty State - Sin noticias en el sistema -->
        <div
          v-else-if="noticias.length === 0"
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

        <!-- Noticias - Vista de Tarjetas Responsiva -->
        <div
          v-else-if="vistaActual === 'tarjetas'"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          role="list"
          aria-label="Lista de noticias"
        >
          <article
            v-for="noticia in noticiasFiltradas"
            :key="noticia.id"
            class="bg-white rounded-lg shadow-sm sm:shadow hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden active:scale-[0.98]"
            role="listitem"
          >
            <!-- Imagen responsive -->
            <div
              v-if="noticia.imagen_url"
              class="h-24 sm:h-28 md:h-32 bg-cover bg-center"
              :style="{ backgroundImage: `url(${noticia.imagen_url})` }"
              role="img"
              :aria-label="`Imagen de ${noticia.titulo}`"
            ></div>
            <div
              v-else
              class="h-24 sm:h-28 md:h-32 bg-gray-100 flex items-center justify-center"
              role="img"
              aria-label="Imagen no disponible"
            >
              <svg
                class="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-green-300"
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

            <!-- Content responsive -->
            <div class="p-2.5 sm:p-3 md:p-4">
              <!-- Título y alcance -->
              <div class="mb-2 sm:mb-2.5 md:mb-3">
                <h3 class="text-sm sm:text-base md:text-base font-bold text-gray-800 mb-1.5 sm:mb-2 line-clamp-2 leading-snug">
                  {{ noticia.titulo }}
                </h3>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-if="!noticia.parroquia_destino"
                    class="inline-block px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    🌍 Global
                  </span>
                  <span
                    v-else
                    class="inline-block px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-green-100 text-green-800 truncate max-w-[150px]"
                  >
                    <svg class="w-3 h-3 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    {{ noticia.parroquia_destino }}
                  </span>
                </div>
              </div>

              <!-- Contenido -->
              <p class="text-gray-700 text-[11px] sm:text-xs md:text-sm mb-2 sm:mb-2.5 md:mb-3 line-clamp-2 leading-relaxed">
                {{ noticia.contenido }}
              </p>

              <!-- Fecha responsive -->
              <div class="flex items-center text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-2.5 md:mb-3 pb-2 sm:pb-2.5 md:pb-3 border-b border-gray-100">
                <svg
                  class="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1"
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
                {{ new Date(noticia.created_at || '').toLocaleDateString('es-EC', { 
                  day: '2-digit', 
                  month: 'short'
                }) }}
              </div>

              <!-- Acciones responsivas -->
              <div class="flex gap-2 sm:gap-2.5">
                <button
                  @click="viewNoticia(noticia)"
                  class="flex-1 inline-flex items-center justify-center px-2 sm:px-3 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[10px] sm:text-xs font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  :aria-label="`Ver ${noticia.titulo}`"
                  title="Ver noticia completa"
                >
                  <svg class="w-4 sm:w-4 h-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button
                  @click="editNoticia(noticia)"
                  class="flex-1 inline-flex items-center justify-center px-2 sm:px-3 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-[10px] sm:text-xs font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                  :aria-label="`${$t('common.edit')} ${noticia.titulo}`"
                  title="Editar noticia"
                >
                  <svg class="w-4 sm:w-4 h-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="confirmDelete(noticia)"
                  class="flex-1 inline-flex items-center justify-center px-2 sm:px-3 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-[10px] sm:text-xs font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
                  :aria-label="`${$t('common.delete')} ${noticia.titulo}`"
                  title="Eliminar noticia"
                >
                  <svg class="w-4 sm:w-4 h-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- Noticias - Vista de Lista Responsiva -->
        <div v-else class="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
          <!-- Vista móvil: Tarjetas compactas -->
          <div class="md:hidden divide-y divide-gray-200">
            <article
              v-for="noticia in noticiasFiltradas"
              :key="noticia.id"
              class="px-3 py-3 hover:bg-green-50 transition-colors"
            >
              <!-- Imagen y título -->
              <div class="flex items-start gap-2 mb-2">
                <div 
                  v-if="noticia.imagen_url"
                  class="w-12 h-12 rounded bg-cover bg-center flex-shrink-0"
                  :style="{ backgroundImage: `url(${noticia.imagen_url})` }"
                ></div>
                <div v-else class="w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span class="text-lg">📰</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                    {{ noticia.titulo }}
                  </h3>
                  <p class="text-xs text-gray-600 line-clamp-2">
                    {{ noticia.contenido }}
                  </p>
                </div>
              </div>

              <!-- Info adicional -->
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span
                  v-if="!noticia.parroquia_destino"
                  class="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  🌍 Global
                </span>
                <span
                  v-else
                  class="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-800"
                >
                  📍 {{ noticia.parroquia_destino }}
                </span>
                <span class="text-[10px] text-gray-500">
                  {{ new Date(noticia.created_at || '').toLocaleDateString('es-EC', { 
                    day: '2-digit', 
                    month: 'short'
                  }) }}
                </span>
              </div>

              <!-- Acciones -->
              <div class="flex gap-1.5">
                <button
                  @click="viewNoticia(noticia)"
                  class="flex-1 p-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded transition-colors text-xs font-medium flex items-center justify-center gap-1"
                  :aria-label="`Ver ${noticia.titulo}`"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button
                  @click="editNoticia(noticia)"
                  class="flex-1 p-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded transition-colors text-xs font-medium flex items-center justify-center gap-1"
                  :aria-label="`${$t('common.edit')} ${noticia.titulo}`"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="confirmDelete(noticia)"
                  class="flex-1 p-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded transition-colors text-xs font-medium flex items-center justify-center gap-1"
                  :aria-label="`${$t('common.delete')} ${noticia.titulo}`"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </article>
          </div>

          <!-- Vista desktop: Tabla completa -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-700 text-white">
                <tr>
                  <th class="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Título</th>
                  <th class="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold hidden lg:table-cell">Contenido</th>
                  <th class="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Alcance</th>
                  <th class="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Fecha</th>
                  <th class="px-4 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="noticia in noticiasFiltradas"
                  :key="noticia.id"
                  class="hover:bg-green-50 transition-colors"
                >
                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <div class="flex items-center gap-2 md:gap-3">
                      <div 
                        v-if="noticia.imagen_url"
                        class="w-10 h-10 md:w-12 md:h-12 rounded bg-cover bg-center flex-shrink-0"
                        :style="{ backgroundImage: `url(${noticia.imagen_url})` }"
                      ></div>
                      <div v-else class="w-10 h-10 md:w-12 md:h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span class="text-base md:text-xl">📰</span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-gray-900 text-xs md:text-sm line-clamp-1">{{ noticia.titulo }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                    <p class="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {{ noticia.contenido }}
                    </p>
                  </td>
                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <span
                      v-if="!noticia.parroquia_destino"
                      class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      🌍 Global
                    </span>
                    <span
                      v-else
                      class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 max-w-[120px] truncate"
                    >
                      📍 {{ noticia.parroquia_destino }}
                    </span>
                  </td>
                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <div class="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600">
                      <svg class="w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="hidden lg:inline">
                        {{ new Date(noticia.created_at || '').toLocaleDateString('es-EC', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        }) }}
                      </span>
                      <span class="lg:hidden">
                        {{ new Date(noticia.created_at || '').toLocaleDateString('es-EC', { 
                          day: '2-digit', 
                          month: 'short'
                        }) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 md:px-6 py-3 md:py-4">
                    <div class="flex justify-center gap-1.5 md:gap-2">
                      <button
                        @click="viewNoticia(noticia)"
                        class="p-1.5 md:p-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :aria-label="`Ver ${noticia.titulo}`"
                        title="Ver"
                      >
                        <svg class="w-3.5 md:w-4 h-3.5 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button
                        @click="editNoticia(noticia)"
                        class="p-1.5 md:p-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                        :aria-label="`${$t('common.edit')} ${noticia.titulo}`"
                        title="Editar"
                      >
                        <svg class="w-3.5 md:w-4 h-3.5 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        @click="confirmDelete(noticia)"
                        class="p-1.5 md:p-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        :aria-label="`${$t('common.delete')} ${noticia.titulo}`"
                        title="Eliminar"
                      >
                        <svg class="w-3.5 md:w-4 h-3.5 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Crear/Editar Noticia -->
    <div
      v-if="showModal"
      class="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-2 sm:p-4 pt-24 z-[110] overflow-y-auto"
      @click.self="closeModal"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div class="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl max-w-3xl w-full my-4 sm:my-8">
        <!-- Modal Header -->
        <div
          class="bg-gradient-to-r from-green-600 to-emerald-500 p-3 sm:p-4 md:p-6 rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl sticky top-0 z-10"
        >
          <div class="flex items-center justify-between">
            <h2 id="modal-title" class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
              {{
                isEditing
                  ? $t("admin.noticias.editNews")
                  : $t("admin.noticias.createNew")
              }}
            </h2>
            <button
              @click="closeModal"
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 sm:p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white min-h-[36px] min-w-[36px] flex items-center justify-center"
              :aria-label="$t('common.close')"
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
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <form
          @submit.prevent="submitForm"
          class="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 max-h-[calc(100vh-150px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <!-- Título -->
          <div>
            <label
              for="titulo"
              class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
            >
              {{ $t("admin.noticias.formLabels.title") }} *
            </label>
            <input
              id="titulo"
              v-model="formData.titulo"
              type="text"
              required
              maxlength="200"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              :class="formData.titulo.trim() === '' && (formData.contenido.trim() !== '' || formData.imagen_url) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
              placeholder="Ej: Inauguración del nuevo parque comunitario"
              aria-required="true"
            />
          </div>

          <!-- Contenido -->
          <div>
            <label
              for="contenido"
              class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
            >
              {{ $t("admin.noticias.formLabels.content") }} *
            </label>
            <textarea
              id="contenido"
              v-model="formData.contenido"
              required
              rows="6"
              maxlength="5000"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              :class="formData.contenido.trim() === '' && (formData.titulo.trim() !== '' || formData.imagen_url) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
              placeholder="Escribe el contenido completo de la noticia..."
              aria-required="true"
              :aria-describedby="'contenido-hint'"
            ></textarea>
            <div class="flex items-center justify-between mt-1">
              <p id="contenido-hint" class="text-xs sm:text-sm text-gray-500">
                {{ formData.contenido.length }}/5000 caracteres
              </p>
              <p v-if="formData.contenido.trim() === '' && formData.titulo.trim() !== ''" class="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Campo requerido
              </p>
            </div>
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
              <p v-if="imageError" class="p-4 text-sm text-red-600 bg-red-50 flex items-center gap-2">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                No se pudo cargar la imagen.
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
              :disabled="submitting || !isFormValid"
              class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :title="!isFormValid ? 'Completa todos los campos requeridos' : ''"
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
          
          <!-- Mensaje de validación -->
          <p v-if="!isFormValid && (formData.titulo || formData.contenido)" class="text-sm text-red-600 mt-2 flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            Por favor completa todos los campos requeridos (Título y Contenido)
          </p>
        </form>
      </div>
    </div>

    <!-- Modal Ver Noticia -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 pt-24 z-[110] overflow-y-auto"
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
              <svg class="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              {{ selectedNoticia.parroquia_destino }}
              <span v-if="selectedNoticia.barrio_destino">
                - {{ selectedNoticia.barrio_destino }}</span
              >
            </span>
            <span
              class="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-700"
            >
              <svg class="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
              </svg>
              {{ formatDate(selectedNoticia.created_at) }}
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
      class="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 pt-24 z-[110]"
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
import { computed, onMounted, ref, watch } from "vue";
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
// Vista actual con persistencia en localStorage
const vistaActual = ref<'tarjetas' | 'lista'>(
  (localStorage.getItem('admin_noticias_vista') as 'tarjetas' | 'lista') || 'tarjetas'
);
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

// Estado de filtros y búsqueda
const busqueda = ref("");
const filtroAlcance = ref<'todas' | 'globales' | 'parroquias' | 'barrios'>('todas');
const filtroParroquia = ref("");

// Computed
const loading = computed(() => noticiasStore.loading);
const error = computed(() => noticiasStore.error);
const noticias = computed(() => noticiasStore.noticias);

// Validación del formulario
const isFormValid = computed(() => {
  return formData.value.titulo.trim().length > 0 && 
         formData.value.contenido.trim().length > 0;
});

// Obtener parroquias únicas de las noticias
const parroquiasUnicas = computed(() => {
  const parroquias = new Set<string>();
  noticias.value.forEach((noticia) => {
    if (noticia.parroquia_destino) {
      parroquias.add(noticia.parroquia_destino);
    }
  });
  return Array.from(parroquias).sort();
});

// Filtrar noticias según criterios
const noticiasFiltradas = computed(() => {
  let resultado = noticias.value;

  // Filtro por texto de búsqueda
  if (busqueda.value.trim()) {
    const textoBusqueda = busqueda.value.toLowerCase().trim();
    resultado = resultado.filter((noticia) => {
      const titulo = noticia.titulo?.toLowerCase() || "";
      const contenido = noticia.contenido?.toLowerCase() || "";
      return titulo.includes(textoBusqueda) || contenido.includes(textoBusqueda);
    });
  }

  // Filtro por tipo de alcance
  if (filtroAlcance.value !== 'todas') {
    resultado = resultado.filter((noticia) => {
      switch (filtroAlcance.value) {
        case 'globales':
          return noticia.parroquia_destino === null || noticia.parroquia_destino === '';
        case 'parroquias':
          return noticia.parroquia_destino && (!noticia.barrio_destino || noticia.barrio_destino === '');
        case 'barrios':
          return noticia.barrio_destino && noticia.barrio_destino !== '';
        default:
          return true;
      }
    });
  }

  // Filtro por parroquia específica
  if (filtroParroquia.value) {
    resultado = resultado.filter((noticia) => 
      noticia.parroquia_destino === filtroParroquia.value
    );
  }

  return resultado;
});

// Métodos
const limpiarFiltros = () => {
  busqueda.value = "";
  filtroAlcance.value = 'todas';
  filtroParroquia.value = "";
};

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
      await noticiasStore.fetchTodasLasNoticias();
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
      await noticiasStore.fetchTodasLasNoticias();
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

  // Cargar TODAS las noticias (administrador puede ver todas)
  try {
    console.log("📰 AdminNoticias: Cargando TODAS las noticias...");
    const result = await noticiasStore.fetchTodasLasNoticias();

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

// Guardar preferencia de vista en localStorage
watch(vistaActual, (nuevaVista) => {
  localStorage.setItem('admin_noticias_vista', nuevaVista);
});

// Limpiar filtro de parroquia cuando cambia el tipo de alcance
watch(filtroAlcance, (nuevoAlcance) => {
  if (nuevoAlcance === 'todas' || nuevoAlcance === 'globales') {
    filtroParroquia.value = '';
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
