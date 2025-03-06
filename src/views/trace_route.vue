<script setup lang="ts">
import { VContainer } from 'vuetify/components/VGrid'
import { VBanner } from 'vuetify/components/VBanner'
import { VBtn } from 'vuetify/components/VBtn'

import Editor from '@/components/editor.vue';
import { inject, onMounted, ref } from 'vue';
import type { MapUtil } from '@/utils/map';
import { useValhallaStore } from '@/stores/valhalla';

const json = ref();
const map = inject<MapUtil>("map");

const valhallaStore = useValhallaStore();

const submit = async () => {
    if (json.value === undefined || json.value == "") return;

    const data = await valhallaStore.traceRoute(json.value);

    const { polylines, alternatePolylines } = valhallaStore.getPolylines(data.trip, data.alternates ?? []);

    map?.addPolyLines(polylines);
    alternatePolylines.forEach((alternate) => {
        map?.addPolyLines(alternate, {
            color: 'red',
        });
    });
}

onMounted(() => map?.clearAllLayers());
</script>
<template>
    <VBanner text="Trace Route"></VBanner>
    <VContainer>
        <Editor @update:model-value="(v) => json = v"></Editor>
        <VBtn @click="submit" color="primary mt-3">Submit</VBtn>
    </VContainer>
</template>