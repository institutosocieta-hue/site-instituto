<script setup>
import { webp } from '../../../utils/imagem.js'
import { computed, ref } from 'vue'
import PainelMeioAltura from '../../../components/PainelMeioAltura.vue'
import CardPessoa from '../../../components/CardPessoa.vue'
import CardDistincao from '../../../components/CardDistincao.vue'
import {
  excelenciaSocieta,
  demaisDistincoes,
  semestresDistincoes,
  anoDistincoesSemestrais,
} from '../../../data/distincoes.js'
import { pessoas } from '../../../data/governanca.js'
import { colunasCompletas } from '../../../utils/grade.js'

const props = defineProps({
  semCabecalho: { type: Boolean, default: false },
})

// As distinções semestrais aparecem em lista, com o mesmo peso. A palavra latina de cada uma vem dos textos da distinção.
const latim = { unita: 'unitas', indice: 'index, indicis', iterare: 'iterare' }

const distincaoAberta = ref(false)
const distincaoSelecionada = ref(null)
function abrirDistincao(semestre, dist) {
  const resultado = semestre.resultados[dist.chave]
  let payload = { nome: dist.nome, texto: dist.texto, semestre: semestre.semestre }
  if (dist.chave === 'unita') {
    payload = { ...payload, tipo: 'unico', vencedor: resultado }
  } else if (dist.chave === 'indice') {
    payload = {
      ...payload,
      tipo: 'grade',
      vencedores: resultado,
      colunas: colunasCompletas(resultado?.length || 0),
    }
  } else {
    payload = { ...payload, tipo: 'nomes', nomes: resultado }
  }
  distincaoSelecionada.value = payload
  distincaoAberta.value = true
}

const galeriaAberta = ref(false)

const painelAberto = ref(false)
const vencedorSelecionado = ref(null)
function abrirVencedor(vencedor) {
  vencedorSelecionado.value = vencedor
  painelAberto.value = true
}

const pessoaCardAberto = ref(false)
const pessoaSelecionada = ref(null)
const listaVencedoresAtual = ref([])
const indiceVencedorAtual = ref(0)

const temVencedorAnterior = computed(() => listaVencedoresAtual.value.length > 1)
const temVencedorProximo = computed(() => listaVencedoresAtual.value.length > 1)

function preencherPessoaSelecionada(vencedor) {
  const perfil = pessoas[vencedor.nome]
  const rotulo = distincaoSelecionada.value
    ? `${distincaoSelecionada.value.nome} · ${distincaoSelecionada.value.semestre}`
    : null
  pessoaSelecionada.value = {
    nome: vencedor.nome,
    foto: vencedor.foto,
    cargo: vencedor.nucleo ? `${rotulo} · ${vencedor.nucleo}` : rotulo,
    associacao: perfil?.associacao,
    trajetoria: perfil?.trajetoria,
    gestao: perfil?.gestao,
    distincoes: perfil?.distincoes,
    linkedin: perfil?.linkedin || null,
  }
}

function abrirVencedorDistincao(vencedor) {
  const dist = distincaoSelecionada.value
  const lista = dist?.tipo === 'grade' ? dist.vencedores : dist?.tipo === 'unico' ? [dist.vencedor] : []
  listaVencedoresAtual.value = lista
  indiceVencedorAtual.value = lista.findIndex((v) => v.nome === vencedor.nome)
  preencherPessoaSelecionada(vencedor)
  pessoaCardAberto.value = true
}

function navegarVencedor(delta) {
  const lista = listaVencedoresAtual.value
  if (!lista.length) return
  indiceVencedorAtual.value = (indiceVencedorAtual.value + delta + lista.length) % lista.length
  preencherPessoaSelecionada(lista[indiceVencedorAtual.value])
}
</script>

