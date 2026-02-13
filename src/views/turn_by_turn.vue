<script setup lang="ts">
import { VContainer } from 'vuetify/components/VGrid'
import { VBanner } from 'vuetify/components/VBanner'
import { VAlert } from 'vuetify/components/VAlert'
import { VForm } from 'vuetify/components/VForm'
import { VBtn } from 'vuetify/components/VBtn'
import { VTextField } from 'vuetify/components/VTextField'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import type { LeafletMouseEvent } from 'leaflet';

import type { MapUtil } from '@/utils/map';
import { useValhallaStore } from '@/stores/valhalla';

const map = inject<MapUtil>("map");

const formTemplateRef = ref();
const valhallaStore = useValhallaStore();
const form = ref<{ source: [number, number] | null, destination: [number, number] | null }>({
    source: null,
    destination: null,
})

const onHandleClick = (e: LeafletMouseEvent) => {
    if (form.value.source === null) {
        form.value.source = [e.latlng.lat, e.latlng.lng];
    } else if (form.value.destination === null) {
        form.value.destination = [e.latlng.lat, e.latlng.lng];
    } else {
        form.value.source = [e.latlng.lat, e.latlng.lng];
        form.value.destination = null;
    }

    map?.addMarker(e.latlng.lat, e.latlng.lng);

    console.log(form.value);
}

const generateRoute = async () => {
    const { valid, errors } = await formTemplateRef.value!.validate();

    console.log('Valid, errors');
    console.log(errors);

    if (!valid) return;

    const data = await valhallaStore.generateRoute({
        "locations": [
            {
                "lat": form.value.source![0],
                "lon": form.value.source![1]
            },
            {
                "lat": form.value.destination![0],
                "lon": form.value.destination![1]
            }
        ],
        "costing": "auto",
        "costing_options": {
            "auto": {
                "country_crossing_penalty": 2000
            }
        },
        "units": "miles",
        "id": "my_work_route"
    });
    const { polylines, alternatePolylines } = valhallaStore.getPolylines(data.trip, []);
    map?.addPolyLines(polylines);
    alternatePolylines.forEach((alternate) => {
        map?.addPolyLines(alternate, {
            color: 'red',
        });
    });

}

onMounted(() => map?.map.value!.addEventListener('click', onHandleClick));
onMounted(() => map?.clearAllLayers());

onBeforeUnmount(() => map?.map.value!.removeEventListener('click', onHandleClick));

</script>
<template>
    <VBanner text="Turn-by-Turn"></VBanner>
    <VContainer>
        <VAlert density="compact" title="Route Generation"
            text="Click on the map to create a route between two points, or enter latitude and longitude below."
            type="info" variant="tonal"></VAlert>
        <VForm @submit.prevent="generateRoute" ref="formTemplateRef" class="mt-3">
            <VTextField :rules="[v => !!v || 'Item is required']" label="Source" :model-value="form.source?.join(', ')">
            </VTextField>
            <VTextField :rules="[v => !!v || 'Item is required']" label="Destination"
                :model-value="form.destination?.join(', ')">
            </VTextField>
            <VBtn type="submit" color="primary">Submit</VBtn>
        </VForm>
    </VContainer>
</template>