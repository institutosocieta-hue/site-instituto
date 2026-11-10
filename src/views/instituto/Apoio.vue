<script setup>
import { webp } from '../../utils/imagem.js'
import HeroVerde from '../../components/HeroVerde.vue'
import { contato } from '../../data/contato.js'

const motivos = [
  'Associação a uma produção acadêmica de rigor técnico, revisada por pares e organizada em torno de núcleos de estudo especializados',
  'Aproximação com uma nova geração de juristas já engajada com a prática do Direito Empresarial, antes mesmo de sua entrada no mercado',
  'Contribuição estrutural a uma iniciativa independente, sem vínculo institucional, que sustenta sua produção pelo mérito acadêmico',
  'Presença construída ao lado de uma comunidade em formação, não como patrocínio pontual, mas como parceria de longo prazo',
]

const apoiadores = [
  // { nome: '[Nome do apoiador]', logo: '/apoiadores/[arquivo].svg', link: null }
]
</script>

<template>
  <div class="vista">
    <HeroVerde
      label="Parcerias"
      titulo="Impulsione o pensamento jurídico coletivo."
      sub="Escritórios e entidades interessados em apoiar o Instituto Società e a Revista QuotaParte encontram aqui o primeiro passo."
    >
      <template #acoes>
        <router-link :to="{ hash: '#como-apoiar' }" class="btn-claro">Como apoiar →</router-link>
      </template>
    </HeroVerde>

    <div class="pagina pagina--sobrepoe pagina--blocos">
      <!-- I · Uma comunidade independente -->
      <section class="bloco" id="independente">
        <header class="bloco-cabecalho">
          <h2 class="bloco-titulo">Uma comunidade independente</h2>
        </header>

        <div class="independente-grade">
          <div class="independente-coluna" v-reveal>
            <span class="apoio-emblema" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
          <p class="independente-lead">
            O Instituto Società é uma iniciativa acadêmica independente. Nasceu como
            um grupo de estudos e se tornou uma verdadeira comunidade de jovens
            entusiastas do Direito Empresarial, sob o ponto de vista acadêmico.
          </p>
          </div>
          <p class="independente-texto" v-reveal>
            Por isso, criamos um plano de parceria institucional que faz do parceiro
            um verdadeiro pilar do Instituto, não apenas estrutural, mas acadêmico. A
            integração com escritórios e entidades jurídicas fortalece o horizonte de
            oportunidades entre todos, garantindo que o entusiasmo dos membros e a
            dedicação às atividades acadêmicas aprofundem todo o seu potencial.
          </p>
        </div>
      </section>

      <!-- II · Quatro motivos para apoiar -->
      <section class="bloco bloco--faixa" id="motivos">
        <header class="bloco-cabecalho">
          <h2 class="bloco-titulo">Quatro motivos para apoiar</h2>
        </header>

        <ol class="motivos grade-stagger">
          <li class="motivo" v-for="(motivo, i) in motivos" :key="motivo" v-reveal>
            <span class="motivo-numero" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="motivo-regua" aria-hidden="true"></span>
            <p class="motivo-texto">{{ motivo }}</p>
          </li>
        </ol>
      </section>

      <!-- III · Apoiadores -->
      <section class="bloco" id="apoiadores">
        <header class="bloco-cabecalho">
          <h2 class="bloco-titulo">Apoiadores</h2>
        </header>

        <div class="apoiadores-grade" v-if="apoiadores.length">
          <a
            class="apoiador-item"
            v-for="apoiador in apoiadores"
            :key="apoiador.nome"
            :href="apoiador.link || undefined"
            target="_blank"
            rel="noopener"
          >
            <picture>
              <source v-if="webp(apoiador.logo)" type="image/webp" :srcset="webp(apoiador.logo)" />
              <img :src="apoiador.logo" :alt="apoiador.nome" loading="lazy" decoding="async" />
            </picture>
          </a>
        </div>
        <div v-else class="apoiadores-vazio" v-reveal>
          <div class="apoiadores-molduras" aria-hidden="true">
            <span><i></i><i></i></span><span><i></i><i></i></span><span><i></i><i></i></span><span><i></i><i></i></span>
          </div>
          <p class="em-breve">Em breve, os primeiros parceiros institucionais aparecem aqui.</p>
        </div>
      </section>

      <!-- Como apoiar: faixa de chamada -->
      <section class="chamada" id="como-apoiar">
        <div class="chamada-textura"></div>
        <div class="chamada-conteudo">
          <div class="chamada-texto">
            <span class="label-caps chamada-rotulo">Como apoiar</span>
            <h2 class="chamada-titulo">Preencha o formulário e comece uma parceria.</h2>
            <p class="chamada-sub">
              Leva poucos minutos. Entraremos em contato para apresentar as
              possibilidades de parceria institucional.
            </p>
          </div>
          <a
            v-if="contato.formularioContribuicao"
            :href="contato.formularioContribuicao"
            target="_blank"
            rel="noopener"
            class="btn-claro btn-claro--grande"
          >
            Preencher formulário →
          </a>
          <span v-else class="btn-secundario btn-secundario--claro chamada-desabilitado">
            Formulário em preparação
          </span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pagina--blocos {
  gap: 0;
  padding-bottom: 0;
}

.em-breve {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  color: var(--texto-sec);
  font-style: italic;
}