<template>
  <section id="distincoes" class="secao-instituto">
    <header class="secao-cabecalho" v-if="!props.semCabecalho">
      <span class="label-caps secao-rotulo">Distinções</span>
      <h2 class="secao-titulo">O reconhecimento do trabalho bem feito.</h2>
    </header>

    <div class="secao-corpo">
      <div class="dist-abertura">
  <p class="intro-texto" v-reveal>
        O Instituto Società confere, ao final de cada semestre, distinções que
        reconhecem diferentes dimensões da vida acadêmica de seus membros. Não se
        trata de premiar apenas o brilho pontual, mas de identificar contribuições
        que estruturam a comunidade: a articulação intelectual dos debates, o
        domínio técnico consolidado e a constância comprometida com o percurso
        coletivo. Cada distinção carrega uma referência conceitual própria,
        extraída da tradição latina e italiana que dá nome ao Instituto, e
        responde a um critério específico de reconhecimento.
      </p>
        <div class="dist-emblema" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      </div>

      <div class="excelencia-bloco">
        <button class="excelencia-gatilho" @click="galeriaAberta = !galeriaAberta">
          <div class="excelencia-gatilho-texto">
            <span class="label-caps">Galeria: Excelência Società</span>
            <h2 class="excelencia-gatilho-titulo">A principal honraria do Instituto.</h2>
            <p class="excelencia-texto">
              Concedida anualmente a quem mais recebeu votos dos membros nas demais
              distinções ao longo de um período de um ano — não um mérito isolado,
              mas a soma da confiança depositada pela comunidade em um único
              percurso.
            </p>
          </div>
          <span class="excelencia-gatilho-sinal" :class="{ aberto: galeriaAberta }">+</span>
        </button>

        <div class="excelencia-painel-wrap" :class="{ aberta: galeriaAberta }">
          <div class="excelencia-painel-inner">
            <div class="galeria-excelencia" v-if="excelenciaSocieta.length">
              <button
                class="vencedor-card"
                v-for="vencedor in excelenciaSocieta"
                :key="vencedor.nome + vencedor.ano"
                @click="abrirVencedor(vencedor)"
              >
                <div class="vencedor-foto">
                  <picture v-if="vencedor.foto">
                    <source v-if="webp(vencedor.foto)" type="image/webp" :srcset="webp(vencedor.foto)" />
                    <img :src="vencedor.foto" :alt="vencedor.nome" loading="lazy" decoding="async" />
                  </picture>
                  <span v-else class="vencedor-placeholder">Foto em breve</span>
                </div>
                <span class="vencedor-nome">{{ vencedor.nome }}</span>
                <span class="vencedor-ano">{{ vencedor.ano }}</span>
              </button>
            </div>
            <p v-else class="em-breve">Ainda não há vencedores registrados.</p>
          </div>
        </div>
      </div>

      <section class="semestrais">
        <header class="semestrais-cabecalho">
          <h2 class="semestrais-titulo">Distinções Semestrais {{ anoDistincoesSemestrais }}</h2>
          <span class="semestrais-linha"></span>
        </header>

        <div class="semestres-grade">
          <article class="semestre" v-for="semestre in semestresDistincoes" :key="semestre.semestre" v-reveal>
            <header class="semestre-cabecalho">
              <span class="semestre-codigo">{{ semestre.semestre }}</span>
              <h3 class="semestre-titulo">{{ semestre.label }}</h3>
            </header>

            <div class="distincoes-lista">
              <button
                class="distincao-trigger"
                v-for="dist in demaisDistincoes"
                :key="dist.chave"
                @click="abrirDistincao(semestre, dist)"
              >
                <span class="distincao-textos">
                  <span class="distincao-latim">{{ latim[dist.chave] }}</span>
                  <h4 class="distincao-nome">{{ dist.nome }}</h4>
                </span>
                <span class="distincao-seta" aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>

    <PainelMeioAltura v-model="painelAberto">
      <template v-if="vencedorSelecionado">
        <span class="label-caps">Excelência Società · {{ vencedorSelecionado.ano }}</span>
        <h2 class="painel-nome">{{ vencedorSelecionado.nome }}</h2>
        <p class="painel-descricao">{{ vencedorSelecionado.descricao }}</p>
      </template>
    </PainelMeioAltura>

    <CardDistincao
      v-model="distincaoAberta"
      :distincao="distincaoSelecionada"
      @abrir-pessoa="abrirVencedorDistincao"
    />
    <CardPessoa
      v-model="pessoaCardAberto"
      :pessoa="pessoaSelecionada"
      :tem-anterior="temVencedorAnterior"
      :tem-proxima="temVencedorProximo"
      @anterior="navegarVencedor(-1)"
      @proxima="navegarVencedor(1)"
    />
  </section>
