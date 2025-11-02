<template>
  <div class="map-selector">
    <!-- Controles de búsqueda -->
    <div class="mb-4">
      <div class="flex flex-col sm:flex-row gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar dirección en Manta..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="searchLocation"
        />
        <button
          type="button"
          @click="searchLocation"
          :disabled="!searchQuery.trim()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ $t('common.buscar') }}
        </button>
        <button
          type="button"
          @click="getCurrentLocation"
          :disabled="loadingLocation"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loadingLocation">📍</span>
          <span v-else>🎯</span>
          {{ $t('reportes.mi_ubicacion') }}
        </button>
      </div>
      
      <!-- Mensaje de ubicación actual -->
      <div v-if="currentAddress" class="mt-2 text-sm text-gray-600">
        📍 {{ currentAddress }}
      </div>
    </div>

    <!-- Mapa -->
    <div class="relative border border-gray-300 rounded-lg overflow-hidden">
      <div ref="mapContainer" :class="['w-full transition-all duration-300', isExpanded ? 'h-96' : 'h-80']"></div>
      
      <!-- Controles del mapa -->
      <div class="absolute top-2 right-2 flex flex-col gap-2 z-[1000]">
        <!-- Botón expandir/contraer -->
        <button
          type="button"
          @click="toggleExpand"
          class="bg-white hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-sm transition-colors"
          :title="isExpanded ? 'Contraer mapa' : 'Expandir mapa'"
        >
          <svg v-if="!isExpanded" class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          <svg v-else class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9l6 6m0-6l-6 6m12-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
        
        <!-- Botón pantalla completa -->
        <button
          type="button"
          @click="toggleFullscreen"
          class="bg-white hover:bg-gray-50 border border-gray-300 rounded-md p-2 shadow-sm transition-colors"
          title="Pantalla completa"
        >
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7V4a1 1 0 011-1h3M4 17v3a1 1 0 001 1h3m10-18h3a1 1 0 011 1v3m0 10v3a1 1 0 01-1 1h-3m-6-6h.01M12 12h.01M18 12h.01"></path>
          </svg>
        </button>
      </div>
      
      <!-- Fondo base mientras cargan tiles -->
      <div v-if="loadingMap" class="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 z-[998]">
        <!-- Patrón de grid sutil -->
        <div class="absolute inset-0 opacity-20" 
             style="background-image: 
               linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
               background-size: 20px 20px;">
        </div>
      </div>

      <!-- Indicador de carga -->
      <div v-if="loadingMap" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-[999]">
        <div class="text-center">
          <div class="relative">
            <!-- Spinner principal -->
            <div class="animate-spin rounded-full h-10 w-10 border-3 border-blue-200 border-t-blue-600 mx-auto mb-3"></div>
            <!-- Pulso de fondo -->
            <div class="absolute inset-0 rounded-full border border-blue-300 animate-ping opacity-30"></div>
          </div>
          <div class="text-gray-700 font-medium text-sm">Cargando mapa de Manta</div>
          <div class="text-xs text-gray-500 mt-1">Preparando tiles...</div>
        </div>
      </div>
      
      <!-- Overlay de selección -->
      <div v-if="!marker" class="absolute inset-0 flex items-center justify-center pointer-events-none z-[998]">
        <div class="bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
          👆 Haz clic en el mapa para seleccionar ubicación
        </div>
      </div>
    </div>

    <!-- Modal de pantalla completa -->
    <div v-if="isFullscreen" class="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        <!-- Header del modal -->
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">{{ $t('reportes.seleccionar_ubicacion_mapa') }}</h3>
          <button
            type="button"
            @click="toggleFullscreen"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Mapa en modal -->
        <div class="flex-1 relative">
          <div ref="fullscreenMapContainer" class="w-full h-full"></div>
        </div>
        
        <!-- Footer del modal -->
        <div class="p-4 border-t bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              <span v-if="currentAddress" class="flex items-center">
                📍 {{ currentAddress }}
              </span>
              <span v-else-if="ubicacion.latitud && ubicacion.longitud" class="flex items-center">
                📍 Lat: {{ ubicacion.latitud.toFixed(6) }}, Lng: {{ ubicacion.longitud.toFixed(6) }}
              </span>
              <span v-else>
                Selecciona una ubicación en el mapa
              </span>
            </div>
            <button
              type="button"
              @click="toggleFullscreen"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Confirmar ubicación
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Información de coordenadas -->
    <div class="mt-2 text-xs text-gray-500">
      <div v-if="ubicacion.latitud && ubicacion.longitud" class="flex items-center gap-2">
        <span class="flex items-center gap-1">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <strong>Ubicación seleccionada:</strong>
        </span>
        <span>Lat: {{ ubicacion.latitud.toFixed(6) }}, Lng: {{ ubicacion.longitud.toFixed(6) }}</span>
      </div>
      <div v-else class="flex items-center gap-1 text-amber-600">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        {{ $t('reportes.seleccionar_ubicacion_mapa') }}
      </div>
    </div>

    <!-- Instrucciones -->
    <div class="mt-2 text-sm text-gray-600">
      💡 {{ $t('reportes.instrucciones_mapa') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// Tipo para ubicación
interface IUbicacion {
  latitud: number
  longitud: number
  direccion: string
  barrio?: string
  sector?: string
  referencias?: string
}
import L from 'leaflet'

// Props y emits
interface Props {
  ubicacion: IUbicacion
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

const emit = defineEmits<{
  'update:ubicacion': [ubicacion: IUbicacion]
}>()

const { t } = useI18n()

// Referencias reactivas
const mapContainer = ref<HTMLElement>()
const fullscreenMapContainer = ref<HTMLElement>()
const searchQuery = ref('')
const currentAddress = ref('')
const loadingMap = ref(true)
const loadingLocation = ref(false)
const isExpanded = ref(false)
const isFullscreen = ref(false)

// Variables del mapa
let map: L.Map | null = null
let fullscreenMap: L.Map | null = null
let marker: L.Marker | null = null
let fullscreenMarker: L.Marker | null = null
let geocodeTimeout: number | null = null
let lastGeocodeTime = 0
const GEOCODE_COOLDOWN = 1000 // 1 segundo entre solicitudes

// Coordenadas de Manta, Ecuador como centro por defecto
const MANTA_COORDS: [number, number] = [-0.9536, -80.7217]

// Configurar iconos de Leaflet
const configureLeafletIcons = () => {
  // Fix para los iconos de Leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

// Inicializar el mapa
const initMap = () => {
  if (!mapContainer.value) return

  configureLeafletIcons()
  
  // Crear el mapa con opciones optimizadas
  map = L.map(mapContainer.value, {
    center: MANTA_COORDS,
    zoom: 13,
    zoomControl: true,
    attributionControl: true,
    preferCanvas: true, // Mejor rendimiento
    fadeAnimation: true,
    zoomAnimation: true,
    markerZoomAnimation: true
  })

  // Usar un proveedor de tiles más rápido y confiable con configuración anti-parches
  const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CARTO',
    maxZoom: 18,
    minZoom: 11,
    tileSize: 256,
    crossOrigin: true,
    updateWhenZooming: false,
    updateWhenIdle: true,
    keepBuffer: 5, // Buffer mucho más grande para pre-cargar
    maxNativeZoom: 18,
    subdomains: ['a', 'b', 'c', 'd'],
    // Opciones específicas para evitar el efecto "parches"
    updateInterval: 150,
    // Evitar mostrar tiles parciales
    noWrap: false,
    // Mejor manejo de errores
    errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTJhNyI+Q2FyZ2FuZG8uLi48L3RleHQ+PC9zdmc+'
  })

  // Contador de tiles para mejor control de carga
  let tilesLoading = 0
  let totalTiles = 0

  tileLayer.on('tileloadstart', () => {
    tilesLoading++
    totalTiles++
    if (tilesLoading > 0) {
      loadingMap.value = true
    }
  })

  tileLayer.on('tileload', () => {
    tilesLoading--
    if (tilesLoading <= 0) {
      // Pequeño delay para asegurar renderizado completo
      setTimeout(() => {
        loadingMap.value = false
      }, 150)
    }
  })

  tileLayer.on('tileerror', () => {
    tilesLoading--
    if (tilesLoading <= 0) {
      setTimeout(() => {
        loadingMap.value = false
      }, 150)
    }
  })

  // Forzar pre-carga de tiles
  tileLayer.on('add', () => {
    // Pre-cargar tiles del área visible
    setTimeout(() => {
      map?.invalidateSize()
    }, 50)
  })

  tileLayer.addTo(map)

  // Evento de click en el mapa
  map.on('click', handleMapClick)

  // Evento cuando el mapa termina de cargar - approach más conservador
  map.whenReady(() => {
    // Forzar múltiples redimensionados para asegurar carga correcta
    setTimeout(() => {
      map?.invalidateSize()
    }, 50)
    
    setTimeout(() => {
      map?.invalidateSize()
    }, 200)
    
    setTimeout(() => {
      map?.invalidateSize()
      // Solo ocultar loading después de que todo esté listo
      if (tilesLoading <= 0) {
        loadingMap.value = false
      }
    }, 400)
  })

  // Pre-cargar área de Manta para evitar tiles visibles
  const preloadMantaArea = () => {
    // Definir bounds de Manta para pre-carga
    const mantaBounds = L.latLngBounds(
      L.latLng(-1.1, -80.9), // Southwest
      L.latLng(-0.8, -80.5)  // Northeast  
    )
    
    // Forzar que el mapa cargue esta área
    map?.fitBounds(mantaBounds, { 
      animate: false,
      padding: [20, 20]
    })
    
    // Después regresar al centro de Manta
    setTimeout(() => {
      map?.setView(MANTA_COORDS, 13, { animate: false })
    }, 300)
  }

  // Pre-cargar área
  setTimeout(() => {
    preloadMantaArea()
  }, 100)

  // Si ya hay una ubicación, mostrarla
  if (props.ubicacion.latitud && props.ubicacion.longitud) {
    setTimeout(() => {
      updateMapLocation(props.ubicacion.latitud, props.ubicacion.longitud, false) // No emitir en inicialización
    }, 500)
  }
}

// Manejar click en el mapa
const handleMapClick = (e: L.LeafletMouseEvent) => {
  const { lat, lng } = e.latlng
  updateMapLocation(lat, lng)
  
  // Debounce de geocodificación para evitar muchas solicitudes
  if (geocodeTimeout) {
    clearTimeout(geocodeTimeout)
  }
  
  geocodeTimeout = setTimeout(() => {
    reverseGeocode(lat, lng)
  }, 500) // Esperar 500ms después del último click
}

// Actualizar ubicación en el mapa
const updateMapLocation = (lat: number, lng: number, emitUpdate: boolean = true) => {
  if (!map) return

  // Remover marcador anterior si existe
  if (marker) {
    map.removeLayer(marker)
  }

  // Crear nuevo marcador con icono personalizado
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 25px;
        height: 25px;
        background: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
        animation: pulse 2s infinite;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5]
  })
  
  marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
  
  // Centrar el mapa en la nueva ubicación
  map.setView([lat, lng], Math.max(map.getZoom(), 15))

  // Solo emitir la nueva ubicación si se solicita
  if (emitUpdate) {
    const nuevaUbicacion: IUbicacion = {
      ...props.ubicacion,
      latitud: lat,
      longitud: lng
    }
    emit('update:ubicacion', nuevaUbicacion)
  }
}

