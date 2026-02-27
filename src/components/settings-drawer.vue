<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useValhallaStore } from '@/stores/valhalla'
import type { ValhallaConfigInterface } from '@/types/store'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const valhallaStore = useValhallaStore()
const { valhallaConfig } = storeToRefs(valhallaStore)

const form = ref<ValhallaConfigInterface>({
  valhallaUrl: '',
  isAuthRequired: false,
  authMethod: undefined,
  authBasicUsername: undefined,
  authBasicPassword: undefined,
})

// Sync local form from store whenever drawer opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && valhallaConfig.value) {
      form.value = { ...valhallaConfig.value }
    }
  },
)

const urlError = ref('')
const isSaving = ref(false)

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
  emit('close')
}
</script>

<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[1001] bg-overlay" @click="emit('close')" />
  </Transition>

  <!-- Drawer panel -->
  <Transition name="slide-right">
    <aside v-if="open" class="fixed top-0 right-0 z-[1002] h-full w-80 bg-surface shadow-2xl flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-stroke">
        <h2 class="text-base font-semibold text-ink">Valhalla Settings</h2>
        <button @click="emit('close')" class="btn-icon p-1 text-ink-muted" aria-label="Close settings">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Form body -->
      <div class="flex-1 overflow-y-auto px-5 py-6 space-y-5">
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

        <!-- Auth Method (shown when auth enabled) -->
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
            <input v-model="form.authBasicPassword" type="password" placeholder="Password" class="field-input" />
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="px-5 py-4 border-t border-stroke">
        <button @click="handleSave" class="btn-primary" :disabled="isSaving">
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </aside>
  </Transition>
</template>
