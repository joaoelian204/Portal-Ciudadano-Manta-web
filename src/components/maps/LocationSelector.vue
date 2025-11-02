<template>
  <div class="location-selector">
    <!-- Método de selección -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        Selecciona cómo indicar la ubicación del problema <span class="text-red-500">*</span>
      </label>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          @click="selectionMethod = 'predefined'"
          :class="[
            'p-4 border-2 rounded-lg text-left transition-all',
            selectionMethod === 'predefined' 
              ? 'border-blue-500 bg-blue-50 text-blue-900' 
              : 'border-gray-300 hover:border-gray-400'
          ]"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <div>
              <div class="font-medium">Sectores de Manta</div>
              <div class="text-sm text-gray-600">Selecciona de una lista</div>
            </div>
          </div>
        </button>

        <button
          type="button"
          @click="selectionMethod = 'manual'"
          :class="[
            'p-4 border-2 rounded-lg text-left transition-all',
            selectionMethod === 'manual' 
              ? 'border-green-500 bg-green-50 text-green-900' 
              : 'border-gray-300 hover:border-gray-400'
          ]"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            <div>
              <div class="font-medium">Dirección Manual</div>
              <div class="text-sm text-gray-600">Escribe la dirección</div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Selector por sectores predefinidos -->
    <div v-if="selectionMethod === 'predefined'" class="space-y-4">
      <div>
        <label for="sector" class="block text-sm font-medium text-gray-700 mb-2">
          Sector/Parroquia
        </label>
        <select
          id="sector"
          v-model="selectedSector"
          @change="onSectorChange"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Selecciona un sector</option>
          <option v-for="sector in sectoresManta" :key="sector.name" :value="sector.name">
            {{ sector.name }}
          </option>
        </select>
      </div>

      <div v-if="selectedSector">
        <label for="barrio" class="block text-sm font-medium text-gray-700 mb-2">
          Barrio (opcional)
        </label>
        <select
          id="barrio"
          v-model="selectedBarrio"
          @change="onBarrioChange"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Selecciona un barrio</option>
          <option v-for="barrio in currentBarrios" :key="barrio.name" :value="barrio.name">
            {{ barrio.name }}
          </option>
        </select>
      </div>

      <!-- Información de la ubicación seleccionada -->
      <div v-if="selectedSector" class="bg-blue-50 p-4 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <div>
            <div class="font-medium text-blue-900">{{ selectedSector }}</div>
            <div v-if="selectedBarrio" class="text-sm text-blue-700">{{ selectedBarrio }}</div>
            <div class="text-xs text-blue-600 mt-1">
              Coordenadas: {{ ubicacion.latitud.toFixed(6) }}, {{ ubicacion.longitud.toFixed(6) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selector manual -->
    <div v-if="selectionMethod === 'manual'" class="space-y-4">
      <div>
        <label for="direccion-manual" class="block text-sm font-medium text-gray-700 mb-2">
          Dirección Completa
        </label>
        <textarea
          id="direccion-manual"
          v-model="manualAddress"
          @input="onManualAddressChange"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ej: Calle 10 de Agosto entre Av. 4 de Noviembre y Calle 13, frente al parque central"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="barrio-manual" class="block text-sm font-medium text-gray-700 mb-2">
            Barrio
          </label>
          <input
            id="barrio-manual"
            v-model="manualBarrio"
            @input="onManualChange"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej: Los Esteros"
          />
        </div>
        <div>
          <label for="sector-manual" class="block text-sm font-medium text-gray-700 mb-2">
            Sector
          </label>
          <input
            id="sector-manual"
            v-model="manualSector"
            @input="onManualChange"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej: Tarqui"
          />
        </div>
      </div>

      <div>
        <label for="referencias-manual" class="block text-sm font-medium text-gray-700 mb-2">
          Referencias
        </label>
        <input
          id="referencias-manual"
          v-model="manualReferences"
          @input="onManualChange"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ej: Frente a la farmacia Cruz Azul, junto al semáforo"
        />
      </div>

      <!-- Información de la ubicación manual -->
      <div v-if="manualAddress" class="bg-green-50 p-4 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <div>
            <div class="font-medium text-green-900">Dirección Manual</div>
            <div class="text-sm text-green-700">{{ manualAddress }}</div>
            <div class="text-xs text-green-600 mt-1">
              Coordenadas aproximadas: {{ ubicacion.latitud.toFixed(6) }}, {{ ubicacion.longitud.toFixed(6) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

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
const selectionMethod = ref<'predefined' | 'manual'>('predefined')
const selectedSector = ref('')
const selectedBarrio = ref('')
const manualAddress = ref('')
const manualBarrio = ref('')
const manualSector = ref('')
const manualReferences = ref('')

// Datos de sectores y barrios de Manta
const sectoresManta = [
  {
    name: 'Tarqui',
    coords: [-0.9536, -80.7217],
    barrios: [
      { name: 'Los Esteros', coords: [-0.9456, -80.7187] },
      { name: 'Centro', coords: [-0.9536, -80.7217] },
      { name: 'La Dolorosa', coords: [-0.9576, -80.7247] },
      { name: '4 de Noviembre', coords: [-0.9516, -80.7197] },
      { name: 'Jocay', coords: [-0.9596, -80.7277] }
    ]
  },
  {
    name: 'Eloy Alfaro',
    coords: [-0.9436, -80.7117],
    barrios: [
      { name: 'Eloy Alfaro', coords: [-0.9436, -80.7117] },
      { name: 'Santa Marianita', coords: [-0.9336, -80.7017] },
      { name: 'La Maternidad', coords: [-0.9476, -80.7157] }
    ]
  },
  {
    name: 'Manta',
    coords: [-0.9636, -80.7317],
    barrios: [
      { name: 'Manta Centro', coords: [-0.9636, -80.7317] },
      { name: 'Barbasquillo', coords: [-0.9736, -80.7417] },
      { name: 'San Mateo', coords: [-0.9556, -80.7267] }
    ]
  },
  {
    name: 'Los Esteros',
    coords: [-0.9456, -80.7187],
    barrios: [
      { name: 'Los Esteros Norte', coords: [-0.9426, -80.7157] },
      { name: 'Los Esteros Sur', coords: [-0.9486, -80.7217] },
      { name: 'Urbanización Los Esteros', coords: [-0.9446, -80.7177] }
    ]
  },
  {
    name: 'San Lorenzo',
    coords: [-0.9756, -80.7437],
    barrios: [
      { name: 'San Lorenzo Centro', coords: [-0.9756, -80.7437] },
      { name: 'El Palmar', coords: [-0.9776, -80.7457] }
    ]
  }
]

// Barrios del sector actual
const currentBarrios = computed(() => {
  const sector = sectoresManta.find(s => s.name === selectedSector.value)
  return sector ? sector.barrios : []
})

// Handlers
const onSectorChange = () => {
  selectedBarrio.value = '' // Reset barrio selection
  const sector = sectoresManta.find(s => s.name === selectedSector.value)
  if (sector && sector.coords) {
    updateUbicacion({
      latitud: sector.coords[0] as number,
      longitud: sector.coords[1] as number,
      direccion: sector.name + ', Manta',
      sector: sector.name,
      barrio: '',
      referencias: ''
    })
  }
}

const onBarrioChange = () => {
  if (selectedBarrio.value) {
    const sector = sectoresManta.find(s => s.name === selectedSector.value)
    const barrio = sector?.barrios.find(b => b.name === selectedBarrio.value)
    if (barrio && barrio.coords) {
      updateUbicacion({
        latitud: barrio.coords[0] as number,
        longitud: barrio.coords[1] as number,
        direccion: `${barrio.name}, ${selectedSector.value}, Manta`,
        sector: selectedSector.value,
        barrio: barrio.name,
        referencias: ''
      })
    }
  }
}

const onManualAddressChange = () => {
  onManualChange()
}

const onManualChange = () => {
  // Coordenadas por defecto del centro de Manta
  const defaultCoords: [number, number] = [-0.9536, -80.7217]
  
  updateUbicacion({
    latitud: defaultCoords[0],
    longitud: defaultCoords[1],
    direccion: manualAddress.value || 'Dirección manual',
    sector: manualSector.value || 'Manta',
    barrio: manualBarrio.value || '',
    referencias: manualReferences.value || ''
  })
}

const updateUbicacion = (newUbicacion: typeof props.ubicacion) => {
  emit('update:ubicacion', newUbicacion)
}

// Watchers para inicializar con datos existentes
watch(() => props.ubicacion, (newUbicacion) => {
  if (newUbicacion.sector && !selectedSector.value) {
    // Intentar match con sectores predefinidos
    const matchedSector = sectoresManta.find(s => 
      s.name.toLowerCase().includes(newUbicacion.sector?.toLowerCase() || '')
    )
    if (matchedSector) {
      selectedSector.value = matchedSector.name
      if (newUbicacion.barrio) {
        const matchedBarrio = matchedSector.barrios.find(b =>
          b.name.toLowerCase().includes(newUbicacion.barrio?.toLowerCase() || '')
        )
        if (matchedBarrio) {
          selectedBarrio.value = matchedBarrio.name
        }
      }
    }
  }
}, { immediate: true })
</script>

<style scoped>
/* Estilos específicos si es necesario */
</style>