</template>

<style scoped>
/* ── Abertura: texto + emblema de quadrados concêntricos (o quadradinho do Instituto) ── */
.dist-abertura {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(32px, 6vw, 96px);
}

.intro-texto {
  max-width: 780px;
  padding-left: clamp(20px, 2.4vw, 32px);
  border-left: 3px solid var(--verde);
  font-family: var(--font-corpo);
  font-size: clamp(17px, 1.5vw, 19px);
  line-height: 1.9;
  color: var(--texto-corpo);
}

.dist-emblema {
  position: relative;
  width: clamp(140px, 16vw, 220px);
  aspect-ratio: 1 / 1;
}

.dist-emblema span {
  position: absolute;
  border: 1px solid var(--sage);
  transition: transform 1.2s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.dist-emblema span:nth-child(1) { inset: 0; }
.dist-emblema span:nth-child(2) { inset: 14%; transform: rotate(6deg); }
.dist-emblema span:nth-child(3) { inset: 28%; transform: rotate(12deg); }
.dist-emblema span:nth-child(4) { inset: 42%; background: var(--verde); border-color: var(--verde); transform: rotate(18deg); }

.dist-abertura:hover .dist-emblema span:nth-child(2) { transform: rotate(-6deg); }
.dist-abertura:hover .dist-emblema span:nth-child(3) { transform: rotate(-12deg); }
.dist-abertura:hover .dist-emblema span:nth-child(4) { transform: rotate(-18deg); }

/* ── Excelência Società: faixa verde cheia ── */
.excelencia-bloco {
  --verde: #ffffff;
  --branco: #324b30;
  --texto-corpo: #eef1ea;
  --texto-sec: #d3dccf;
  --sage-texto: #b9c7b4;
  --borda: rgba(255, 255, 255, 0.22);
  --fundo-sutil: #3d5a3b;
  position: relative;
  isolation: isolate;
  color: var(--verde);
}

.excelencia-bloco::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  background-color: #324b30;
  background-image: linear-gradient(rgba(35, 55, 34, 0.88), rgba(35, 55, 34, 0.88)), url('/img/textura-verde.svg');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.excelencia-gatilho {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: clamp(48px, 6vw, 80px) 0;
  background: none;
  border: none;
  text-align: left;
  color: inherit;
  cursor: pointer;
}

.excelencia-gatilho-texto {
  max-width: 700px;
}

.excelencia-gatilho-texto .label-caps {
  display: block;
  margin-bottom: 14px;
  color: var(--sage-texto);
}

.excelencia-gatilho-titulo {
  margin-bottom: 16px;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.2;
  color: var(--verde);
}

.excelencia-texto {
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.85;
  color: var(--texto-corpo);
}

.excelencia-gatilho-sinal {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--verde);
  border-radius: 50%;
  font-family: var(--font-titulo);
  font-size: 24px;
  color: var(--verde);
  transition: transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1), background 0.3s ease, color 0.3s ease;
}

.excelencia-gatilho:hover .excelencia-gatilho-sinal {
  background: var(--verde);
  color: #324b30;
}

.excelencia-gatilho-sinal.aberto {
  transform: rotate(45deg);
}

.excelencia-painel-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.excelencia-painel-wrap.aberta {
  grid-template-rows: 1fr;
}

