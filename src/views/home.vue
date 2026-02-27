<script setup lang="ts">
import { ref, inject } from 'vue'
import Map from '@/components/map.vue'
import SettingsDrawer from '@/components/SettingsDrawer.vue'
import type { MapUtil } from '@/utils/map'

const map = inject<MapUtil>('map')
const drawerOpen = ref(false)
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <!-- Fullscreen map -->
    <Map class="absolute inset-0 w-full h-full" />

    <!-- Gear button: fixed bottom-right, above map layers -->
    <button
      @click="drawerOpen = true"
      class="fixed bottom-6 right-6 z-[1000] flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
      aria-label="Open settings"
    >
      <!-- Settings gear SVG icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-6 h-6 text-gray-700">
        <path
          d="M28.832 18.472c.248.18.433.436.528.728c.098.294.1.61.009.906a14.269 14.269 0 0 1-3.156 5.443a1.478 1.478 0 0 1-1.671.347l-1.955-.858a1.501 1.501 0 0 0-.68-.128a1.474 1.474 0 0 0-.66.2a1.472 1.472 0 0 0-.727 1.124l-.235 2.13a1.48 1.48 0 0 1-1.13 1.276c-2.076.495-4.24.495-6.316 0a1.484 1.484 0 0 1-1.125-1.27l-.235-2.126a1.483 1.483 0 0 0-.485-.94a1.5 1.5 0 0 0-1.58-.255l-1.955.859a1.477 1.477 0 0 1-1.668-.343a14.267 14.267 0 0 1-3.16-5.45a1.484 1.484 0 0 1 .536-1.632l1.725-1.275a1.488 1.488 0 0 0 0-2.4l-1.725-1.273a1.48 1.48 0 0 1-.536-1.623A14.249 14.249 0 0 1 5.79 6.467c.14-.151.31-.271.5-.351a1.5 1.5 0 0 1 1.17 0l1.947.858a1.493 1.493 0 0 0 2.073-1.206l.236-2.122a1.482 1.482 0 0 1 1.148-1.281a15.462 15.462 0 0 1 3.146-.362c1.052.012 2.1.133 3.127.362a1.476 1.476 0 0 1 1.147 1.284l.236 2.12a1.483 1.483 0 0 0 2.067 1.2l1.946-.857a1.483 1.483 0 0 1 1.674.346a14.231 14.231 0 0 1 3.157 5.44a1.476 1.476 0 0 1-.537 1.63l-1.72 1.273a1.48 1.48 0 0 0-.004 2.395l1.729 1.276zM16 20a4 4 0 1 0 0-8a4 4 0 0 0 0 8z"
          fill="currentColor"
        />
      </svg>
    </button>

    <!-- Settings drawer -->
    <SettingsDrawer :open="drawerOpen" @close="drawerOpen = false" />
  </div>
</template>
