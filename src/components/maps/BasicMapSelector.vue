<template>
  <div class="map-selector">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Selecciona la ubicación del problema en el mapa <span class="text-red-500">*</span>
      </label>
      <p class="text-sm text-gray-600 mb-3">
        Haz clic en el mapa para marcar la ubicación exacta del problema
      </p>
    </div>

    <!-- Mapa -->
    <div class="relative mb-4">
      <div
        ref="mapContainer"
        class="w-full h-80 rounded-lg border-2 border-gray-300 overflow-hidden"
        style="min-height: 320px;"
      ></div>
      
      <!-- Loading overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p class="text-sm text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    </div>

    <!-- Controles del mapa -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      <button
        type="button"
        @click="getCurrentLocation"
        :disabled="loading"
        class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Mi Ubicación
      </button>

      <button
        type="button"
        @click="centerOnManta"
        :disabled="loading"
        class="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Centro de Manta
      </button>
    </div>

    <!-- Información de la ubicación seleccionada -->
    <div v-if="ubicacion.latitud !== -0.9536 || ubicacion.longitud !== -80.7217" class="bg-green-50 p-4 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <div>
          <div class="font-medium text-green-900">Ubicación Seleccionada</div>
          <div class="text-sm text-green-700">
            Coordenadas: {{ ubicacion.latitud.toFixed(6) }}, {{ ubicacion.longitud.toFixed(6) }}
          </div>
          <div v-if="ubicacion.direccion" class="text-sm text-green-600 mt-1">
            {{ ubicacion.direccion }}
          </div>
        </div>
      </div>
    </div>

    <!-- Buscar dirección -->
    <div class="mt-4">
      <label for="search-address" class="block text-sm font-medium text-gray-700 mb-2">
        O busca una dirección en Manta
      </label>
      <div class="flex">
        <input
          id="search-address"
          v-model="searchQuery"
          type="text"
          placeholder="Ej: Calle 10 de Agosto, Manta"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keyup.enter="searchAddress"
        />
        <button
          type="button"
          @click="searchAddress"
          :disabled="loading || !searchQuery.trim()"
          class="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buscar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

// Props
interface Props {
  ubicacion: {
    latitud: number
    longitud: number
    direccion: string
    barrio?: string
    sector?: string
    referencias?: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:ubicacion': [ubicacion: typeof props.ubicacion]
}>()

// Refs
const mapContainer = ref<HTMLDivElement>()
const loading = ref(true)
const searchQuery = ref('')

// Variables del mapa
let map: any = null
let marker: any = null
let L: any = null

// Cargar Leaflet dinámicamente
const loadLeaflet = async () => {
  if (window.L) {
    L = window.L
    return
  }

  // Cargar CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  document.head.appendChild(link)

  // Cargar JS
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  
  return new Promise((resolve, reject) => {
    script.onload = () => {
      L = window.L
      resolve(L)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Inicializar mapa
const initMap = async () => {
  try {
    await loadLeaflet()
    
    if (!mapContainer.value || !L) return

    // Crear mapa centrado en Manta
    map = L.map(mapContainer.value, {
      center: [props.ubicacion.latitud, props.ubicacion.longitud],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true
    })

    // Añadir capa de tiles - usando OpenStreetMap directo
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0
    }).addTo(map)

    // Crear marcador inicial
    updateMarker(props.ubicacion.latitud, props.ubicacion.longitud)

    // Event listener para clics en el mapa
    map.on('click', (e: any) => {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      updateMarker(lat, lng)
      updateUbicacion(lat, lng)
    })

    loading.value = false
  } catch (error) {
    console.error('Error inicializando mapa:', error)
    loading.value = false
  }
}

// Actualizar marcador
const updateMarker = (lat: number, lng: number) => {
  if (!map || !L) return

  if (marker) {
    map.removeLayer(marker)
  }

  marker = L.marker([lat, lng], {
    draggable: true
  }).addTo(map)

  // Event listener para arrastrar marcador
  marker.on('dragend', (e: any) => {
    const position = e.target.getLatLng()
    updateUbicacion(position.lat, position.lng)
  })
}

// Actualizar ubicación
const updateUbicacion = async (lat: number, lng: number) => {
  try {
    // Intentar obtener dirección usando Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    )
    
    let direccion = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    let barrio = ''
    let sector = ''

    if (response.ok) {
      const data = await response.json()
      if (data.display_name) {
        direccion = data.display_name
        barrio = data.address?.neighbourhood || data.address?.suburb || ''
        sector = data.address?.city_district || data.address?.town || 'Manta'
      }
    }

    const nuevaUbicacion = {
      latitud: lat,
      longitud: lng,
      direccion,
      barrio,
      sector,
      referencias: props.ubicacion.referencias || ''
    }

    emit('update:ubicacion', nuevaUbicacion)
  } catch (error) {
    console.error('Error obteniendo dirección:', error)
    
    const nuevaUbicacion = {
      latitud: lat,
      longitud: lng,
      direccion: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      barrio: props.ubicacion.barrio || '',
      sector: props.ubicacion.sector || 'Manta',
      referencias: props.ubicacion.referencias || ''
    }

    emit('update:ubicacion', nuevaUbicacion)
  }
}

// Obtener ubicación actual
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('La geolocalización no está soportada en este navegador')
    return
  }

  loading.value = true
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      
      if (map) {
        map.setView([lat, lng], 16)
        updateMarker(lat, lng)
        updateUbicacion(lat, lng)
      }
      
      loading.value = false
    },
    (error) => {
      console.error('Error obteniendo ubicación:', error)
      alert('No se pudo obtener tu ubicación actual')
      loading.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  )
}

// Centrar en Manta
const centerOnManta = () => {
  if (map) {
    map.setView([-0.9536, -80.7217], 14)
    updateMarker(-0.9536, -80.7217)
    updateUbicacion(-0.9536, -80.7217)
  }
}

// Buscar dirección
const searchAddress = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  
  try {
    const query = `${searchQuery.value}, Manta, Ecuador`
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&bounded=1&viewbox=-80.8,-0.8,-80.6,-1.1`
    )

    if (response.ok) {
      const data = await response.json()
      if (data && data.length > 0) {
        const result = data[0]
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        
        if (map) {
          map.setView([lat, lng], 16)
          updateMarker(lat, lng)
          updateUbicacion(lat, lng)
        }
      } else {
        alert('No se encontró la dirección especificada en Manta')
      }
    }
  } catch (error) {
    console.error('Error buscando dirección:', error)
    alert('Error al buscar la dirección')
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.ubicacion, (newUbicacion) => {
  if (map && marker) {
    const lat = newUbicacion.latitud
    const lng = newUbicacion.longitud
    map.setView([lat, lng], map.getZoom())
    marker.setLatLng([lat, lng])
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// Declarar L en window para TypeScript
declare global {
  interface Window {
    L: any
  }
}
</script>

<style scoped>
/* Asegurar que el mapa se renderice correctamente */
.map-selector :deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  z-index: 1;
}

.map-selector :deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
}

.map-selector :deep(.leaflet-control-zoom a) {
  color: #374151 !important;
  background-color: white !important;
}

.map-selector :deep(.leaflet-control-zoom a:hover) {
  background-color: #f3f4f6 !important;
}
</style>