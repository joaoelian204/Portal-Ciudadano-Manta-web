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
    <header class="bg-white shadow-md border-b-4 border-blue-600 sticky top-0 z-40" role="banner">
      <div class="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
        <div class="flex items-center justify-between gap-2 sm:gap-3">
          <div class="min-w-0 flex-1">
            <h1 class="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
              {{ $t("admin.encuestas.title") }}
            </h1>
            <p class="text-gray-600 mt-0.5 sm:mt-1 text-xs sm:text-sm truncate hidden sm:block">
              {{ $t("admin.sections.surveys.description") }}
            </p>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
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
    <main id="main-content" class="container mx-auto px-4 py-8" role="main">
      <!-- Barra de acciones -->
      <div class="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <!-- Botón Crear -->
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

        <!-- Buscador y Filtros -->
        <div class="flex flex-wrap gap-3 w-full lg:w-auto items-center">
          <!-- Buscador de texto -->
          <div class="relative flex-1 sm:flex-initial sm:w-64">
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por título o descripción..."
              class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              :class="{ 'border-blue-500 bg-blue-50': busqueda }"
            />
            <svg
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors"
              :class="busqueda ? 'text-blue-600' : 'text-gray-400'"
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
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Limpiar búsqueda"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Filtro por estado -->
          <select
            v-model="filtroEstado"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
            :class="{ 'border-blue-500 bg-blue-50': filtroEstado !== 'todas' }"
          >
            <option value="todas">Todas las encuestas</option>
            <option value="activas">Activas</option>
            <option value="proximas">Próximas</option>
            <option value="finalizadas">Finalizadas</option>
            <option value="inactivas">Inactivas</option>
          </select>

          <!-- Filtro por tipo -->
          <select
            v-model="filtroTipo"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
            :class="{ 'border-blue-500 bg-blue-50': filtroTipo !== 'todas' }"
          >
            <option value="todas">Todos los tipos</option>
            <option value="opcion_multiple">Opción múltiple</option>
            <option value="calificacion">Calificación</option>
            <option value="abierta">Pregunta abierta</option>
          </select>

          <!-- Filtro por alcance -->
          <select
            v-model="filtroAlcance"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
            :class="{ 'border-blue-500 bg-blue-50': filtroAlcance !== 'todas' }"
          >
            <option value="todas">Todos los alcances</option>
            <option value="globales">Solo globales</option>
            <option value="parroquias">Solo parroquias</option>
            <option value="barrios">Solo barrios</option>
          </select>

          <!-- Filtro por parroquia específica -->
          <select
            v-if="filtroAlcance === 'parroquias' || filtroAlcance === 'barrios'"
            v-model="filtroParroquia"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
            :class="{ 'border-blue-500 bg-blue-50': filtroParroquia }"
          >
            <option value="">Todas las parroquias</option>
            <option v-for="parroquia in parroquiasUnicas" :key="parroquia" :value="parroquia">
              {{ parroquia }}
            </option>
          </select>

          <!-- Botón limpiar todos los filtros -->
          <button
            v-if="busqueda || filtroEstado !== 'todas' || filtroTipo !== 'todas' || filtroAlcance !== 'todas' || filtroParroquia"
            @click="limpiarFiltros"
            class="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-all flex items-center gap-1.5 font-medium text-sm"
            title="Limpiar todos los filtros"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="hidden sm:inline">Limpiar</span>
          </button>

          <!-- Filtro de vista - Adaptado para móvil -->
          <div class="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg">
            <button
              @click="vistaActual = 'tarjetas'"
              :class="[
                'p-1.5 sm:px-3 sm:py-2 rounded-md font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1',
                vistaActual === 'tarjetas'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              ]"
              :aria-label="'Vista de tarjetas'"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span class="hidden sm:inline">Tarjetas</span>
            </button>
            <button
              @click="vistaActual = 'lista'"
              :class="[
                'p-1.5 sm:px-3 sm:py-2 rounded-md font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1',
                vistaActual === 'lista'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              ]"
              :aria-label="'Vista de lista'"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span class="hidden sm:inline">Lista</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Contador de resultados y filtros activos -->
      <div v-if="busqueda || filtroEstado !== 'todas' || filtroTipo !== 'todas'" class="mb-6">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Contador -->
          <div class="text-sm text-gray-600">
            <span class="font-semibold text-blue-600 text-lg">{{ encuestasFiltradas.length }}</span> 
            <span class="ml-1">{{ encuestasFiltradas.length === 1 ? 'encuesta encontrada' : 'encuestas encontradas' }}</span>
            <span class="text-gray-400 ml-1">de {{ encuestas.length }}</span>
          </div>
          
          <!-- Badges de filtros activos -->
          <div class="flex flex-wrap gap-2">
            <!-- Badge búsqueda -->
            <span 
              v-if="busqueda"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="max-w-[150px] truncate">{{ busqueda }}</span>
            </span>
            
            <!-- Badge estado -->
            <span 
              v-if="filtroEstado !== 'todas'"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
            >
              <span v-if="filtroEstado === 'activas'">✅</span>
              <span v-else-if="filtroEstado === 'proximas'">⏳</span>
              <span v-else-if="filtroEstado === 'finalizadas'">�</span>
              <span v-else>❌</span>
              {{ filtroEstado === 'activas' ? 'Activas' : filtroEstado === 'proximas' ? 'Próximas' : filtroEstado === 'finalizadas' ? 'Finalizadas' : 'Inactivas' }}
            </span>
            
            <!-- Badge tipo -->
            <span 
              v-if="filtroTipo !== 'todas'"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
            >
              <span v-if="filtroTipo === 'opcion_multiple'">☑️</span>
              <span v-else-if="filtroTipo === 'calificacion'">⭐</span>
              <span v-else>�</span>
              {{ filtroTipo === 'opcion_multiple' ? 'Opción múltiple' : filtroTipo === 'calificacion' ? 'Calificación' : 'Pregunta abierta' }}
            </span>

            <!-- Badge alcance -->
            <span 
              v-if="filtroAlcance !== 'todas'"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
            >
              <svg v-if="filtroAlcance === 'globales'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              {{ filtroAlcance === 'globales' ? 'Globales' : filtroAlcance === 'parroquias' ? 'Parroquias' : 'Barrios' }}
            </span>
            
            <!-- Badge parroquia -->
            <span 
              v-if="filtroParroquia"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium"
            >
              <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              {{ filtroParroquia }}
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
        <!-- Empty State - Sin resultados de filtrado -->
        <div
          v-if="encuestasFiltradas.length === 0 && (busqueda || filtroEstado !== 'todas' || filtroTipo !== 'todas' || filtroAlcance !== 'todas' || filtroParroquia)"
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
            No hay encuestas que coincidan con los filtros seleccionados
          </p>
          <button
            @click="limpiarFiltros"
            class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </button>
        </div>

        <!-- Empty State - Sin encuestas en el sistema -->
        <div
          v-else-if="encuestas.length === 0"
          class="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200"
        >
          <svg class="w-20 h-20 mb-4 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
          </svg>
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

        <!-- Encuestas Cards/List -->
        <div v-else>
          <!-- Vista de Tarjetas -->
          <div
            v-if="vistaActual === 'tarjetas'"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            role="list"
            aria-label="Lista de encuestas en tarjetas"
          >
            <article
              v-for="encuesta in encuestasFiltradas"
              :key="encuesta.id"
              class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group"
              role="listitem"
            >
              <!-- Header compacto -->
              <div class="p-4 border-b border-gray-100">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <h3
                    :id="`encuesta-title-${encuesta.id}`"
                    class="text-base font-bold text-gray-800 line-clamp-2 flex-1"
                  >
                    {{ encuesta.titulo }}
                  </h3>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                    :class="
                      encuesta.activa
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    "
                  >
                    {{ encuesta.activa ? "✓" : "✕" }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {{ getTipoLabel(encuesta.tipo) }}
                  </span>
                </div>
              </div>

              <!-- Body compacto -->
              <div class="p-4">
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                  {{ encuesta.descripcion }}
                </p>

                <!-- Fechas compactas -->
                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>{{ formatDate(encuesta.fecha_inicio) }}</span>
                  </div>
                  <span>→</span>
                  <span>{{ formatDate(encuesta.fecha_fin) }}</span>
                </div>

                <!-- Acciones compactas -->
                <div class="flex gap-2">
                  <button
                    @click="viewStats(encuesta)"
                    class="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors"
                    :aria-label="`Ver estadísticas de ${encuesta.titulo}`"
                    title="Estadísticas"
                  >
                    <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </button>
                  <button
                    @click="editEncuesta(encuesta)"
                    class="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
                    :aria-label="`Editar ${encuesta.titulo}`"
                    title="Editar"
                  >
                    <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(encuesta)"
                    class="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
                    :aria-label="`Eliminar ${encuesta.titulo}`"
                    title="Eliminar"
                  >
                    <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Vista de Lista -->
          <div
            v-else
            class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            role="list"
            aria-label="Lista de encuestas en formato tabla"
          >
            <!-- Vista móvil: Tarjetas compactas -->
            <div class="md:hidden divide-y divide-gray-200">
              <article
                v-for="encuesta in encuestasFiltradas"
                :key="encuesta.id"
                class="px-3 py-3 hover:bg-gray-50 transition-colors"
                role="listitem"
              >
                <!-- Título y tipo -->
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-bold text-gray-800 line-clamp-1">
                      {{ encuesta.titulo }}
                    </h3>
                    <p class="text-xs text-gray-600 line-clamp-1 mt-0.5">
                      {{ encuesta.descripcion }}
                    </p>
                  </div>
                  <span
                    class="px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0"
                    :class="
                      encuesta.activa
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    "
                  >
                    {{ encuesta.activa ? "✓" : "✕" }}
                  </span>
                </div>

                <!-- Info adicional -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-100 text-blue-700">
                    {{ getTipoLabel(encuesta.tipo) }}
                  </span>
                  <span class="text-[10px] text-gray-500">
                    {{ formatDate(encuesta.fecha_inicio) }} - {{ formatDate(encuesta.fecha_fin) }}
                  </span>
                </div>

                <!-- Acciones -->
                <div class="flex gap-1.5">
                  <button
                    @click="viewStats(encuesta)"
                    class="flex-1 p-1.5 bg-green-100 hover:bg-green-200 active:bg-green-300 text-green-700 rounded transition-colors text-xs font-medium flex items-center justify-center gap-1"
                    :aria-label="`Ver estadísticas de ${encuesta.titulo}`"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </button>
                  <button
                    @click="editEncuesta(encuesta)"
                    class="flex-1 p-1.5 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-700 rounded transition-colors text-xs font-medium flex items-center justify-center gap-1"
                    :aria-label="`Editar ${encuesta.titulo}`"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(encuesta)"
                    class="flex-1 p-1.5 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 rounded transition-colors text-xs font-medium flex items-center justify-center gap-1"
                    :aria-label="`Eliminar ${encuesta.titulo}`"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </article>
            </div>

            <!-- Vista desktop: Tabla completa -->
            <div class="hidden md:block">
              <!-- Header de tabla -->
              <div class="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3">
                <div class="grid grid-cols-12 gap-3 text-xs font-semibold text-white uppercase">
                  <div class="col-span-4">Título</div>
                  <div class="col-span-2">Tipo</div>
                  <div class="col-span-2">Inicio</div>
                  <div class="col-span-2">Fin</div>
                  <div class="col-span-1">Estado</div>
                  <div class="col-span-1 text-right">Acciones</div>
                </div>
              </div>

              <!-- Filas -->
              <div class="divide-y divide-gray-200">
                <article
                  v-for="encuesta in encuestasFiltradas"
                  :key="encuesta.id"
                  class="px-4 py-3 hover:bg-gray-50 transition-colors"
                  role="listitem"
                >
                  <div class="grid grid-cols-12 gap-3 items-center">
                    <!-- Título -->
                    <div class="col-span-4 min-w-0">
                      <h3 class="text-sm font-bold text-gray-800 mb-0.5 line-clamp-1">
                        {{ encuesta.titulo }}
                      </h3>
                      <p class="text-xs text-gray-600 line-clamp-1">
                        {{ encuesta.descripcion }}
                      </p>
                    </div>

                    <!-- Tipo -->
                    <div class="col-span-2">
                      <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 inline-block">
                        {{ getTipoLabel(encuesta.tipo) }}
                      </span>
                    </div>

                    <!-- Fechas -->
                    <div class="col-span-2 text-xs text-gray-600">
                      {{ formatDate(encuesta.fecha_inicio) }}
                    </div>
                    <div class="col-span-2 text-xs text-gray-600">
                      {{ formatDate(encuesta.fecha_fin) }}
                    </div>

                    <!-- Estado -->
                    <div class="col-span-1">
                      <span
                        class="px-2 py-1 text-xs font-semibold rounded-full inline-block"
                        :class="
                          encuesta.activa
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        "
                      >
                        {{ encuesta.activa ? "✓" : "✕" }}
                      </span>
                    </div>

                    <!-- Acciones -->
                    <div class="col-span-1 flex justify-end gap-1">
                      <button
                        @click="viewStats(encuesta)"
                        class="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                        :aria-label="`Ver estadísticas de ${encuesta.titulo}`"
                        title="Estadísticas"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </button>
                      <button
                        @click="editEncuesta(encuesta)"
                        class="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                        :aria-label="`Editar ${encuesta.titulo}`"
                        title="Editar"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        @click="confirmDelete(encuesta)"
                        class="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                        :aria-label="`Eliminar ${encuesta.titulo}`"
                        title="Eliminar"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Crear/Editar Encuesta -->
    <div
      v-if="showModal"
      class="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 pt-24 z-[110]"
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
        <form @submit.prevent="submitForm" class="p-6 space-y-5">
          <!-- Título y Estado en una fila -->
          <div class="flex gap-4 items-start">
            <div class="flex-1">
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
                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ej: Satisfacción con servicios públicos"
                aria-required="true"
              />
            </div>
            <div class="pt-8">
              <label class="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2.5 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors">
                <input
                  id="activa"
                  v-model="formData.activa"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-sm font-semibold text-gray-700">Activa</span>
              </label>
            </div>
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
              rows="2"
              maxlength="500"
              class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              placeholder="Describe el objetivo de la encuesta..."
              aria-required="true"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ formData.descripcion.length }}/500
            </p>
          </div>

          <!-- Tipo y Fechas en una fila -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                for="tipo"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                Tipo *
              </label>
              <select
                id="tipo"
                v-model="formData.tipo"
                required
                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                aria-required="true"
                @change="handleTipoChange"
              >
                <option value="opcion_multiple">Opción Múltiple</option>
                <option value="calificacion">Calificación (1-5)</option>
                <option value="abierta">Respuesta Abierta</option>
              </select>
            </div>
            <div>
              <label
                for="fecha_inicio"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                Inicio *
              </label>
              <input
                id="fecha_inicio"
                v-model="formData.fecha_inicio"
                type="datetime-local"
                required
                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                aria-required="true"
              />
            </div>
            <div>
              <label
                for="fecha_fin"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                Fin *
              </label>
              <input
                id="fecha_fin"
                v-model="formData.fecha_fin"
                type="datetime-local"
                required
                class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                aria-required="true"
              />
            </div>
          </div>

          <!-- Ubicación - Parroquia y Barrio -->
          <div class="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 space-y-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              Alcance Geográfico
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  for="parroquia_destino"
                  class="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Parroquia (opcional)
                </label>
                <select
                  id="parroquia_destino"
                  v-model="formData.parroquia_destino"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                  <option value="">🌍 Global (todas las parroquias)</option>
                  <option value="Tarqui">Tarqui</option>
                  <option value="Eloy Alfaro">Eloy Alfaro</option>
                  <option value="Manta">Manta</option>
                  <option value="Los Esteros">Los Esteros</option>
                  <option value="San Mateo">San Mateo</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                  Deja en "Global" para toda la ciudad, o selecciona una parroquia específica
                </p>
              </div>
              <div>
                <label
                  for="barrio_destino"
                  class="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Barrio (opcional)
                </label>
                <input
                  id="barrio_destino"
                  v-model="formData.barrio_destino"
                  type="text"
                  :disabled="!formData.parroquia_destino"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Ej: Los Esteros, Jocay..."
                />
                <p class="text-xs text-gray-500 mt-1">
                  Déjalo vacío para toda la parroquia, o especifica un barrio
                </p>
              </div>
            </div>
          </div>

          <!-- Preguntas (solo para opción múltiple) -->
          <div v-if="formData.tipo === 'opcion_multiple'" class="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 space-y-4">
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              Preguntas con Opciones *
            </label>
            
            <!-- Cada Pregunta -->
            <div
              v-for="(pregunta, preguntaIndex) in formData.preguntas"
              :key="preguntaIndex"
              class="bg-white rounded-lg p-4 border-2 border-blue-300 space-y-3"
            >
              <!-- Encabezado de la pregunta -->
              <div class="flex items-center gap-2 mb-2">
                <span class="flex-shrink-0 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                  Pregunta {{ preguntaIndex + 1 }}
                </span>
                <button
                  v-if="formData.preguntas.length > 1"
                  @click="removePregunta(preguntaIndex)"
                  type="button"
                  class="ml-auto p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  :aria-label="`Eliminar pregunta ${preguntaIndex + 1}`"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Texto de la pregunta -->
              <input
                v-model="pregunta.pregunta"
                type="text"
                required
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
                :placeholder="`Ej: ¿Qué servicio necesita mejorar?`"
                :aria-label="`Texto de pregunta ${preguntaIndex + 1}`"
              />

              <!-- Opciones de esta pregunta -->
              <div class="space-y-2 pl-4">
                <label class="text-xs font-semibold text-gray-600">Opciones de respuesta:</label>
                <div
                  v-for="(_, opcionIndex) in pregunta.opciones"
                  :key="opcionIndex"
                  class="flex items-center gap-2"
                >
                  <span class="flex-shrink-0 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {{ String.fromCharCode(65 + opcionIndex) }}
                  </span>
                  <input
                    v-model="pregunta.opciones[opcionIndex]"
                    type="text"
                    required
                    class="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    :placeholder="`Opción ${String.fromCharCode(65 + opcionIndex)}`"
                    :aria-label="`Pregunta ${preguntaIndex + 1}, Opción ${opcionIndex + 1}`"
                  />
                  <button
                    v-if="pregunta.opciones.length > 2"
                    @click="removeOpcionDePregunta(preguntaIndex, opcionIndex)"
                    type="button"
                    class="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    :aria-label="`Eliminar opción ${opcionIndex + 1} de pregunta ${preguntaIndex + 1}`"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <!-- Botón agregar opción a esta pregunta -->
                <button
                  @click="addOpcionAPregunta(preguntaIndex)"
                  type="button"
                  class="inline-flex items-center px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Agregar Opción
                </button>
              </div>
            </div>

            <!-- Botón agregar pregunta -->
            <button
              @click="addPregunta"
              type="button"
              class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Agregar Nueva Pregunta
            </button>
          </div>

          <!-- Campo para pregunta de calificación -->
          <div v-else-if="formData.tipo === 'calificacion'" class="space-y-4">
            <div class="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
              <div class="flex items-center gap-2 text-yellow-800">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm font-medium">Los ciudadanos calificarán del 1 al 5</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Pregunta a calificar *
              </label>
              <input
                v-model="formData.preguntaCalificacion"
                type="text"
                placeholder="Ej: ¿Cómo califica la atención recibida?"
                required
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>
          </div>

          <!-- Campo para pregunta abierta -->
          <div v-else-if="formData.tipo === 'abierta'" class="space-y-4">
            <div class="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div class="flex items-center gap-2 text-green-800">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span class="text-sm font-medium">Los ciudadanos escribirán su respuesta libremente</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Pregunta abierta *
              </label>
              <input
                v-model="formData.preguntaAbierta"
                type="text"
                placeholder="Ej: ¿Qué sugerencias tiene para mejorar nuestros servicios?"
                required
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-4 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors border-2 border-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
              <span v-else>{{ isEditing ? "Actualizar" : "Crear Encuesta" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Estadísticas -->
    <div
      v-if="showStatsModal"
      class="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 pt-24 z-[110]"
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
            <div v-if="currentStats.tipo === 'multiple_preguntas' && Array.isArray(currentStats.data)">
              <!-- Estadísticas por cada pregunta -->
              <div
                v-for="(preguntaStats, index) in (currentStats.data as Array<any>)"
                :key="index"
                class="mb-8 last:mb-0"
              >
                <div class="bg-blue-50 rounded-lg p-4 mb-4 border-2 border-blue-200">
                  <h4 class="text-base font-bold text-gray-800 flex items-center gap-2">
                    <span class="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                      {{ index + 1 }}
                    </span>
                    {{ preguntaStats.pregunta }}
                  </h4>
                </div>

                <div
                  v-if="Object.keys(preguntaStats.estadisticas).length > 0"
                  class="space-y-3 pl-4"
                >
                  <div
                    v-for="(count, opcion) in preguntaStats.estadisticas"
                    :key="opcion"
                    class="space-y-2"
                  >
                    <div class="flex justify-between text-sm">
                      <span class="font-medium text-gray-700">{{ opcion }}</span>
                      <span class="text-gray-600">
                        {{ count }} ({{ getPercentage(count as number, preguntaStats.total) }}%)
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        class="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-500"
                        :style="{ width: `${getPercentage(count as number, preguntaStats.total)}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-4 text-gray-500 text-sm">
                  No hay respuestas para esta pregunta
                </div>
              </div>
            </div>

            <!-- Respuestas abiertas (mostrar como cuadros de texto) -->
            <div
              v-else-if="currentStats.tipo === 'abierta' && Array.isArray(currentStats.data)"
              class="space-y-4"
            >
              <div class="flex items-center justify-between mb-6">
                <h4 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Respuestas Recibidas
                </h4>
                <span class="text-sm text-gray-600 font-medium">
                  {{ (currentStats.data as Array<any>).length }} respuestas
                </span>
              </div>
              
              <div class="grid gap-4 max-h-[500px] overflow-y-auto pr-2">
                <div
                  v-for="(respuesta, index) in (currentStats.data as Array<any>)"
                  :key="index"
                  class="bg-white rounded-xl p-4 border-2 border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200"
                >
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
                        {{ respuesta.respuesta }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gráfico simple (para tipos de calificación y otros) -->
            <div
              v-else-if="!Array.isArray(currentStats.data) && Object.keys(currentStats.data).length > 0"
              class="space-y-4"
            >
              <h4 class="text-lg font-semibold text-gray-800 mb-4">
                Distribución de Respuestas
              </h4>
              <div
                v-for="(count, opcion) in (currentStats.data as Record<string, number>)"
                :key="opcion"
                class="space-y-2"
              >
                <div class="flex justify-between text-sm">
                  <span class="font-medium text-gray-700">{{ opcion }}</span>
                  <span class="text-gray-600">
                    {{ count }} ({{
                      getPercentage(count as number, currentStats.total)
                    }}%)
                  </span>
                </div>
                <div
                  class="w-full bg-gray-200 rounded-full h-4 overflow-hidden"
                >
                  <div
                    class="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                    :style="{
                      width: `${getPercentage(count as number, currentStats.total)}%`,
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
import { computed, onMounted, ref, watch } from "vue";
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
// Cargar vista guardada desde localStorage o usar 'tarjetas' por defecto
const vistaActual = ref<'tarjetas' | 'lista'>(
  (localStorage.getItem('admin_encuestas_vista') as 'tarjetas' | 'lista') || 'tarjetas'
);
const selectedEncuesta = ref<Encuesta | null>(null);
const encuestaToDelete = ref<Encuesta | null>(null);
const currentStats = ref<{
  data: Record<string, number> | Array<{
    pregunta: string;
    estadisticas: Record<string, number>;
    total: number;
  }> | Array<{
    respuesta: string;
    fecha: string;
  }>;
  total: number;
  tipo?: string;
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
  opciones: ["", ""], // Para compatibilidad con tipos calificación/abierta
  preguntas: [
    {
      pregunta: "",
      opciones: ["", ""]
    }
  ], // Para tipo opción múltiple
  preguntaCalificacion: "", // Para tipo calificación
  preguntaAbierta: "", // Para tipo pregunta abierta
  fecha_inicio: "",
  fecha_fin: "",
  activa: true,
  parroquia_destino: "",
  barrio_destino: "",
});

// Estado de filtros y búsqueda
const busqueda = ref("");
const filtroEstado = ref<'todas' | 'activas' | 'inactivas' | 'proximas' | 'finalizadas'>('todas');
const filtroTipo = ref<'todas' | 'opcion_multiple' | 'calificacion' | 'abierta'>('todas');
const filtroAlcance = ref<'todas' | 'globales' | 'parroquias' | 'barrios'>('todas');
const filtroParroquia = ref("");

// Computed
const loading = computed(() => encuestasStore.loading);
const error = computed(() => encuestasStore.error);
const encuestas = computed(() => encuestasStore.encuestas);

// Obtener parroquias únicas de las encuestas
const parroquiasUnicas = computed(() => {
  const parroquias = new Set<string>();
  encuestas.value.forEach((encuesta) => {
    if (encuesta.parroquia_destino) {
      parroquias.add(encuesta.parroquia_destino);
    }
  });
  return Array.from(parroquias).sort();
});

// Filtrar encuestas según criterios
const encuestasFiltradas = computed(() => {
  let resultado = encuestas.value;

  // Filtro por texto de búsqueda
  if (busqueda.value.trim()) {
    const textoBusqueda = busqueda.value.toLowerCase().trim();
    resultado = resultado.filter((encuesta) => {
      const titulo = encuesta.titulo?.toLowerCase() || "";
      const descripcion = encuesta.descripcion?.toLowerCase() || "";
      return titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
    });
  }

  // Filtro por estado
  if (filtroEstado.value !== 'todas') {
    const ahora = new Date();
    resultado = resultado.filter((encuesta) => {
      const fechaInicio = new Date(encuesta.fecha_inicio);
      const fechaFin = new Date(encuesta.fecha_fin);
      
      switch (filtroEstado.value) {
        case 'activas':
          return encuesta.activa && ahora >= fechaInicio && ahora <= fechaFin;
        case 'inactivas':
          return !encuesta.activa;
        case 'proximas':
          return ahora < fechaInicio;
        case 'finalizadas':
          return ahora > fechaFin;
        default:
          return true;
      }
    });
  }

  // Filtro por tipo
  if (filtroTipo.value !== 'todas') {
    resultado = resultado.filter((encuesta) => encuesta.tipo === filtroTipo.value);
  }

  // Filtro por tipo de alcance
  if (filtroAlcance.value !== 'todas') {
    resultado = resultado.filter((encuesta) => {
      const tieneParroquia = encuesta.parroquia_destino && encuesta.parroquia_destino.trim() !== '';
      const tieneBarrio = encuesta.barrio_destino && encuesta.barrio_destino.trim() !== '';
      
      switch (filtroAlcance.value) {
        case 'globales':
          // Global: sin parroquia
          return !tieneParroquia;
        case 'parroquias':
          // Parroquia: tiene parroquia pero sin barrio (toda la parroquia)
          return tieneParroquia && !tieneBarrio;
        case 'barrios':
          // Barrio específico: tiene parroquia Y barrio
          return tieneParroquia && tieneBarrio;
        default:
          return true;
      }
    });
  }

  // Filtro por parroquia específica
  if (filtroParroquia.value) {
    resultado = resultado.filter((encuesta) => 
      encuesta.parroquia_destino === filtroParroquia.value
    );
  }

  return resultado;
});

// Métodos
const limpiarFiltros = () => {
  busqueda.value = "";
  filtroEstado.value = 'todas';
  filtroTipo.value = 'todas';
  filtroAlcance.value = 'todas';
  filtroParroquia.value = "";
};

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
    preguntas: [
      {
        pregunta: "",
        opciones: ["", ""]
      }
    ],
    preguntaCalificacion: "",
    preguntaAbierta: "",
    fecha_inicio: "",
    fecha_fin: "",
    activa: true,
    parroquia_destino: "",
    barrio_destino: "",
  };
  showModal.value = true;
};

const editEncuesta = (encuesta: Encuesta) => {
  isEditing.value = true;
  selectedEncuesta.value = encuesta;

  const fechaInicio = new Date(encuesta.fecha_inicio);
  const fechaFin = new Date(encuesta.fecha_fin);

  // Convertir opciones a preguntas si es opción múltiple
  let preguntasData = [{ pregunta: "", opciones: ["", ""] }];
  let preguntaCalif = "";
  let preguntaAb = "";
  
  if (encuesta.tipo === 'opcion_multiple' && Array.isArray(encuesta.opciones)) {
    // Verificar si ya tiene el formato de preguntas
    if (encuesta.opciones.length > 0 && typeof encuesta.opciones[0] === 'object' && 'pregunta' in encuesta.opciones[0]) {
      preguntasData = encuesta.opciones as any;
    }
  } else if (encuesta.tipo === 'calificacion' && typeof encuesta.opciones === 'string') {
    // Si es calificación, la primera opción es la pregunta
    preguntaCalif = encuesta.opciones;
  } else if (encuesta.tipo === 'abierta' && typeof encuesta.opciones === 'string') {
    // Si es abierta, la primera opción es la pregunta
    preguntaAb = encuesta.opciones;
  }

  formData.value = {
    titulo: encuesta.titulo,
    descripcion: encuesta.descripcion,
    tipo: encuesta.tipo as any,
    opciones: Array.isArray(encuesta.opciones)
      ? [...encuesta.opciones]
      : ["", ""],
    preguntas: preguntasData,
    preguntaCalificacion: preguntaCalif,
    preguntaAbierta: preguntaAb,
    fecha_inicio: fechaInicio.toISOString().slice(0, 16),
    fecha_fin: fechaFin.toISOString().slice(0, 16),
    activa: encuesta.activa ?? true,
    parroquia_destino: encuesta.parroquia_destino || "",
    barrio_destino: encuesta.barrio_destino || "",
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

// Funciones para manejar preguntas en opción múltiple
const addPregunta = () => {
  formData.value.preguntas.push({
    pregunta: "",
    opciones: ["", ""]
  });
};

const removePregunta = (index: number) => {
  if (formData.value.preguntas.length > 1) {
    formData.value.preguntas.splice(index, 1);
  }
};

const addOpcionAPregunta = (preguntaIndex: number) => {
  const pregunta = formData.value.preguntas[preguntaIndex];
  if (pregunta) {
    pregunta.opciones.push("");
  }
};

const removeOpcionDePregunta = (preguntaIndex: number, opcionIndex: number) => {
  const pregunta = formData.value.preguntas[preguntaIndex];
  if (pregunta && pregunta.opciones.length > 2) {
    pregunta.opciones.splice(opcionIndex, 1);
  }
};

const submitForm = async () => {
  submitting.value = true;

  try {
    // Determinar qué guardar en opciones según el tipo
    let opcionesData: any = null;
    
    if (formData.value.tipo === "opcion_multiple") {
      opcionesData = formData.value.preguntas; // Guardar las preguntas completas
    } else if (formData.value.tipo === "calificacion") {
      opcionesData = formData.value.preguntaCalificacion; // Guardar la pregunta de calificación
    } else if (formData.value.tipo === "abierta") {
      opcionesData = formData.value.preguntaAbierta; // Guardar la pregunta abierta
    }

    const encuestaData = {
      titulo: formData.value.titulo,
      descripcion: formData.value.descripcion,
      tipo: formData.value.tipo,
      opciones: opcionesData,
      fecha_inicio: new Date(formData.value.fecha_inicio).toISOString(),
      fecha_fin: new Date(formData.value.fecha_fin).toISOString(),
      activa: formData.value.activa,
      parroquia_destino: formData.value.parroquia_destino?.trim() || null,
      barrio_destino: formData.value.barrio_destino?.trim() || null,
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
        tipo: (result as any).tipo || 'simple'
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

// Watcher para guardar la vista seleccionada en localStorage
watch(vistaActual, (nuevaVista) => {
  localStorage.setItem('admin_encuestas_vista', nuevaVista);
});

// Limpiar filtro de parroquia cuando cambia el tipo de alcance
watch(filtroAlcance, (nuevoAlcance) => {
  if (nuevoAlcance === 'todas' || nuevoAlcance === 'globales') {
    filtroParroquia.value = '';
  }
});

// Limpiar barrio del formulario cuando se cambia o limpia la parroquia
watch(() => formData.value.parroquia_destino, (nuevaParroquia) => {
  if (!nuevaParroquia) {
    formData.value.barrio_destino = '';
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
