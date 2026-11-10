<script setup>
import { webp } from '../../../utils/imagem.js'
import { reactive, ref } from 'vue'
import SerieYoutubeCard from '../../../components/SerieYoutubeCard.vue'
import CardCelula from '../../../components/CardCelula.vue'
import { celulas } from '../../../data/celulas.js'
import { seriesYoutube } from '../../../data/eventos.js'
import { marcosInstituto } from '../../../data/marcosInstituto.js'

const falhasFoto = reactive({})

const celulaCardAberta = ref(false)
const celulaSelecionada = ref(null)
function abrirCelula(celula) {
  celulaSelecionada.value = celula
  celulaCardAberta.value = true
}

const indice = [
  { nome: 'Atividades', hash: '#comunidade-atividades' },
  { nome: 'Fundação', hash: '#comunidade-fundacao' },
  { nome: 'Células Regionais', hash: '#comunidade-celulas' },
  { nome: 'YouTube', hash: '#comunidade-youtube' },
]
</script>

<template>
  <div class="comunidade">
    <!-- Índice da página -->
    <nav class="indice" aria-label="Seções da página">
      <router-link v-for="item in indice" :key="item.hash" :to="{ path: '/comunidade', hash: item.hash }" class="indice-link">
        {{ item.nome }}
      </router-link>
    </nav>

    <!-- Atividades -->
    <section class="bloco secao" id="comunidade-atividades">
      <header class="cab">
        <h2 class="cab-titulo">Atividades</h2>
      </header>

      <div class="atv-pares">
        <article class="atv-item" v-reveal>
          <span class="atv-sinal atv-sinal--h" aria-hidden="true"><i></i></span>
          <h3 class="atv-titulo">Encontros Horizontais</h3>
          <p>
            Os Encontros Horizontais reúnem, periodicamente, os integrantes de
            todos os núcleos de estudo em um só ambiente, guiado por um professor
            especialista em alguma das áreas estudadas no semestre, para ouvi-lo
            e discutir a temática proposta. Por sua natureza interna, a
            participação é reservada aos membros do Instituto.
          </p>
          <p>
            Cada Encontro Horizontal parte de um recorte técnico específico,
            conduzido por um convidado externo com domínio consolidado sobre o
            tema. A dinâmica favorece a troca entre integrantes de núcleos
            diferentes, ampliando o repertório de cada um para além da linha de
            estudo do próprio núcleo.
          </p>
        </article>

        <article class="atv-item" v-reveal>
          <span class="atv-sinal atv-sinal--v" aria-hidden="true"><i></i></span>
          <h3 class="atv-titulo">Encontros Verticais</h3>
          <p>
            Os Encontros Verticais são os encontros de cada núcleo. Há uma
            proposta de estudo semestral por núcleo, e a cada semestre os
            núcleos ativos são ajustados. Ao final do ciclo, os integrantes devem
            entregar um resumo expandido sobre a linha de estudo específica do
            respectivo núcleo.
          </p>
          <p>
            O ciclo tem início com um Encontro Vertical inaugural, no qual um
            convidado externo apresenta um panorama geral da linha de pesquisa
            proposta. A partir daí, o núcleo passa a se reunir de forma
            autônoma, sob a coordenação de seus próprios integrantes, até a entrega
            final do semestre.
          </p>
        </article>
      </div>

      <figure class="panorama" v-reveal>
        <div class="panorama-moldura">
          <picture>
            <source v-if="webp('/dinamicas/encontros-horizontais.png')" type="image/webp" :srcset="webp('/dinamicas/encontros-horizontais.png')" />
            <img src="/dinamicas/encontros-horizontais.png" alt="Encontro Horizontal do Instituto Società" loading="lazy" decoding="async" />
          </picture>
        </div>
        <figcaption class="panorama-legenda">
          As atividades do Instituto operam em ciclos semestrais, acompanhando
          o calendário acadêmico.
        </figcaption>
      </figure>

      <div class="metodologia" v-reveal>
        <span class="cruz" aria-hidden="true"><i></i><i></i><b></b></span>
        <span class="label-caps">Por que horizontal e vertical?</span>
        <p>
          A nomenclatura reflete a metodologia do Instituto: nos núcleos,
          aprofundamos verticalmente um recorte específico do Direito
          Empresarial ao longo do semestre; nos Encontros Horizontais,
          integramos coletivamente essas frentes, cruzando debates
          interdisciplinares entre integrantes de diferentes núcleos.
        </p>
      </div>
    </section>

    <!-- Fundação -->
    <section class="bloco bloco--faixa secao" id="comunidade-fundacao">
      <header class="cab">
        <h2 class="cab-titulo">Fundação</h2>
      </header>

      <div class="fundacao-grid">
        <div class="fundacao-coluna">
          <span class="fundacao-data">Desde 04/11/2024</span>
          <div class="fundacao-texto">
            <p>
              O Instituto Società foi fundado em 4 de novembro de 2024 por estudantes
              em fase final do curso de Direito. O objetivo era avançar os estudos em
              matéria empresarial para além do que se via em sala de aula.
            </p>
            <p>
              Através das relações construídas no universo das competições
              acadêmicas, formamos um ambiente dedicado à discussão de tópicos
              complexos em matéria empresarial entre jovens em final de graduação e
              em pós-graduação com alto grau de aprofundamento na dogmática
              empresarial.
            </p>
            <p>
              Inicialmente, os encontros se voltaram ao contato com autores
              prestigiados na área, seguidos de debates entre os membros. Com o
              passar do tempo, novas frentes foram se formando: os núcleos de
              estudo, os eventos externos, o canal no YouTube e a nossa revista
              QuotaParte.
            </p>
            <p>
              Mais do que um espaço de aprofundamento, o Instituto possui um
              compromisso acadêmico de difundir discussões sofisticadas no âmbito do
              Direito Comercial entre jovens dedicados à área.
            </p>
          </div>
        </div>

        <div class="fundacao-imagem" v-reveal>
          <picture>
            <source v-if="webp('/dinamicas/governanca.png')" type="image/webp" :srcset="webp('/dinamicas/governanca.png')" />
            <img src="/dinamicas/governanca.png" alt="Governança do Instituto Società" loading="lazy" decoding="async" />
          </picture>
        </div>
      </div>

      <div class="marcos">
        <span class="label-caps marcos-rotulo">Linha do tempo</span>
        <div class="marcos-grade grade-stagger">
          <div class="marco" v-for="marco in marcosInstituto" :key="marco.data" v-reveal>
            <span class="marco-data">{{ marco.data }}</span>
            <span class="marco-titulo">{{ marco.titulo }}</span>
            <p class="marco-texto">{{ marco.texto }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Células Regionais -->
    <section class="bloco secao" id="comunidade-celulas">
      <header class="cab">
        <h2 class="cab-titulo">Células Regionais</h2>
      </header>

      <div class="celulas-layout">
        <div class="celulas-texto">
          <p class="celulas-abertura">
            O Instituto Società não é vinculado a nenhum escritório ou instituição de
            ensino. Foi fundado no Rio Grande do Sul, mas conta com participação
            ativa dispersa por todas as regiões do país: hoje, membros em mais de
            10 estados.
          </p>
          <p class="secao-intro">
            Dentre as cidades com maior número de membros estão Salvador, Porto
            Alegre e Rio de Janeiro. Ao concentrarem 15 membros do Instituto, essas
            cidades passam a atuar como célula, assumindo o compromisso de manter a
            presença institucional do projeto em frentes regionais, além de promover
            eventos e atividades próprias.
          </p>
        </div>

        <div class="celulas-grade grade-stagger">
          <button
            class="celula"
            v-for="celula in celulas"
            :key="celula.cidade"
            @click="abrirCelula(celula)"
            v-reveal
          >
            <picture v-if="celula.foto && !falhasFoto[celula.cidade]">
              <source v-if="webp(celula.foto)" type="image/webp" :srcset="webp(celula.foto)" />
              <img :src="celula.foto" :alt="celula.cidade" @error="falhasFoto[celula.cidade] = true" loading="lazy" decoding="async" />
            </picture>
            <span v-else class="celula-vazia" aria-hidden="true"></span>

            <span class="celula-veu" aria-hidden="true"></span>
            <span class="celula-info">
              <span class="celula-rotulo">Célula Regional</span>
              <span class="celula-nome">{{ celula.cidade }}</span>
              <span class="celula-linha" aria-hidden="true"></span>
              <span class="celula-membros">
                {{ celula.membros }} membros
                <span class="celula-seta" aria-hidden="true">→</span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- YouTube -->
    <section class="bloco bloco--faixa secao" id="comunidade-youtube">
      <header class="cab">
        <h2 class="cab-titulo">YouTube</h2>
      </header>

      <div class="youtube-grade grade-stagger">
        <SerieYoutubeCard v-for="serie in seriesYoutube" :key="serie.nome" :serie="serie" />
      </div>
    </section>

    <CardCelula v-model="celulaCardAberta" :celula="celulaSelecionada" />
  </div>
</template>

<style scoped>
.comunidade {
  display: flex;
  flex-direction: column;
}

/* ── Índice: quatro entradas discretas, filetes finos ── */
.indice {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px clamp(24px, 4vw, 56px);
  padding: clamp(28px, 3.4vw, 44px) 0 0;
}

.indice-link {
  position: relative;
  padding: 10px 0;
  font-family: var(--font-titulo);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--sage-texto);
  transition: color 0.5s var(--ease-lento);
}

