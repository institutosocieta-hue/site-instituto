<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import FluxoMetodo from '../../../components/FluxoMetodo.vue'
import { processoSeletivo } from '../../../data/processoSeletivo.js'
import { depoimentos } from '../../../data/depoimentos.js'

const perguntaAberta = ref(null)

function alternarPergunta(i) {
  perguntaAberta.value = perguntaAberta.value === i ? null : i
}

const modalidades = [
  {
    chave: 'transitorio',
    titulo: 'Membro Transitório',
    descricao:
      'O Membro Transitório é a porta de entrada para conhecer o Instituto Società por dentro. Tem acesso aos Encontros Horizontais e acompanha de perto a rotina do Instituto, participando das atividades abertas a essa modalidade ao longo do período em que estiver inscrito.',
    blocos: [
      {
        rotulo: 'Direitos',
        itens: [
          'Acesso aos Encontros Horizontais',
          'Participação nas atividades abertas à modalidade',
          'Contato direto com membros efetivos e coordenadores',
        ],
      },
      {
        rotulo: 'Deveres',
        itens: [
          'Comparecimento aos encontros do período',
          'Postura ativa e respeitosa nas discussões',
          'Observância ao regimento interno do Instituto',
        ],
      },
    ],
  },
  {
    chave: 'efetivo',
    titulo: 'Membro Efetivo',
    descricao:
      'O Membro Efetivo é parte permanente do Instituto Società, com participação plena nos núcleos de estudo e nas demais dinâmicas, dos Encontros Verticais à produção da Revista QuotaParte. Não há inscrição direta para esta modalidade: tornar-se Membro Efetivo exige passar por um processo de seleção interna, que costuma levar um semestre de participação ativa nas atividades disponíveis ao Membro Transitório.',
    blocos: [
      {
        rotulo: 'Caminho até lá',
        itens: [
          'Um semestre de participação ativa como Membro Transitório',
          'Indicação de um Membro Efetivo já vinculado',
          'Ou análise automática após um ano de vinculação',
        ],
      },
      {
        rotulo: 'Direitos adicionais',
        itens: [
          'Participação política nas decisões institucionais',
          'Acesso amplo aos núcleos de estudo',
          'Elegibilidade a coordenações e à Diretoria',
        ],
      },
    ],
  },
]

const modalidadeAtiva = ref(modalidades[0].chave)
const modalidadeSelecionada = computed(() => modalidades.find((m) => m.chave === modalidadeAtiva.value))
const indiceModalidade = computed(() => modalidades.findIndex((m) => m.chave === modalidadeAtiva.value))

// Barra fixa (mobile): aparece depois do hero e some quando a faixa final entra na tela
const barraVisivel = ref(false)
let observador = null
let faixaVisivel = false
let passouDoHero = false

function atualizarBarra() {
  barraVisivel.value = passouDoHero && !faixaVisivel
}

function aoRolar() {
  passouDoHero = window.scrollY > 420
  atualizarBarra()
}

