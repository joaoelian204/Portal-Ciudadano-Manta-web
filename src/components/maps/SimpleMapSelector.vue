<template>
  <div class="simple-map-selector">
    <!-- Mapa simple -->
    <div class="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
      <div ref="mapContainer" class="w-full h-64"></div>
      
      <!-- Indicador de carga -->
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div class="text-gray-700 text-sm">Cargando mapa...</div>
        </div>
      </div>
    </div>

    <!-- Información de ubicación -->
    <div class="mt-3 text-sm">
      <div v-if="ubicacion.latitud && ubicacion.longitud" class="flex items-center gap-2 text-green-700">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
        </svg>
        <span class="font-medium">Ubicación seleccionada</span>
        <span class="text-gray-600">{{ ubicacion.latitud.toFixed(6) }}, {{ ubicacion.longitud.toFixed(6) }}</span>
      </div>
      <div v-else class="flex items-center gap-2 text-amber-600">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span>Haz clic en el mapa para seleccionar ubicación</span>
      </div>
    </div>

    <!-- Controles de búsqueda y geolocalización -->
    <div class="mt-4 flex gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar dirección..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="searchLocation"
      />
      <button
        type="button"
        @click="searchLocation"
        :disabled="!searchQuery.trim()"
        class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
      >
        Buscar
      </button>
      <button
        type="button"
        @click="getCurrentLocation"
        class="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
      >
        Mi ubicación
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import L from 'leaflet'

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

// Estado
const mapContainer = ref<HTMLElement>()
const loading = ref(true)
const searchQuery = ref('')

// Variables del mapa
let map: L.Map | null = null
let marker: L.Marker | null = null

// Coordenadas de Manta
const MANTA_COORDS: [number, number] = [-0.9536, -80.7217]

// Configurar iconos de Leaflet
const setupLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

// Inicializar mapa
const initMap = () => {
  if (!mapContainer.value) return

  setupLeafletIcons()

  try {
    // Crear mapa simple
    map = L.map(mapContainer.value, {
      center: MANTA_COORDS,
      zoom: 13,
      zoomControl: true
    })

    // Añadir tiles básicos
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map)

    // Click en el mapa
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      setMapLocation(lat, lng)
    })

    // Si hay ubicación inicial
    if (props.ubicacion.latitud && props.ubicacion.longitud) {
      setMapLocation(props.ubicacion.latitud, props.ubicacion.longitud, false)
    }

    loading.value = false
  } catch (error) {
    console.error('Error inicializando mapa:', error)
    loading.value = false
  }
}

// Establecer ubicación en el mapa
const setMapLocation = (lat: number, lng: number, shouldEmit: boolean = true) => {
  if (!map) return

  // Remover marcador anterior
  if (marker) {
    map.removeLayer(marker)
  }

  // Crear nuevo marcador
  marker = L.marker([lat, lng]).addTo(map)
  map.setView([lat, lng], Math.max(map.getZoom(), 15))

  // Emitir cambio
  if (shouldEmit) {
    const nuevaUbicacion = {
      ...props.ubicacion,
      latitud: lat,
      longitud: lng
    }
    emit('update:ubicacion', nuevaUbicacion)
  }
}

// Buscar ubicación
const searchLocation = async () => {
  if (!searchQuery.value.trim()) return

  try {
    const query = `${searchQuery.value.trim()}, Manta, Ecuador`
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
    )
    const data = await response.json()

    if (data && data.length > 0) {
      const result = data[0]
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)
      setMapLocation(lat, lng)
      searchQuery.value = ''
    } else {
      alert('No se encontró la ubicación')
    }
  } catch (error) {
    console.error('Error buscando ubicación:', error)
  }
}

// Obtener ubicación actual
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Tu navegador no soporta geolocalización')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      setMapLocation(latitude, longitude)
    },
    (error) => {
      console.error('Error obteniendo ubicación:', error)
      alert('Error obteniendo tu ubicación')
    }
  )
}

// Inicializar al montar
onMounted(() => {
  setTimeout(() => {
    initMap()
  }, 100)
})
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';

.simple-map-selector :deep(.leaflet-container) {
  border-radius: 0.5rem;
}
</style>