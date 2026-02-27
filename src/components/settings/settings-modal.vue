<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const menuItems = [
    { id: 'configuration', label: 'Configuration', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'appearance', label: 'Appearance', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a1 1 0 010 2H5v12a2 2 0 002 2h12a2 2 0 002-2v-1M18 7a2 2 0 100-4 2 2 0 000 4z' }
]

const activeMenu = ref('configuration')

const ConfigurationComponent = defineAsyncComponent(() => import('./configuration.vue'))
const AppearanceComponent = defineAsyncComponent(() => import('./appearance.vue'))

const components: Record<string, any> = {
    configuration: ConfigurationComponent,
    appearance: AppearanceComponent
}
</script>

<template>
    <Transition name="fade">
        <div v-if="open" class="fixed inset-0 z-1001 bg-overlay backdrop-blur-sm flex items-center justify-center"
            @click.self="emit('close')">
            <div
                class="bg-surface w-full max-w-4xl h-[50vh] shadow-2xl rounded-xl border border-stroke overflow-hidden flex flex-row animate-in fade-in zoom-in duration-200">
                <!-- Sidebar -->
                <aside class="w-64 border-r border-stroke bg-surface-subtle flex flex-col">
                    <div class="px-6 py-5 border-b border-stroke">
                        <h2 class="text-xl font-bold text-ink">Settings</h2>
                    </div>

                    <nav class="flex-1 p-3 space-y-1">
                        <button v-for="item in menuItems" :key="item.id" @click="activeMenu = item.id"
                            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group"
                            :class="activeMenu === item.id
                                ? 'bg-accent text-white shadow-md'
                                : 'text-ink-secondary hover:bg-surface hover:text-ink'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-colors"
                                :class="activeMenu === item.id ? 'text-white' : 'text-ink-muted group-hover:text-ink'"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
                                <circle v-if="item.id === 'configuration'" cx="12" cy="12" r="3" stroke-width="2" />
                                <path v-if="item.id === 'appearance'" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M18 7a2 2 0 100-4 2 2 0 000 4zM18 7v11a2 2 0 01-2 2H8a2 2 0 01-2-2V7a2 2 0 012-2h8a2 2 0 012 2z" />
                            </svg>
                            {{ item.label }}
                        </button>
                    </nav>

                </aside>

                <!-- Main Content -->
                <main class="flex-1 overflow-y-auto bg-surface p-8">
                    <component :is="components[activeMenu]" />
                </main>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
