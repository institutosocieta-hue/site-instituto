<script setup>
defineProps({
  tipo: {
    type: String, // 'email' | 'youtube' | 'linkedin'
    required: true,
  },
  size: {
    type: Number,
    default: 16,
  },
})
</script>

<template>
  <svg
    v-if="tipo === 'email'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect x="2" y="4.5" width="20" height="15" rx="1.5" stroke="currentColor" stroke-width="1.4" />
    <path d="M3 6L12 13L21 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="tipo === 'youtube'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" stroke-width="1.4" />
    <path d="M10.5 9L15.5 12L10.5 15V9Z" fill="currentColor" />
  </svg>

  <svg
    v-else-if="tipo === 'instagram'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" stroke-width="1.4" />
    <circle cx="12" cy="12" r="4.3" stroke="currentColor" stroke-width="1.4" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
  </svg>

  <svg
    v-else-if="tipo === 'linkedin'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="2.5" stroke="currentColor" stroke-width="1.4" />
    <circle cx="7.2" cy="7.2" r="1.15" fill="currentColor" />
    <rect x="6.3" y="10" width="1.8" height="8" fill="currentColor" />
    <path
      d="M10.6 18V10H12.4V11.1C12.9 10.4 13.8 9.75 15.1 9.75C17.1 9.75 18 11.05 18 13.1V18H16.2V13.4C16.2 12.2 15.75 11.5 14.7 11.5C13.6 11.5 12.9 12.3 12.9 13.5V18H10.6Z"
      fill="currentColor"
    />
  </svg>
</template>