.indice-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transition: transform 0.7s var(--ease-lento);
}

.indice-link:hover {
  color: var(--verde);
}

.indice-link:hover::after {
  transform: scaleX(1);
}

/* ── Seções ── */
.secao {
  gap: clamp(48px, 6vw, 88px);
  padding: clamp(80px, 10vw, 140px) 0;
}

.secao:first-of-type {
  padding-top: clamp(56px, 7vw, 96px);
}

/* título centralizado com filete vertical */
.cab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  text-align: center;
}

.cab-titulo {
  font-family: var(--font-titulo);
  font-weight: 400 !important;
  font-size: clamp(30px, 3.8vw, 54px);
  line-height: 1.15;
  letter-spacing: 0.05em;
  color: var(--verde);
}

/* ── Atividades ── */
.atv-pares {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
}

.atv-item {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 clamp(24px, 4vw, 64px);
}

.atv-item + .atv-item {
  border-left: 1px solid var(--borda);
}

.atv-titulo {
  font-family: var(--font-titulo);
  font-weight: 500 !important;
  font-size: clamp(21px, 2vw, 27px);
  letter-spacing: 0.06em;
  line-height: 1.3;
  color: var(--verde);
}

.atv-item p {
  font-family: var(--font-corpo);
  font-size: 16.5px;
  font-weight: 300;
  line-height: 1.9;
  color: var(--texto-corpo);
}

