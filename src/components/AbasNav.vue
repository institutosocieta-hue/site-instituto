<script setup>
defineProps({
  abas: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="abas-nav">
    <button
      v-for="(aba, i) in abas"
      :key="aba"
      class="aba-botao"
      :class="{ ativa: modelValue === i }"
      @click="$emit('update:modelValue', i)"
    >
      {{ aba }}
    </button>
  </div>
</template>

<style scoped>
.abas-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
  border-bottom: 1px solid var(--borda);
  margin: -32px 0 calc(48px - var(--secao-gap));
  overflow-x: auto;
  scrollbar-width: none;
}

.abas-nav::-webkit-scrollbar {
  display: none;
}

.aba-botao {
  flex-shrink: 0;
  min-height: 44px;
  background: none;
  border: none;
  font-family: var(--font-titulo);
  font-size: 15px;
  color: var(--sage-texto);
  padding: 12px 20px;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.35s ease;
}

.aba-botao:hover {
  color: var(--verde);
  border-bottom-color: var(--sage);
}

.aba-botao.ativa {
  color: var(--verde);
  border-bottom-color: var(--verde);
}

@media (max-width: 700px) {
  .abas-nav {
    justify-content: flex-start;
  }
}
</style>
