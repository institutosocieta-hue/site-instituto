<script setup>
import { webp } from '../../utils/imagem.js'
import { computed, ref } from 'vue'
import HeroVerde from '../../components/HeroVerde.vue'
import SubNavRevista from '../../components/SubNavRevista.vue'
import CardFlash from '../../components/CardFlash.vue'
import { nucleosEmAndamento } from '../../data/nucleosEmAndamento.js'
import { nucleosPublicando } from '../../data/nucleosPublicando.js'
import { edicoes } from '../../data/edicoes.js'
import { pessoas } from '../../data/governanca.js'

const nucleosJaFormados = computed(() => {
  const nomes = new Set([
    ...nucleosPublicando.flatMap((g) => g.nucleos.map((n) => n.nome)),
    ...nucleosEmAndamento.nucleos.map((n) => n.nome),
  ])
  return nomes.size
})

const nucleosAtivos = computed(() => nucleosEmAndamento.nucleos.length)

const coordenadoresAtivos = computed(() => {
  const nomes = new Set(nucleosEmAndamento.nucleos.flatMap((n) => n.coordenadores || []))
  return Array.from(nomes)
})

const autoresPublicados = computed(() => {
  const nomes = new Set(edicoes.flatMap((ed) => ed.trabalhos?.map((t) => t.autor) || []))
  return nomes.size
})

const trabalhosPublicados = computed(() =>
  edicoes.reduce((acc, ed) => acc + (ed.trabalhos?.length || 0), 0)
)

const anosDeProducao = computed(() => {
  const anos = new Set([
    ...nucleosPublicando.map((g) => g.semestre.split('/')[0]),
    nucleosEmAndamento.semestre.split('/')[0],
  ])
  return anos.size
})

function fotoCoordenador(nome) {
  return pessoas[nome]?.foto || null
}

const itens = computed(() => [
  {
    chave: 'formados',
    valor: String(nucleosJaFormados.value).padStart(2, '0'),
    label: 'Núcleos já formados',
    descricao:
      'Conta cada núcleo distinto que o Instituto já formou, unindo os núcleos publicados em semestres anteriores aos que estão em produção agora.',
  },
  {
    chave: 'ativos',
    valor: String(nucleosAtivos.value).padStart(2, '0'),
    label: 'Núcleos ativos',
    descricao:
      'Núcleos de estudo em produção neste semestre, cada um dedicado a um recorte específico do Direito Empresarial.',
  },
  {
    chave: 'edicoes',
    valor: String(edicoes.length).padStart(2, '0'),
    label: 'Edições publicadas',
    descricao:
      'Cada edição da Revista QuotaParte reúne os resumos expandidos de um núcleo inteiro, do primeiro debate à publicação.',
  },
  {
    chave: 'trabalhos',
    valor: String(trabalhosPublicados.value).padStart(2, '0'),
    label: 'Trabalhos publicados',
    descricao: 'Resumos expandidos já publicados nas edições da Revista QuotaParte.',
  },
  {
    chave: 'autores',
    valor: String(autoresPublicados.value).padStart(2, '0'),
    label: 'Autores e Autoras',
    descricao: 'Membros que já assinaram um resumo expandido publicado na Revista QuotaParte.',
  },
  {
    chave: 'coordenadores',
    valor: String(coordenadoresAtivos.value.length).padStart(2, '0'),
    label: 'Coordenadores ativos',
    descricao:
      'Membros que coordenam um núcleo de estudo neste semestre, respondendo pela produção acadêmica de sua Vertical.',
  },
  {
    chave: 'anos',
    valor: String(anosDeProducao.value).padStart(2, '0'),
    label: 'Anos de produção',
    descricao: 'Tempo, em anos, desde que o primeiro núcleo de estudo do Instituto entrou em produção.',
  },
])

const flashAberto = ref(false)
const itemSelecionado = ref(null)
function abrirFlash(item) {
  itemSelecionado.value = item
  flashAberto.value = true
}
</script>

