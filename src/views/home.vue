<script setup lang="ts">
import { ref, inject } from 'vue'
import Map from '@/components/map.vue'
import Navigation from '@/components/navigation.vue'
import SettingsModal from '@/components/settings/settings-modal.vue'
import Button from '@/components/ui/button.vue'
import type { MapUtil } from '@/utils/map'

const map = inject<MapUtil>('map')
const settingsOpen = ref(false)
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <!-- Fullscreen map -->
    <Map class="absolute inset-0 w-full h-full" />

    <!-- Navigation Drawer & Menus -->
    <Navigation />

    <!-- Zoom controls: fixed top-right -->
    <div class="fixed top-6 right-6 z-1000 flex flex-col gap-1">
      <Button shape="square" variant="solid" class="rounded-t-md! rounded-b-none! size-7 px-0! py-0! shadow-lg"
        aria-label="Zoom in" @click="map?.zoomIn()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Button>
      <Button shape="square" variant="solid" class="rounded-b-md! rounded-t-none! size-7 px-0! py-0! shadow-lg"
        aria-label="Zoom out" @click="map?.zoomOut()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Button>
    </div>

    <!-- Gear button: fixed bottom-right, above map layers -->
    <Button shape="pill" variant="solid"
      class="fixed bottom-6 right-6 z-[1000] w-12 h-12 px-0! py-0! shadow-lg active:scale-95 transition-all duration-150"
      aria-label="Open settings" @click="settingsOpen = true">
      <!-- Settings gear SVG icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-6 h-6">
        <path
          d="M28.832 18.472c.248.18.433.436.528.728c.098.294.1.61.009.906a14.269 14.269 0 0 1-3.156 5.443a1.478 1.478 0 0 1-1.671.347l-1.955-.858a1.501 1.501 0 0 0-.68-.128a1.474 1.474 0 0 0-.66.2a1.472 1.472 0 0 0-.727 1.124l-.235 2.13a1.48 1.48 0 0 1-1.13 1.276c-2.076.495-4.24.495-6.316 0a1.484 1.484 0 0 1-1.125-1.27l-.235-2.126a1.483 1.483 0 0 0-.485-.94a1.5 1.5 0 0 0-1.58-.255l-1.955.859a1.477 1.477 0 0 1-1.668-.343a14.267 14.267 0 0 1-3.16-5.45a1.484 1.484 0 0 1 .536-1.632l1.725-1.275a1.488 1.488 0 0 0 0-2.4l-1.725-1.273a1.48 1.48 0 0 1-.536-1.623A14.249 14.249 0 0 1 5.79 6.467c.14-.151.31-.271.5-.351a1.5 1.5 0 0 1 1.17 0l1.947.858a1.493 1.493 0 0 0 2.073-1.206l.236-2.122a1.482 1.482 0 0 1 1.148-1.281a15.462 15.462 0 0 1 3.146-.362c1.052.012 2.1.133 3.127.362a1.476 1.476 0 0 1 1.147 1.284l.236 2.12a1.483 1.483 0 0 0 2.067 1.2l1.946-.857a1.483 1.483 0 0 1 1.674.346a14.231 14.231 0 0 1 3.157 5.44a1.476 1.476 0 0 1-.537 1.63l-1.72 1.273a1.48 1.48 0 0 0-.004 2.395l1.729 1.276zM16 20a4 4 0 1 0 0-8a4 4 0 0 0 0 8z"
          fill="currentColor" />
      </svg>
    </Button>

    <!-- Settings modal -->
    <SettingsModal :open="settingsOpen" @close="settingsOpen = false" />

  </div>
</template>