onMounted(() => {
  window.addEventListener('scroll', aoRolar, { passive: true })
  aoRolar()
  const faixa = document.getElementById('candidatura')
  if (faixa) {
    observador = new IntersectionObserver((entradas) => {
      faixaVisivel = entradas[0].isIntersecting
      atualizarBarra()
    })
    observador.observe(faixa)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', aoRolar)
  observador?.disconnect()
})
</script>

<template>
  <section id="seja-membro" class="secao-instituto">
    <header class="secao-cabecalho">
      <span class="label-caps secao-rotulo">Seja Membro</span>
      <h2 class="secao-titulo">Faça parte do Instituto Società.</h2>
      <p class="secao-sub">O primeiro passo é se tornar Membro Transitório, a porta de entrada para conhecer o Instituto por dentro.</p>
      <div class="secao-acoes">
        <router-link :to="{ hash: '#candidatura' }" class="btn-claro">Inscrever-se →</router-link>
      </div>
    </header>

    <div class="secao-corpo">
      <section v-reveal>
        <span class="label-caps secao-rotulo">Para quem é</span>
        <div class="para-quem">
          <p v-for="paragrafo in processoSeletivo.paraQuem" :key="paragrafo">{{ paragrafo }}</p>
        </div>
      </section>

      <section v-reveal>
        <span class="label-caps secao-rotulo">Como funciona o semestre</span>
        <FluxoMetodo :etapas="processoSeletivo.semestre" />
      </section>

      <section>
        <span class="label-caps secao-rotulo">Modalidades</span>

        <div class="vias">
          <div class="vias-lista" role="tablist" aria-label="Modalidade" :style="{ '--i': indiceModalidade }">
            <span class="vias-marca" aria-hidden="true"></span>
            <button
              v-for="modalidade in modalidades"
              :key="modalidade.chave"
              class="via"
              :class="{ ativa: modalidadeAtiva === modalidade.chave }"
              role="tab"
              :aria-selected="modalidadeAtiva === modalidade.chave"
              @click="modalidadeAtiva = modalidade.chave"
            >
              <span class="via-marcador" aria-hidden="true"></span>
              <span class="via-nome">{{ modalidade.titulo }}</span>
              <span class="via-seta" aria-hidden="true">→</span>
            </button>
          </div>

          <transition name="via-troca" mode="out-in">
            <article class="via-painel" :key="modalidadeAtiva" role="tabpanel">
              <h3 class="via-titulo">{{ modalidadeSelecionada.titulo }}</h3>
              <p class="via-descricao">{{ modalidadeSelecionada.descricao }}</p>

              <div class="via-blocos">
                <div class="via-bloco" v-for="bloco in modalidadeSelecionada.blocos" :key="bloco.rotulo">
                  <span class="label-caps via-rotulo">{{ bloco.rotulo }}</span>
                  <ol class="via-itens">
                    <li v-for="(item, i) in bloco.itens" :key="item">
                      <span class="via-n" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
                      <span>{{ item }}</span>
                    </li>
                  </ol>
                </div>
              </div>
            </article>
          </transition>
        </div>
      </section>

      <section v-if="depoimentos.length">
        <span class="label-caps secao-rotulo">Depoimentos</span>
        <div class="depoimentos grade-stagger">
          <figure class="depoimento" v-for="dep in depoimentos" :key="dep.nome" v-reveal>
            <blockquote class="depoimento-texto">{{ dep.texto }}</blockquote>
            <figcaption class="depoimento-autor">{{ dep.nome }} · {{ dep.nucleo }}</figcaption>
          </figure>
        </div>
      </section>

      <section v-if="processoSeletivo.faq.length">
        <span class="label-caps secao-rotulo">Perguntas frequentes</span>

        <div class="faq-lista">
          <div
            class="faq-item"
            v-for="(item, i) in processoSeletivo.faq"
            :key="item.pergunta"
            v-reveal
          >
            <button
              class="faq-pergunta"
              :id="`faq-pergunta-${i}`"
              :aria-expanded="perguntaAberta === i"
              :aria-controls="`faq-resposta-${i}`"
              @click="alternarPergunta(i)"
            >
              <span>{{ item.pergunta }}</span>
              <span class="faq-sinal" :class="{ aberto: perguntaAberta === i }" aria-hidden="true">+</span>
            </button>
            <div
              class="faq-resposta-wrap"
              :class="{ aberta: perguntaAberta === i }"
              :id="`faq-resposta-${i}`"
              role="region"
              :aria-labelledby="`faq-pergunta-${i}`"
            >
              <div class="faq-resposta-inner">
                <p class="faq-resposta">{{ item.resposta }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="inscricao" id="candidatura">
        <div class="inscricao-textura"></div>
        <div class="inscricao-conteudo">
          <div class="inscricao-texto">
            <span class="inscricao-selo">
              <span class="inscricao-ponto" aria-hidden="true"></span>
              Inscrições abertas o ano todo
            </span>
            <h2 class="inscricao-titulo">Comece pelo formulário de inscrição.</h2>
            <p class="inscricao-sub">
              Leva poucos minutos. A partir dele, você entra no processo de seleção
              mensal para Membro Transitório.
            </p>
          </div>
          <div class="inscricao-acoes">
            <a
              v-if="processoSeletivo.linkFormulario"
              :href="processoSeletivo.linkFormulario"
              target="_blank"
              rel="noopener"
              class="btn-claro btn-claro--grande inscricao-botao"
            >
              Formulário de inscrição →
            </a>
            <a
              v-if="processoSeletivo.linkEdital"
              :href="processoSeletivo.linkEdital"
              target="_blank"
              rel="noopener"
              class="btn-secundario btn-secundario--claro btn-claro--grande inscricao-botao"
            >
              Acessar edital →
            </a>
          </div>
        </div>
      </div>
    </div>

    <transition name="barra-sobe">
      <div class="barra-fixa" v-if="barraVisivel">
        <router-link :to="{ hash: '#candidatura' }" class="btn-primario barra-btn">Seja membro →</router-link>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.para-quem {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 760px;
  padding-top: 24px;
  border-top: 1px solid var(--verde);
}

.para-quem p {
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.8;
  color: var(--texto-corpo);
}

/* Cabeçalho da seção: faixa verde de chegada */
.secao-instituto {
  gap: 0;
}

.secao-cabecalho {
  position: relative;
  isolation: isolate;
  padding: clamp(56px, 7vw, 96px) 0;
  margin-bottom: clamp(56px, 7vw, 96px);
}

.secao-cabecalho::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  background-color: var(--verde);
  background-image: linear-gradient(rgba(50, 75, 48, 0.86), rgba(50, 75, 48, 0.86)),
    url('/img/textura-verde.svg');
  background-size: cover;
  z-index: -1;
}

.secao-cabecalho .label-caps {
  color: rgba(255, 255, 255, 0.72);
}

.secao-cabecalho .secao-rotulo::after {
  background: rgba(255, 255, 255, 0.7);
}

.secao-cabecalho .secao-titulo {
  color: var(--branco);
  font-size: clamp(28px, 3.4vw, 42px);
}

.secao-cabecalho .secao-sub {
  color: rgba(255, 255, 255, 0.86);
}

/* Modalidades: duas vias, seletor lateral e painel editorial */
.vias {
  display: grid;
  grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
  gap: clamp(32px, 5vw, 80px);
  align-items: stretch;
}

.vias-lista {
  --via-h: 96px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: calc(var(--via-h) * 2);
  border-top: 1px solid var(--verde);
}

.vias-marca {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: var(--verde);
  transform: translateY(calc(var(--i, 0) * 100%));
  transition: transform 0.55s cubic-bezier(0.65, 0, 0.35, 1);
}

.via {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-height: var(--via-h);
  padding: 0 22px;
  background: none;
  border: none;
  border-bottom: 1px solid var(--borda);
  text-align: left;
  color: var(--verde);
  transition: color 0.35s ease, padding-left 0.4s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.via:hover {
  padding-left: 32px;
}

.via.ativa {
  color: var(--branco);
}

.via-marcador {
  flex: 0 0 8px;
  height: 8px;
  background: currentColor;
  opacity: 0.55;
  transition: transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1), opacity 0.3s ease;
}

.via:hover .via-marcador,
.via.ativa .via-marcador {
  opacity: 1;
  transform: rotate(45deg);
}

.via-nome {
  flex: 1;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 17px;
  line-height: 1.3;
}

.via-seta {
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.via:hover .via-seta,
.via.ativa .via-seta {
  opacity: 1;
  transform: none;
}

.via-painel {
  position: relative;
  padding-top: 8px;
}

.via-titulo {
  position: relative;
  margin-bottom: 20px;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(24px, 2.6vw, 32px);
  line-height: 1.25;
  color: var(--verde);
}

.via-descricao {
  position: relative;
  max-width: 660px;
  padding-left: 26px;
  border-left: 3px solid var(--verde);
  font-family: var(--font-corpo);
  font-size: 18px;
  line-height: 1.85;
  color: var(--texto-corpo);
}

.via-blocos {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 40px clamp(32px, 4vw, 56px);
  margin-top: 48px;
}

.via-rotulo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.via-rotulo::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--verde);
}

