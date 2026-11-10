<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { edicoes } from '../../data/edicoes.js'
import CapaEdicao from '../../components/CapaEdicao.vue'
import ListaTrabalhos from '../../components/ListaTrabalhos.vue'
import SubNavRevista from '../../components/SubNavRevista.vue'
import HeroVerde from '../../components/HeroVerde.vue'

const totalTrabalhos = computed(() =>
  edicoes.reduce((acc, ed) => acc + (ed.trabalhos?.length || 0), 0)
)

const route = useRoute()
const router = useRouter()

// Estado da busca e dos filtros fica nos query params (?q=&nucleo=&edicao=)
const busca = ref(String(route.query.q || ''))
const filtroNucleo = ref(String(route.query.nucleo || 'Todos'))
const filtroEdicao = ref(String(route.query.edicao || 'Todas'))

watch([busca, filtroNucleo, filtroEdicao], () => {
  router.replace({
    query: {
      q: busca.value.trim() || undefined,
      nucleo: filtroNucleo.value !== 'Todos' ? filtroNucleo.value : undefined,
      edicao: filtroEdicao.value !== 'Todas' ? filtroEdicao.value : undefined,
    },
  })
})

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const modoBusca = computed(() => busca.value.trim().length > 0)

const resultadosBusca = computed(() => {
  const termo = normalizar(busca.value.trim())
  if (!termo) return []
  return edicoes
    .filter((ed) => filtroEdicao.value === 'Todas' || String(ed.numero) === filtroEdicao.value)
    .map((ed) => ({
      edicao: ed,
      trabalhos: (ed.trabalhos || []).filter((t) => {
        const nucleo = t.nucleo || ed.nucleo
        if (filtroNucleo.value !== 'Todos' && nucleo !== filtroNucleo.value) return false
        const autores = t.autores?.length ? t.autores.join(' ') : t.autor
        const texto = normalizar([t.titulo, autores, (t.palavrasChave || []).join(' ')].join(' '))
        return texto.includes(termo)
      }),
    }))
    .filter((g) => g.trabalhos.length > 0)
})

const filtrosAtivos = computed(
  () => modoBusca.value || filtroNucleo.value !== 'Todos' || filtroEdicao.value !== 'Todas'
)

function limparFiltros() {
  busca.value = ''
  filtroNucleo.value = 'Todos'
  filtroEdicao.value = 'Todas'
}

const nucleosDisponiveis = computed(() => ['Todos', ...new Set(edicoes.map((e) => e.nucleo))])

const edicoesPorAno = computed(() => {
  const grupos = {}
  edicoes.forEach((ed) => {
    const ano = ed.semestre.split('/')[0]
    if (!grupos[ano]) grupos[ano] = []
    grupos[ano].push(ed)
  })
  return Object.entries(grupos)
    .sort(([a], [b]) => b - a)
    .map(([ano, eds]) => ({
      ano,
      edicoes: [...eds].sort((a, b) => b.numero - a.numero),
    }))
})

const anosFuturos = computed(() => {
  const anoAtual = new Date().getFullYear()
  const anosExistentes = edicoesPorAno.value.map((g) => Number(g.ano))
  const anoBase = anosExistentes.length ? Math.max(...anosExistentes, anoAtual) : anoAtual
  return [anoBase + 1, anoBase + 2]
})

const edicoesPorAnoFiltradas = computed(() =>
  edicoesPorAno.value
    .map((grupo) => ({
      ano: grupo.ano,
      edicoes: grupo.edicoes
        .filter((e) => filtroNucleo.value === 'Todos' || e.nucleo === filtroNucleo.value)
        .filter((e) => filtroEdicao.value === 'Todas' || String(e.numero) === filtroEdicao.value),
    }))
    .filter((grupo) => grupo.edicoes.length > 0)
)

