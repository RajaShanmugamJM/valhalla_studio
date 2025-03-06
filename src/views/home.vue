<script setup lang="ts">
import { VListItem, VListSubheader, VList } from 'vuetify/components/VList'
import { VNavigationDrawer } from 'vuetify/components/VNavigationDrawer'
import { VDivider } from 'vuetify/components/VDivider'
import { VMain } from 'vuetify/components/VMain'
import { VContainer } from 'vuetify/components/VGrid'
import { useRoute } from 'vue-router'

import Map from '@/components/map.vue'
import { DirectionFilled, HomeFilled, SettingsFilled, DirectionCurveFilled } from '@/components/icons/filled'
import { HeatmapOutlined, ScatterMatrixOutlined, LocateOutlined } from '@/components/icons/outlined'
import { inject, onMounted } from 'vue'
import type { MapUtil } from '@/utils/map'

const route = useRoute();
const map = inject<MapUtil>('map');

onMounted(() => map?.clearAllLayers());

</script>

<template>
  <VNavigationDrawer location="left">
    <VList>
      <VListItem to="/" exact title="Home">
        <template #prepend>
          <HomeFilled></HomeFilled>
        </template>
      </VListItem>
      <VDivider> </VDivider>
      <VListItem to="/matrix" exact title="Matrix">
        <template #prepend>
          <ScatterMatrixOutlined></ScatterMatrixOutlined>
        </template>
      </VListItem>
      <VListItem to="/locate" exact title="Locate">
        <template #prepend>
          <LocateOutlined></LocateOutlined>
        </template>
      </VListItem>
      <VListItem to="/isochrone" exact title="Isochrone">
        <template #prepend>
          <HeatmapOutlined></HeatmapOutlined>
        </template>
      </VListItem>
      <VListSubheader>
        Route
      </VListSubheader>
      <VListItem to="/turn_by_turn" title="Turn-by-Turn">
        <template #prepend>
          <DirectionFilled></DirectionFilled>
        </template>
      </VListItem>
      <VListSubheader>
        Map Matching
      </VListSubheader>
      <VListItem to="/trace_route" title="Trace Route">
        <template #prepend>
          <DirectionCurveFilled></DirectionCurveFilled>
        </template>
      </VListItem>
      <VListSubheader>
        Configurations
      </VListSubheader>
      <VListItem to="/settings" title="Settings">
        <template #prepend>
          <SettingsFilled></SettingsFilled>
        </template>
      </VListItem>
    </VList>
  </VNavigationDrawer>
  <VMain>
    <VContainer fluid height="100%">
      <Map></Map>
    </VContainer>
  </VMain>
  <VNavigationDrawer location="right" :model-value="route.path !== '/'" width="350">
    <router-view></router-view>
  </VNavigationDrawer>
</template>
