<script setup>
import { webp } from '../utils/imagem.js'
import { ref, watch } from 'vue'

const props = defineProps({
  capa: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: 'Capa da edição',
  },
})

const falhouCarregamento = ref(false)

watch(
  () => props.capa,
  () => {
    falhouCarregamento.value = false
  }
)
</script>

<template>
  <div class="capa">
    <picture v-if="capa && !falhouCarregamento">
      <source v-if="webp(capa)" type="image/webp" :srcset="webp(capa)" />
      <img :src="capa" :alt="alt" @error="falhouCarregamento = true" loading="lazy" decoding="async" />
    </picture>
    <div v-else class="capa-placeholder">
      <span>Capa em breve</span>
    </div>
  </div>
</template>

<style scoped>
.capa {
  aspect-ratio: 2 / 3;
  border-radius: 2px;
  overflow: hidden;
}

.capa img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.capa-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(50, 75, 48, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
}

.capa-placeholder span {
  font-family: var(--font-corpo);
  font-size: 13px;
  color: var(--sage-texto);
}
</style>