// Geocodificación inversa (obtener dirección de coordenadas)
const reverseGeocode = async (lat: number, lng: number) => {
  // Rate limiting
  const now = Date.now()
  if (now - lastGeocodeTime < GEOCODE_COOLDOWN) {
    console.log('Geocodificación omitida por rate limiting')
    return
  }
  lastGeocodeTime = now
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'PortalCiudadanoManta/1.0',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      console.warn('Geocodificación falló con status:', response.status)
      return
    }
    
    const data = await response.json()
    
    if (data.display_name) {
      currentAddress.value = data.display_name
      
      // Intentar extraer información específica
      const address = data.address || {}
      const nuevaUbicacion: IUbicacion = {
        ...props.ubicacion,
        latitud: lat,
        longitud: lng,
        direccion: data.display_name,
        barrio: address.neighbourhood || address.suburb || props.ubicacion.barrio || '',
        sector: address.city_district || address.district || props.ubicacion.sector || ''
      }
      emit('update:ubicacion', nuevaUbicacion)
    } else {
      // Si no hay dirección, solo actualizar coordenadas
      const nuevaUbicacion: IUbicacion = {
        ...props.ubicacion,
        latitud: lat,
        longitud: lng,
        direccion: props.ubicacion.direccion || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      }
      emit('update:ubicacion', nuevaUbicacion)
    }
  } catch (error) {
    console.warn('Error en geocodificación inversa:', error)
    // Fallback: actualizar solo coordenadas si falla la geocodificación
    const nuevaUbicacion: IUbicacion = {
      ...props.ubicacion,
      latitud: lat,
      longitud: lng,
      direccion: props.ubicacion.direccion || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
    emit('update:ubicacion', nuevaUbicacion)
  }
}

