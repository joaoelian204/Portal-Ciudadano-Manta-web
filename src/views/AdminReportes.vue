<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-6 md:py-8">
    <div class="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1920px] mx-auto">
      <!-- Header -->
      <div class="mb-4 sm:mb-6 md:mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
              <span class="text-2xl sm:text-3xl md:text-4xl">📋</span>
              <span class="break-words">{{ $t('admin.reportes.title') }}</span>
            </h1>
            <p class="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600">
              {{ $t('admin.reportes.subtitle') }}
            </p>
          </div>
          
          <!-- Estadísticas rápidas - Responsive -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full lg:w-auto">
            <div class="bg-white rounded-lg shadow px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center">
              <div class="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">{{ reportesPendientes.length }}</div>
              <div class="text-[10px] sm:text-xs md:text-sm text-gray-600">{{ $t('admin.reportes.stats.pending') }}</div>
            </div>
            <div class="bg-white rounded-lg shadow px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center">
              <div class="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{{ reportesRevision.length }}</div>
              <div class="text-[10px] sm:text-xs md:text-sm text-gray-600">{{ $t('admin.reportes.stats.inReview') }}</div>
            </div>
            <div class="bg-white rounded-lg shadow px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center">
              <div class="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">{{ reportesProceso.length }}</div>
              <div class="text-[10px] sm:text-xs md:text-sm text-gray-600">{{ $t('admin.reportes.stats.inProcess') }}</div>
            </div>
            <div class="bg-white rounded-lg shadow px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center">
              <div class="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{{ reportesResueltos.length }}</div>
              <div class="text-[10px] sm:text-xs md:text-sm text-gray-600">{{ $t('admin.reportes.stats.resolved') }}</div>
            </div>
          </div>
        </div>

        <!-- Filtros - Responsive -->
        <div class="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch sm:items-center">
          <div class="flex-1">
            <input
              v-model="filtroTexto"
              type="text"
              :placeholder="$t('admin.reportes.filters.searchPlaceholder')"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            />
          </div>
          <select
            v-model="filtroCategoria"
            class="px-3 sm:px-4 py-2 sm:py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">{{ $t('admin.reportes.filters.allCategories') }}</option>
            <option value="alumbrado">{{ $t('admin.reportes.categories.alumbrado') }}</option>
            <option value="baches">{{ $t('admin.reportes.categories.baches') }}</option>
            <option value="limpieza">{{ $t('admin.reportes.categories.limpieza') }}</option>
            <option value="agua">{{ $t('admin.reportes.categories.agua') }}</option>
            <option value="alcantarillado">{{ $t('admin.reportes.categories.alcantarillado') }}</option>
            <option value="parques">{{ $t('admin.reportes.categories.parques') }}</option>
            <option value="señalizacion">{{ $t('admin.reportes.categories.señalizacion') }}</option>
            <option value="seguridad">{{ $t('admin.reportes.categories.seguridad') }}</option>
            <option value="ruido">{{ $t('admin.reportes.categories.ruido') }}</option>
            <option value="otro">{{ $t('admin.reportes.categories.otro') }}</option>
          </select>
          <select
            v-model="filtroPrioridad"
            class="px-3 sm:px-4 py-2 sm:py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">{{ $t('admin.reportes.filters.allPriorities') }}</option>
            <option value="urgente">{{ $t('admin.reportes.priorities.urgente') }}</option>
            <option value="alta">{{ $t('admin.reportes.priorities.alta') }}</option>
            <option value="media">{{ $t('admin.reportes.priorities.media') }}</option>
            <option value="baja">{{ $t('admin.reportes.priorities.baja') }}</option>
          </select>
          <button
            @click="cargarReportes"
            class="px-4 sm:px-6 py-2 sm:py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="hidden sm:inline">{{ $t('admin.reportes.filters.update') }}</span>
          </button>
        </div>
      </div>

      <!-- Tablero Kanban - Responsive -->
      <div v-if="!cargando">
        <!-- Vista móvil y tablet: Tabs -->
        <div class="block xl:hidden">
          <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              @click="tabActivo = 'pendientes'"
              class="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-xs sm:text-sm"
              :class="tabActivo === 'pendientes' ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-400' : 'bg-gray-100 text-gray-600'"
            >
              ⏳ {{ $t('admin.reportes.stats.pending') }} ({{ reportesPendientesFiltrados.length }})
            </button>
            <button
              @click="tabActivo = 'revision'"
              class="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-xs sm:text-sm"
              :class="tabActivo === 'revision' ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' : 'bg-gray-100 text-gray-600'"
            >
              🔍 {{ $t('admin.reportes.stats.inReview') }} ({{ reportesRevisionFiltrados.length }})
            </button>
            <button
              @click="tabActivo = 'proceso'"
              class="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-xs sm:text-sm"
              :class="tabActivo === 'proceso' ? 'bg-purple-100 text-purple-800 ring-2 ring-purple-400' : 'bg-gray-100 text-gray-600'"
            >
              ⚙️ {{ $t('admin.reportes.stats.inProcess') }} ({{ reportesProcesoFiltrados.length }})
            </button>
            <button
              @click="tabActivo = 'resueltos'"
              class="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-xs sm:text-sm"
              :class="tabActivo === 'resueltos' ? 'bg-green-100 text-green-800 ring-2 ring-green-400' : 'bg-gray-100 text-gray-600'"
            >
              ✅ {{ $t('admin.reportes.stats.resolved') }} ({{ reportesResueltosFiltrados.length }})
            </button>
          </div>

          <!-- Contenido del tab activo - Pendientes -->
          <div v-show="tabActivo === 'pendientes'" class="bg-yellow-50 rounded-xl shadow-lg border-2 border-yellow-200">
            <div class="bg-yellow-100 px-3 sm:px-6 py-3 sm:py-4 rounded-t-xl border-b-2 border-yellow-200">
              <h3 class="font-bold text-yellow-800 flex items-center gap-2 text-sm sm:text-base">
                <span class="text-xl sm:text-2xl">⏳</span>
                {{ $t('admin.reportes.stats.pending') }}
                <span class="ml-auto bg-yellow-200 text-yellow-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {{ reportesPendientesFiltrados.length }}
                </span>
              </h3>
            </div>
            <div class="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
              <div
                v-for="reporte in reportesPendientesFiltrados"
                :key="reporte.id"
                class="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-xl transition-shadow cursor-pointer border-l-4"
                :class="getBorderColor(reporte.prioridad)"
                @click="verDetalle(reporte)"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded capitalize bg-gray-100 text-gray-700">
                    {{ $t(`admin.reportes.categories.${reporte.categoria}`) }}
                  </span>
                  <span class="text-[10px] sm:text-xs font-bold px-2 py-1 rounded uppercase"
                        :class="getPrioridadBadge(reporte.prioridad)">
                    {{ $t(`admin.reportes.priorities.${reporte.prioridad}`) }}
                  </span>
                </div>
                
                <p class="text-xs sm:text-sm text-gray-700 line-clamp-3 mb-2 sm:mb-3">
                  {{ reporte.descripcion }}
                </p>
                
                <div class="text-[10px] sm:text-xs text-gray-500 space-y-1 mb-2 sm:mb-3">
                  <p><strong>📍</strong> {{ reporte.ubicacion_barrio }}, {{ reporte.ubicacion_parroquia }}</p>
                  <p><strong>📅</strong> {{ formatFechaCorta(reporte.created_at) }}</p>
                </div>

                <button
                  @click.stop="cambiarEstado(reporte.id, 'en_revision')"
                  class="w-full px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
                >
                  → {{ $t('admin.reportes.actions.review') }}
                </button>
              </div>
              <div v-if="reportesPendientesFiltrados.length === 0" class="text-center py-8 text-gray-500 text-sm">
                {{ $t('admin.reportes.empty.pending') }}
              </div>
            </div>
          </div>

          <!-- Contenido del tab activo - Revisión -->
          <div v-show="tabActivo === 'revision'" class="bg-blue-50 rounded-xl shadow-lg border-2 border-blue-200">
            <div class="bg-blue-100 px-3 sm:px-6 py-3 sm:py-4 rounded-t-xl border-b-2 border-blue-200">
              <h3 class="font-bold text-blue-800 flex items-center gap-2 text-sm sm:text-base">
                <span class="text-xl sm:text-2xl">🔍</span>
                {{ $t('admin.reportes.stats.inReview') }}
                <span class="ml-auto bg-blue-200 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {{ reportesRevisionFiltrados.length }}
                </span>
              </h3>
            </div>
            <div class="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
              <div
                v-for="reporte in reportesRevisionFiltrados"
                :key="reporte.id"
                class="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-xl transition-shadow cursor-pointer border-l-4"
                :class="getBorderColor(reporte.prioridad)"
                @click="verDetalle(reporte)"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded capitalize bg-gray-100 text-gray-700">
                    {{ $t(`admin.reportes.categories.${reporte.categoria}`) }}
                  </span>
                  <span class="text-[10px] sm:text-xs font-bold px-2 py-1 rounded uppercase"
                        :class="getPrioridadBadge(reporte.prioridad)">
                    {{ $t(`admin.reportes.priorities.${reporte.prioridad}`) }}
                  </span>
                </div>
                
                <p class="text-xs sm:text-sm text-gray-700 line-clamp-3 mb-2 sm:mb-3">
                  {{ reporte.descripcion }}
                </p>
                
                <div class="text-[10px] sm:text-xs text-gray-500 space-y-1 mb-2 sm:mb-3">
                  <p><strong>📍</strong> {{ reporte.ubicacion_barrio }}, {{ reporte.ubicacion_parroquia }}</p>
                  <p><strong>📅</strong> {{ formatFechaCorta(reporte.created_at) }}</p>
                </div>

                <div class="flex gap-2">
                  <button
                    @click.stop="cambiarEstado(reporte.id, 'pendiente')"
                    class="flex-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold hover:bg-yellow-200 transition-colors"
                  >
                    ← {{ $t('admin.reportes.actions.toPending') }}
                  </button>
                  <button
                    @click.stop="cambiarEstado(reporte.id, 'en_proceso')"
                    class="flex-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold hover:bg-purple-200 transition-colors"
                  >
                    → {{ $t('admin.reportes.actions.process') }}
                  </button>
                </div>
              </div>
              <div v-if="reportesRevisionFiltrados.length === 0" class="text-center py-8 text-gray-500 text-sm">
                {{ $t('admin.reportes.empty.review') }}
              </div>
            </div>
          </div>

          <!-- Contenido del tab activo - En Proceso -->
          <div v-show="tabActivo === 'proceso'" class="bg-purple-50 rounded-xl shadow-lg border-2 border-purple-200">
            <div class="bg-purple-100 px-3 sm:px-6 py-3 sm:py-4 rounded-t-xl border-b-2 border-purple-200">
              <h3 class="font-bold text-purple-800 flex items-center gap-2 text-sm sm:text-base">
                <span class="text-xl sm:text-2xl">⚙️</span>
                {{ $t('admin.reportes.stats.inProcess') }}
                <span class="ml-auto bg-purple-200 text-purple-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {{ reportesProcesoFiltrados.length }}
                </span>
              </h3>
            </div>
            <div class="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
              <div
                v-for="reporte in reportesProcesoFiltrados"
                :key="reporte.id"
                class="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-xl transition-shadow cursor-pointer border-l-4"
                :class="getBorderColor(reporte.prioridad)"
                @click="verDetalle(reporte)"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded capitalize bg-gray-100 text-gray-700">
                    {{ $t(`admin.reportes.categories.${reporte.categoria}`) }}
                  </span>
                  <span class="text-[10px] sm:text-xs font-bold px-2 py-1 rounded uppercase"
                        :class="getPrioridadBadge(reporte.prioridad)">
                    {{ $t(`admin.reportes.priorities.${reporte.prioridad}`) }}
                  </span>
                </div>
                
                <p class="text-xs sm:text-sm text-gray-700 line-clamp-3 mb-2 sm:mb-3">
                  {{ reporte.descripcion }}
                </p>
                
                <div class="text-[10px] sm:text-xs text-gray-500 space-y-1 mb-2 sm:mb-3">
                  <p><strong>📍</strong> {{ reporte.ubicacion_barrio }}, {{ reporte.ubicacion_parroquia }}</p>
                  <p><strong>📅</strong> {{ formatFechaCorta(reporte.created_at) }}</p>
                </div>

                <div class="flex gap-2">
                  <button
                    @click.stop="cambiarEstado(reporte.id, 'en_revision')"
                    class="flex-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
                  >
                    ← {{ $t('admin.reportes.actions.toReview') }}
                  </button>
                  <button
                    @click.stop="cambiarEstado(reporte.id, 'resuelto')"
                    class="flex-1 px-3 py-1.5 bg-green-100 text-green-700 rounded text-xs font-semibold hover:bg-green-200 transition-colors"
                  >
                    → {{ $t('admin.reportes.actions.resolve') }}
                  </button>
                </div>
              </div>
              <div v-if="reportesProcesoFiltrados.length === 0" class="text-center py-8 text-gray-500 text-sm">
                {{ $t('admin.reportes.empty.process') }}
              </div>
            </div>
          </div>

          <!-- Contenido del tab activo - Resueltos -->
          <div v-show="tabActivo === 'resueltos'" class="bg-green-50 rounded-xl shadow-lg border-2 border-green-200">
            <div class="bg-green-100 px-3 sm:px-6 py-3 sm:py-4 rounded-t-xl border-b-2 border-green-200">
              <h3 class="font-bold text-green-800 flex items-center gap-2 text-sm sm:text-base">
                <span class="text-xl sm:text-2xl">✅</span>
                {{ $t('admin.reportes.stats.resolved') }}
                <span class="ml-auto bg-green-200 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {{ reportesResueltosFiltrados.length }}
                </span>
              </h3>
            </div>
            <div class="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto">
              <div
                v-for="reporte in reportesResueltosFiltrados"
                :key="reporte.id"
                class="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-xl transition-shadow cursor-pointer border-l-4"
                :class="getBorderColor(reporte.prioridad)"
                @click="verDetalle(reporte)"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded capitalize bg-gray-100 text-gray-700">
                    {{ $t(`admin.reportes.categories.${reporte.categoria}`) }}
                  </span>
                  <span class="text-[10px] sm:text-xs font-bold px-2 py-1 rounded uppercase"
                        :class="getPrioridadBadge(reporte.prioridad)">
                    {{ $t(`admin.reportes.priorities.${reporte.prioridad}`) }}
                  </span>
                </div>
                
                <p class="text-xs sm:text-sm text-gray-700 line-clamp-3 mb-2 sm:mb-3">
                  {{ reporte.descripcion }}
                </p>
                
                <div class="text-[10px] sm:text-xs text-gray-500 space-y-1 mb-2 sm:mb-3">
                  <p><strong>📍</strong> {{ reporte.ubicacion_barrio }}, {{ reporte.ubicacion_parroquia }}</p>
                  <p><strong>📅</strong> {{ formatFechaCorta(reporte.created_at) }}</p>
                  <p v-if="reporte.fecha_resolucion"><strong>✓</strong> {{ $t('admin.reportes.detail.resolved') }}: {{ formatFechaCorta(reporte.fecha_resolucion) }}</p>
                </div>

                <button
                  @click.stop="cambiarEstado(reporte.id, 'en_proceso')"
                  class="w-full px-3 py-1.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold hover:bg-purple-200 transition-colors"
                >
                  ← {{ $t('admin.reportes.actions.reopen') }}
                </button>
              </div>
              <div v-if="reportesResueltosFiltrados.length === 0" class="text-center py-8 text-gray-500 text-sm">
                {{ $t('admin.reportes.empty.resolved') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Vista desktop: Grid con 4 columnas y drag & drop -->
        <div class="hidden xl:grid xl:grid-cols-4 gap-4 lg:gap-6">
        <!-- Columna: Pendientes -->
        <div class="bg-yellow-50 rounded-xl shadow-lg border-2 border-yellow-200">
          <div class="bg-yellow-100 px-6 py-4 rounded-t-xl border-b-2 border-yellow-200">
            <h3 class="font-bold text-yellow-800 flex items-center gap-2">
              <span class="text-2xl">⏳</span>
              {{ $t('admin.reportes.stats.pending') }}
              <span class="ml-auto bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
                {{ reportesPendientesFiltrados.length }}
              </span>
            </h3>
          </div>
          <div 
            class="p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto"
            @dragover="onDragOver"
            @dragenter="(e) => onDragEnter(e, 'pendiente')"
            @dragleave="onDragLeave"
            @drop="(e) => onDrop(e, 'pendiente')"
          >
            <div
              v-for="reporte in reportesPendientesFiltrados"
              :key="reporte.id"
              draggable="true"
              @dragstart="(e) => onDragStart(e, reporte)"
              @dragend="onDragEnd"
              class="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow cursor-move border-l-4"
              :class="getBorderColor(reporte.prioridad)"
              @click="verDetalle(reporte)"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-semibold px-2 py-1 rounded capitalize bg-gray-100 text-gray-700">
                  {{ $t(`admin.reportes.categories.${reporte.categoria}`) }}
                </span>
                <span class="text-xs font-bold px-2 py-1 rounded uppercase"
                      :class="getPrioridadBadge(reporte.prioridad)">
                  {{ $t(`admin.reportes.priorities.${reporte.prioridad}`) }}
                </span>
              </div>
              
              <p class="text-sm text-gray-700 line-clamp-3 mb-3">
                {{ reporte.descripcion }}
              </p>
              
              <div class="text-xs text-gray-500 space-y-1 mb-3">
                <p><strong>📍</strong> {{ reporte.ubicacion_barrio }}, {{ reporte.ubicacion_parroquia }}</p>
                <p><strong>📅</strong> {{ formatFechaCorta(reporte.created_at) }}</p>
              </div>

              <div class="flex gap-2">
                <button
                  v-if="reporte.estado === 'pendiente'"
                  @click.stop="cambiarEstado(reporte.id, 'en_revision')"
                  class="flex-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
                >
                  → {{ $t('admin.reportes.actions.review') }}
                </button>
              </div>
            </div>
            <div v-if="reportesPendientesFiltrados.length === 0" class="text-center py-8 text-gray-500">
              {{ $t('admin.reportes.empty.pending') }}
            </div>
          </div>
        </div>

        <!-- Columna: En Revisión -->
        <div class="bg-blue-50 rounded-xl shadow-lg border-2 border-blue-200">
          <div class="bg-blue-100 px-6 py-4 rounded-t-xl border-b-2 border-blue-200">
            <h3 class="font-bold text-blue-800 flex items-center gap-2">
              <span class="text-2xl">🔍</span>
              {{ $t('admin.reportes.stats.inReview') }}
              <span class="ml-auto bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                {{ reportesRevisionFiltrados.length }}
              </span>
            </h3>
          </div>
          <div 
            class="p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto"
            @dragover="onDragOver"
            @dragenter="(e) => onDragEnter(e, 'en_revision')"
            @dragleave="onDragLeave"
            @drop="(e) => onDrop(e, 'en_revision')"
          >
            <div
              v-for="reporte in reportesRevisionFiltrados"
              :key="reporte.id"
              draggable="true"
              @dragstart="(e) => onDragStart(e, reporte)"
              @dragend="onDragEnd"
              class="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow cursor-move border-l-4"
              :class="getBorderColor(reporte.prioridad)"
              @click="verDetalle(reporte)"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-semibold px-2 py-1 rounded capitalize bg-gray-100 text-gray-700">
                  {{ $t(`admin.reportes.categories.${reporte.categoria}`) }}
                </span>
                <span class="text-xs font-bold px-2 py-1 rounded uppercase"
                      :class="getPrioridadBadge(reporte.prioridad)">
                  {{ $t(`admin.reportes.priorities.${reporte.prioridad}`) }}
                </span>
              </div>
              
              <p class="text-sm text-gray-700 line-clamp-3 mb-3">
                {{ reporte.descripcion }}
              </p>
              
              <div class="text-xs text-gray-500 space-y-1 mb-3">
                <p><strong>📍</strong> {{ reporte.ubicacion_barrio }}, {{ reporte.ubicacion_parroquia }}</p>
                <p><strong>📅</strong> {{ formatFechaCorta(reporte.created_at) }}</p>
              </div>

              <div class="flex gap-2">
                <button
                  v-if="reporte.estado === 'en_revision'"
                  @click.stop="cambiarEstado(reporte.id, 'en_proceso')"
                  class="flex-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold hover:bg-purple-200 transition-colors"
                >
                  → {{ $t('admin.reportes.actions.process') }}
                </button>
              </div>
            </div>
            <div v-if="reportesRevisionFiltrados.length === 0" class="text-center py-8 text-gray-500">
              {{ $t('admin.reportes.empty.review') }}
            </div>
          </div>
        </div>

        <!-- Columna: En Proceso -->
        <div class="bg-purple-50 rounded-xl shadow-lg border-2 border-purple-200">
          <div class="bg-purple-100 px-6 py-4 rounded-t-xl border-b-2 border-purple-200">
            <h3 class="font-bold text-purple-800 flex items-center gap-2">
              <span class="text-2xl">⚙️</span>
              {{ $t('admin.reportes.stats.inProcess') }}
              <span class="ml-auto bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                {{ reportesProcesoFiltrados.length }}
              </span>
            </h3>
          </div>
          <div 
            class="p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto"
            @dragover="onDragOver"
            @dragenter="(e) => onDragEnter(e, 'en_proceso')"
            @dragleave="onDragLeave"
            @drop="(e) => onDrop(e, 'en_proceso')"
          >
            <div
              v-for="reporte in reportesProcesoFiltrados"
              :key="reporte.id"
              draggable="true"
              @dragstart="(e) => onDragStart(e, reporte)"
              @dragend="onDragEnd"
              class="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow cursor-move border-l-4"
              :class="getBorderColor(reporte.prioridad)"
              @click="verDetalle(reporte)"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-semibold px-2 py-1 rounded capitalize bg-gray-100 text-gray-700">
                  {{ $t(`admin.reportes.categories.${reporte.categoria}`) }}
                </span>
                <span class="text-xs font-bold px-2 py-1 rounded uppercase"
                      :class="getPrioridadBadge(reporte.prioridad)">
                  {{ $t(`admin.reportes.priorities.${reporte.prioridad}`) }}
                </span>
              </div>
              
              <p class="text-sm text-gray-700 line-clamp-3 mb-3">
                {{ reporte.descripcion }}
              </p>
              
              <div class="text-xs text-gray-500 space-y-1 mb-3">
                <p><strong>📍</strong> {{ reporte.ubicacion_barrio }}, {{ reporte.ubicacion_parroquia }}</p>
                <p><strong>📅</strong> {{ formatFechaCorta(reporte.created_at) }}</p>
              </div>

              <div class="flex gap-2">
                <button
                  v-if="reporte.estado === 'en_proceso'"
                  @click.stop="cambiarEstado(reporte.id, 'resuelto')"
                  class="flex-1 px-3 py-1.5 bg-green-100 text-green-700 rounded text-xs font-semibold hover:bg-green-200 transition-colors"
                >
                  → {{ $t('admin.reportes.actions.resolve') }}
                </button>
              </div>
            </div>
            <div v-if="reportesProcesoFiltrados.length === 0" class="text-center py-8 text-gray-500">
              {{ $t('admin.reportes.empty.process') }}
            </div>
          </div>
        </div>

        <!-- Columna: Resueltos -->
        <div class="bg-green-50 rounded-xl shadow-lg border-2 border-green-200">
          <div class="bg-green-100 px-6 py-4 rounded-t-xl border-b-2 border-green-200">
            <h3 class="font-bold text-green-800 flex items-center gap-2">
              <span class="text-2xl">✅</span>
              {{ $t('admin.reportes.stats.resolved') }}
              <span class="ml-auto bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                {{ reportesResueltosFiltrados.length }}
              </span>
            </h3>
          </div>
          <div 
            class="p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto"
            @dragover="onDragOver"
            @dragenter="(e) => onDragEnter(e, 'resuelto')"
            @dragleave="onDragLeave"
            @drop="(e) => onDrop(e, 'resuelto')"
          >
            <div
              v-for="reporte in reportesResueltosFiltrados"
              :key="reporte.id"
              draggable="true"
              @dragstart="(e) => onDragStart(e, reporte)"
              @dragend="onDragEnd"
              class="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow cursor-move border-l-4"
              :class="getBorderColor(reporte.prioridad)"
              @click="verDetalle(reporte)"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-semibold px-2 py-1 rounded capitalize bg-gray-100 text-gray-700">
                  {{ $t(`admin.reportes.categories.${reporte.categoria}`) }}
                </span>
                <span class="text-xs font-bold px-2 py-1 rounded uppercase"
                      :class="getPrioridadBadge(reporte.prioridad)">
                  {{ $t(`admin.reportes.priorities.${reporte.prioridad}`) }}
                </span>
              </div>
              
              <p class="text-sm text-gray-700 line-clamp-3 mb-3">
                {{ reporte.descripcion }}
              </p>
              
              <div class="text-xs text-gray-500 space-y-1 mb-3">
                <p><strong>📍</strong> {{ reporte.ubicacion_barrio }}, {{ reporte.ubicacion_parroquia }}</p>
                <p><strong>📅</strong> {{ formatFechaCorta(reporte.created_at) }}</p>
              </div>
            </div>
            <div v-if="reportesResueltosFiltrados.length === 0" class="text-center py-8 text-gray-500">
              {{ $t('admin.reportes.empty.resolved') }}
            </div>
          </div>
        </div>
      </div>
      </div>

      <!-- Loading -->
      <div v-else class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    </div>

      <!-- Modal de detalle -->
      <div
        v-if="reporteSeleccionado"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="cerrarDetalle"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div class="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
            <h3 class="text-xl font-bold text-white">{{ $t('admin.reportes.detail.title') }}</h3>
            <button @click="cerrarDetalle" class="text-white hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Información básica -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-semibold text-gray-600">{{ $t('admin.reportes.detail.category') }}</label>
                <p class="text-lg capitalize">{{ $t(`admin.reportes.categories.${reporteSeleccionado.categoria}`) }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">{{ $t('admin.reportes.detail.priority') }}</label>
                <p class="text-lg capitalize" :class="getPrioridadColor(reporteSeleccionado.prioridad)">
                  {{ $t(`admin.reportes.priorities.${reporteSeleccionado.prioridad}`) }}
                </p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">{{ $t('admin.reportes.detail.currentState') }}</label>
                <p class="text-lg capitalize">{{ $t(`admin.reportes.states.${reporteSeleccionado.estado}`) }}</p>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-600">{{ $t('admin.reportes.detail.reportDate') }}</label>
                <p class="text-lg">{{ formatFecha(reporteSeleccionado.created_at || '') }}</p>
              </div>
            </div>

            <!-- Descripción -->
            <div>
              <label class="text-sm font-semibold text-gray-600">{{ $t('admin.reportes.detail.description') }}</label>
              <p class="mt-2 text-gray-700 bg-gray-50 p-4 rounded-lg">
                {{ reporteSeleccionado.descripcion }}
              </p>
            </div>

            <!-- Ubicación -->
            <div>
              <label class="text-sm font-semibold text-gray-600">{{ $t('admin.reportes.detail.location') }}</label>
              <div class="mt-2 bg-gray-50 p-4 rounded-lg">
                <p><strong>{{ $t('admin.reportes.detail.parish') }}:</strong> {{ reporteSeleccionado.ubicacion_parroquia }}</p>
                <p><strong>{{ $t('admin.reportes.detail.neighborhood') }}:</strong> {{ reporteSeleccionado.ubicacion_barrio }}</p>
                <p><strong>{{ $t('admin.reportes.detail.address') }}:</strong> {{ reporteSeleccionado.ubicacion_direccion }}</p>
              </div>
            </div>

            <!-- Imagen si existe -->
            <div v-if="reporteSeleccionado.imagen_url">
              <label class="text-sm font-semibold text-gray-600">{{ $t('admin.reportes.detail.image') }}</label>
              <img
                :src="reporteSeleccionado.imagen_url"
                alt="Imagen del reporte"
                class="mt-2 w-full rounded-lg shadow-md"
              />
            </div>

            <!-- Cambiar estado -->
            <div class="border-t pt-6">
              <label class="text-sm font-semibold text-gray-600">{{ $t('admin.reportes.detail.changeState') }}</label>
              <div class="mt-3 grid grid-cols-4 gap-3">
                <button
                  @click="cambiarEstado(reporteSeleccionado.id, 'pendiente')"
                  class="px-4 py-3 rounded-lg font-semibold transition-all"
                  :class="reporteSeleccionado.estado === 'pendiente' 
                    ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400' 
                    : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'"
                >
                  ⏳ {{ $t('admin.reportes.stats.pending') }}
                </button>
                <button
                  @click="cambiarEstado(reporteSeleccionado.id, 'en_revision')"
                  class="px-4 py-3 rounded-lg font-semibold transition-all"
                  :class="reporteSeleccionado.estado === 'en_revision' 
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-400' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50'"
                >
                  🔍 {{ $t('admin.reportes.stats.inReview') }}
                </button>
                <button
                  @click="cambiarEstado(reporteSeleccionado.id, 'en_proceso')"
                  class="px-4 py-3 rounded-lg font-semibold transition-all"
                  :class="reporteSeleccionado.estado === 'en_proceso' 
                    ? 'bg-purple-100 text-purple-800 border-2 border-purple-400' 
                    : 'bg-gray-100 text-gray-600 hover:bg-purple-50'"
                >
                  ⚙️ {{ $t('admin.reportes.stats.inProcess') }}
                </button>
                <button
                  @click="cambiarEstado(reporteSeleccionado.id, 'resuelto')"
                  class="px-4 py-3 rounded-lg font-semibold transition-all"
                  :class="reporteSeleccionado.estado === 'resuelto' 
                    ? 'bg-green-100 text-green-800 border-2 border-green-400' 
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50'"
                >
                  ✅ {{ $t('admin.reportes.stats.resolved') }}
                </button>
              </div>
            </div>

            <!-- Respuesta del administrador -->
            <div>
              <label class="text-sm font-semibold text-gray-600">{{ $t('admin.reportes.detail.adminResponse') }}</label>
              <textarea
                v-model="reporteSeleccionado.respuesta_admin"
                rows="4"
                class="mt-2 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                :placeholder="$t('admin.reportes.detail.responsePlaceholder')"
              ></textarea>
              <button
                @click="guardarRespuesta"
                class="mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ $t('admin.reportes.detail.saveResponse') }}
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabase';
import type { ReportesRow } from '@/types/database.types';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type Reporte = ReportesRow;

const reportes = ref<Reporte[]>([]);
const cargando = ref(true);
const reporteSeleccionado = ref<Reporte | null>(null);
const reporteArrastrado = ref<Reporte | null>(null);
const columnaDestino = ref<string | null>(null);
const tabActivo = ref<'pendientes' | 'revision' | 'proceso' | 'resueltos'>('pendientes');

// Filtros
const filtroTexto = ref('');
const filtroCategoria = ref('');
const filtroPrioridad = ref('');

// Computed para separar reportes por estado
const reportesPendientes = computed(() => 
  reportes.value.filter(r => !r.estado || r.estado === 'pendiente')
);

const reportesRevision = computed(() => 
  reportes.value.filter(r => r.estado === 'en_revision')
);

const reportesProceso = computed(() => 
  reportes.value.filter(r => r.estado === 'en_proceso')
);

const reportesResueltos = computed(() => 
  reportes.value.filter(r => r.estado === 'resuelto')
);

// Computed con filtros aplicados
const reportesPendientesFiltrados = computed(() => aplicarFiltros(reportesPendientes.value));
const reportesRevisionFiltrados = computed(() => aplicarFiltros(reportesRevision.value));
const reportesProcesoFiltrados = computed(() => aplicarFiltros(reportesProceso.value));
const reportesResueltosFiltrados = computed(() => aplicarFiltros(reportesResueltos.value));

function aplicarFiltros(reportesList: Reporte[]) {
  return reportesList.filter(reporte => {
    const cumpleFiltroTexto = !filtroTexto.value || 
      (reporte.descripcion || '').toLowerCase().includes(filtroTexto.value.toLowerCase()) ||
      (reporte.ubicacion_parroquia || '').toLowerCase().includes(filtroTexto.value.toLowerCase()) ||
      (reporte.ubicacion_barrio || '').toLowerCase().includes(filtroTexto.value.toLowerCase()) ||
      (reporte.categoria || '').toLowerCase().includes(filtroTexto.value.toLowerCase());

    const cumpleFiltroCategoria = !filtroCategoria.value || reporte.categoria === filtroCategoria.value;
    const cumpleFiltroPrioridad = !filtroPrioridad.value || (reporte.prioridad || 'media') === filtroPrioridad.value;

    return cumpleFiltroTexto && cumpleFiltroCategoria && cumpleFiltroPrioridad;
  });
}

async function cargarReportes() {
  try {
    cargando.value = true;
    
    const { data, error } = await (supabase as any)
      .from('reportes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error de Supabase:', error);
      throw error;
    }
    
    // Normalizar reportes: asignar valores por defecto si son null
    reportes.value = (data || []).map((reporte: any) => ({
      ...reporte,
      estado: reporte.estado || 'pendiente',
      prioridad: reporte.prioridad || 'media',
      ubicacion_parroquia: reporte.ubicacion_parroquia || 'No especificada',
      ubicacion_barrio: reporte.ubicacion_barrio || 'No especificado'
    }));
  } catch (error) {
    console.error('Error al cargar reportes:', error);
    alert(t('admin.reportes.errorLoading') + ': ' + (error as any).message);
  } finally {
    cargando.value = false;
  }
}

async function cambiarEstado(reporteId: string, nuevoEstado: string, mostrarAlerta = true) {
  try {
    const updateData: {
      estado: string;
      updated_at: string;
      fecha_resolucion?: string;
    } = { 
      estado: nuevoEstado, 
      updated_at: new Date().toISOString()
    };
    
    if (nuevoEstado === 'resuelto') {
      updateData.fecha_resolucion = new Date().toISOString();
    }

    const { error } = await (supabase as any)
      .from('reportes')
      .update(updateData)
      .eq('id', reporteId);

    if (error) throw error;

    // Actualizar localmente
    const index = reportes.value.findIndex(r => r.id === reporteId);
    if (index !== -1 && reportes.value[index]) {
      const reporte = reportes.value[index];
      reportes.value[index] = { 
        ...reporte, 
        estado: nuevoEstado as any, 
        updated_at: updateData.updated_at,
        ...(updateData.fecha_resolucion ? { fecha_resolucion: updateData.fecha_resolucion } : {})
      };
    }

    if (reporteSeleccionado.value?.id === reporteId) {
      reporteSeleccionado.value.estado = nuevoEstado as any;
      reporteSeleccionado.value.updated_at = updateData.updated_at;
      if (updateData.fecha_resolucion) {
        reporteSeleccionado.value.fecha_resolucion = updateData.fecha_resolucion;
      }
    }

    if (mostrarAlerta) {
      alert(t('admin.reportes.detail.stateUpdated'));
    }
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    alert(t('admin.reportes.detail.errorUpdating'));
  }
}

async function guardarRespuesta() {
  if (!reporteSeleccionado.value) return;

  try {
    const respuestaActual = reporteSeleccionado.value.respuesta_admin || '';
    const updateData: {
      respuesta_admin: string;
      updated_at: string;
    } = { 
      respuesta_admin: respuestaActual,
      updated_at: new Date().toISOString()
    };

    const { error } = await (supabase as any)
      .from('reportes')
      .update(updateData)
      .eq('id', reporteSeleccionado.value.id);

    if (error) throw error;

    // Actualizar localmente
    const index = reportes.value.findIndex(r => r.id === reporteSeleccionado.value!.id);
    if (index !== -1 && reportes.value[index]) {
      reportes.value[index].respuesta_admin = respuestaActual;
      reportes.value[index].updated_at = updateData.updated_at;
    }

    alert(t('admin.reportes.detail.responseSaved'));
  } catch (error) {
    console.error('Error al guardar respuesta:', error);
    alert(t('admin.reportes.detail.errorSaving'));
  }
}

function verDetalle(reporte: Reporte) {
  reporteSeleccionado.value = { ...reporte };
}

function cerrarDetalle() {
  reporteSeleccionado.value = null;
}

function getPrioridadColor(prioridad: string): string {
  const colors: Record<string, string> = {
    urgente: 'text-red-600 font-bold',
    alta: 'text-orange-600 font-semibold',
    media: 'text-yellow-600',
    baja: 'text-green-600'
  };
  return colors[prioridad] || '';
}

function formatFecha(fecha: string | null): string {
  if (!fecha) return 'Fecha no disponible';
  return new Date(fecha).toLocaleString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatFechaCorta(fecha: string | null): string {
  if (!fecha) return 'Fecha no disponible';
  return new Date(fecha).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getBorderColor(prioridad: string | null): string {
  const colors: Record<string, string> = {
    urgente: 'border-red-500',
    alta: 'border-orange-500',
    media: 'border-yellow-500',
    baja: 'border-green-500'
  };
  return colors[prioridad || 'media'] || 'border-gray-300';
}

function getPrioridadBadge(prioridad: string | null): string {
  const badges: Record<string, string> = {
    urgente: 'bg-red-100 text-red-700',
    alta: 'bg-orange-100 text-orange-700',
    media: 'bg-yellow-100 text-yellow-700',
    baja: 'bg-green-100 text-green-700'
  };
  return badges[prioridad || 'media'] || 'bg-gray-100 text-gray-700';
}

// Funciones de Drag and Drop
function onDragStart(event: DragEvent, reporte: Reporte) {
  reporteArrastrado.value = reporte;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('reporteId', reporte.id);
  }
  // Agregar clase visual al elemento que se está arrastrando
  (event.target as HTMLElement).classList.add('opacity-50');
}

function onDragEnd(event: DragEvent) {
  (event.target as HTMLElement).classList.remove('opacity-50');
  reporteArrastrado.value = null;
  columnaDestino.value = null;
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function onDragEnter(event: DragEvent, estado: string) {
  event.preventDefault();
  columnaDestino.value = estado;
  // Agregar clase visual a la columna destino
  const columna = (event.currentTarget as HTMLElement);
  columna.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-50');
}

function onDragLeave(event: DragEvent) {
  const columna = (event.currentTarget as HTMLElement);
  columna.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50');
}

async function onDrop(event: DragEvent, nuevoEstado: string) {
  event.preventDefault();
  
  // Remover clases visuales
  const columna = (event.currentTarget as HTMLElement);
  columna.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50');
  
  if (!reporteArrastrado.value) return;
  
  const reporteId = reporteArrastrado.value.id;
  const estadoActual = reporteArrastrado.value.estado;
  
  // Si el estado no cambió, no hacer nada
  if (estadoActual === nuevoEstado) {
    reporteArrastrado.value = null;
    return;
  }
  
  // Cambiar el estado en la base de datos (sin alerta)
  await cambiarEstado(reporteId, nuevoEstado, false);
  
  reporteArrastrado.value = null;
  columnaDestino.value = null;
}

onMounted(() => {
  cargarReportes();
});
</script>
