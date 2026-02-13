<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { VListItem, VListItemTitle, VListItemSubtitle } from 'vuetify/components/VList'
import { VSkeletonLoader } from 'vuetify/components/VSkeletonLoader'
import { VBtn } from 'vuetify/components/VBtn'

import { useValhallaStore } from '@/stores/valhalla';
import type { LocateResponse } from '@/types/valhalla';
import { DeleteFilled } from '@/components/icons/filled'

const props = defineProps<{
    lat: number,
    lng: number,
    enableDelete?: boolean
}>()
const emit = defineEmits(['on:delete']);

const valhallaStore = useValhallaStore();
const locationDetail = ref<LocateResponse>();
const loading = ref(false);

const fetchLocationDetails = async () => {
    loading.value = true;
    const data = await valhallaStore.locate({
        "verbose": true,
        "locations": [
            {
                "lat": props.lat,
                "lon": props.lng
            }
        ],
        "costing": "auto",
        "directions_options": {
            "units": "miles"
        }
    });

    loading.value = false;
    locationDetail.value = data[0];
}

const locationName = computed(() => {
    return locationDetail.value?.edges?.[0]?.edge_info?.names?.[0] ?? "Unknown";
})

watch(() => props.lat, (lat) => {
    fetchLocationDetails();
})

onMounted(() => {
    fetchLocationDetails();
})

</script>
<template>
    <VSkeletonLoader v-if="loading" type="list-item">
    </VSkeletonLoader>
    <VListItem v-else>
        <VListItemTitle>
            {{ locationName }}
        </VListItemTitle>
        <VListItemSubtitle>
            {{ props.lat }}, {{ props.lng }}
        </VListItemSubtitle>
        <template #append v-if="props.enableDelete">
            <VBtn icon size="small" @click="$emit('on:delete')">
                <DeleteFilled />
            </VBtn>
        </template>
    </VListItem>
</template>