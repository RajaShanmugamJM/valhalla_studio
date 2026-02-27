<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
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

const handleSave = () => {
  const url = form.value.valhallaUrl ?? ''
  urlError.value = /^https?:\/\/[^\s]+$/.test(url) ? '' : 'Must be a valid http(s) URL'
  if (urlError.value) return
  valhallaStore.setValhallaConfig(form.value)
  emit('close')
}
</script>

<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[1001] bg-black/20" @click="emit('close')" />
  </Transition>

  <!-- Drawer panel -->
  <Transition name="slide-right">
    <aside
      v-if="open"
      class="fixed top-0 right-0 z-[1002] h-full w-80 bg-white shadow-2xl flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 class="text-base font-semibold text-gray-800">Valhalla Settings</h2>
        <button
          @click="emit('close')"
          class="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
          aria-label="Close settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Form body -->
      <div class="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        <!-- Valhalla URL -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Valhalla Server URL</label>
          <input
            v-model="form.valhallaUrl"
            type="url"
            placeholder="http://localhost:8002"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-400': urlError }"
          />
          <p v-if="urlError" class="text-xs text-red-500">{{ urlError }}</p>
        </div>

        <!-- Authorization toggle -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">Enable Authorization</label>
          <button
            type="button"
            role="switch"
            :aria-checked="form.isAuthRequired"
            @click="form.isAuthRequired = !form.isAuthRequired"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
            :class="form.isAuthRequired ? 'bg-blue-600' : 'bg-gray-300'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
              :class="form.isAuthRequired ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <!-- Auth Method (shown when auth enabled) -->
        <template v-if="form.isAuthRequired">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Auth Method</label>
            <select
              v-model="form.authMethod"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Basic">Basic</option>
            </select>
          </div>
        </template>

        <!-- Basic auth credentials -->
        <template v-if="form.isAuthRequired && form.authMethod === 'Basic'">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Username</label>
            <input
              v-model="form.authBasicUsername"
              type="text"
              placeholder="Username"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="form.authBasicPassword"
              type="password"
              placeholder="Password"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="px-5 py-4 border-t border-gray-200">
        <button
          @click="handleSave"
          class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
        >
          Save
        </button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
/* Drawer slide in from right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Backdrop fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