<template>
  <div class="vista">
    <HeroVerde
      label="Núcleos"
      titulo="Um compromisso contínuo com a produção acadêmica."
      sub="Os núcleos de estudo são a principal dinâmica de pesquisa do Instituto Società: grupos itinerantes que mudam a cada semestre, do primeiro debate à edição publicada."
    />

    <div class="pagina pagina--sobrepoe">
      <SubNavRevista />

      <div class="bento">
        <button class="tile tile-hero" @click="abrirFlash(itens[0])" v-reveal>
          <span class="tile-valor tile-valor--grande">{{ itens[0].valor }}</span>
          <span class="tile-label">{{ itens[0].label }}</span>
        </button>

        <button class="tile tile-a" @click="abrirFlash(itens[1])" v-reveal>
          <span class="tile-valor">{{ itens[1].valor }}</span>
          <span class="tile-label">{{ itens[1].label }}</span>
        </button>

        <button class="tile tile-b" @click="abrirFlash(itens[2])" v-reveal>
          <span class="tile-valor">{{ itens[2].valor }}</span>
          <span class="tile-label">{{ itens[2].label }}</span>
        </button>

        <button class="tile tile-c" @click="abrirFlash(itens[3])" v-reveal>
          <span class="tile-valor">{{ itens[3].valor }}</span>
          <span class="tile-label">{{ itens[3].label }}</span>
        </button>

        <button class="tile tile-d" @click="abrirFlash(itens[4])" v-reveal>
          <span class="tile-valor">{{ itens[4].valor }}</span>
          <span class="tile-label">{{ itens[4].label }}</span>
        </button>

        <button class="tile tile-e tile-coordenadores" @click="abrirFlash(itens[5])" v-reveal>
          <div class="tile-avatares" v-if="coordenadoresAtivos.length">
            <div class="tile-avatar" v-for="c in coordenadoresAtivos" :key="c">
              <picture v-if="fotoCoordenador(c)">
                <source v-if="webp(fotoCoordenador(c))" type="image/webp" :srcset="webp(fotoCoordenador(c))" />
                <img :src="fotoCoordenador(c)" :alt="c" loading="lazy" decoding="async" />
              </picture>
              <span v-else>{{ c.charAt(0) }}</span>
            </div>
          </div>
          <span class="tile-valor">{{ itens[5].valor }}</span>
          <span class="tile-label">{{ itens[5].label }}</span>
        </button>

        <button class="tile tile-f" @click="abrirFlash(itens[6])" v-reveal>
          <span class="tile-valor">{{ itens[6].valor }}</span>
          <span class="tile-label">{{ itens[6].label }}</span>
        </button>
      </div>

      <div class="producao-secao" v-if="nucleosEmAndamento.nucleos.length">
        <div class="producao-cabecalho">
          <h2 class="producao-titulo">Em produção</h2>
          <span class="producao-semestre">{{ nucleosEmAndamento.semestre }}</span>
        </div>
        <div class="producao-linha-divisora"></div>

        <div class="producao-grade">
          <div
            class="producao-card"
            v-for="nucleo in nucleosEmAndamento.nucleos"
            :key="nucleo.nome"
            v-reveal
          >
            <h3 class="producao-nome">{{ nucleo.nome }}</h3>
            <p class="producao-linha">{{ nucleo.linhaPesquisa }}</p>
            <div class="producao-coordenadores" v-if="nucleo.coordenadores?.length">
              <div class="producao-avatares">
                <div class="producao-avatar" v-for="c in nucleo.coordenadores" :key="c">
                  <picture v-if="fotoCoordenador(c)">
                    <source v-if="webp(fotoCoordenador(c))" type="image/webp" :srcset="webp(fotoCoordenador(c))" />
                    <img :src="fotoCoordenador(c)" :alt="c" loading="lazy" decoding="async" />
                  </picture>
                  <span v-else>{{ c.charAt(0) }}</span>
                </div>
              </div>
              <span class="producao-nomes">{{ nucleo.coordenadores.join(' · ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CardFlash v-model="flashAberto" :item="itemSelecionado" />
  </div>
</template>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 124px;
  grid-auto-flow: dense;
  gap: 16px;
}

.tile {
  border: none;
  border-radius: var(--raio);
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 6px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 28px -18px rgba(26, 26, 26, 0.35);
}

.tile-valor {
  font-family: var(--font-titulo);
  font-size: 30px;
  line-height: 1;
}

.tile-valor--grande {
  font-size: 52px;
}

.tile-label {
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;

}

.tile-hero {
  grid-column: span 2;
  grid-row: span 2;
  background-color: var(--hero-fundo, #324b30);
  background-image: linear-gradient(rgba(var(--hero-veu, 50, 75, 48), 0.88), rgba(var(--hero-veu, 50, 75, 48), 0.88)),
    url('/img/textura-verde.svg');
  background-size: cover;
  background-position: center;
}

.tile-hero .tile-valor,
.tile-hero .tile-label {
  color: #fff;
}

.tile-a {
  grid-column: span 1;
  background: rgba(50, 75, 48, 0.14);
}

.tile-a .tile-valor,
.tile-a .tile-label {
  color: var(--verde);
}

.tile-b {
  grid-column: span 1;
  background: var(--branco);
  border: 1px solid var(--borda);
}

.tile-b .tile-valor,
.tile-b .tile-label {
  color: var(--verde);
}

.tile-c {
  grid-column: span 1;
  grid-row: span 1;
  background: rgba(149, 153, 136, 0.24);
}

.tile-c .tile-valor,
.tile-c .tile-label {
  color: var(--verde);
}

.tile-d {
  grid-column: span 1;
  background: var(--fundo-sutil);
  border: 1px solid var(--borda);
}

.tile-d .tile-valor,
.tile-d .tile-label {
  color: var(--verde);
}

.tile-e {
  grid-column: span 2;
  background: rgba(50, 75, 48, 0.22);
}

.tile-e .tile-valor,
.tile-e .tile-label {
  color: var(--verde);
}

.tile-f {
  grid-column: span 1;
  background: rgba(149, 153, 136, 0.16);
}

.tile-f .tile-valor,
.tile-f .tile-label {
  color: var(--verde);
}

.tile-coordenadores {
  justify-content: space-between;
}

.tile-avatares {
  display: flex;
}

.tile-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  border: 1.5px solid var(--branco);
  box-shadow: 0 0 0 1px rgba(50, 75, 48, 0.3);
  margin-left: -8px;
  background: var(--branco);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile-avatar:first-child {
  margin-left: 0;
}

.tile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.tile-avatar span {
  font-family: var(--font-titulo);
  font-size: 12px;
  color: var(--verde);
}

.producao-cabecalho {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.producao-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(24px, 2.4vw, 30px);
  color: var(--verde);
}

.producao-semestre {
  font-family: var(--font-corpo);
  font-size: 14px;
  color: var(--sage-texto);
}

.producao-linha-divisora {
  height: 2px;
  background: var(--verde);
  width: 64px;
  margin: 14px 0 32px;
}

.producao-grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: 20px;
}

.producao-card {
  padding: 24px 26px;
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  transition: border-color 0.2s ease;
}

.producao-card:hover {
  border-color: var(--verde);
}

.producao-nome {
  font-family: var(--font-titulo);
  font-size: 20px;
  color: var(--verde);
  margin-bottom: 10px;
  font-weight: 600;
  line-height: 1.3;

}

.producao-linha {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  color: var(--texto-sec);
  line-height: 1.65;
  margin-bottom: 16px;
}

.producao-coordenadores {
  display: flex;
  align-items: center;
  gap: 10px;
}

.producao-avatares {
  display: flex;
  flex-shrink: 0;
}

.producao-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  border: 1.5px solid var(--branco);
  box-shadow: 0 0 0 1px var(--borda);
  margin-left: -8px;
  background: var(--fundo-sutil);
  display: flex;
  align-items: center;
  justify-content: center;
}

.producao-avatar:first-child {
  margin-left: 0;
}

.producao-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.producao-avatar span {
  font-family: var(--font-titulo);
  font-size: 12px;
  color: var(--verde);
}

.producao-nomes {
  font-family: var(--font-corpo);
  font-size: 14px;
  color: var(--verde);
}

@media (max-width: 1024px) {
  .bento {
    grid-template-columns: repeat(2, 1fr);
  }

  .tile-hero,
  .tile-e {
    grid-column: span 2;
  }
}

@media (max-width: 600px) {
  .bento {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }

  .tile {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
    min-height: 100px;
  }

  .tile-hero {
    min-height: 160px;
  }

  .producao-grade {
    grid-template-columns: 1fr;
  }
}

.tile {
  position: relative;
  overflow: hidden;
}

.tile::before,
.tile::after {
  content: '';
  position: absolute;
  top: 18px;
  right: 18px;
  border: 1px solid currentColor;
  opacity: 0.35;
  transition: transform 0.9s cubic-bezier(0.22, 0.8, 0.2, 1), opacity 0.4s ease;
  pointer-events: none;
}

.tile::before {
  width: 30px;
  height: 30px;
  transform: rotate(8deg);
}

.tile::after {
  width: 14px;
  height: 14px;
  margin: 8px;
  transform: rotate(18deg);
}

.tile:hover::before {
  opacity: 0.8;
  transform: rotate(-8deg);
}

.tile:hover::after {
  opacity: 0.8;
  transform: rotate(-18deg);
}
</style>