.atv-sinal {
  position: relative;
  display: block;
  width: 72px;
  height: 20px;
}

.atv-sinal::before,
.atv-sinal::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 7px;
  height: 7px;
  margin-top: -3.5px;
  background: var(--verde);
}

.atv-sinal::before {
  left: 0;
}
.atv-sinal::after {
  right: 0;
}

.atv-sinal i {
  position: absolute;
  left: 7px;
  right: 7px;
  top: 50%;
  height: 1px;
  background: var(--verde);
  transform-origin: left;
  transition: transform 1s var(--ease-lento);
}

/* vertical: o mesmo sinal girado, sem mudar a altura da linha */
.atv-sinal--v {
  transform: rotate(90deg);
  transform-origin: 0 50%;
  margin-left: 20px;
}

.atv-item:hover .atv-sinal i {
  transform: scaleX(0.7);
}

/* imagem em sangria, proporção de cinema */
.panorama {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panorama-moldura {
  overflow: hidden;
  aspect-ratio: 21 / 9;
  background-image: url('/img/textura-sage.svg');
  background-size: cover;
}

.panorama-moldura img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 2.4s var(--ease-lento);
}

.panorama:hover .panorama-moldura img {
  transform: scale(1.03);
}

.panorama-legenda {
  text-align: center;
  font-family: var(--font-corpo);
  font-size: 13.5px;
  font-weight: 300;
  font-style: italic;
  letter-spacing: 0.03em;
  color: var(--sage-texto);
}

/* metodologia: citação centralizada */
.metodologia {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  max-width: 780px;
  margin: 0 auto;
  text-align: center;
}

.metodologia p {
  font-family: var(--font-corpo);
  font-size: clamp(17px, 1.5vw, 20px);
  font-weight: 300;
  line-height: 1.95;
  color: var(--texto-corpo);
}

.cruz {
  position: relative;
  width: 64px;
  height: 64px;
}

.cruz i {
  position: absolute;
  background: var(--verde);
}

.cruz i:nth-child(1) {
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
}

.cruz i:nth-child(2) {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
}

.cruz b {
  position: absolute;
  inset: 40%;
  background: var(--verde);
  transform: rotate(45deg);
  transition: transform 1.2s var(--ease-lento);
}

.metodologia:hover .cruz b {
  transform: rotate(225deg);
}

/* ── Fundação ── */
.fundacao-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(36px, 6vw, 96px);
  align-items: stretch;
}