// Buscar ubicación por texto
const searchLocation = async () => {
  if (!searchQuery.value.trim() || !map) return

  loadingLocation.value = true
  
  try {
    const query = `${searchQuery.value.trim()}, Manta, Ecuador`
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=es&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'PortalCiudadanoManta/1.0',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      console.warn('Búsqueda falló con status:', response.status)
      alert(t('reportes.error_busqueda'))
      return
    }

    const data = await response.json()

    if (data && data.length > 0) {
      const result = data[0]
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)
      
      updateMapLocation(lat, lng)
      currentAddress.value = result.display_name
      searchQuery.value = '' // Limpiar búsqueda
    } else {
      alert(t('reportes.ubicacion_no_encontrada'))
    }
  } catch (error) {
    console.error('Error buscando ubicación:', error)
    alert(t('reportes.error_busqueda'))
  } finally {
    loadingLocation.value = false
  }
}

// Obtener ubicación actual del usuario
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert(t('reportes.geolocalizacion_no_soportada'))
    return
  }

  loadingLocation.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      updateMapLocation(latitude, longitude)
      
      // Debounce también para geolocalización
      if (geocodeTimeout) {
        clearTimeout(geocodeTimeout)
      }
      
      geocodeTimeout = setTimeout(() => {
        reverseGeocode(latitude, longitude)
      }, 300)
      
      loadingLocation.value = false
    },
    (error) => {
      console.error('Error obteniendo ubicación:', error)
      alert(t('reportes.error_obteniendo_ubicacion'))
      loadingLocation.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutos
    }
  )
}

