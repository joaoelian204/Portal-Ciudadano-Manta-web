<template>
  <!-- Navbar Principal con ISO 9241-11 y 9241-210 -->
  <nav class="bg-white shadow-lg sticky top-0 z-[100] border-b border-gray-100">
    <!-- Barra Superior -->
    <div class="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1920px] mx-auto">
      <div
        class="flex justify-between items-center h-16 sm:h-18 md:h-20 gap-2 sm:gap-4 md:gap-6"
      >
        <!-- Logo y título - Responsive -->
        <div
          class="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-[120px] sm:min-w-[180px] lg:min-w-[280px]"
        >
          <img
            src="../../assets/logo/logo_manta.png"
            alt="Logo Manta"
            class="h-10 sm:h-12 md:h-14 w-auto object-contain cursor-pointer flex-shrink-0"
            @click="navigateTo('inicio')"
            role="button"
            tabindex="0"
            @keydown.enter="navigateTo('inicio')"
          />
          <div class="hidden sm:block">
            <span
              class="text-sm sm:text-base lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent whitespace-nowrap"
            >
              {{ $t("navbar.title") }}
            </span>
            <div
              class="text-[10px] sm:text-xs text-gray-500 font-medium whitespace-nowrap hidden md:block"
            >
              {{ $t("navbar.subtitle") }}
            </div>
          </div>
        </div>

        <!-- Barra de búsqueda colapsable - Solo ícono inicialmente -->
        <div
          class="hidden md:flex items-center justify-end flex-1 mx-2 lg:mx-4"
        >
          <div
            class="relative"
            :class="isSearchExpanded ? 'w-full max-w-xl' : 'w-auto'"
          >
            <!-- Botón de lupa cuando está colapsado -->
            <button
              v-if="!isSearchExpanded"
              @click="expandSearch"
              class="p-2 lg:p-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 text-gray-600 hover:text-blue-600"
              aria-label="Abrir búsqueda (Alt + B)"
              title="Abrir búsqueda (Alt + B)"
            >
              <svg
                class="w-5 h-5 lg:w-6 lg:h-6"
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
            </button>

            <!-- Input expandido -->
            <div
              v-else
              class="relative w-full transition-all duration-300 animate-fadeIn"
            >
              <input
                ref="searchInput"
                v-model="searchQuery"
                @input="handleSearch"
                @blur="handleSearchBlur"
                type="text"
                :placeholder="$t('home.search.placeholder')"
                class="w-full px-4 lg:px-5 py-2 lg:py-2.5 pr-10 lg:pr-12 text-sm border-2 rounded-full transition-all duration-300 border-blue-500 shadow-lg ring-2 ring-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Buscar servicios del portal"
              />
              <button
                @click="collapseSearch"
                class="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <svg
                  class="w-5 h-5 text-gray-500 hover:text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Sugerencias de búsqueda -->
            <div
              v-if="showSearchSuggestions && filteredSearchOptions.length > 0"
              class="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-80 overflow-y-auto"
              @mousedown.prevent
            >
              <button
                v-for="option in filteredSearchOptions"
                :key="option.id"
                @click="selectSearchOption(option)"
                class="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
              >
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  :class="option.bgColor"
                >
                  {{ option.icon }}
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-800 text-sm truncate">
                    {{ option.title }}
                  </h3>
                  <p class="text-xs text-gray-600 truncate">
                    {{ option.description }}
                  </p>
                </div>
                <svg
                  class="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Controles superiores - Compactos y responsive -->
        <div
          class="hidden md:flex items-center gap-1 lg:gap-2 transition-all duration-300"
          :class="isSearchExpanded ? 'space-x-1' : 'space-x-2 lg:space-x-3'"
        >
          <!-- Selector de idioma - Compacto -->
          <div class="relative">
            <button
              @click="toggleLanguageMenu"
              class="p-2 lg:px-3 lg:py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50 flex items-center transition-colors"
              :class="isSearchExpanded ? 'gap-0' : 'gap-1.5'"
              aria-label="Cambiar idioma (Alt + I)"
              title="Cambiar idioma (Alt + I)"
              :aria-expanded="isLanguageMenuOpen"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              <span v-if="!isSearchExpanded" class="hidden lg:inline">{{
                currentLanguage
              }}</span>
            </button>
            <!-- Menú desplegable de idiomas -->
            <div
              v-if="isLanguageMenuOpen"
              class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            >
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="changeLanguage(lang.code)"
                class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                :class="{
                  'bg-blue-50 text-blue-600 font-medium':
                    currentLanguage.toUpperCase() === lang.code.toUpperCase(),
                }"
              >
                <span>{{ lang.flag }}</span>
                <span>{{ lang.name }}</span>
              </button>
            </div>
          </div>

          <!-- Botón de Zoom - Compacto -->
          <div class="relative">
            <button
              @click="toggleZoomMenu"
              class="p-2 lg:px-3 lg:py-2 text-sm font-medium rounded-lg flex items-center transition-colors"
              :class="[
                zoomLevel !== 100
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50',
                isSearchExpanded ? 'gap-0' : 'gap-1.5',
              ]"
              aria-label="Opciones de zoom (Alt + Z) - Ctrl +/- para ajustar"
              title="Zoom (Alt + Z) - Ctrl +/- para ajustar"
              :aria-expanded="isZoomMenuOpen"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
              <span v-if="!isSearchExpanded" class="text-xs hidden lg:inline"
                >{{ zoomLevel }}%</span
              >
            </button>
            <!-- Menú desplegable de zoom -->
            <div
              v-if="isZoomMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
            >
              <button
                @click="zoomIn"
                class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <svg
                  class="h-5 w-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
                <span>{{ $t("navbar.zoom.increase") }}</span>
              </button>
              <button
                @click="zoomOut"
                class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <svg
                  class="h-5 w-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                  />
                </svg>
                <span>{{ $t("navbar.zoom.decrease") }}</span>
              </button>
              <button
                @click="resetZoom"
                class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <svg
                  class="h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{{ $t("navbar.zoom.reset") }}</span>
              </button>
            </div>
          </div>

          <!-- Navegación con divisor -->
          <div class="h-8 w-px bg-gray-300 hidden lg:block"></div>

          <template v-if="!isAuthenticated">
            <a
              href="#"
              class="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="
                currentPage === 'inicio'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              "
              @click.prevent="navigateTo('inicio')"
              tabindex="0"
              data-nav-item="inicio"
            >
              {{ $t("navbar.home") }}
            </a>
            <a
              href="#"
              class="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="
                currentPage === 'sobre-nosotros'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              "
              @click.prevent="navigateTo('sobre-nosotros')"
              tabindex="0"
              data-nav-item="sobre-nosotros"
            >
              {{ $t("navbar.about") }}
            </a>
          </template>
          <template v-else>
            <!-- Menú desplegable de Herramientas (solo para ciudadanos) -->
            <div v-if="!authStore.isAdministrador()" class="relative">
              <button
                @click="toggleToolsMenu"
                class="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="
                  ['reportar-problema', 'encuestas', 'noticias'].includes(
                    currentPage
                  )
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                "
                :aria-expanded="isToolsMenuOpen"
                aria-label="Menú de herramientas"
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
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <span>{{ $t("navbar.tools") }}</span>
                <svg
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': isToolsMenuOpen }"
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
              </button>

              <!-- Menú desplegable -->
              <div
                v-if="isToolsMenuOpen"
                class="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fadeIn"
              >
                <a
                  href="#"
                  @click.prevent="
                    navigateTo('reportar-problema');
                    toggleToolsMenu();
                  "
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group"
                  :class="
                    currentPage === 'reportar-problema'
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : ''
                  "
                >
                  <div
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3
                      class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors"
                    >
                      {{ $t("navbar.toolsMenu.report") }}
                    </h3>
                    <p class="text-xs text-gray-500">
                      Reporta problemas de tu barrio
                    </p>
                  </div>
                </a>

                <a
                  href="#"
                  @click.prevent="
                    navigateTo('encuestas');
                    toggleToolsMenu();
                  "
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group"
                  :class="
                    currentPage === 'encuestas'
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : ''
                  "
                >
                  <div
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3
                      class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors"
                    >
                      {{ $t("navbar.toolsMenu.surveys") }}
                    </h3>
                    <p class="text-xs text-gray-500">Participa en encuestas</p>
                  </div>
                </a>

                <a
                  href="#"
                  @click.prevent="
                    navigateTo('noticias');
                    toggleToolsMenu();
                  "
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group"
                  :class="
                    currentPage === 'noticias'
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : ''
                  "
                >
                  <div
                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
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
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3
                      class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors"
                    >
                      {{ $t("navbar.toolsMenu.news") }}
                    </h3>
                    <p class="text-xs text-gray-500">
                      Lee las últimas noticias
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <!-- Enlace al dashboard siempre disponible -->
            <a
              href="#"
              class="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap"
              :class="
                currentPage === 'dashboard'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              "
              @click.prevent="navigateTo('dashboard')"
            >
              {{ $t("navbar.dashboard") }}
            </a>
            <!-- Botón Panel Admin (solo para administradores) -->
            <a
              v-if="authStore.isAdministrador()"
              href="#"
              class="px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
              :class="
                currentPage === 'admin'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
              "
              @click.prevent="navigateTo('admin')"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span>{{ $t("navbar.adminPanel") }}</span>
            </a>
          </template>

          <!-- Divisor antes de los botones de acción -->
          <div
            class="h-8 w-px bg-gray-300 hidden lg:block"
            v-if="!isSearchExpanded"
          ></div>

          <!-- Botón Iniciar Sesión - Compacto cuando búsqueda expandida -->
          <button
            v-if="!isAuthenticated"
            @click="navigateTo('iniciar-sesion')"
            class="group relative text-sm font-semibold rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :class="
              isSearchExpanded
                ? 'p-2 lg:px-3 lg:py-2'
                : 'px-4 lg:px-5 py-2 lg:py-2.5 space-x-2'
            "
            tabindex="0"
            data-nav-item="iniciar-sesion"
          >
            <svg
              class="h-4 w-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span v-if="!isSearchExpanded">{{ $t("navbar.login") }}</span>
          </button>
          <!-- Botón Registro - Compacto cuando búsqueda expandida -->
          <button
            v-if="!isAuthenticated"
            @click="navigateTo('registrarse')"
            class="group relative text-sm font-bold rounded-lg bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden flex items-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            tabindex="0"
            data-nav-item="registrarse"
            :class="
              isSearchExpanded
                ? 'p-2 lg:px-3 lg:py-2'
                : 'px-5 lg:px-6 py-2 lg:py-2.5 space-x-2'
            "
          >
            <span
              class="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></span>
            <svg
              class="h-4 w-4 relative z-10 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <span v-if="!isSearchExpanded" class="relative z-10">{{
              $t("navbar.register")
            }}</span>
          </button>
          <!-- Avatar con inicial y menú desplegable para usuario autenticado -->
          <div v-else class="relative flex-shrink-0">
            <button
              @click="toggleUserMenu"
              class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Abrir menú de usuario"
            >
              {{ userInitial }}
            </button>
            <!-- Menú desplegable -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <button
                @click="
                  navigateTo('perfil');
                  toggleUserMenu();
                "
                class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <i class="fas fa-user-circle text-blue-600"></i>
                <span>{{ $t("navbar.profile") }}</span>
              </button>
              <button
                @click="
                  authStore.logout();
                  navigateTo('inicio');
                  toggleUserMenu();
                "
                class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <i class="fas fa-sign-out-alt text-red-600"></i>
                <span>{{ $t("navbar.logout") }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Botón menú móvil -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-600 hover:text-blue-600 p-2 rounded-lg"
            aria-label="Abrir menú de navegación (Alt + M)"
            title="Menú (Alt + M)"
            :aria-expanded="isMobileMenuOpen"
          >
            <svg
              v-if="!isMobileMenuOpen"
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Breadcrumb solo para no autenticados -->
      <div
        v-if="!isAuthenticated"
        class="hidden md:flex items-center space-x-2 py-2 text-sm text-gray-500 border-t border-gray-100"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span class="font-medium text-blue-600">{{ breadcrumb }}</span>
      </div>
    </div>

    <!-- Menú móvil -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-t border-gray-100 bg-gray-50"
    >
      <div class="px-4 py-3 space-y-3">
        <!-- Barra de búsqueda móvil -->
        <div class="relative mb-4">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            @focus="showSearchSuggestions = true"
            type="text"
            :placeholder="$t('home.search.placeholder')"
            class="w-full px-4 py-2.5 pr-10 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200"
            aria-label="Buscar servicios del portal"
          />
          <svg
            class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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

          <!-- Sugerencias móvil -->
          <div
            v-if="showSearchSuggestions && filteredSearchOptions.length > 0"
            class="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-64 overflow-y-auto"
            @touchstart.stop
          >
            <button
              v-for="option in filteredSearchOptions"
              :key="option.id"
              @click="
                selectSearchOption(option);
                toggleMobileMenu();
              "
              class="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
            >
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                :class="option.bgColor"
              >
                {{ option.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-800 text-sm truncate">
                  {{ option.title }}
                </h3>
                <p class="text-xs text-gray-600 truncate">
                  {{ option.description }}
                </p>
              </div>
            </button>
          </div>
        </div>

        <!-- Enlaces móviles -->
        <template v-if="!isAuthenticated">
          <a
            href="#"
            class="block px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200"
            :class="
              currentPage === 'inicio'
                ? 'text-blue-600 bg-white'
                : 'text-gray-600 hover:bg-white'
            "
            @click.prevent="handleMobileClick('inicio')"
          >
            {{ $t("navbar.home") }}
          </a>
          <a
            href="#"
            class="block px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200"
            :class="
              currentPage === 'sobre-nosotros'
                ? 'text-blue-600 bg-white'
                : 'text-gray-600 hover:bg-white'
            "
            @click.prevent="handleMobileClick('sobre-nosotros')"
          >
            {{ $t("navbar.about") }}
          </a>
        </template>
        <template v-else>
          <a
            href="#"
            class="block px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200"
            :class="
              currentPage === 'dashboard'
                ? 'text-blue-600 bg-white'
                : 'text-gray-600 hover:bg-white'
            "
            @click.prevent="handleMobileClick('dashboard')"
          >
            {{ $t("navbar.dashboard") }}
          </a>

          <!-- Menú de Herramientas móvil (solo para ciudadanos autenticados) -->
          <div v-if="!authStore.isAdministrador()" class="space-y-1">
            <!-- Botón toggle de Herramientas -->
            <button
              @click="toggleToolsMenu"
              class="w-full flex items-center justify-between px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200 text-gray-700 hover:bg-white"
              :aria-expanded="isToolsMenuOpen"
            >
              <div class="flex items-center gap-2">
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{{ $t("navbar.tools") }}</span>
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isToolsMenuOpen }"
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
            </button>

            <!-- Submenú de Herramientas (desplegable) -->
            <div
              v-if="isToolsMenuOpen"
              class="pl-4 space-y-1 overflow-hidden transition-all duration-300"
            >
              <a
                href="#"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:bg-white hover:text-blue-600"
                @click.prevent="
                  handleMobileClick('reportar-problema');
                  toggleToolsMenu();
                "
              >
                <svg
                  class="w-4 h-4"
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
                <span>{{ $t("navbar.toolsMenu.report") }}</span>
              </a>

              <a
                href="#"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:bg-white hover:text-blue-600"
                @click.prevent="
                  handleMobileClick('encuestas');
                  toggleToolsMenu();
                "
              >
                <svg
                  class="w-4 h-4"
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
                <span>{{ $t("navbar.toolsMenu.surveys") }}</span>
              </a>

              <a
                href="#"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:bg-white hover:text-blue-600"
                @click.prevent="
                  handleMobileClick('noticias');
                  toggleToolsMenu();
                "
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <span>{{ $t("navbar.toolsMenu.news") }}</span>
              </a>
            </div>
          </div>

          <!-- Panel Admin móvil (solo para administradores) -->
          <a
            v-if="authStore.isAdministrador()"
            href="#"
            class="flex items-center gap-2 px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200"
            :class="
              currentPage === 'admin'
                ? 'text-purple-600 bg-white border-l-4 border-purple-600'
                : 'text-purple-600 hover:bg-white hover:border-l-4 hover:border-purple-600'
            "
            @click.prevent="handleMobileClick('admin')"
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span>{{ $t("navbar.adminPanel") }}</span>
          </a>
        </template>

        <!-- Botón Iniciar Sesión mejorado móvil -->
        <template v-if="!isAuthenticated">
          <!-- Botón Iniciar Sesión mejorado móvil -->
          <button
            @click="handleMobileClick('iniciar-sesion')"
            class="w-full px-5 py-3 text-base font-semibold rounded-lg border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span>{{ $t("navbar.login") }}</span>
          </button>
          <!-- Botón Registro mejorado móvil -->
          <button
            @click="handleMobileClick('registrarse')"
            class="w-full px-6 py-3 text-base font-bold rounded-lg bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <span>{{ $t("navbar.register") }}</span>
            <svg
              class="h-4 w-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </template>
        <template v-else>
          <!-- Avatar y menú móvil -->
          <div class="relative flex justify-center">
            <button
              @click="toggleUserMenuMobile"
              class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Abrir menú de usuario"
            >
              {{ userInitial }}
            </button>
            <div
              v-if="isUserMenuMobileOpen"
              class="absolute top-14 right-0 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <button
                @click="
                  handleMobileClick('perfil');
                  toggleUserMenuMobile();
                "
                class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <i class="fas fa-user-circle text-blue-600"></i>
                <span>{{ $t("navbar.profile") }}</span>
              </button>
              <button
                @click="
                  authStore.logout();
                  handleMobileClick('inicio');
                  toggleUserMenuMobile();
                "
                class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <i class="fas fa-sign-out-alt text-red-600"></i>
                <span>{{ $t("navbar.logout") }}</span>
              </button>
            </div>
          </div>
        </template>

        <!-- Controles adicionales móvil -->
        <div class="flex flex-col space-y-2 pt-2 border-t border-gray-200">
          <!-- Zoom móvil -->
          <div
            class="flex items-center justify-between px-4 py-2 bg-white rounded-lg"
          >
            <span class="text-sm font-medium text-gray-700">{{
              $t("navbar.zoom.title")
            }}</span>
            <div class="flex items-center space-x-2">
              <button
                @click="zoomOut"
                class="p-2 text-red-600 hover:bg-red-50 rounded"
                aria-label="Reducir zoom"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                  />
                </svg>
              </button>
              <span
                class="text-sm font-semibold text-blue-600 min-w-[50px] text-center"
                >{{ zoomLevel }}%</span
              >
              <button
                @click="zoomIn"
                class="p-2 text-green-600 hover:bg-green-50 rounded"
                aria-label="Aumentar zoom"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </button>
              <button
                @click="resetZoom"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                aria-label="Restablecer zoom"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Idioma móvil -->
          <div class="flex items-center justify-between">
            <button
              @click="toggleAccessibility"
              class="px-3 py-2 text-sm rounded-lg"
              :class="
                accessibilityEnabled
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600'
              "
            >
              {{ $t("navbar.accessibility") }}
            </button>
            <select
              v-model="currentLanguage"
              @change="changeLanguage(currentLanguage)"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              <option
                v-for="lang in languages"
                :key="lang.code"
                :value="lang.code"
              >
                {{ lang.flag }} {{ lang.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón Flotante de Ayuda (Burbuja) - Solo visible en desktop -->
    <button
      @click="showKeyboardShortcuts = !showKeyboardShortcuts"
      class="hidden md:flex fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 items-center justify-center group"
      :class="{ 'ring-4 ring-blue-300 ring-opacity-50': showKeyboardShortcuts }"
      aria-label="Ayuda de Atajos de Teclado"
      title="Atajos de Teclado (? o F1)"
    >
      <!-- Ícono de Teclado -->
      <svg
        v-if="!showKeyboardShortcuts"
        class="w-7 h-7 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
      <!-- Ícono de X cuando está abierto -->
      <svg
        v-else
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
        />
      </svg>

      <!-- Tooltip en hover -->
      <span
        class="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg"
      >
        Presiona ? o F1
      </span>

      <!-- Indicador de pulso -->
      <span
        class="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"
      ></span>
    </button>

    <!-- Panel de Ayuda de Atajos de Teclado -->
    <Transition name="slide-up">
      <div
        v-if="showKeyboardShortcuts"
        class="fixed bottom-32 md:bottom-42 left-3 right-3 md:left-auto md:right-6 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-6 max-w-md w-auto md:w-96 mx-auto md:mx-0"
      >
        <div class="flex items-center justify-between mb-3 md:mb-4">
          <h3
            class="text-base md:text-lg font-bold text-gray-800 flex items-center gap-1 md:gap-2"
          >
            ⌨️ <span class="hidden sm:inline">Atajos de Teclado</span
            ><span class="sm:hidden">Atajos</span>
          </h3>
          <button
            @click="showKeyboardShortcuts = false"
            class="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg flex-shrink-0"
            aria-label="Cerrar ayuda"
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
              />
            </svg>
          </button>
        </div>

        <div
          class="space-y-2 md:space-y-3 max-h-72 md:max-h-96 overflow-y-auto pr-1"
        >
          <!-- Navegación -->
          <div>
            <h4
              class="text-xs md:text-sm font-semibold text-blue-600 mb-1 md:mb-2"
            >
              🧭 {{ $t("navbar.shortcuts.navigation") }}
            </h4>
            <div class="space-y-0.5 md:space-y-1 text-xs md:text-sm">
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">{{
                  $t("navbar.shortcuts.goHome")
                }}</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Alt + H</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">{{
                  $t("navbar.shortcuts.goLogin")
                }}</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Alt + L</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">{{
                  $t("navbar.shortcuts.goRegister")
                }}</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Alt + R</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Sobre Nosotros</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Alt + S</kbd
                >
              </div>
            </div>
          </div>

          <!-- Herramientas -->
          <div>
            <h4
              class="text-xs md:text-sm font-semibold text-green-600 mb-1 md:mb-2"
            >
              🔧 Herramientas
            </h4>
            <div class="space-y-0.5 md:space-y-1 text-xs md:text-sm">
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Abrir Búsqueda</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Alt + B</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Cambiar Idioma</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Alt + I</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Menú de Zoom</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Alt + Z</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Menú Móvil</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Alt + M</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Menú de Usuario</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Alt + U</kbd
                >
              </div>
            </div>
          </div>

          <!-- Zoom -->
          <div>
            <h4
              class="text-xs md:text-sm font-semibold text-purple-600 mb-1 md:mb-2"
            >
              🔍 Zoom
            </h4>
            <div class="space-y-0.5 md:space-y-1 text-xs md:text-sm">
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Aumentar Zoom</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Ctrl + +</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Reducir Zoom</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Ctrl + -</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Resetear Zoom</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Ctrl + 0</kbd
                >
              </div>
            </div>
          </div>

          <!-- Ayuda -->
          <div>
            <h4
              class="text-xs md:text-sm font-semibold text-orange-600 mb-1 md:mb-2"
            >
              ❓ Ayuda
            </h4>
            <div class="space-y-0.5 md:space-y-1 text-xs md:text-sm">
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate"
                  >Mostrar/Ocultar Ayuda</span
                >
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >? o F1</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Cerrar Menús</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Esc</kbd
                >
              </div>
            </div>
          </div>

          <!-- Navegación con Teclado -->
          <div>
            <h4
              class="text-xs md:text-sm font-semibold text-indigo-600 mb-1 md:mb-2"
            >
              ⌨️ Navegación con Teclado
            </h4>
            <div class="space-y-0.5 md:space-y-1 text-xs md:text-sm">
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Siguiente Opción</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >→ o ↓</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Opción Anterior</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >← o ↑</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Seleccionar/Entrar</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Enter o Espacio</kbd
                >
              </div>
              <div class="flex justify-between items-center gap-2">
                <span class="text-gray-600 truncate">Usar Tab normal</span>
                <kbd
                  class="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 rounded text-[10px] md:text-xs font-mono whitespace-nowrap flex-shrink-0"
                  >Tab / Shift+Tab</kbd
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
// Stores y composables
import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts";
import { useNavbarLogic } from "@/composables/useNavbarLogic";
import { useNavbarMenus } from "@/composables/useNavbarMenus";
import { useAuthStore } from "@/stores/auth.store";

