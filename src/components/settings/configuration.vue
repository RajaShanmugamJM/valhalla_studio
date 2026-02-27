<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useValhallaStore } from '@/stores/valhalla'
import type { ValhallaConfigInterface } from '@/types/store'

const valhallaStore = useValhallaStore()
const { valhallaConfig } = storeToRefs(valhallaStore)

const form = ref<ValhallaConfigInterface>({
    valhallaUrl: '',
    isAuthRequired: false,
    authMethod: undefined,
    authBasicUsername: undefined,
    authBasicPassword: undefined,
})

const urlError = ref('')
const isSaving = ref(false)

onMounted(() => {
    if (valhallaConfig.value) {
        form.value = { ...valhallaConfig.value }
    }
})

const handleSave = async () => {
    const url = form.value.valhallaUrl ?? ''
    urlError.value = /^https?:\/\/[^\s]+$/.test(url) ? '' : 'Must be a valid http(s) URL'
    if (urlError.value) return

    isSaving.value = true
    try {
        const headers: Record<string, string> = {}
        if (form.value.isAuthRequired && form.value.authMethod === 'Basic') {
            const username = form.value.authBasicUsername || ''
            const password = form.value.authBasicPassword || ''
            headers['Authorization'] = 'Basic ' + btoa(username + ':' + password)
        }

        await axios.get(`${url}/status`, { headers })
    } catch (error) {
        urlError.value = 'Failed to connect to Valhalla instance'
        isSaving.value = false
        return
    }
    isSaving.value = false

    valhallaStore.setValhallaConfig(form.value)
}
</script>

<template>
    <div class="space-y-6">
        <div>
            <h3 class="text-lg font-medium text-ink">Valhalla Configuration</h3>
            <p class="text-sm text-ink-muted">Manage your connection to the Valhalla server.</p>
        </div>

        <div class="space-y-5">
            <!-- Valhalla URL -->
            <div class="space-y-1">
                <label class="field-label">Valhalla Server URL</label>
                <input v-model="form.valhallaUrl" type="url" placeholder="http://localhost:8002" class="field-input"
                    :class="{ 'field-input-error': urlError }" />
                <p v-if="urlError" class="field-error-text">{{ urlError }}</p>
            </div>

            <!-- Authorization toggle -->
            <div class="flex items-center justify-between">
                <label class="field-label">Enable Authorization</label>
                <button type="button" role="switch" :aria-checked="form.isAuthRequired"
                    @click="form.isAuthRequired = !form.isAuthRequired"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-ring focus:ring-offset-1 cursor-pointer"
                    :class="form.isAuthRequired ? 'bg-accent' : 'bg-toggle-off'">
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                        :class="form.isAuthRequired ? 'translate-x-6' : 'translate-x-1'" />
                </button>
            </div>

            <!-- Auth Method -->
            <template v-if="form.isAuthRequired">
                <div class="space-y-1">
                    <label class="field-label">Auth Method</label>
                    <select v-model="form.authMethod" class="field-input">
                        <option value="Basic">Basic</option>
                    </select>
                </div>
            </template>

            <!-- Basic auth credentials -->
            <template v-if="form.isAuthRequired && form.authMethod === 'Basic'">
                <div class="space-y-1">
                    <label class="field-label">Username</label>
                    <input v-model="form.authBasicUsername" type="text" placeholder="Username" class="field-input" />
                </div>
                <div class="space-y-1">
                    <label class="field-label">Password</label>
                    <input v-model="form.authBasicPassword" type="password" placeholder="Password"
                        class="field-input" />
                </div>
            </template>
        </div>

        <div class="pt-4 border-t border-stroke">
            <button @click="handleSave" class="btn-primary w-auto inline-flex" :disabled="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Configuration' }}
            </button>
        </div>
    </div>
</template>