// Funciones de expansión y pantalla completa
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  
  // Redimensionar el mapa después del cambio de tamaño con múltiples intentos
  setTimeout(() => {
    if (map) {
      map.invalidateSize({ animate: true })
      // Segundo intento para asegurar el redimensionado
      setTimeout(() => {
        map?.invalidateSize({ animate: false })
      }, 100)
    }
  }, 350) // Tiempo ligeramente mayor que la animación CSS
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  
  if (isFullscreen.value) {
    // Crear mapa en pantalla completa
    setTimeout(() => {
      initFullscreenMap()
    }, 100)
  } else {
    // Limpiar mapa de pantalla completa
    if (fullscreenMap) {
      fullscreenMap.remove()
      fullscreenMap = null
      fullscreenMarker = null
    }
  }
}

const initFullscreenMap = () => {
  if (!fullscreenMapContainer.value) return

  configureLeafletIcons()
  
  // Crear el mapa de pantalla completa con opciones optimizadas
  fullscreenMap = L.map(fullscreenMapContainer.value, {
    center: MANTA_COORDS,
    zoom: 13,
    zoomControl: true,
    attributionControl: true,
    preferCanvas: true,
    fadeAnimation: true,
    zoomAnimation: true,
    markerZoomAnimation: true
  })

  // Añadir capa de tiles optimizada
  const fullscreenTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CARTO',
    maxZoom: 19,
    minZoom: 10,
    tileSize: 256,
    crossOrigin: true,
    updateWhenZooming: false,
    keepBuffer: 3,
    maxNativeZoom: 18,
    subdomains: ['a', 'b', 'c', 'd']
  })

  fullscreenTileLayer.addTo(fullscreenMap)

  // Asegurar que el mapa se redimensione correctamente
  fullscreenMap.whenReady(() => {
    setTimeout(() => {
      fullscreenMap?.invalidateSize()
    }, 100)
  })

  // Evento de click en el mapa de pantalla completa
  fullscreenMap.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    updateFullscreenMapLocation(lat, lng)
    
    // También actualizar el mapa principal
    updateMapLocation(lat, lng)
    
    // Geocodificación con debounce
    if (geocodeTimeout) {
      clearTimeout(geocodeTimeout)
    }
    
    geocodeTimeout = setTimeout(() => {
      reverseGeocode(lat, lng)
    }, 500)
  })

  // Si ya hay una ubicación, mostrarla en pantalla completa
  if (props.ubicacion.latitud && props.ubicacion.longitud) {
    updateFullscreenMapLocation(props.ubicacion.latitud, props.ubicacion.longitud)
    
    // Centrar en la ubicación actual
    fullscreenMap.setView([props.ubicacion.latitud, props.ubicacion.longitud], 15)
  }
}

