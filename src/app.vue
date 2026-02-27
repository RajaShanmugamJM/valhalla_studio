<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onBeforeMount, provide } from 'vue'
import { useValhallaStore } from '@/stores/valhalla'
import mapUtil from '@/utils/map'

const valhallaStore = useValhallaStore()
onBeforeMount(valhallaStore.loadValhallaConfig)
provide('map', mapUtil())
</script>

<template>
  <RouterView />
</template>
