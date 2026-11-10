<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  mensagens: {
    type: Array,
    required: true,
  },
})

const indice = ref(0)
let temporizador = null

onMounted(() => {
  if (props.mensagens.length > 1) {
    temporizador = setInterval(() => {
      indice.value = (indice.value + 1) % props.mensagens.length
    }, 6000)
  }
})

onUnmounted(() => {
  if (temporizador) clearInterval(temporizador)
})
</script>

<template>
  <div class="ticker" v-if="mensagens.length">
    <transition name="ticker-fade" mode="out-in">
      <p class="ticker-texto" :key="indice">{{ mensagens[indice] }}</p>
    </transition>
    <div class="ticker-pontos" v-if="mensagens.length > 1">
      <button
        v-for="(aviso, i) in mensagens"
        :key="i"
        type="button"
        class="ticker-ponto"
        :class="{ ativo: i === indice }"
        :aria-label="`Aviso ${i + 1}`"
        @click="indice = i"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin-top: 20px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
  display: flex;
  gap: 18px;
  align-items: center;
}

.ticker-texto {
  font-family: var(--font-corpo);
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
  min-height: 26px;
}

.ticker-pontos {
  display: flex;
  gap: 7px;
  flex-shrink: 0;
}

.ticker-ponto {
  width: 7px;
  height: 7px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.32);
  transition: background 0.2s ease;
}

.ticker-ponto.ativo {
  background: rgba(255, 255, 255, 0.9);
}

.ticker-fade-enter-active,
.ticker-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.ticker-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.ticker-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .ticker {
    flex-wrap: wrap;
  }
}
</style>
