<script setup>
import { webp } from '../utils/imagem.js'
import IconeContato from './IconeContato.vue'
import { useFecharComEsc } from '../composables/useFecharComEsc.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  pessoa: {
    type: Object,
    default: null,
  },
  temAnterior: {
    type: Boolean,
    default: false,
  },
  temProxima: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'anterior', 'proxima'])

function fechar() {
  emit('update:modelValue', false)
}

useFecharComEsc(() => props.modelValue, fechar)

function iniciais(nome) {
  const partes = nome.split(' ')
  return partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')
}

// Blocos do card. Convenção dos dados (data/governanca.js):
//   lista de tópicos → exibida; null → "nenhum" (bloco oculto);
//   campo ausente (undefined) → ainda sem informação: mostra o espaço pronto,
//   exceto Gestão, que só aparece para quem de fato ocupou cargo ou coordenação.
const blocos = [
  { chave: 'associacao', rotulo: 'Associação' },
  { chave: 'trajetoria', rotulo: 'Trajetória no Instituto' },
  { chave: 'gestao', rotulo: 'Gestão', opcional: true }, // só para quem ocupou cargo/coordenação
  { chave: 'distincoes', rotulo: 'Distinções' },
]

// Prêmio Unità: a maior distinção do Instituto ganha destaque no card de quem a recebeu
function ehUnita(chave, item) {
  return chave === 'distincoes' && /^Prêmio Unità/.test(item)
}

function partesUnita(item) {
  const i = item.indexOf(',')
  return i < 0 ? [item, ''] : [item.slice(0, i), item.slice(i + 1).trim()]
}
</script>

<template>
  <Teleport to="body">
    <transition name="janela-fade">
      <div class="janela-fundo" v-if="modelValue" @click="fechar"></div>
    </transition>

    <button
      class="card-nav card-nav--esq"
      v-if="modelValue && temAnterior"
      @click="emit('anterior')"
      aria-label="Pessoa anterior"
    >
      ←
    </button>
    <button
      class="card-nav card-nav--dir"
      v-if="modelValue && temProxima"
      @click="emit('proxima')"
      aria-label="Próxima pessoa"
    >
      →
    </button>

    <transition name="palco" mode="out-in">
      <div
        class="palco"
        v-if="modelValue && pessoa"
        :key="pessoa.nome + (pessoa.nucleo || '')"
        role="dialog"
        aria-modal="true"
      >
        <button class="card-fechar" @click="fechar" aria-label="Fechar">×</button>

        <div class="palco-foto">
          <picture v-if="pessoa.foto">
            <source v-if="webp(pessoa.foto)" type="image/webp" :srcset="webp(pessoa.foto)" />
            <img :src="pessoa.foto" :alt="pessoa.nome" decoding="async" />
          </picture>
          <span v-else class="palco-iniciais" aria-hidden="true">{{ iniciais(pessoa.nome) }}</span>
        </div>

        <div class="palco-gaveta">
          <div class="palco-info">
            <span class="card-cargo label-caps" v-if="pessoa.cargo || pessoa.nucleo">
              {{ pessoa.cargo || pessoa.nucleo }}
            </span>
            <h2 class="card-nome">{{ pessoa.nome }}</h2>

            <div class="card-secoes">
              <template v-for="bloco in blocos" :key="bloco.chave">
                <div class="card-secao" v-if="bloco.opcional ? pessoa[bloco.chave] : pessoa[bloco.chave] !== null">
                  <span class="label-caps">{{ bloco.rotulo }}</span>
                  <ul class="card-lista" v-if="pessoa[bloco.chave]">
                    <li v-for="(item, i) in pessoa[bloco.chave]" :key="i" :class="{ 'item-unita': ehUnita(bloco.chave, item) }">
                      <template v-if="ehUnita(bloco.chave, item)">
                        <span class="unita-emblema" aria-hidden="true"><span></span><span></span><span></span></span>
                        <span class="unita-corpo">
                          <span class="unita-titulo">{{ partesUnita(item)[0] }}</span>
                          <span class="unita-resto">{{ partesUnita(item)[1] }}</span>
                        </span>
                      </template>
                      <template v-else>{{ item }}</template>
                    </li>
                  </ul>
                  <p v-else class="card-vazio">Em breve.</p>
                </div>
              </template>
            </div>

            <a
              v-if="pessoa.linkedin"
              :href="pessoa.linkedin"
              target="_blank"
              rel="noopener"
              class="card-linkedin"
            >
              <IconeContato tipo="linkedin" :size="14" />
              LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.card-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 26, 0.6);
  z-index: 200;
}

/* ── Palco: a foto entra primeiro; o cartão de informações é puxado
   de trás dela, horizontalmente para a direita. ── */
.palco {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 201;
  display: flex;
  align-items: flex-start;
  width: min(900px, calc(100vw - 48px));
}