.excelencia-painel-inner {
  overflow: hidden;
}

.excelencia-painel-wrap.aberta .excelencia-painel-inner {
  padding-bottom: clamp(48px, 6vw, 80px);
}

.galeria-excelencia {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 24px 20px;
  padding-top: 8px;
}

.vencedor-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  color: inherit;
  cursor: pointer;
}

.vencedor-foto {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--raio);
  overflow: hidden;
  background: var(--fundo-sutil);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.vencedor-card:hover .vencedor-foto {
  transform: translateY(-5px);
}

.vencedor-foto picture,
.vencedor-foto img {
  display: block;
  width: 100%;
  height: 100%;
}

.vencedor-foto img {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.8s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.vencedor-card:hover .vencedor-foto img {
  transform: scale(1.05);
}

.vencedor-placeholder {
  font-family: var(--font-corpo);
  font-size: 13px;
  color: var(--sage-texto);
}

.vencedor-nome {
  font-family: var(--font-corpo);
  font-size: 15px;
  font-weight: 600;
  color: var(--verde);
}

.vencedor-ano {
  font-family: var(--font-corpo);
  font-size: 13px;
  color: var(--sage-texto);
}

.em-breve {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  color: var(--texto-sec);
  font-style: italic;
}

/* ── Distinções semestrais ── */
.semestrais {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.semestrais-cabecalho {
  display: flex;
  align-items: center;
  gap: 20px;
}

.semestrais-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(24px, 2.8vw, 36px);
  color: var(--verde);
}

.semestrais-linha {
  flex: 1;
  height: 1px;
  background: var(--borda);
}

.semestres-grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: clamp(28px, 3.4vw, 48px);
}

.semestre {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.semestre-cabecalho {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--verde);
}

.semestre-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(28px, 3.2vw, 42px);
  line-height: 1.1;
  color: var(--verde);
}

.semestre-codigo {
  order: 2;
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--sage-texto);
}

/* demais distinções */
.distincoes-lista {
  display: flex;
  flex-direction: column;
}

.distincao-trigger {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  min-height: 84px;
  padding: 0 clamp(8px, 1.4vw, 20px);
  background: none;
  border: none;
  border-bottom: 1px solid var(--borda);
  text-align: left;
  color: var(--verde);
  cursor: pointer;
  transition: color 0.35s ease;
}

.distincao-trigger::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--verde);
  transform: translateX(-101%);
  transition: transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.distincao-trigger:hover,
.distincao-trigger:focus-visible {
  color: #fff;
}

.distincao-trigger:hover::before,
.distincao-trigger:focus-visible::before {
  transform: none;
}

.distincao-textos {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.distincao-latim {
  font-family: var(--font-titulo);
  font-size: 13.5px;
  font-style: italic;
  color: var(--sage-texto);
  transition: color 0.35s ease;
}

.distincao-trigger:hover .distincao-latim {
  color: rgba(255, 255, 255, 0.8);
}

.distincao-nome {
  font-family: var(--font-titulo);
  font-size: 21px;
  font-weight: 600;
  line-height: 1.3;
  color: inherit;
}

.distincao-seta {
  font-family: var(--font-titulo);
  font-size: 18px;
  transition: transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.distincao-trigger:hover .distincao-seta {
  transform: translateX(8px);
}

.painel-nome {
  font-family: var(--font-titulo);
  font-size: 22px;
  color: var(--verde);
  margin: 12px 0 18px;
}

.painel-descricao {
  font-family: var(--font-corpo);
  font-size: 16.5px;
  line-height: 1.8;
  color: var(--texto-corpo);
}

@media (max-width: 900px) {
  .dist-abertura {
    grid-template-columns: minmax(0, 1fr);
  }

  .dist-emblema {
    display: none;
  }
}

@media (max-width: 1024px) {
  .galeria-excelencia {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .galeria-excelencia {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dist-emblema span {
    transition: none;
  }
}
</style>