.fundacao-coluna {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.fundacao-data {
  font-family: var(--font-titulo);
  font-weight: 400;
  font-size: clamp(26px, 3vw, 40px);
  letter-spacing: 0.08em;
  line-height: 1.1;
  text-transform: uppercase;
  color: var(--verde);
}

.fundacao-texto p {
  font-family: var(--font-corpo);
  font-size: 16.5px;
  font-weight: 300;
  line-height: 1.95;
  color: var(--texto-corpo);
  margin-bottom: 20px;
}

.fundacao-texto p:last-child {
  margin-bottom: 0;
}

.fundacao-imagem {
  min-height: 360px;
  overflow: hidden;
  background-image: url('/img/textura-sage.svg');
  background-size: cover;
}

.fundacao-imagem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* linha do tempo: grade que quebra em linhas, sem rolagem lateral */
.marcos {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.marcos-rotulo {
  text-align: center;
}

.marcos-grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(32px, 3.6vw, 56px) clamp(24px, 3vw, 48px);
}

.marco {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 32px;
  border-top: 1px solid var(--borda);
}

.marco::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 0;
  width: 7px;
  height: 7px;
  background: var(--ouro);
  transition: transform 0.9s var(--ease-lento);
}

.marco:hover::before {
  transform: rotate(45deg) scale(1.3);
}

.marco-data {
  font-family: var(--font-titulo);
  font-weight: 400;
  font-size: 22px;
  letter-spacing: 0.06em;
  color: var(--verde);
}

.marco-titulo {
  font-family: var(--font-corpo);
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.marco-texto {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  font-weight: 300;
  line-height: 1.8;
  color: var(--texto-sec);
}

/* ── Células ── */
.celulas-layout {
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  gap: clamp(36px, 6vw, 96px);
  align-items: stretch;
}

.celulas-texto {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.celulas-abertura {
  font-family: var(--font-titulo);
  font-weight: 400;
  font-size: clamp(17px, 1.4vw, 20px);
  line-height: 1.65;
  letter-spacing: 0.03em;
  color: var(--verde);
}

.secao-intro {
  font-family: var(--font-corpo);
  font-size: 16.5px;
  font-weight: 300;
  line-height: 1.9;
  color: var(--texto-corpo);
}

.celulas-grade {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: minmax(0, 1fr);
  gap: clamp(16px, 2vw, 28px);
}

.celula {
  position: relative;
  isolation: isolate;
  display: block;
  height: 100%;
  min-height: 380px;
  padding: 0;
  border: 0;
  overflow: hidden;
  background: var(--sage);
  text-align: left;
  cursor: pointer;
}

.celula picture,
.celula img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.celula img {
  object-fit: cover;
  transition: transform 2s var(--ease-lento);
}

.celula:hover img {
  transform: scale(1.06);
}

.celula-vazia {
  position: absolute;
  inset: 0;
  background-image: url('/img/textura-sage.svg');
  background-size: cover;
  background-position: center;
}

.celula-veu {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to top, rgba(26, 44, 24, 0.9) 0%, rgba(26, 44, 24, 0.4) 38%, rgba(26, 44, 24, 0) 64%);
}

.celula-info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: clamp(18px, 2vw, 28px);
}

.celula-rotulo {
  font-family: var(--font-corpo);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.celula-nome {
  font-family: var(--font-titulo);
  font-weight: 400;
  font-size: clamp(20px, 2vw, 28px);
  line-height: 1.15;
  letter-spacing: 0.05em;
  color: #fff;
}

.celula-linha {
  display: block;
  width: 28px;
  height: 1px;
  background: #fff;
  transition: width 0.9s var(--ease-lento);
}

.celula:hover .celula-linha {
  width: 100%;
}

.celula-membros {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.9);
}

.celula-seta {
  transition: transform 0.6s var(--ease-lento);
}

.celula:hover .celula-seta {
  transform: translateX(6px);
}

/* ── YouTube ── */
.youtube-grade {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 28px);
  align-items: stretch;
}

/* ── Responsivo ── */
@media (max-width: 1000px) {
  .celula {
    height: auto;
    min-height: 0;
    aspect-ratio: 3 / 4;
  }

  .celulas-layout,
  .fundacao-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .fundacao-imagem {
    min-height: 280px;
    order: -1;
  }
}

@media (max-width: 900px) {
  .atv-pares {
    grid-template-columns: minmax(0, 1fr);
    gap: 56px;
  }

  .atv-item {
    padding: 0;
  }

  .atv-item + .atv-item {
    border-left: 0;
    padding-top: 56px;
    border-top: 1px solid var(--borda);
  }

  .youtube-grade {
    grid-template-columns: minmax(0, 1fr);
  }

  .panorama-moldura {
    aspect-ratio: 16 / 9;
  }
}

@media (max-width: 560px) {
  .celulas-grade {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .atv-sinal i,
  .cruz b,
  .marco::before,
  .panorama-moldura img,
  .celula img,
  .celula-linha,
  .celula-seta,
  .indice-link,
  .indice-link::after {
    transition: none;
  }
}
</style>