.palco-foto {
  position: relative;
  z-index: 2;
  flex: 0 0 clamp(260px, 38%, 360px);
  aspect-ratio: 4 / 5;
  background: var(--branco);
  border-radius: 6px 0 0 6px;
  overflow: hidden;
  box-shadow: 18px 0 38px -14px rgba(0, 0, 0, 0.45);
  animation: foto-entra 0.5s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

.palco-foto picture,
.palco-foto img {
  display: block;
  width: 100%;
  height: 100%;
}

.palco-foto img {
  object-fit: cover;
  object-position: center top;
}

.palco-iniciais {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 64px;
  letter-spacing: 0.04em;
  color: var(--sage-texto);
}

.palco-gaveta {
  position: relative;
  z-index: 1;
  align-self: stretch;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  border-radius: 0 6px 6px 0;
}

.palco-info {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding: clamp(28px, 4vw, 44px);
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--branco);
  animation: info-desliza 0.75s 0.28s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

@keyframes foto-entra {
  from {
    opacity: 0;
    transform: scale(0.94) translateX(-12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes info-desliza {
  from {
    transform: translateX(-102%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes info-desce {
  from {
    transform: translateY(-102%);
  }
  to {
    transform: translateY(0);
  }
}

.palco-enter-active {
  transition: opacity 0.2s ease;
}

.palco-leave-active {
  transition: opacity 0.15s ease;
}

.palco-enter-from,
.palco-leave-to {
  opacity: 0;
}

.card-fechar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  font-family: var(--font-titulo);
  font-size: 22px;
  color: var(--verde);
  line-height: 1;
  transition: transform 0.35s cubic-bezier(0.22, 0.8, 0.2, 1), background 0.2s ease,
    border-color 0.2s ease;
}

.card-fechar:hover {
  transform: rotate(90deg);
  background: var(--fundo-sutil);
  border-color: var(--borda);
}

.card-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.92);
  color: var(--verde);
  font-family: var(--font-titulo);
  font-size: 18px;
  z-index: 202;
  box-shadow: 0 8px 20px -8px rgba(26, 26, 26, 0.4);
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.25s ease;
}

.card-nav:hover {
  background: var(--verde);
  color: var(--branco);
  box-shadow: 0 12px 26px -10px rgba(26, 26, 26, 0.55);
}

.card-nav--esq {
  left: max(16px, calc(50% - min(900px, calc(100vw - 48px)) / 2 - 64px));
}

.card-nav--dir {
  right: max(16px, calc(50% - min(900px, calc(100vw - 48px)) / 2 - 64px));
}

.card-nav--esq:hover {
  transform: translateY(-50%) translateX(-3px);
}

.card-nav--dir:hover {
  transform: translateY(-50%) translateX(3px);
}

.card-cargo {
  margin-bottom: 2px;
  padding-right: 40px;
}

.card-nome {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(22px, 2.6vw, 30px);
  line-height: 1.25;
  color: var(--verde);
}

.card-secoes {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 18px 0 22px;
}

.card-secao .label-caps {
  display: inline-block;
  background: var(--verde);
  color: var(--branco);
  font-weight: 700;
  font-size: 12px;
  padding: 5px 11px;
  margin-bottom: 10px;
}

.card-secao p {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--texto-sec);
}

.card-vazio {
  font-style: italic;
  color: var(--sage-texto) !important;
}

.card-lista {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-lista li {
  position: relative;
  padding-left: 16px;
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--texto-sec);
}

.card-lista li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  background: var(--verde);
}

.card-lista li.item-unita {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 16px;
  margin: 6px 0;
  padding: 18px 20px;
  background: var(--verde);
  color: #fff;
}

.card-lista li.item-unita::before {
  display: none;
}

.unita-emblema {
  position: relative;
  display: block;
  width: 40px;
  height: 40px;
  color: #fff;
}

.unita-emblema span {
  position: absolute;
  border: 1px solid currentColor;
  transition: transform 0.9s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.unita-emblema span:nth-child(1) { inset: 0; }
.unita-emblema span:nth-child(2) { inset: 18%; transform: rotate(8deg); }
.unita-emblema span:nth-child(3) { inset: 36%; background: currentColor; transform: rotate(16deg); }

.item-unita:hover .unita-emblema span:nth-child(2) { transform: rotate(-8deg); }
.item-unita:hover .unita-emblema span:nth-child(3) { transform: rotate(-16deg); }

.unita-corpo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.unita-titulo {
  font-family: var(--font-titulo);
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.06em;
  line-height: 1.3;
  color: #fff;
}

.unita-resto {
  font-family: var(--font-corpo);
  font-size: 14.5px;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
}

.card-linkedin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  font-family: var(--font-corpo);
  min-height: 46px;
  font-size: 14px;
  font-weight: 600;
  color: var(--verde);
  border: 1px solid var(--verde);
  border-radius: var(--raio);
  padding: 0 24px;
  transition: background 0.25s ease, color 0.25s ease;
}

.card-linkedin:hover {
  background: var(--verde);
  color: var(--branco);
}

.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.25s ease;
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
}

/* Mobile: foto no topo; o cartão desce de trás dela */
@media (max-width: 700px) {
  .palco {
    flex-direction: column;
    align-items: center;
    width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
  }

  .palco-foto {
    flex: 0 0 auto;
    width: min(220px, 55vw);
    border-radius: 6px 6px 0 0;
    box-shadow: 0 18px 30px -14px rgba(0, 0, 0, 0.45);
  }

  .palco-gaveta {
    flex: 0 1 auto;
    width: 100%;
    min-height: 0;
    border-radius: 0 0 6px 6px;
  }

  .palco-info {
    position: relative;
    inset: auto;
    max-height: 46vh;
    animation-name: info-desce;
  }

  .card-fechar {
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
  }

  .card-nav {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .palco-foto,
  .palco-info {
    animation: none;
  }
}
</style>