function irParaAno(ano) {
  const el = document.getElementById(`ano-${ano}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="vista">
    <HeroVerde label="Edições" titulo="Todas as edições." sub="Arquivo completo da Revista QuotaParte, organizado por ano.">
      <div class="hero-numeros">
        <div class="hero-numero">
          <span class="hero-numero-valor">{{ String(edicoes.length).padStart(2, '0') }}</span>
          <span class="hero-numero-label">Edições publicadas</span>
        </div>
        <div class="hero-numero">
          <span class="hero-numero-valor">{{ String(totalTrabalhos).padStart(2, '0') }}</span>
          <span class="hero-numero-label">Trabalhos elaborados</span>
        </div>
      </div>
    </HeroVerde>

    <div class="pagina pagina--sobrepoe">
    <SubNavRevista />

    <div class="edicoes-conteudo">
    <form class="busca" role="search" @submit.prevent>
      <label class="busca-rotulo" for="busca-edicoes">Buscar</label>
      <input
        id="busca-edicoes"
        v-model="busca"
        type="search"
        class="busca-campo"
        placeholder="Título, autor ou palavra-chave"
        autocomplete="off"
      />
    </form>

    <div class="filtro-nucleos" v-if="edicoes.length > 1">
      <span class="label-caps">Filtrar por edição</span>
      <div class="filtro-pills">
        <button
          type="button"
          class="pill-filtro"
          :class="{ ativo: filtroEdicao === 'Todas' }"
          @click="filtroEdicao = 'Todas'"
        >
          Todas
        </button>
        <button
          v-for="ed in edicoes"
          :key="ed.numero"
          type="button"
          class="pill-filtro"
          :class="{ ativo: filtroEdicao === String(ed.numero) }"
          @click="filtroEdicao = String(ed.numero)"
        >
          Edição {{ String(ed.numero).padStart(2, '0') }}
        </button>
      </div>
    </div>

    <nav class="indice-anos" v-if="!modoBusca && edicoesPorAno.length">
      <button
        v-for="grupo in edicoesPorAno"
        :key="grupo.ano"
        class="pill-ano"
        @click="irParaAno(grupo.ano)"
      >
        {{ grupo.ano }}
      </button>
      <span v-for="ano in anosFuturos" :key="ano" class="pill-ano pill-ano--bloqueado">
        {{ ano }}
      </span>
    </nav>

    <div class="filtro-nucleos" v-if="nucleosDisponiveis.length > 2">
      <span class="label-caps">Filtrar por núcleo</span>
      <div class="filtro-pills">
        <button
          v-for="nome in nucleosDisponiveis"
          :key="nome"
          class="pill-filtro"
          :class="{ ativo: filtroNucleo === nome }"
          @click="filtroNucleo = nome"
        >
          {{ nome }}
        </button>
      </div>
    </div>

    <section v-if="modoBusca" class="resultados" aria-live="polite">
      <div v-for="grupo in resultadosBusca" :key="grupo.edicao.numero" class="resultados-grupo">
        <h2 class="resultados-titulo">
          Edição {{ String(grupo.edicao.numero).padStart(2, '0') }} · {{ grupo.edicao.semestre }}
        </h2>
        <ListaTrabalhos :trabalhos="grupo.trabalhos" />
      </div>
      <div class="resultados-vazio" v-if="!resultadosBusca.length">
        <p class="resultados-vazio-texto">Nenhum trabalho encontrado</p>
        <button type="button" class="btn-secundario" @click="limparFiltros">Limpar filtros</button>
      </div>
    </section>

    <template v-else>
    <section
      v-for="grupo in edicoesPorAnoFiltradas"
      :key="grupo.ano"
      :id="`ano-${grupo.ano}`"
      class="grupo-ano"
    >
      <div class="grupo-cabecalho">
        <h2 class="grupo-titulo">{{ grupo.ano }}</h2>
        <div class="grupo-linha"></div>
        <span class="grupo-contagem">{{ grupo.edicoes.length }} edições</span>
      </div>

      <div class="grade-edicoes grade-stagger">
        <router-link
          v-for="ed in grupo.edicoes"
          :key="ed.numero"
          :to="`/revista/edicoes/${ed.numero}`"
          class="card-edicao"
          v-reveal
        >
          <CapaEdicao :capa="ed.capa" :alt="`Capa da edição ${ed.numero}`" />
          <span class="card-titulo">{{ ed.chamada }}</span>
          <span class="card-nucleo">{{ ed.nucleo }}</span>
        </router-link>
      </div>
    </section>

    </template>

    <div class="resultados-vazio" v-if="!modoBusca && !edicoesPorAnoFiltradas.length">
      <p class="resultados-vazio-texto">Nenhuma edição encontrada para esse filtro.</p>
      <button type="button" class="btn-secundario" @click="limparFiltros">Limpar filtros</button>
    </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  position: relative;
}

.pagina::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/img/textura-clara.svg');
  background-size: cover;
  background-position: center top;
  opacity: 0.05;
  z-index: -1;
  pointer-events: none;
}

.hero-numeros {
  display: flex;
  gap: 32px;
  margin-top: 28px;
}

.hero-numero {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-numero-valor {
  font-family: var(--font-titulo);
  font-size: 28px;
  color: #fff;
}

.hero-numero-label {
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 600;

}

.indice-anos {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pill-ano {
  font-family: var(--font-corpo);
  font-size: 14px;
  color: var(--verde);
  background: var(--branco);
  border: 1px solid var(--borda);
  border-radius: 999px;
  padding: 0 20px;
  transition: border-color 0.15s ease, color 0.15s ease;
  min-height: 44px;

}

.pill-ano:hover {
  border-color: var(--verde);
  color: var(--verde);
}

.pill-ano--bloqueado {
  color: var(--sage-texto);
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
}

.filtro-nucleos {
  padding: 24px 0;
  border-top: 1px solid var(--borda);
  border-bottom: 1px solid var(--borda);
}

.filtro-pills {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.pill-filtro {
  font-family: var(--font-corpo);
  font-size: 13px;
  color: var(--verde);
  background: var(--branco);
  border: 1px solid var(--borda);
  border-radius: 999px;
  padding: 0 18px;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
  min-height: 44px;

}

.pill-filtro:hover {
  border-color: var(--verde);
}

.pill-filtro.ativo {
  background: var(--verde);
  border-color: var(--verde);
  color: var(--branco);
}

.grupo-ano {
  margin-bottom: 24px;
  scroll-margin-top: 100px;
}

.grupo-cabecalho {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.grupo-titulo {
  font-family: var(--font-titulo);
  font-size: clamp(24px, 2.4vw, 30px);
  color: var(--verde);
  white-space: nowrap;
  font-weight: 600;

}

.grupo-linha {
  flex: 1;
  height: 1px;
  background: var(--borda);
}

.grupo-contagem {
  font-family: var(--font-corpo);
  font-size: 13px;
  color: var(--sage-texto);
  white-space: nowrap;
}

/* Galeria: sempre 3 por linha, mas compacta — não estica para
   preencher a largura toda da página. */
.grade-edicoes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  gap: 24px;
  max-width: 900px;
}

.card-edicao {
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.2s ease;
}

.card-edicao :deep(.capa) {
  box-shadow: 0 18px 32px -12px rgba(50, 75, 48, 0.45);
  transition: box-shadow 0.25s ease;
}

.card-edicao:hover {
  transform: translateY(-4px);
}

.card-edicao:hover :deep(.capa) {
  box-shadow: 0 24px 38px -10px rgba(50, 75, 48, 0.5);
}

.card-titulo {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  color: var(--verde);
  margin-top: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;

}

.card-nucleo {
  font-family: var(--font-corpo);
  font-size: 12px;
  color: var(--sage-texto);
  font-weight: 600;
  letter-spacing: 0.08em;

}

@media (max-width: 768px) {
  .cabecalho {
    flex-direction: column;
    align-items: flex-start;
  }

  .cabecalho-numeros {
    align-self: stretch;
    justify-content: space-between;
  }

  .cabecalho-numero {
    align-items: flex-start;
  }
}

@media (max-width: 560px) {
  .grade-edicoes {
    grid-template-columns: 1fr;
    max-width: 240px;
  }
}

.busca {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 560px;
}

.busca-rotulo {
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.busca-campo {
  min-height: 52px;
  padding: 0 18px;
  font-family: var(--font-corpo);
  font-size: 17px;
  color: var(--verde);
  background: var(--branco);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
}

.busca-campo:focus {
  outline: 2px solid var(--verde);
  outline-offset: 2px;
  border-color: var(--verde);
}

.resultados {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.resultados-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(20px, 2vw, 24px);
  color: var(--verde);
  margin-bottom: 20px;
}

.resultados-vazio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 32px 0;
}

.resultados-vazio-texto {
  font-family: var(--font-corpo);
  font-size: 17px;
  color: var(--texto-sec);
}

.edicoes-conteudo {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
