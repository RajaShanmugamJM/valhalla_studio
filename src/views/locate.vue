<script setup lang="ts">
import { VContainer } from 'vuetify/components/VGrid'
import { VBanner } from 'vuetify/components/VBanner'
import { inject, onMounted, ref } from 'vue';
import { Marker } from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { VDivider } from 'vuetify/components/VDivider'
import { VBtn } from 'vuetify/components/VBtn'
import { VSlider } from 'vuetify/components/VSlider'
import { VSelect } from 'vuetify/components/VSelect'

import type { MapUtil } from '@/utils/map';
import Location from '@/components/location.vue'
import { useValhallaStore } from '@/stores/valhalla';


interface Options {
    source: number[] | null;
    radius: number;
    reachability: number;
    heading: number;
    tolerance: number;
    costing: 'none' | 'auto' | 'pedestrian' | 'bicycle';
    preferred_side: 'either' | 'same' | 'opposite';
}

const valhallaStore = useValhallaStore();
const map = inject<MapUtil>("map");
const form = ref<Options>({
    radius: 0,
    reachability: 0,
    heading: -1,
    tolerance: 0,
    costing: 'none', // corrected assignment from type to value
    preferred_side: 'either', // corrected assignment from type to value
    source: null
})
const markers = ref<Marker[]>([]);

const onHandleClick = (e: LeafletMouseEvent) => {
    markers.value.forEach(m => m.remove());
    form.value.source = [e.latlng.lat, e.latlng.lng];

    const m = new Marker([e.latlng.lat, e.latlng.lng])
    m.bindPopup("Source Marker").openPopup();

    m.addTo(map?.map.value!);
    markers.value.push(m);

    // map?.addMarker(e.latlng.lat, e.latlng.lng);
}

const snapToRoad = async () => {
    markers.value.forEach(m => m.remove());

    const data = await valhallaStore.locate({
        "verbose": true,
        "locations": [
            {
                "lat": form.value.source ? form.value.source[0] : 0,
                "lon": form.value.source ? form.value.source[1] : 0,
                "minimum_reachability": form.value.reachability,
                "radius": form.value.radius, // updated radius to use form's value
                "node_snap_tolerance": form.value.tolerance, // updated tolerance to use form's value
                "preferred_side": form.value.preferred_side, // updated preferred_side to use form's value
                "heading": form.value.heading
            }
        ],
        "costing": form.value.costing,
        "directions_options": {
            "units": "miles"
        }
    });

    if (data.length > 0) {
        const first = data[0];

        for (let index = 0; index < first.edges.length; index++) {
            const point = first.edges[index];
            const m = new Marker([point.correlated_lat, point.correlated_lon]);
            m.bindPopup(`Edge ${index + 1}`).openPopup();
            m.addTo(map?.map.value!);
            markers.value.push(m);
        }
        const sourceMarker = new Marker([form.value.source![0], form.value.source![1]]);
        sourceMarker.bindPopup("Source Marker").openPopup();
        sourceMarker.addTo(map?.map.value!);
        markers.value.push(sourceMarker);
    }
}

onMounted(() => map?.map.value!.addEventListener('click', onHandleClick));
onMounted(() => map?.clearAllLayers());

</script>
<template>
    <VBanner text="Locate"></VBanner>
    <VContainer>
        <Location v-if="form.source" :lat="form.source[0]" :lng="form.source[1]" class="px-0" />
        <VDivider class="my-2"></VDivider>
        <div class="my-2 d-flex align-center justify-space-between">
            <p class="text-subtitle-2 font-weight-black">Options</p>
        </div>
        <div>
            <div class="text-caption">Radius: {{ form.radius }}</div>
            <VSlider v-model="form.radius" step="1" min="0" max="1000"></VSlider>
        </div>
        <div>
            <div class="text-caption">Reachability: {{ form.reachability }}</div>
            <VSlider v-model="form.reachability" step="1" min="0" max="1000"></VSlider>
        </div>
        <div>
            <div class="text-caption">Heading: {{ form.heading }}</div>
            <VSlider v-model="form.heading" step="1" min="-1" max="359"></VSlider>
        </div>
        <div>
            <div class="text-caption">Tolerance: {{ form.tolerance }}</div>
            <VSlider v-model="form.tolerance" step="1" min="0" max="100"></VSlider>
        </div>
        <div>
            <VSelect label="Costing" v-model="form.costing" :items="['none', 'auto', 'pedestrian', 'bicycle']">
            </VSelect>
        </div>
        <div>
            <VSelect label="Preferred Side" v-model="form.preferred_side" :items="['either', 'same', 'opposite']">
            </VSelect>
        </div>
        <VBtn @click="snapToRoad" :disabled="form.source === null" color="primary" class="mt-2">Snap to Road</VBtn>
    </VContainer>
</template>