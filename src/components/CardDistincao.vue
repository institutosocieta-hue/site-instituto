<script setup>
import { webp } from '../utils/imagem.js'
import { useFecharComEsc } from '../composables/useFecharComEsc.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  distincao: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'abrir-pessoa'])

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
      <div class="janela card-distincao" v-if="modelValue && distincao" role="dialog" aria-modal="true">
        <button class="janela-fechar" @click="fechar" aria-label="Fechar">×</button>

        <div class="card-cabecalho">
          <span class="label-caps">{{ distincao.nome }} · {{ distincao.semestre }}</span>
          <p class="card-texto">{{ distincao.texto }}</p>
        </div>

        <div class="card-corpo janela-sobe">
          <div class="vencedor-unico" v-if="distincao.tipo === 'unico' && distincao.vencedor">
            <button class="foto-item foto-item--grande" @click="emit('abrir-pessoa', distincao.vencedor)">
              <picture v-if="distincao.vencedor.foto">
                <source v-if="webp(distincao.vencedor.foto)" type="image/webp" :srcset="webp(distincao.vencedor.foto)" />
                <img :src="distincao.vencedor.foto" :alt="distincao.vencedor.nome" loading="lazy" decoding="async" />
              </picture>
              <span v-else class="foto-placeholder">Foto em breve</span>
            </button>
            <div class="vencedor-unico-texto">
              <span class="foto-nome">{{ distincao.vencedor.nome }}</span>
              <span class="foto-detalhe" v-if="distincao.vencedor.nucleo">{{ distincao.vencedor.nucleo }}</span>
            </div>
          </div>

          <div
            class="vencedores-grade"
            v-else-if="distincao.tipo === 'grade' && distincao.vencedores?.length"
            :style="{ gridTemplateColumns: `repeat(${distincao.colunas || 3}, 1fr)` }"
          >
            <div class="foto-coluna" v-for="v in distincao.vencedores" :key="v.nome">
              <button class="foto-item" @click="emit('abrir-pessoa', v)">
                <picture v-if="v.foto">
                  <source v-if="webp(v.foto)" type="image/webp" :srcset="webp(v.foto)" />
                  <img :src="v.foto" :alt="v.nome" loading="lazy" decoding="async" />
                </picture>
                <span v-else class="foto-placeholder">Foto em breve</span>
              </button>
              <span class="foto-nome">{{ v.nome }}</span>
              <span class="foto-detalhe" v-if="v.nucleo">{{ v.nucleo }}</span>
            </div>
          </div>

          <ul class="nomes-lista" v-else-if="distincao.tipo === 'nomes' && distincao.nomes?.length">
            <li v-for="nome in distincao.nomes" :key="nome">{{ nome }}</li>
          </ul>

          <p v-else class="sem-vencedor">Vencedores deste semestre ainda não anunciados.</p>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.card-distincao {
  display: flex;
  flex-direction: column;
  width: min(900px, calc(100vw - 32px));
  overflow-y: auto;
}

/* cabeçalho verde, com o texto da distinção */
.card-cabecalho {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: clamp(36px, 4.4vw, 56px) clamp(28px, 4vw, 52px) clamp(28px, 3.4vw, 40px);
  color: #fff;
}

.card-cabecalho::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: #233722;
  background-image: linear-gradient(rgba(35, 55, 34, 0.88), rgba(35, 55, 34, 0.88)), url('/img/textura-verde.svg');
  background-size: cover;
  background-position: center;
}

.card-cabecalho .label-caps {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  padding-right: 44px;
  color: rgba(255, 255, 255, 0.82);
}

.card-cabecalho .label-caps::before {
  content: '';
  width: 7px;
  height: 7px;
  background: #fff;
}

.card-texto {
  max-width: 720px;
  font-family: var(--font-corpo);
  font-size: 16.5px;
  line-height: 1.85;
  color: rgba(255, 255, 255, 0.93);
}

.card-corpo {
  padding: clamp(28px, 3.4vw, 44px) clamp(28px, 4vw, 52px) clamp(36px, 4vw, 52px);
}

.vencedor-unico {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 36px);
}

.foto-item {
  position: relative;
  display: block;
  padding: 0;
  border: none;
  aspect-ratio: 4 / 5;
  border-radius: var(--raio);
  overflow: hidden;
  background: var(--fundo-sutil);
  box-shadow: 0 12px 22px -16px rgba(26, 26, 26, 0.4);
  cursor: pointer;
  transition: transform 0.45s cubic-bezier(0.22, 0.8, 0.2, 1), box-shadow 0.45s ease;
}

.foto-item--grande {
  width: 220px;
  flex-shrink: 0;
}

.foto-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 26px 34px -18px rgba(26, 26, 26, 0.5);
}

.foto-item picture,
.foto-item img {
  display: block;
  width: 100%;
  height: 100%;
}

.foto-item img {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.8s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.foto-item:hover img {
  transform: scale(1.06);
}

.foto-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-corpo);
  font-size: 13px;
  color: var(--sage-texto);
}

.vencedor-unico-texto,
.foto-coluna {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.foto-nome {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 17px;
  line-height: 1.3;
  color: var(--verde);
}

.vencedor-unico-texto .foto-nome {
  font-size: clamp(22px, 2.6vw, 30px);
}

.foto-detalhe {
  font-family: var(--font-corpo);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.vencedores-grade {
  display: grid;
  gap: clamp(16px, 2.4vw, 28px);
}

.foto-coluna {
  min-width: 0;
}

.foto-coluna .foto-item {
  width: 100%;
  margin-bottom: 6px;
}

.nomes-lista {
  columns: 2 240px;
  column-gap: 40px;
}

.nomes-lista li {
  break-inside: avoid;
  padding: 14px 0;
  border-bottom: 1px solid var(--borda);
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 18px;
  color: var(--verde);
  transition: padding-left 0.3s cubic-bezier(0.22, 0.8, 0.2, 1), border-color 0.2s ease;
}

.nomes-lista li:hover {
  padding-left: 10px;
  border-bottom-color: var(--verde);
}

.sem-vencedor {
  font-family: var(--font-corpo);
  font-style: italic;
  color: var(--texto-sec);
}

@media (max-width: 640px) {
  .vencedor-unico {
    flex-direction: column;
    align-items: flex-start;
  }

  .foto-item--grande {
    width: 180px;
  }

  .vencedores-grade {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}
</style>