const updateFullscreenMapLocation = (lat: number, lng: number) => {
  if (!fullscreenMap) return

  // Remover marcador anterior si existe
  if (fullscreenMarker) {
    fullscreenMap.removeLayer(fullscreenMarker)
  }

  // Crear nuevo marcador con icono personalizado
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: #ef4444;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
  
  fullscreenMarker = L.marker([lat, lng], { icon: customIcon }).addTo(fullscreenMap)
  
  // Centrar el mapa en la nueva ubicación
  fullscreenMap.setView([lat, lng], Math.max(fullscreenMap.getZoom(), 15))
}

// Watchers
watch(() => props.ubicacion, (newUbicacion) => {
  if (newUbicacion.latitud && newUbicacion.longitud && map) {
    // Solo actualizar si la posición del marcador es diferente a la nueva ubicación
    if (!marker || 
        marker.getLatLng().lat !== newUbicacion.latitud || 
        marker.getLatLng().lng !== newUbicacion.longitud) {
      updateMapLocation(newUbicacion.latitud, newUbicacion.longitud, false) // No emitir para evitar recursión
    }
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  // Usar nextTick y setTimeout para asegurar que el DOM esté completamente listo
  setTimeout(() => {
    initMap()
  }, 200)
  
  // También escuchar cambios en el tamaño de ventana
  const handleResize = () => {
    if (map) {
      setTimeout(() => {
        map?.invalidateSize()
      }, 100)
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  // Limpiar listener al desmontar
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (map) {
      map.remove()
    }
    if (fullscreenMap) {
      fullscreenMap.remove()
    }
  })
})
</script>

<style scoped>
/* Importar estilos de Leaflet */
@import 'leaflet/dist/leaflet.css';

.map-selector {
  width: 100%;
}

/* Ajustes para el contenedor del mapa */
.map-selector :deep(.leaflet-container) {
  border-radius: 0.5rem;
  background-color: #f8fafc; /* Fondo mientras cargan tiles */
}

/* Suavizar transiciones de tiles */
.map-selector :deep(.leaflet-tile) {
  transition: opacity 0.2s ease-in-out;
}

.map-selector :deep(.leaflet-tile-loaded) {
  opacity: 1;
}

/* Evitar que se vean tiles a medio cargar */
.map-selector :deep(.leaflet-tile-container) {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.map-selector :deep(.leaflet-tile-container.leaflet-zoom-animated) {
  opacity: 1;
}

/* Estilos para el indicador de carga */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Estilos para marcadores personalizados */
.map-selector :deep(.custom-marker) {
  background: transparent !important;
  border: none !important;
}

/* Estilos para el modal de pantalla completa */
.map-selector :deep(.leaflet-container.leaflet-fullscreen) {
  border-radius: 0;
}

/* Mejorar controles del mapa */
.map-selector :deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
}

.map-selector :deep(.leaflet-control-zoom a) {
  background: white !important;
  border: 1px solid #d1d5db !important;
  color: #374151 !important;
  transition: all 0.2s ease !important;
}

.map-selector :deep(.leaflet-control-zoom a:hover) {
  background: #f3f4f6 !important;
  border-color: #9ca3af !important;
}
</style>