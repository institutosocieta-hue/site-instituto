<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PessoaCartao from './PessoaCartao.vue'

const props = defineProps({
  // membros efetivos já preparados (nome, foto, ingresso, funcao, cargo, linkedin, …)
  efetivos: { type: Array, required: true },
  // [{ nome, ingresso }]
  transitorios: { type: Array, required: true },
})

const emit = defineEmits(['abrir'])

const route = useRoute()
const router = useRouter()

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const filtro = reactive({ q: '', letra: '', categoria: '', ingresso: '', funcao: '' })

const normalizar = (t) =>
  (t || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

const inicial = (nome) => normalizar(nome).charAt(0).toUpperCase()

const todos = computed(() => [
  ...props.efetivos.map((m) => ({ ...m, categoria: 'efetivo' })),
  ...props.transitorios.map((t) => ({ ...t, categoria: 'transitorio', funcao: 'Membro', cargo: null })),
])

// ── contagens para os filtros (sobre o total) ──
function contar(chave) {
  const mapa = {}
  for (const m of todos.value) mapa[m[chave]] = (mapa[m[chave]] || 0) + 1
  return mapa
}
const contagemCategoria = computed(() => contar('categoria'))
const contagemIngresso = computed(() => contar('ingresso'))
const contagemFuncao = computed(() => contar('funcao'))
const ingressos = computed(() => Object.keys(contagemIngresso.value).sort().reverse())
const funcoes = computed(() => ['Diretoria', 'Coordenação', 'Membro'].filter((f) => contagemFuncao.value[f]))

function aprovado(m, ignorarLetra = false) {
  if (filtro.q) {
    const alvo = normalizar(`${m.nome} ${m.completo || ''}`)
    if (!normalizar(filtro.q).split(/\s+/).every((p) => alvo.includes(p))) return false
  }
  if (!ignorarLetra && filtro.letra && inicial(m.nome) !== filtro.letra) return false
  if (filtro.categoria && m.categoria !== filtro.categoria) return false
  if (filtro.ingresso && m.ingresso !== filtro.ingresso) return false
  if (filtro.funcao && m.funcao !== filtro.funcao) return false
  return true
}

const filtrados = computed(() => todos.value.filter((m) => aprovado(m)))
const efetivosFiltrados = computed(() =>
  filtrados.value.filter((m) => m.categoria === 'efetivo').sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
)
const transitoriosFiltrados = computed(() =>
  filtrados.value.filter((m) => m.categoria === 'transitorio').sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
)
const letrasDisponiveis = computed(
  () => new Set(todos.value.filter((m) => aprovado(m, true)).map((m) => inicial(m.nome)))
)
const temFiltro = computed(() => Object.values(filtro).some(Boolean))

function limpar() {
  Object.assign(filtro, { q: '', letra: '', categoria: '', ingresso: '', funcao: '' })
}

function iniciais(nome) {
  const partes = nome.split(' ')
  return partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')
}

// ── estado na URL (?q=&letra=&categoria=&ingresso=&funcao=) ──
const CHAVES = Object.keys(filtro)

onMounted(() => {
  for (const chave of CHAVES) if (typeof route.query[chave] === 'string') filtro[chave] = route.query[chave]
  if (route.query.q && route.hash === '#quadro-membros') {
    document.getElementById('quadro-membros')?.scrollIntoView({ block: 'start' })
  }
})

// busca global ou link externo mudando a URL com o diretório já aberto
watch(
  () => route.query,
  (query) => {
    for (const chave of CHAVES) {
      const valor = typeof query[chave] === 'string' ? query[chave] : ''
      if (filtro[chave] !== valor) filtro[chave] = valor
    }
    if (query.q) document.getElementById('quadro-membros')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
)

watch(filtro, () => {
  const query = { ...route.query }
  for (const chave of CHAVES) {
    if (filtro[chave]) query[chave] = filtro[chave]
    else delete query[chave]
  }
  router.replace({ path: route.path, query, hash: route.hash })
})
</script>

<template>
  <div class="diretorio">
    <form class="dir-busca" role="search" @submit.prevent>
      <label class="dir-rotulo" for="dir-nome">Buscar por nome</label>
      <div class="dir-campo">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5L21 21" />
        </svg>
        <input id="dir-nome" v-model="filtro.q" type="search" placeholder="Nome ou sobrenome" autocomplete="off" />
        <button v-if="filtro.q" type="button" class="dir-limpar-campo" aria-label="Limpar busca" @click="filtro.q = ''">×</button>
      </div>
    </form>

    <div class="dir-letras" role="group" aria-label="Inicial do nome">
      <span class="dir-letras-rotulo">Inicial do nome</span>
      <button class="letra letra--todas" :class="{ ativa: !filtro.letra }" :aria-pressed="!filtro.letra" @click="filtro.letra = ''">Todas</button>
      <button
        v-for="l in LETRAS"
        :key="l"
        class="letra"
        :class="{ ativa: filtro.letra === l }"
        :disabled="!letrasDisponiveis.has(l)"
        :aria-pressed="filtro.letra === l"
        @click="filtro.letra = filtro.letra === l ? '' : l"
      >
        {{ l }}
      </button>
    </div>

    <div class="dir-filtros">
      <label class="dir-select">
        <span>Categoria</span>
        <select v-model="filtro.categoria">
          <option value="">Todos ({{ todos.length }})</option>
          <option value="efetivo">Efetivos ({{ contagemCategoria.efetivo || 0 }})</option>
          <option value="transitorio">Transitórios ({{ contagemCategoria.transitorio || 0 }})</option>
        </select>
      </label>

      <label class="dir-select">
        <span>Ingresso</span>
        <select v-model="filtro.ingresso">
          <option value="">Todos os semestres</option>
          <option v-for="i in ingressos" :key="i" :value="i">{{ i }} ({{ contagemIngresso[i] }})</option>
        </select>
      </label>

      <label class="dir-select">
        <span>Função</span>
        <select v-model="filtro.funcao">
          <option value="">Todas</option>
          <option v-for="f in funcoes" :key="f" :value="f">{{ f }} ({{ contagemFuncao[f] }})</option>
        </select>
      </label>

      <button class="dir-limpar" :disabled="!temFiltro" @click="limpar">Limpar filtros</button>
    </div>

    <p class="dir-contagem" aria-live="polite">
      {{ filtrados.length }} {{ filtrados.length === 1 ? 'membro' : 'membros' }}
    </p>

    <section v-if="efetivosFiltrados.length" class="dir-grupo">
      <h4 class="dir-grupo-titulo" v-if="!filtro.categoria">Efetivos <span>{{ efetivosFiltrados.length }}</span></h4>
      <ul class="membros-grade grade-stagger">
        <li class="membro" v-for="m in efetivosFiltrados" :key="m.nome" v-reveal>
          <PessoaCartao
            :pessoa="m"
            :legenda="m.nucleo || ''"
            @abrir="emit('abrir', m, efetivosFiltrados)"
          />
        </li>
      </ul>
    </section>

    <section v-if="transitoriosFiltrados.length" class="dir-grupo">
      <h4 class="dir-grupo-titulo" v-if="!filtro.categoria">Transitórios <span>{{ transitoriosFiltrados.length }}</span></h4>
      <ul class="transitorios-lista grade-stagger">
        <li v-for="t in transitoriosFiltrados" :key="t.nome" v-reveal>
          <span>{{ t.nome }}</span>
          <span class="transitorio-semestre">{{ t.ingresso }}</span>
        </li>
      </ul>
    </section>

    <div class="dir-vazio" v-if="!filtrados.length">
      <p>Nenhum membro encontrado.</p>
      <button class="btn-secundario" @click="limpar">Limpar filtros</button>
    </div>
  </div>
</template>

<style scoped>
.diretorio {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* busca */
.dir-rotulo {
  display: block;
  margin-bottom: 10px;
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.dir-campo {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 8px 0 18px;
  background: var(--branco);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  color: var(--verde);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.dir-campo:focus-within {
  border-color: var(--verde);
  box-shadow: 0 0 0 1px var(--verde);
}

.dir-campo input {
  flex: 1;
  min-width: 0;
  height: 56px;
  border: none;
  background: none;
  font-family: var(--font-corpo);
  font-size: 17px;
  color: var(--verde);
}

.dir-campo input:focus {
  outline: none;
}

.dir-limpar-campo {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  font-family: var(--font-titulo);
  font-size: 22px;
  color: var(--verde);
}

/* A–Z */
.dir-letras {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.dir-letras-rotulo {
  flex: 0 0 100%;
  margin-bottom: 6px;
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.letra {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  background: none;
  border: 1px solid transparent;
  border-radius: var(--raio);
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 14px;
  color: var(--verde);
  transition: color 0.3s ease, border-color 0.3s ease;
}

.letra::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--verde);
  transform: translateY(101%);
  transition: transform 0.35s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.letra:hover:not(:disabled),
.letra.ativa {
  color: var(--branco);
}

.letra:hover:not(:disabled)::before,
.letra.ativa::before {
  transform: none;
}

.letra:disabled {
  color: var(--borda);
  cursor: default;
}

.letra--todas {
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-right: 8px;
  border-color: var(--borda);
}

/* filtros */
.dir-filtros {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
}

.dir-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 200px;
  max-width: 260px;
}

.dir-select span {
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.dir-select select {
  height: 48px;
  padding: 0 40px 0 14px;
  appearance: none;
  background: var(--branco)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23324b30' stroke-width='1.6'/%3E%3C/svg%3E")
    no-repeat right 16px center;
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  font-family: var(--font-corpo);
  font-size: 15px;
  color: var(--verde);
  cursor: pointer;
  transition: border-color 0.25s ease;
}

.dir-select select:hover,
.dir-select select:focus {
  border-color: var(--verde);
}

.dir-limpar {
  height: 48px;
  padding: 0 4px;
  background: none;
  border: none;
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 700;
  color: var(--verde);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.dir-limpar:disabled {
  opacity: 0.35;
  text-decoration: none;
  cursor: default;
}

.dir-contagem {
  padding-top: 14px;
  border-top: 1px solid var(--verde);
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--texto-sec);
}

/* resultados */
.dir-grupo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dir-grupo-titulo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 20px;
  color: var(--verde);
}

.dir-grupo-titulo span {
  padding: 3px 10px;
  background: var(--verde);
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 700;
  color: var(--branco);
}

.membros-grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 32px 20px;
}

.transitorios-lista {
  columns: 3 260px;
  column-gap: 48px;
}

.transitorios-lista li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  break-inside: avoid;
  padding: 12px 0;
  border-bottom: 1px solid var(--borda);
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.5;
  color: var(--texto-corpo);
  transition: padding-left 0.3s cubic-bezier(0.22, 0.8, 0.2, 1), color 0.2s ease,
    border-color 0.2s ease;
}

.transitorios-lista li:hover {
  padding-left: 10px;
  color: var(--verde);
  border-bottom-color: var(--verde);
}

.transitorio-semestre {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--sage-texto);
}

.dir-vazio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 32px 0;
}

.dir-vazio p {
  font-family: var(--font-corpo);
  font-size: 20px;
  color: var(--verde);
}

@media (max-width: 768px) {
  .membros-grade {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px 12px;
  }

  .dir-select {
    flex: 1 1 100%;
    max-width: none;
  }

  .letra {
    min-width: 32px;
    height: 32px;
  }
}
</style>
