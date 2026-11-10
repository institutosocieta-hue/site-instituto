<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { edicoes } from '../../data/edicoes.js'

const route = useRoute()

const encontrado = computed(() => {
  for (const edicao of edicoes) {
    const indice = (edicao.trabalhos || []).findIndex((t) => t.slug === route.params.slug)
    if (indice >= 0) return { edicao, indice, trabalho: edicao.trabalhos[indice] }
  }
  return null
})

const trabalho = computed(() => encontrado.value?.trabalho || null)
const edicao = computed(() => encontrado.value?.edicao || null)

const anterior = computed(() => {
  if (!encontrado.value || encontrado.value.indice === 0) return null
  return edicao.value.trabalhos[encontrado.value.indice - 1]
})

const seguinte = computed(() => {
  if (!encontrado.value) return null
  return edicao.value.trabalhos[encontrado.value.indice + 1] || null
})

const autores = computed(() => {
  if (!trabalho.value) return []
  return trabalho.value.autores?.length ? trabalho.value.autores : [trabalho.value.autor].filter(Boolean)
})

const nucleo = computed(() => trabalho.value?.nucleo || edicao.value?.nucleo)

const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']

function autorAbnt(nome) {
  if (nome.trim().startsWith('[')) return nome.trim()
  const partes = nome.trim().split(/\s+/)
  if (partes.length < 2) return nome.toUpperCase()
  const sobrenome = partes[partes.length - 1].toUpperCase()
  return `${sobrenome}, ${partes.slice(0, -1).join(' ')}`
}

const urlAtual = computed(() => (typeof window !== 'undefined' ? window.location.href : ''))

const citacao = computed(() => {
  if (!trabalho.value) return ''
  const hoje = new Date()
  const acesso = `${hoje.getDate()} ${MESES[hoje.getMonth()]} ${hoje.getFullYear()}`
  const ano = edicao.value.semestre.split('/')[0]
  const autoresAbnt = autores.value.map(autorAbnt).join('; ')
  return `${autoresAbnt}. ${trabalho.value.titulo}. QuotaParte: Revista do Instituto Società, edição ${edicao.value.numero}, ${edicao.value.semestre}, ${ano}. Disponível em: ${urlAtual.value}. Acesso em: ${acesso}.`
})

const copiado = ref(false)
async function copiarCitacao() {
  try {
    await navigator.clipboard.writeText(citacao.value)
    copiado.value = true
    setTimeout(() => (copiado.value = false), 2000)
  } catch {
    copiado.value = false
  }
}
</script>

<template>
  <div class="pagina trabalho-pagina" v-if="trabalho">
    <nav class="breadcrumb" aria-label="Trilha de navegação">
      <router-link to="/revista/edicoes">Edições</router-link>
      <span>/</span>
      <router-link :to="`/revista/edicoes/${edicao.numero}`">Edição {{ edicao.numero }}</router-link>
    </nav>

    <article class="trabalho-leitura">
      <header class="trabalho-cabecalho">
        <span class="trabalho-meta">
          Núcleo de {{ nucleo }} · {{ edicao.semestre }} · Edição
          {{ String(edicao.numero).padStart(2, '0') }}
        </span>
        <h1 class="trabalho-titulo">{{ trabalho.titulo }}</h1>
        <p class="trabalho-autores">{{ autores.join(', ') }}</p>
      </header>

      <section class="trabalho-bloco" v-if="trabalho.resumo">
        <h2 class="trabalho-bloco-titulo">Resumo</h2>
        <p class="trabalho-texto">{{ trabalho.resumo }}</p>
      </section>

      <section class="trabalho-bloco" v-if="trabalho.palavrasChave?.length">
        <h2 class="trabalho-bloco-titulo">Palavras-chave</h2>
        <ul class="trabalho-palavras">
          <li v-for="palavra in trabalho.palavrasChave" :key="palavra">{{ palavra }}</li>
        </ul>
      </section>

      <p class="trabalho-texto trabalho-em-preparacao" v-if="!trabalho.resumo && !trabalho.pdf">
        Em preparação
      </p>

      <section class="trabalho-bloco no-print" v-if="trabalho.pdf">
        <iframe class="trabalho-pdf" :src="trabalho.pdf" :title="trabalho.titulo"></iframe>
        <a :href="trabalho.pdf" target="_blank" rel="noopener" class="btn-secundario">
          Baixar PDF →
        </a>
      </section>

      <section class="trabalho-bloco trabalho-citar">
        <h2 class="trabalho-bloco-titulo">Como citar</h2>
        <p class="trabalho-citacao">{{ citacao }}</p>
        <button type="button" class="btn-secundario no-print" @click="copiarCitacao">
          {{ copiado ? 'Copiado ✓' : 'Copiar citação' }}
        </button>
      </section>

      <p class="trabalho-url-impressao">{{ urlAtual }}</p>
    </article>

    <nav class="navegacao-trabalhos no-print" aria-label="Trabalhos da edição">
      <router-link
        v-if="anterior"
        :to="`/revista/trabalhos/${anterior.slug}`"
        class="navegacao-link"
      >
        ← Trabalho anterior
      </router-link>
      <span v-else></span>
      <router-link
        v-if="seguinte"
        :to="`/revista/trabalhos/${seguinte.slug}`"
        class="navegacao-link"
      >
        Próximo trabalho →
      </router-link>
    </nav>
  </div>

  <div class="pagina" v-else>
    <p class="label-caps">Edição não encontrada.</p>
    <router-link to="/revista/edicoes" class="btn-secundario">← Voltar às edições</router-link>
  </div>