// Inicializar store
const authStore = useAuthStore();

// Usar composables refactorizados
const navbarLogic = useNavbarLogic();
const navbarMenus = useNavbarMenus();
const { showKeyboardShortcuts } = useKeyboardShortcuts();

// Exportar todas las variables y funciones necesarias para el template
const {
  isUserMenuOpen,
  isUserMenuMobileOpen,
  searchQuery,
  showSearchSuggestions,
  isSearchExpanded,
  searchInput,
  currentLanguage,
  languages,
  zoomLevel,
  isZoomMenuOpen,
  accessibilityEnabled,
  currentPage,
  userInitial,
  isAuthenticated,
  // isHome no se usa actualmente, pero se mantiene para futuras referencias
  filteredSearchOptions,
  breadcrumb,
  toggleUserMenu,
  toggleUserMenuMobile,
  handleSearch,
  expandSearch,
  collapseSearch,
  handleSearchBlur,
  selectSearchOption,
  toggleZoomMenu,
  zoomIn,
  zoomOut,
  resetZoom,
  navigateTo,
  toggleAccessibility,
  handleMobileClick,
  changeLanguage,
} = navbarLogic;

const {
  isLanguageMenuOpen,
  isMobileMenuOpen,
  isToolsMenuOpen,
  toggleLanguageMenu,
  toggleMobileMenu,
  toggleToolsMenu,
} = navbarMenus;
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

/* Transición para el panel de ayuda - Desde abajo */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Estilos para las teclas kbd */
kbd {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d5db;
}

/* Animación de pulso suave para el botón flotante */
@keyframes pulse-soft {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Sombra más fuerte para hover */
.hover\:shadow-3xl:hover {
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.35);
}

/* Resaltado de navegación con teclado */
.nav-keyboard-focus {
  outline: 3px solid #3b82f6 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
  background-color: rgba(59, 130, 246, 0.1) !important;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}
</style>

;
