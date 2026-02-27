<script lang="ts" setup>
import { inject, onMounted } from 'vue'
import type { MapUtil } from '@/utils/map'

const map = inject<MapUtil>('map')

onMounted(() => {
  if (!map) return
  map.initMap('map')
})
</script>

<template>
  <div id="map" class="w-full h-full"></div>
</template>