/* I · independente */
.independente-grade {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
}

.independente-coluna {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.apoio-emblema {
  position: relative;
  width: 64px;
  height: 64px;
}

.apoio-emblema span {
  position: absolute;
  border: 1px solid var(--sage);
  transition: transform 1s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.apoio-emblema span:nth-child(1) { inset: 0; }
.apoio-emblema span:nth-child(2) { inset: 16%; transform: rotate(7deg); }
.apoio-emblema span:nth-child(3) { inset: 32%; transform: rotate(14deg); }
.apoio-emblema span:nth-child(4) { inset: 44%; background: var(--verde); border-color: var(--verde); transform: rotate(21deg); }

.independente-coluna:hover .apoio-emblema span:nth-child(2) { transform: rotate(-7deg); }
.independente-coluna:hover .apoio-emblema span:nth-child(3) { transform: rotate(-14deg); }
.independente-coluna:hover .apoio-emblema span:nth-child(4) { transform: rotate(-21deg); }

.independente-lead {
  font-family: var(--font-corpo);
  font-weight: 500;
  font-size: clamp(20px, 2.1vw, 26px);
  line-height: 1.6;
  color: var(--verde);
}

.independente-texto {
  padding-left: clamp(20px, 2.5vw, 32px);
  border-left: 1px solid var(--verde);
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.9;
  color: var(--texto-corpo);
}

/* II · motivos */
.motivos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(36px, 5vw, 64px) clamp(32px, 6vw, 96px);
}

.motivo {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    'num regua'
    'texto texto';
  align-items: center;
  column-gap: 20px;
  row-gap: 20px;
}

.motivo-numero {
  grid-area: num;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(44px, 5vw, 64px);
  line-height: 1;
  color: var(--sage);
  opacity: 0.55;
  transition: color 0.4s ease, opacity 0.4s ease, transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.motivo-regua {
  grid-area: regua;
  position: relative;
  height: 1px;
  background: var(--borda);
}

.motivo-regua::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--verde);
  transform: scaleX(0.14);
  transform-origin: left;
  transition: transform 0.7s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.motivo-texto {
  grid-area: texto;
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.8;
  color: var(--texto-corpo);
}

.motivo:hover .motivo-numero {
  color: var(--verde);
  opacity: 1;
  transform: translateX(6px);
}

.motivo:hover .motivo-regua::after {
  transform: scaleX(1);
}

/* III · apoiadores */
.apoiadores-grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
}

.apoiador-item {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 2;
  padding: 24px;
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  transition: border-color 0.3s ease, transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1),
    box-shadow 0.4s ease;
}

.apoiador-item:hover {
  border-color: var(--verde);
  transform: translateY(-4px);
  box-shadow: 0 18px 30px -20px rgba(26, 26, 26, 0.4);
}

.apoiador-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.apoiadores-vazio {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.apoiadores-molduras {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.apoiadores-molduras span {
  position: relative;
  background-image: linear-gradient(135deg, rgba(149, 153, 136, 0.12), rgba(149, 153, 136, 0.04));
  transition: border-color 0.4s ease, transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
  aspect-ratio: 3 / 2;
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  background: linear-gradient(135deg, transparent 49.5%, var(--borda) 49.5%, var(--borda) 50.5%, transparent 50.5%);
}

/* Faixa de chamada */
.chamada {
  position: relative;
  isolation: isolate;
  margin-top: clamp(32px, 4vw, 56px);
  padding: clamp(56px, 7vw, 96px) 0;
}

.chamada::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  background: var(--verde);
  z-index: -2;
}

.chamada-textura {
  position: absolute;
  inset: 0;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  background-image: linear-gradient(rgba(50, 75, 48, 0.86), rgba(50, 75, 48, 0.86)),
    url('/img/textura-verde.svg');
  background-size: 120% auto;
  background-position: center;
  animation: deriva-chamada 40s ease-in-out infinite;
  z-index: -1;
}

@keyframes deriva-chamada {
  0% {
    background-position: 40% 40%;
  }
  50% {
    background-position: 60% 60%;
  }
  100% {
    background-position: 40% 40%;
  }
}

.chamada-conteudo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 32px 48px;
}

.chamada-texto {
  max-width: 600px;
}

.chamada-rotulo {
  display: block;
  margin-bottom: 14px;
  color: rgba(255, 255, 255, 0.72) !important;
}

.chamada-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(26px, 3.2vw, 40px);
  line-height: 1.25;
  color: var(--branco);
}

.chamada-sub {
  margin-top: 16px;
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.86);
}

.chamada-desabilitado {
  opacity: 0.6;
  pointer-events: none;
}

.apoiadores-molduras span i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 28px;
  height: 28px;
  margin: -14px 0 0 -14px;
  border: 1px solid var(--sage);
}

.apoiadores-molduras span i:last-child {
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  background: var(--sage);
  transform: rotate(18deg);
}

.apoiadores-molduras span:hover {
  border-color: var(--verde);
  transform: translateY(-4px);
}

@media (max-width: 860px) {
  .independente-grade,
  .motivos {
    grid-template-columns: minmax(0, 1fr);
  }

  .apoiadores-molduras {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .chamada-textura {
    animation: none;
  }

  .motivo-numero,
  .motivo-regua::after,
  .apoiador-item {
    transition: none;
  }
}
</style>
