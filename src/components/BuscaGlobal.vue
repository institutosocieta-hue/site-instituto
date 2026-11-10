<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { buscar, ROTULOS } from '../utils/busca.js'

const router = useRouter()
const aberta = ref(false)
const termo = ref('')
const campo = ref(null)
const ativo = ref(0)
let anterior = null

const grupos = computed(() => buscar(termo.value))
// lista plana na ordem exibida, para navegar com as setas
const planos = computed(() => Object.values(grupos.value).flat())
const total = computed(() => planos.value.length)

function abrir() {
  anterior = document.activeElement
  termo.value = ''
  ativo.value = 0
  aberta.value = true
  nextTick(() => campo.value?.focus())
}

function fechar() {
  aberta.value = false
  if (anterior && typeof anterior.focus === 'function') anterior.focus({ preventScroll: true })
}

function ir(item) {
  fechar()
  router.push(item.to)
}

function aoPressionar(e) {
  const digitando = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
  if (e.key === '/' && !aberta.value && !digitando) {
    e.preventDefault()
    abrir()
    return
  }
  if (!aberta.value) return
  if (e.key === 'Escape') fechar()
  else if (e.key === 'ArrowDown') {
    e.preventDefault()
    ativo.value = total.value ? (ativo.value + 1) % total.value : 0
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    ativo.value = total.value ? (ativo.value - 1 + total.value) % total.value : 0
  } else if (e.key === 'Enter' && planos.value[ativo.value]) {
    e.preventDefault()
    ir(planos.value[ativo.value])
  }
}

watch(termo, () => (ativo.value = 0))

onMounted(() => {
  window.addEventListener('abrir-busca', abrir)
  window.addEventListener('keydown', aoPressionar)
})
onUnmounted(() => {
  window.removeEventListener('abrir-busca', abrir)
  window.removeEventListener('keydown', aoPressionar)
})

function indiceGlobal(grupo, i) {
  let antes = 0
  for (const chave of Object.keys(grupos.value)) {
    if (chave === grupo) break
    antes += grupos.value[chave].length
  }
  return antes + i
}
</script>

<template>
  <Teleport to="body">
    <transition name="busca-fade">
      <div class="busca-fundo" v-if="aberta" @click="fechar"></div>
    </transition>

    <transition name="busca-desce">
      <div class="busca" v-if="aberta" role="dialog" aria-label="Buscar no site">
        <div class="busca-campo">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5L21 21" />
          </svg>
          <input
            ref="campo"
            v-model="termo"
            type="search"
            class="busca-input"
            placeholder="Buscar membros, notícias, edições e páginas"
            aria-label="Buscar no site"
            autocomplete="off"
          />
          <button class="busca-fechar" @click="fechar" aria-label="Fechar busca">×</button>
        </div>

        <div class="busca-resultados">
          <template v-for="(lista, grupo) in grupos" :key="grupo">
            <section class="busca-grupo" v-if="lista.length">
              <h3 class="busca-titulo">{{ termo ? ROTULOS[grupo] : 'Páginas principais' }}</h3>
              <ul>
                <li v-for="(item, i) in lista" :key="item.to + item.titulo">
                  <button
                    class="busca-item"
                    :class="{ ativo: indiceGlobal(grupo, i) === ativo }"
                    @click="ir(item)"
                    @mousemove="ativo = indiceGlobal(grupo, i)"
                  >
                    <span class="busca-item-titulo">{{ item.titulo }}</span>
                    <span class="busca-item-detalhe" v-if="item.detalhe">{{ item.detalhe }}</span>
                    <span class="busca-item-seta" aria-hidden="true">→</span>
                  </button>
                </li>
              </ul>
            </section>
          </template>

          <p class="busca-vazio" v-if="termo && !total">Nenhum resultado para “{{ termo }}”.</p>
        </div>

        <p class="busca-dica">↑ ↓ para navegar · Enter para abrir · Esc para fechar</p>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.busca-fundo {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(26, 26, 26, 0.55);
}

.busca {
  position: fixed;
  top: clamp(24px, 10vh, 96px);
  left: 50%;
  z-index: 301;
  transform: translateX(-50%);
  width: min(760px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  background: var(--branco);
  border-radius: 6px;
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.busca-campo {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 12px 0 22px;
  border-bottom: 2px solid var(--verde);
  color: var(--verde);
}

.busca-input {
  flex: 1;
  min-width: 0;
  height: 68px;
  border: none;
  background: none;
  font-family: var(--font-titulo);
  font-size: 20px;
  color: var(--verde);
}

.busca-input:focus {
  outline: none;
}

.busca-input::placeholder {
  font-family: var(--font-corpo);
  font-size: 16px;
  color: var(--sage-texto);
}

.busca-fechar {
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  font-family: var(--font-titulo);
  font-size: 24px;
  color: var(--verde);
  transition: transform 0.35s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.busca-fechar:hover {
  transform: rotate(90deg);
}

.busca-resultados {
  overflow-y: auto;
  padding: 8px 0 12px;
}

.busca-titulo {
  padding: 16px 22px 8px;
  font-family: var(--font-titulo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.busca-item {
  display: flex;
  align-items: baseline;
  gap: 14px;
  width: 100%;
  padding: 12px 22px;
  background: none;
  border: none;
  border-left: 3px solid transparent;
  text-align: left;
  color: var(--verde);
  transition: background 0.2s ease, border-color 0.2s ease, padding-left 0.3s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.busca-item.ativo {
  background: var(--fundo-sutil);
  border-left-color: var(--verde);
  padding-left: 28px;
}

.busca-item-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 16px;
  line-height: 1.4;
}

.busca-item-detalhe {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-corpo);
  font-size: 13px;
  color: var(--sage-texto);
}

.busca-item-seta {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.3s ease;
}

.busca-item.ativo .busca-item-seta {
  opacity: 1;
  transform: translateX(4px);
}

.busca-vazio {
  padding: 28px 22px;
  font-family: var(--font-corpo);
  font-style: italic;
  color: var(--texto-sec);
}

.busca-dica {
  padding: 10px 22px;
  border-top: 1px solid var(--borda);
  font-family: var(--font-corpo);
  font-size: 12px;
  color: var(--sage-texto);
}

.busca-fade-enter-active,
.busca-fade-leave-active {
  transition: opacity 0.25s ease;
}

.busca-fade-enter-from,
.busca-fade-leave-to {
  opacity: 0;
}

.busca-desce-enter-active,
.busca-desce-leave-active {
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.busca-desce-enter-from,
.busca-desce-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-16px);
}

@media (max-width: 600px) {
  .busca-item-detalhe {
    display: none;
  }

  .busca-dica {
    display: none;
  }
}
</style>
