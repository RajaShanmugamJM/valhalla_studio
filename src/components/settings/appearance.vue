<script setup lang="ts">
import { ref, onMounted } from 'vue'

const theme = ref<'light' | 'dark' | 'system'>('system')

onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    if (savedTheme) {
        theme.value = savedTheme
        applyTheme(savedTheme)
    }
})

const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const html = document.documentElement
    html.removeAttribute('data-theme')
    if (newTheme === 'dark') {
        html.setAttribute('data-theme', 'dark')
    } else if (newTheme === 'light') {
        html.setAttribute('data-theme', 'light')
    }
    // 'system' → no attribute, falls back to @media prefers-color-scheme
    localStorage.setItem('theme', newTheme)
    theme.value = newTheme
}
</script>

<template>
    <div class="space-y-6">
        <div>
            <h3 class="text-lg font-medium text-ink">Appearance</h3>
            <p class="text-sm text-ink-muted">Customize how Valhalla Studio looks on your screen.</p>
        </div>

        <div class="space-y-4">
            <label class="field-label">Theme</label>
            <div class="grid grid-cols-3 gap-3">
                <button @click="applyTheme('light')"
                    class="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer"
                    :class="theme === 'light' ? 'border-accent bg-accent/5' : 'border-stroke hover:bg-surface-subtle'">
                    <div class="w-full h-12 bg-white rounded border border-stroke flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.636 7.636l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-ink">Light</span>
                </button>

                <button @click="applyTheme('dark')"
                    class="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer"
                    :class="theme === 'dark' ? 'border-accent bg-accent/5' : 'border-stroke hover:bg-surface-subtle'">
                    <div class="w-full h-12 bg-[#1e1e2e] rounded border border-stroke flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-ink">Dark</span>
                </button>

                <button @click="applyTheme('system')"
                    class="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer"
                    :class="theme === 'system' ? 'border-accent bg-accent/5' : 'border-stroke hover:bg-surface-subtle'">
                    <div
                        class="w-full h-12 bg-linear-to-r from-white to-[#1e1e2e] rounded border border-stroke flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span class="text-sm font-medium text-ink">System</span>
                </button>
            </div>
        </div>
    </div>
</template>
