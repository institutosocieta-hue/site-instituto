<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { edicoes } from '../../data/edicoes.js'
import CapaEdicao from '../../components/CapaEdicao.vue'
import ListaTrabalhos from '../../components/ListaTrabalhos.vue'

const route = useRoute()

const edicao = computed(() =>
  edicoes.find((e) => String(e.numero) === route.params.numero)
)

const edicaoAnterior = computed(() => {
  if (!edicao.value) return null
  return edicoes.find((e) => e.numero === edicao.value.numero - 1) || null
})

const edicaoSeguinte = computed(() => {
  if (!edicao.value) return null
  return edicoes.find((e) => e.numero === edicao.value.numero + 1) || null
})

const gruposPorNucleo = computed(() => {
  if (!edicao.value) return []
  const grupos = []
  edicao.value.trabalhos?.forEach((trabalho) => {
    const nucleo = trabalho.nucleo || edicao.value.nucleo
    let grupo = grupos.find((g) => g.nucleo === nucleo)
    if (!grupo) {
      grupo = { nucleo, trabalhos: [] }
      grupos.push(grupo)
    }
    grupo.trabalhos.push(trabalho)
  })
  return grupos
})

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>

<template>
  <div class="pagina" v-if="edicao">
    <nav class="breadcrumb">
      <router-link to="/revista/edicoes">Edições</router-link>
      <span>/</span>
      <span>Edição {{ edicao.numero }}</span>
    </nav>

    <div class="detalhe-grid">
      <div class="detalhe-coluna-esquerda">
        <span class="detalhe-capa-meta">
          Edição Nº {{ String(edicao.numero).padStart(2, '0') }}
          <template v-if="edicao.dataPublicacao"> · {{ formatarData(edicao.dataPublicacao) }}</template>
        </span>
        <div class="detalhe-capa">
          <CapaEdicao :capa="edicao.capa" :alt="`Capa da edição ${edicao.numero}`" />
        </div>

        <a
          v-if="edicao.linkDrive"
          :href="edicao.linkDrive"
          target="_blank"
          rel="noopener"
          class="btn-primario"
        >
          Baixar edição completa →
        </a>
        <span v-else class="btn-primario desabilitado">Em breve</span>
      </div>

      <div class="detalhe-corpo">
        <span class="detalhe-tag">
          NÚCLEO DE {{ edicao.nucleo.toUpperCase() }} · {{ edicao.semestre }} · EDIÇÃO
          {{ edicao.numero }}
        </span>

        <span class="detalhe-linha-pesquisa" v-if="edicao.linhaPesquisa">
          {{ edicao.linhaPesquisa }}
        </span>

        <span class="detalhe-coordenacao" v-if="edicao.coordenacao">
          Coordenação: {{ edicao.coordenacao }}
        </span>

        <span class="detalhe-contagem">
          {{ edicao.trabalhos?.length || 0 }} trabalhos<template v-if="edicao.issn"> · ISSN {{ edicao.issn }}</template>
        </span>

        <h1 class="detalhe-chamada">{{ edicao.chamada }}</h1>

        <p class="detalhe-subtitulo">{{ edicao.subtitulo }}</p>

        <p class="detalhe-conexao" v-if="edicao.textoConexao">{{ edicao.textoConexao }}</p>
      </div>
    </div>

    <section class="artigos-secao" v-if="edicao.trabalhos?.length">
      <span class="label-caps secao-rotulo">Trabalhos desta edição</span>

      <div class="sumario-grupo" v-for="grupo in gruposPorNucleo" :key="grupo.nucleo">
        <h2 class="sumario-nucleo">Núcleo de {{ grupo.nucleo }}</h2>
        <ListaTrabalhos :trabalhos="grupo.trabalhos" />
      </div>
    </section>

    <nav class="navegacao-edicoes">
      <router-link
        v-if="edicaoAnterior"
        :to="`/revista/edicoes/${edicaoAnterior.numero}`"
        class="navegacao-link"
      >
        ← Edição anterior
      </router-link>
      <span v-else></span>
      <router-link
        v-if="edicaoSeguinte"
        :to="`/revista/edicoes/${edicaoSeguinte.numero}`"
        class="navegacao-link navegacao-link--direita"
      >
        Próxima edição →
      </router-link>
    </nav>
  </div>

  <div class="pagina" v-else>
    <p class="label-caps">Edição não encontrada.</p>
    <router-link
      to="/revista/edicoes"
      class="btn-secundario"
      style="margin-top: 16px; display: inline-block"
    >
      ← Voltar às edições
    </router-link>
  </div>
</template>

<style scoped>
.pagina {
  gap: clamp(40px, 6vw, 64px);
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

.detalhe-grid {
  display: grid;
  grid-template-columns: minmax(180px, 260px) 1fr;
  gap: clamp(28px, 5vw, 56px);
}

.detalhe-coluna-esquerda {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detalhe-capa-meta {
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sage-texto);
  font-weight: 600;

}

.detalhe-capa :deep(.capa) {
  box-shadow: 0 22px 34px -16px rgba(50, 75, 48, 0.4);
}

.detalhe-tag {
  display: inline-block;
  font-family: var(--font-corpo);
  font-size: 12px;
  color: var(--sage-texto);
  border: 1px solid var(--borda);
  padding: 6px 12px;
  border-radius: var(--raio);
  margin-bottom: 20px;
  letter-spacing: 0.1em;
  font-weight: 600;

}

.detalhe-linha-pesquisa {
  display: block;
  font-family: var(--font-corpo);
  font-style: italic;
  font-size: 15.5px;
  color: var(--texto-sec);
  margin-bottom: 8px;
}

.detalhe-coordenacao {
  display: block;
  font-family: var(--font-corpo);
  font-size: 14px;
  color: var(--sage-texto);
  margin-bottom: 24px;
}

.detalhe-chamada {
  font-family: var(--font-titulo);
  font-size: clamp(22px, 2.4vw, 30px);
  color: var(--verde);
  line-height: 1.35;
  margin-bottom: 20px;
  font-weight: 600;

}

.detalhe-subtitulo {
  font-family: var(--font-corpo);
  font-size: 16px;
  color: var(--texto-sec);
  max-width: 620px;
  line-height: 1.7;
  margin-bottom: 16px;
}

.detalhe-conexao {
  font-family: var(--font-corpo);
  font-size: 17px;
  color: var(--texto-corpo);
  max-width: 620px;
  line-height: 1.8;
}

.artigos-secao {
}

.navegacao-edicoes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid var(--borda);
}

.navegacao-link {
  font-family: var(--font-corpo);
  font-size: 15px;
  color: var(--verde);
  font-weight: 600;
  min-height: 44px;
  display: inline-flex;
  align-items: center;

}

.navegacao-link:hover {
  opacity: 0.7;
}

.navegacao-link--direita {
  margin-left: auto;
}

@media (max-width: 768px) {
  .detalhe-grid {
    grid-template-columns: 1fr;
  }

  .detalhe-coluna-esquerda {
    max-width: 200px;
  }
}

.detalhe-contagem {
  display: block;
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
  margin-bottom: 24px;
}

.sumario-grupo + .sumario-grupo {
  margin-top: 40px;
}

.sumario-nucleo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(20px, 2vw, 24px);
  line-height: 1.3;
  color: var(--verde);
  margin-bottom: 20px;
}
</style>
