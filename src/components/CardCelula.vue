<script setup>
import { webp } from '../utils/imagem.js'
import { useFecharComEsc } from '../composables/useFecharComEsc.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  celula: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

function fechar() {
  emit('update:modelValue', false)
}

useFecharComEsc(() => props.modelValue, fechar)

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>

<template>
  <Teleport to="body">
    <transition name="janela-fade">
      <div class="janela-fundo" v-if="modelValue" @click="fechar"></div>
    </transition>
    <transition name="janela">
      <div class="janela cc" v-if="modelValue && celula" role="dialog" aria-modal="true">
        <button class="janela-fechar" @click="fechar" aria-label="Fechar">×</button>

        <div class="cc-imagem">
          <picture v-if="celula.foto">
            <source v-if="webp(celula.foto)" type="image/webp" :srcset="webp(celula.foto)" />
            <img :src="celula.foto" :alt="celula.cidade" loading="lazy" decoding="async" />
          </picture>
        </div>

        <div class="cc-corpo janela-sobe">
          <span class="janela-rotulo">Célula Regional</span>
          <h2 class="janela-titulo">{{ celula.cidade }}</h2>
          <span class="janela-linha"></span>

          <div class="cc-numeros">
            <div class="cc-numero">
              <span class="cc-valor">{{ celula.membros }}</span>
              <span class="cc-rotulo">Membros</span>
            </div>
            <div class="cc-numero" v-if="celula.embaixadores?.length">
              <span class="cc-valor cc-valor--texto">{{ celula.embaixadores.join(', ') }}</span>
              <span class="cc-rotulo">Embaixadores</span>
            </div>
          </div>

          <div class="cc-eventos">
            <span class="janela-rotulo">Eventos na célula</span>
            <p v-if="!celula.eventos?.length" class="cc-vazio">Em breve, acompanhe nossas redes.</p>
            <ol class="cc-linha-tempo" v-else>
              <li class="cc-evento" v-for="(evento, i) in celula.eventos" :key="i">
                <span class="cc-data">{{ formatarData(evento.data) }}</span>
                <h3 class="cc-evento-titulo">{{ evento.titulo }}</h3>
                <p class="cc-evento-texto">{{ evento.descricao }}</p>
              </li>
            </ol>
          </div>
        </div>

        <span class="janela-emblema" aria-hidden="true"><span></span><span></span><span></span></span>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.cc {
  display: grid;
  grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1.4fr);
  width: min(960px, calc(100vw - 32px));
  height: min(600px, calc(100vh - 48px));
}

.cc-imagem {
  position: relative;
  overflow: hidden;
  background: var(--fundo-sutil);
  animation: cc-cortina 0.9s 0.1s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

@keyframes cc-cortina {
  from { clip-path: inset(100% 0 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

.cc-imagem picture,
.cc-imagem img {
  display: block;
  width: 100%;
  height: 100%;
}

.cc-imagem img {
  object-fit: cover;
  object-position: center;
}

.cc-corpo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  overflow-y: auto;
  padding: clamp(28px, 3.6vw, 44px);
  padding-right: clamp(60px, 7vw, 80px);
}

.cc-numeros {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin: 8px 0 12px;
  border-top: 1px solid var(--borda);
  border-bottom: 1px solid var(--borda);
}

.cc-numero {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 28px 18px 0;
  margin-right: 28px;
  border-right: 1px solid var(--borda);
}

.cc-numero:last-child {
  border-right: none;
  margin-right: 0;
}

.cc-valor {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(34px, 4vw, 48px);
  line-height: 1;
  color: var(--verde);
}

.cc-valor--texto {
  font-size: 18px;
  line-height: 1.3;
}

.cc-rotulo {
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.cc-eventos {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cc-vazio {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  font-style: italic;
  color: var(--texto-sec);
}

.cc-linha-tempo {
  display: flex;
  flex-direction: column;
}

.cc-evento {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 0 22px 24px;
  border-left: 1px solid var(--verde);
}

.cc-evento::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 4px;
  width: 7px;
  height: 7px;
  background: var(--verde);
}

.cc-data {
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--sage-texto);
}

.cc-evento-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 19px;
  line-height: 1.35;
  color: var(--verde);
}

.cc-evento-texto {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--texto-corpo);
}

@media (max-width: 760px) {
  .cc {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 200px minmax(0, 1fr);
    height: calc(100vh - 32px);
  }

  .cc-corpo {
    padding-right: clamp(28px, 3.6vw, 44px);
  }

  .janela-emblema {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cc-imagem {
    animation: none;
  }
}
</style>