.via-itens li {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: baseline;
  padding: 14px 0;
  border-bottom: 1px solid var(--borda);
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--texto-sec);
  transition: padding-left 0.35s cubic-bezier(0.22, 0.8, 0.2, 1), color 0.25s ease,
    border-color 0.25s ease;
}

.via-itens li:hover {
  padding-left: 8px;
  color: var(--verde);
  border-bottom-color: var(--verde);
}

.via-n {
  font-family: var(--font-titulo);
  font-size: 13px;
  color: var(--sage);
}

.via-troca-enter-active,
.via-troca-leave-active {
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.via-troca-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.via-troca-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

@media (max-width: 860px) {
  .vias {
    grid-template-columns: minmax(0, 1fr);
  }

  .vias-lista {
    --via-h: 72px;
    flex-direction: row;
    min-height: var(--via-h);
  }

  .vias-marca {
    width: 50%;
    height: 100%;
    right: auto;
    transform: translateX(calc(var(--i, 0) * 100%));
  }

  .via {
    flex: 1 1 50%;
    min-width: 0;
    padding: 0 12px;
    gap: 8px;
  }

  .via:hover {
    padding-left: 12px;
  }

  .via-nome {
    font-size: 14px;
  }

  .via-seta {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vias-marca,
  .via,
  .via-seta,
  .via-troca-enter-active,
  .via-troca-leave-active {
    transition: none;
  }
}

.depoimentos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: clamp(24px, 3vw, 40px);
}

.depoimento {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--verde);
}

