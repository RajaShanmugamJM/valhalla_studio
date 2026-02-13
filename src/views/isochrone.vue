<script setup lang="ts">
import { VContainer } from 'vuetify/components/VGrid'
import { VBanner } from 'vuetify/components/VBanner'
import { VBtn } from 'vuetify/components/VBtn'
import { VDivider } from 'vuetify/components/VDivider'
import { VDialog } from 'vuetify/components/VDialog'
import { VCard } from 'vuetify/components/VCard'
import { VForm } from 'vuetify/components/VForm'
import { VList, VListItem, VListItemTitle, VListItemSubtitle } from 'vuetify/components/VList'
import { VTextField } from 'vuetify/components/VTextField'
import { VColorPicker } from 'vuetify/components/VColorPicker'
import { clone } from 'lodash';

import Location from '@/components/location.vue'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import type { MapUtil } from '@/utils/map';
import { useValhallaStore } from '@/stores/valhalla';
import type { LeafletMouseEvent } from 'leaflet';
import { AddBoxFilled } from '@/components/icons/filled'

interface Contour {
    time: number;
    color: string;
}

const map = inject<MapUtil>("map");
const contourFormTemplateRef = ref();
const contourModel = ref(false);
const valhallaStore = useValhallaStore();

const form = ref<{ source: [number, number] | null, contours: Contour[] }>({
    source: null,
    contours: []
})
const contourForm = ref<Contour>({
    time: 5,
    color: '#D95151'
})

const onHandleClick = (e: LeafletMouseEvent) => {

    map?.clearMarkers();

    form.value.source = [e.latlng.lat, e.latlng.lng];
    map?.addMarker(e.latlng.lat, e.latlng.lng);
}
const addContour = async () => {
    const { valid, errors } = await contourFormTemplateRef.value!.validate();

    if (!valid) return;

    const c = clone(contourForm.value);
    form.value.contours.push({
        time: c.time,
        color: c.color.replace("#", ""),
    });

    contourModel.value = false;
}
const fetchIsochrone = async () => {
    if (!form.value.source || form.value.contours.length <= 0) return;

    const data = await valhallaStore.getIsochrone({
        contours: form.value.contours,
        locations: [{
            lat: form.value.source[0],
            lon: form.value.source[1],
        }],
        costing: 'auto',
    });

    map?.clearGeoJsons();
    map?.addGeoJson(data, null, {
        contours: form.value.contours,
        locations: [{
            lat: form.value.source[0],
            lon: form.value.source[1],
        }],
        costing: 'auto',
    });
}

onMounted(() => map?.map.value!.addEventListener('click', onHandleClick));
onMounted(() => map?.clearAllLayers());

onBeforeUnmount(() => map?.map.value!.removeEventListener('click', onHandleClick));
</script>
<template>
    <VDialog v-model="contourModel" width="auto">
        <VCard width="350" title="Add Contour">
            <VContainer>
                <VForm @submit.prevent="addContour" ref="contourFormTemplateRef">
                    <VTextField :rules="[v => !!v || 'Username is required']" v-model:model-value="contourForm.time"
                        label="Time (In Minutes)" type="number">
                    </VTextField>
                    <div class="d-flex justify-center">
                        <VColorPicker v-model:model-value="contourForm.color" tile elevation="0" :modes="['rgb']">
                        </VColorPicker>
                    </div>
                    <div class="d-flex justify-space-between mt-3">
                        <VBtn flat>Close</VBtn>
                        <VBtn type="submit" color="primary">Add</VBtn>
                    </div>
                </VForm>
            </VContainer>
        </VCard>
    </VDialog>
    <VBanner text="Isochrone"></VBanner>
    <VContainer>
        <Location v-if="form.source" :lat="form.source[0]" :lng="form.source[1]" class="px-0" />
        <VDivider class="my-2"></VDivider>
        <div class="mt-2 d-flex align-center justify-space-between">
            <p class="text-subtitle-2 font-weight-black">Contours</p>
            <VBtn size="small" icon @click="contourModel = true">
                <AddBoxFilled></AddBoxFilled>
            </VBtn>
        </div>
        <VList v-if="form.contours.length">
            <VListItem v-for="c in form.contours" class="px-0">
                <VListItemTitle>{{ c.time }} Min</VListItemTitle>
                <VListItemSubtitle>Color: <span :style="{ 'color': '#' + c.color }">#{{ c.color }}</span>
                </VListItemSubtitle>
            </VListItem>
        </VList>
        <VBtn @click="fetchIsochrone" color="primary" class="mt-2">Fetch Isochrone</VBtn>
    </VContainer>
</template>