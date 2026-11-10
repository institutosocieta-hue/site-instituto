<script setup>
import { webp } from '../utils/imagem.js'
import { useFecharComEsc } from '../composables/useFecharComEsc.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  dinamica: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

function fechar() {
  emit('update:modelValue', false)
}

useFecharComEsc(() => props.modelValue, fechar)
</script>

<template>
  <Teleport to="body">
    <transition name="janela-fade">
      <div class="janela-fundo" v-if="modelValue" @click="fechar"></div>
    </transition>
    <transition name="janela">
      <div class="janela cd" v-if="modelValue && dinamica" role="dialog" aria-modal="true">
        <button class="janela-fechar" @click="fechar" aria-label="Fechar">×</button>

        <div class="cd-imagem" v-if="dinamica.foto">
          <picture>
            <source v-if="webp(dinamica.foto)" type="image/webp" :srcset="webp(dinamica.foto)" />
            <img :src="dinamica.foto" :alt="dinamica.titulo" loading="lazy" decoding="async" />
          </picture>
        </div>

        <div class="cd-corpo janela-sobe">
          <span class="janela-rotulo">Dinâmicas do Instituto</span>
          <h2 class="janela-titulo">{{ dinamica.titulo }}</h2>
          <span class="janela-linha"></span>
          <p class="cd-texto">{{ dinamica.detalhe }}</p>
          <div class="cd-acoes">
            <router-link :to="dinamica.to" class="btn-primario" @click="fechar">Saiba mais →</router-link>
            <button class="btn-secundario" @click="fechar">Fechar</button>
          </div>
        </div>

        <span class="janela-emblema" aria-hidden="true"><span></span><span></span><span></span></span>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.cd {
  width: min(780px, calc(100vw - 32px));
  overflow-y: auto;
}

/* a foto se revela como uma cortina e se dissolve no corpo do card */
.cd-imagem {
  position: relative;
  aspect-ratio: 16 / 8;
  overflow: hidden;
  background: var(--fundo-sutil);
  -webkit-mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
  animation: cd-cortina 1s 0.1s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

@keyframes cd-cortina {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

.cd-imagem picture,
.cd-imagem img {
  display: block;
  width: 100%;
  height: 100%;
}

.cd-imagem img {
  object-fit: cover;
  object-position: center;
  animation: cd-aproxima 6s ease-out both;
}

@keyframes cd-aproxima {
  from { transform: scale(1.08); }
  to { transform: scale(1); }
}

.cd-corpo {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 clamp(28px, 4vw, 48px) clamp(32px, 4vw, 44px);
  margin-top: -28px;
}

.cd-texto {
  max-width: 600px;
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.85;
  color: var(--texto-corpo);
}

.cd-acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

@media (max-width: 600px) {
  .cd-acoes > * {
    flex: 1 1 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cd-imagem,
  .cd-imagem img {
    animation: none;
  }
}
</style>