.depoimento-texto {
  margin: 0;
  font-family: var(--font-corpo);
  font-style: italic;
  font-size: 19px;
  line-height: 1.7;
  color: var(--texto-corpo);
}

.depoimento-autor {
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--sage-texto);
}



@media (prefers-reduced-motion: reduce) {
  }








.faq-item {
  transition: background 0.3s ease, padding-left 0.35s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.faq-item:hover {
  background: var(--fundo-sutil);
}

.faq-lista {
  max-width: 760px;
}

.faq-item {
  border-bottom: 1px solid var(--borda);
}

.faq-pergunta {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: none;
  border: none;
  padding: 18px 0;
  text-align: left;
  font-family: var(--font-corpo);
  font-size: 17px;
  color: var(--verde);
  min-height: 56px;

}

.faq-sinal {
  flex-shrink: 0;
  font-family: var(--font-titulo);
  color: var(--verde);
  font-size: 20px;
  transition: transform 0.25s ease;
}

.faq-sinal.aberto {
  transform: rotate(45deg);
}

.faq-resposta-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.faq-resposta-wrap.aberta {
  grid-template-rows: 1fr;
}

.faq-resposta-inner {
  overflow: hidden;
}

.faq-resposta {
  font-family: var(--font-corpo);
  font-size: 16px;
  line-height: 1.75;
  color: var(--texto-sec);
  padding-bottom: 20px;
  max-width: 560px;
}

/* Tarja de inscrição: faixa cheia, grande, o ponto mais forte da página */
.inscricao {
  position: relative;
  isolation: isolate;
  margin: clamp(24px, 4vw, 56px) 0 clamp(64px, 8vw, 112px);
  padding: clamp(56px, 8vw, 104px) 0;
  color: #fff;
}

.inscricao::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  background: #24391f;
  z-index: -2;
}

.inscricao-textura {
  position: absolute;
  inset: 0;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  background-image: linear-gradient(rgba(36, 57, 31, 0.84), rgba(36, 57, 31, 0.84)), url('/img/textura-verde.svg');
  background-size: 120% auto;
  background-position: center;
  animation: deriva-inscricao 30s ease-in-out infinite;
  z-index: -1;
}

@keyframes deriva-inscricao {
  0% { background-position: 40% 40%; }
  50% { background-position: 60% 60%; }
  100% { background-position: 40% 40%; }
}

.inscricao-conteudo {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(32px, 6vw, 96px);
}

.inscricao-texto {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.inscricao-selo {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  font-family: var(--font-corpo);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.inscricao-ponto {
  width: 8px;
  height: 8px;
  background: #b7e0a8;
  animation: pulsa-inscricao 2s ease-in-out infinite;
}

@keyframes pulsa-inscricao {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

.inscricao-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(32px, 4.6vw, 58px);
  line-height: 1.12;
  color: #fff;
}

.inscricao-sub {
  max-width: 520px;
  font-family: var(--font-corpo);
  font-size: 18px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.88);
}

.inscricao-acoes {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.inscricao-botao {
  width: 100%;
  min-height: 64px;
  font-size: 16px;
}

@media (max-width: 900px) {
  .inscricao-conteudo {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .inscricao-textura,
  .inscricao-ponto {
    animation: none;
  }
}

.barra-fixa {
  display: none;
}

@media (max-width: 767px) {
  .barra-fixa {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 90;
    height: 64px;
    padding: 8px var(--padding-h);
    background: var(--branco);
    border-top: 1px solid var(--borda);
  }

  .barra-btn {
    width: 100%;
    height: 100%;
  }

  .barra-sobe-enter-active,
  .barra-sobe-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .barra-sobe-enter-from,
  .barra-sobe-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
}

</style>
