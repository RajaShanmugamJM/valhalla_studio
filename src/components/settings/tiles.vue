<script setup lang="ts">
import { inject, computed } from 'vue'
import type { MapUtil, TileLayerId } from '@/utils/map'
import { TILE_LAYERS } from '@/utils/map'

const map = inject<MapUtil>('map')

const layers = Object.values(TILE_LAYERS)

const activeTileId = computed(() => map?.currentTileLayerId.value ?? 'osm')

const selectTile = (id: TileLayerId) => {
    map?.changeTileLayer(id)
}

// Simple preview colour per tile layer
const previewColors: Record<string, { bg: string; accent: string }> = {
    osm: { bg: '#d4e8c2', accent: '#6aa84f' },
    osm_hot: { bg: '#f4d5b0', accent: '#e07b3f' },
    cartodb_light: { bg: '#f0f0f0', accent: '#9bafc4' },
    cartodb_dark: { bg: '#1a1a2e', accent: '#4a4a7a' },
    esri_world: { bg: '#3a6b35', accent: '#8bc34a' },
    stadia_toner: { bg: '#ffffff', accent: '#111111' },
}
</script>

<template>
    <div class="space-y-6">
        <div>
            <h3 class="text-lg font-medium text-ink">Map Tiles</h3>
            <p class="text-sm text-ink-muted">Choose a tile provider for the map background. Changes apply instantly.
            </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <button v-for="layer in layers" :key="layer.id" @click="selectTile(layer.id as TileLayerId)"
                class="group flex flex-col gap-0 rounded-xl border-2 overflow-hidden transition-all cursor-pointer text-left"
                :class="activeTileId === layer.id
                    ? 'border-accent shadow-md'
                    : 'border-stroke hover:border-accent/40 hover:shadow-sm'">
                <!-- Tile Preview Block -->
                <div class="relative w-full h-20 flex items-center justify-center overflow-hidden"
                    :style="{ backgroundColor: previewColors[layer.id]?.bg ?? '#e0e0e0' }">
                    <!-- Fake map grid lines -->
                    <svg class="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" stroke-width="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    <!-- Road-like lines -->
                    <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="50%" x2="100%" y2="45%" stroke-width="3"
                            :stroke="previewColors[layer.id]?.accent ?? '#888'" opacity="0.7" />
                        <line x1="30%" y1="0" x2="50%" y2="100%" stroke-width="2"
                            :stroke="previewColors[layer.id]?.accent ?? '#888'" opacity="0.5" />
                        <circle cx="55%" cy="45%" r="4" :fill="previewColors[layer.id]?.accent ?? '#888'"
                            opacity="0.9" />
                    </svg>

                    <!-- Active checkmark -->
                    <transition name="pop">
                        <div v-if="activeTileId === layer.id"
                            class="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                    </transition>
                </div>

                <!-- Label -->
                <div class="px-3 py-2 bg-surface">
                    <span class="text-sm font-medium text-ink block leading-tight">{{ layer.name }}</span>
                    <span class="text-xs text-ink-muted">{{ layer.description }}</span>
                </div>
            </button>
        </div>
    </div>
</template>

<style scoped>
.pop-enter-active {
    transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.1s ease;
}

.pop-enter-from {
    transform: scale(0);
    opacity: 0;
}
</style>