</template>

<style scoped>
.trabalho-pagina {
  gap: clamp(32px, 5vw, 56px);
}

.breadcrumb {
  display: flex;
  gap: 8px;
  font-family: var(--font-corpo);
  font-size: 13px;
  color: var(--sage-texto);
}

.breadcrumb a:hover {
  color: var(--verde);
}

.trabalho-leitura {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.trabalho-cabecalho {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trabalho-meta {
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.trabalho-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(26px, 3.2vw, 38px);
  line-height: 1.25;
  color: var(--verde);
}

.trabalho-autores {
  font-family: var(--font-corpo);
  font-size: 17px;
  color: var(--texto-sec);
}

.trabalho-bloco {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
}

.trabalho-bloco-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 20px;
  color: var(--verde);
  padding-top: 20px;
  border-top: 1px solid var(--verde);
  width: 100%;
}

.trabalho-texto {
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.8;
  color: var(--texto-corpo);
}

.trabalho-em-preparacao {
  font-style: italic;
  color: var(--sage-texto);
}

.trabalho-palavras {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trabalho-palavras li {
  font-family: var(--font-corpo);
  font-size: 14px;
  color: var(--verde);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  padding: 6px 12px;
}

.trabalho-pdf {
  width: 100%;
  height: 70vh;
  border: 1px solid var(--borda);
  border-radius: var(--raio);
}

.trabalho-citacao {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--texto-sec);
  background: var(--fundo-sutil);
  padding: 18px 20px;
  border-radius: var(--raio);
  width: 100%;
  overflow-wrap: anywhere;
}

.navegacao-trabalhos {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--borda);
}

.navegacao-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-family: var(--font-corpo);
  font-size: 15px;
  font-weight: 600;
  color: var(--verde);
}

.navegacao-link:hover {
  opacity: 0.7;
}

.trabalho-url-impressao {
  display: none;
}
</style>

<style>
@media print {
  header.nav,
  footer.footer,
  .newsletter,
  .no-print,
  .breadcrumb {
    display: none !important;
  }

  body,
  .trabalho-leitura * {
    color: #000 !important;
    background: #fff !important;
  }

  .trabalho-leitura {
    max-width: none;
    font-size: 12pt;
  }

  .trabalho-leitura .trabalho-texto,
  .trabalho-leitura .trabalho-citacao,
  .trabalho-leitura .trabalho-autores {
    font-size: 12pt;
    line-height: 1.6;
  }

  .trabalho-leitura .trabalho-url-impressao {
    display: block;
    margin-top: 24px;
    font-size: 10pt;
    word-break: break-all;
  }
}
</style>
