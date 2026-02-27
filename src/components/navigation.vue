<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'

const menus = [
    { id: 'route', label: 'Turn-by-Turn', icon: 'route' },
    { id: 'isochrone', label: 'Isochrone', icon: 'isochrone' },
    { id: 'matrix', label: 'Matrix', icon: 'matrix' },
    { id: 'trace_route', label: 'Trace Route', icon: 'trace_route' },
    { id: 'locate', label: 'Locate', icon: 'locate' },
    { id: 'status', label: 'Status', icon: 'status' },
]

const activeMenu = ref<string | null>(null)

const toggleMenu = (id: string) => {
    if (activeMenu.value === id) {
        activeMenu.value = null // provision to hide the drawer
    } else {
        activeMenu.value = id
    }
}
</script>

<template>
    <!-- Main wrapper for navigation: fixed to top-left -->
    <div class="fixed top-6 left-6 z-1000 flex gap-4 h-[calc(100vh-3rem)] pointer-events-none">

        <!-- First set of menus: vertically stacked buttons -->
        <div
            class="flex flex-col gap-2 pointer-events-auto bg-surface/90 backdrop-blur shadow-lg rounded-md p-1.5 border border-surface-border">
            <Button v-for="menu in menus" :key="menu.id" shape="square"
                :variant="activeMenu === menu.id ? 'solid' : 'translucent'"
                class="w-10 h-10 flex items-center justify-center p-0! rounded-md! transition-colors duration-200"
                :aria-label="menu.label" :title="menu.label" @click="toggleMenu(menu.id)">
                <!-- Turn-by-Turn Icon -->
                <svg v-if="menu.icon === 'route'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 17 4 12 9 7"></polyline>
                    <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                </svg>

                <!-- Isochrone Icon -->
                <svg v-else-if="menu.icon === 'isochrone'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polygon points="2 17 12 22 22 17"></polygon>
                    <polygon points="2 12 12 17 22 12"></polygon>
                </svg>

                <!-- Matrix Icon -->
                <svg v-else-if="menu.icon === 'matrix'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>

                <!-- Trace Route Icon -->
                <svg v-else-if="menu.icon === 'trace_route'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M12 20v-2"></path>
                    <path d="M12 14v-2"></path>
                    <path d="M12 8V6"></path>
                    <circle cx="12" cy="4" r="2"></circle>
                    <circle cx="12" cy="22" r="2"></circle>
                </svg>

                <!-- Locate Icon -->
                <svg v-else-if="menu.icon === 'locate'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>

                <!-- Status Icon -->
                <svg v-else-if="menu.icon === 'status'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
            </Button>

            <!-- Provision to hide the drawer (Close button) -->
            <div v-if="activeMenu" class="mt-auto border-t border-surface-border pt-2">
                <Button shape="square" variant="translucent"
                    class="w-10 h-10 flex items-center justify-center p-0! rounded-md! text-red-500 hover:bg-red-500/10"
                    aria-label="Close Drawer" title="Close Drawer" @click="activeMenu = null">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </Button>
            </div>
        </div>

        <!-- Drawer loaded based on the selected menu -->
        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-x-4"
            enter-to-class="opacity-100 translate-x-0" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-4">
            <div v-show="activeMenu"
                class="pointer-events-auto bg-surface/95 backdrop-blur shadow-xl rounded-md w-80 h-full flex flex-col border border-surface-border overflow-hidden">
                <!-- Drawer Header -->
                <div
                    class="px-4 py-3 border-b border-surface-border flex justify-between items-center bg-surface-secondary/50">
                    <h2 class="text-base font-semibold text-ink">{{menus.find(m => m.id === activeMenu)?.label}}</h2>
                </div>

                <!-- Drawer Content -->
                <div class="p-4 flex-1 overflow-y-auto">
                    <!-- TODO: Load the actual component based on activeMenu -->
                    <div class="flex flex-col items-center justify-center h-full text-ink-secondary space-y-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 opacity-50" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M12 2v20"></path>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <p class="text-sm text-center">Settings for {{menus.find(m => m.id === activeMenu)?.label}}
                            will be loaded here.</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
