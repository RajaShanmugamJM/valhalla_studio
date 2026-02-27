<script setup lang="ts">
type Variant = 'filled' | 'outline' | 'solid' | 'translucent'
type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
    defineProps<{
        variant?: Variant
        loading?: boolean
        disabled?: boolean
        type?: ButtonType
    }>(),
    {
        variant: 'filled',
        loading: false,
        disabled: false,
        type: 'button',
    },
)
</script>

<template>
    <button
        :type="props.type"
        :disabled="props.disabled || props.loading"
        class="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{
            'bg-accent text-white hover:bg-accent-hover active:bg-accent-active': props.variant === 'filled',
            'border border-accent text-accent bg-transparent hover:bg-accent/10 active:bg-accent/20': props.variant === 'outline',
            'bg-ink text-surface hover:bg-ink-secondary active:bg-ink': props.variant === 'solid',
            'bg-accent/10 text-accent hover:bg-accent/20 active:bg-accent/30': props.variant === 'translucent',
        }"
    >
        <svg
            v-if="props.loading"
            class="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
        <slot />
    </button>
</template>
