<script setup>
import { webp } from '../../utils/imagem.js'
import { computed, ref } from 'vue'
import HeroVerde from '../../components/HeroVerde.vue'
import AvisoTicker from '../../components/AvisoTicker.vue'
import CardDinamica from '../../components/CardDinamica.vue'
import CardMateria from '../../components/CardMateria.vue'
import CapaEdicao from '../../components/CapaEdicao.vue'
import FluxoMetodo from '../../components/FluxoMetodo.vue'
import AgendaItem from '../../components/AgendaItem.vue'
import { avisosInstituto } from '../../data/avisosInstituto.js'
import { edicoes } from '../../data/edicoes.js'
import { agenda } from '../../data/agenda.js'
import { seriesYoutube, linkCanal } from '../../data/eventos.js'
import { efetivos } from '../../data/membros.js'
import { celulas } from '../../data/celulas.js'
import { nucleosEmAndamento } from '../../data/nucleosEmAndamento.js'
import MateriaCard from '../../components/MateriaCard.vue'

const dinamicas = [
  {
    titulo: 'Encontros Horizontais',
    texto: 'Reúnem, horizontalmente, os integrantes de todos os núcleos de estudo em torno de um convidado especialista.',
    detalhe:
      'Os Encontros Horizontais são o ponto de encontro entre todos os núcleos do Instituto. Periodicamente, os integrantes se reúnem para ouvir um convidado especialista e debater, coletivamente, um tema que atravessa diferentes áreas do Direito Empresarial: o desaguar de tudo o que cada núcleo aprofunda em suas Verticais.',
    foto: '/dinamicas/encontros-horizontais.png',
    to: '/atividades',
  },
  {
    titulo: 'Núcleos de Estudo',
    texto: 'Grupos temáticos de estudo e produção acadêmica, renovados a cada semestre.',
    detalhe:
      'Os núcleos de estudo são o braço produtivo do Instituto. A cada semestre, um novo recorte do Direito Empresarial é proposto, e um grupo se forma em torno dele: dos primeiros debates ao resumo expandido publicado na Revista QuotaParte.',
    foto: '/dinamicas/nucleos.png',
    to: '/revista/nucleos',
  },
  {
    titulo: 'Revista QuotaParte',
    texto: 'Publicação semestral que reúne os resumos expandidos produzidos pelos núcleos.',
    detalhe:
      'A QuotaParte é o registro do pensamento coletivo do Instituto: uma publicação semestral que reúne os resumos expandidos produzidos por cada núcleo, do primeiro debate à edição publicada.',
    foto: '/dinamicas/quotaparte.png',
    to: '/revista',
  },
  {
    titulo: 'YouTube',
    texto: 'Conferências Società, Nota de Rodapé e Quórum: conteúdo em vídeo aberto ao público.',
    detalhe:
      'No YouTube, o Instituto leva parte de suas discussões ao público: Conferências Società, com especialistas convidados; Nota de Rodapé, entrevistas com autores de referência; e Quórum, um clube de leitura em formato de assembleia.',
    foto: '/dinamicas/youtube.png',
    to: '/comunidade',
  },
  {
    titulo: 'Distinções',
    texto: 'Reconhecimento semestral e anual da produção acadêmica e do engajamento dos membros.',
    detalhe:
      'Ao final de cada semestre, o Instituto reconhece a produção acadêmica e o engajamento de seus membros através de distinções com raízes na tradição latina e italiana que dá nome à instituição.',
    foto: '/dinamicas/distincoes.png',
    to: '/distincoes',
  },
  {
    titulo: 'Governança',
    texto: 'Diretoria e coordenadores de núcleo que estruturam o Instituto a cada semestre.',
    detalhe:
      'A Diretoria conduz as decisões institucionais, enquanto os coordenadores de núcleo respondem pela produção acadêmica de cada Vertical ao longo do semestre.',
    foto: '/dinamicas/governanca.png',
    to: '/membros',
  },
]

const dinamicaCardAberto = ref(false)
const dinamicaSelecionada = ref(null)
function abrirDinamica(dinamica) {
  dinamicaSelecionada.value = dinamica
  dinamicaCardAberto.value = true
}

const noticiaCardAberto = ref(false)
const noticiaSelecionada = ref(null)
function abrirNoticia(noticia) {
  noticiaSelecionada.value = noticia
  noticiaCardAberto.value = true
}

const etapas = [
  {
    numeral: 'I',
    titulo: dinamicas[1].titulo,
    texto: dinamicas[1].texto,
  },
  {
    numeral: 'II',
    titulo: 'Resumos expandidos',
    texto: 'Ao final do semestre, os membros entregam um resumo expandido, que dá origem a uma edição da QuotaParte.',
  },
  {
    numeral: 'III',
    titulo: dinamicas[2].titulo,
    texto: dinamicas[2].texto,
  },
  {
    numeral: 'IV',
    titulo: dinamicas[0].titulo,
    texto: dinamicas[0].texto,
  },
]

// Em destaque: a matéria mais recente, o último número da revista e o último vídeo
const materiaDestaque = computed(() => [...agenda].sort((a, b) => b.data.localeCompare(a.data))[0] || null)
const videoDestaque = computed(() => {
  const comEpisodio = seriesYoutube.filter((s) => s.ultimoEpisodio?.data)
  const maisNovo = comEpisodio.sort((a, b) => b.ultimoEpisodio.data.localeCompare(a.ultimoEpisodio.data))[0]
  return maisNovo ? { serie: maisNovo.nome, ...maisNovo.ultimoEpisodio } : null
})

// Números: tudo vem dos dados do site
const numeros = [
  { valor: efetivos.length, sufixo: '', rotulo: 'Membros efetivos' },
  { valor: nucleosEmAndamento.nucleos.length, sufixo: '', rotulo: 'Núcleos de estudo no semestre' },
  { valor: celulas.length, sufixo: '', rotulo: 'Células regionais' },
  { valor: 10, sufixo: '+', rotulo: 'Estados com membros' },
]

const ultimaEdicao = computed(() => [...edicoes].sort((a, b) => b.numero - a.numero)[0] || null)

const hoje = new Date().toISOString().slice(0, 10)
const proximos = computed(() =>
  agenda
    .filter((e) => e.data >= hoje)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3)
)
const recentes = computed(() =>
  agenda
    .filter((e) => e.data < hoje)
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 4)
)
// "Próximos encontros" só aparece quando há eventos futuros; os já realizados
// aparecem em "Notícias e Atualizações".
const noticiasExibidas = computed(() => recentes.value)

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>

<template>
  <div class="vista">
    <HeroVerde
      label="Instituto Società"
      titulo="Direito Empresarial entre *futuras referências no assunto.*"
      grande
      sub="Uma comunidade acadêmica independente, formada por jovens advogados e estudantes dedicados ao estudo do Direito Empresarial."
    >
      <template #acoes>
        <router-link to="/membros#seja-membro" class="btn-claro">Seja membro →</router-link>
        <router-link to="/revista" class="btn-secundario btn-secundario--claro">
          Revista QuotaParte
        </router-link>
      </template>
      <AvisoTicker :mensagens="avisosInstituto" />
    </HeroVerde>

    <div class="pagina pagina--sobrepoe">
      <section class="foco" v-if="materiaDestaque">
        <header class="foco-cabecalho">
          <span class="label-caps secao-rotulo">Em destaque</span>
          <router-link to="/atividades" class="foco-todos">
            Todas as notícias
            <span aria-hidden="true">→</span>
          </router-link>
        </header>

        <div class="foco-grade">
          <MateriaCard :materia="materiaDestaque" variante="destaque" @abrir="abrirNoticia" />

          <div class="foco-lateral">
            <router-link v-if="ultimaEdicao" :to="`/revista/edicoes/${ultimaEdicao.numero}`" class="foco-item">
              <span class="foco-item-rotulo">QuotaParte · Edição {{ String(ultimaEdicao.numero).padStart(2, '0') }}</span>
              <span class="foco-item-titulo">{{ ultimaEdicao.chamada }}</span>
              <span class="foco-item-mais">Ler edição <span aria-hidden="true">→</span></span>
            </router-link>

            <a
              v-if="videoDestaque"
              :href="videoDestaque.linkYoutube || linkCanal"
              target="_blank"
              rel="noopener"
              class="foco-item"
            >
              <span class="foco-item-rotulo">YouTube · {{ videoDestaque.serie }}</span>
              <span class="foco-item-titulo">{{ videoDestaque.titulo }}</span>
              <span class="foco-item-mais">Assistir <span aria-hidden="true">→</span></span>
            </a>
          </div>
        </div>
      </section>

      <section class="numeros" aria-label="O Instituto em números">
        <div class="numero" v-for="n in numeros" :key="n.rotulo">
          <span class="numero-valor">
            <span v-contar="n.valor">{{ n.valor }}</span><span class="numero-sufixo">{{ n.sufixo }}</span>
          </span>
          <span class="numero-rotulo">{{ n.rotulo }}</span>
        </div>
      </section>

      <section class="grid-missao" v-reveal>
        <div class="bloco-missao">
          <div class="bloco-cabecalho">
            <span class="bloco-numeral">I</span>
            <h2 class="bloco-titulo">Missão</h2>
          </div>
          <p>
            O Instituto Società é uma comunidade acadêmica independente, formada por
            jovens advogados e estudantes dedicados ao estudo do Direito Empresarial.
            Reunimos pessoas com o mesmo engajamento em torno de encontros,
            discussões e produção de conhecimento. Nosso objetivo é difundir o
            estudo do Direito Empresarial desde quando for possível: um ambiente
            que dá protagonismo a jovens ideias e abre espaço para a ideia de
            jovens.
          </p>
        </div>
        <div class="bloco-missao">
          <div class="bloco-cabecalho">
            <span class="bloco-numeral">II</span>
            <h2 class="bloco-titulo">Método</h2>
          </div>
          <p>
            Os núcleos de estudo são o braço produtivo do Instituto: grupos
            temáticos itinerantes que se dedicam, a cada semestre, a um recorte
            específico do Direito Empresarial, dando origem aos resumos expandidos
            publicados na Revista QuotaParte. Esses recortes deságuam nos
            Encontros Horizontais, onde todos os integrantes se reúnem,
            independentemente do núcleo, para beber do conhecimento de
            especialistas na área.
          </p>
        </div>
      </section>

      <section v-reveal>
        <span class="label-caps secao-rotulo">Como funciona</span>
        <FluxoMetodo :etapas="etapas" />
      </section>

      <section>
        <span class="label-caps secao-rotulo">Dinâmicas do Instituto</span>

        <div class="dinamicas-grade grade-stagger">
          <button
            v-for="(dinamica, i) in dinamicas"
            :key="dinamica.titulo"
            class="dinamica-card"
            v-reveal
            @click="abrirDinamica(dinamica)"
          >
            <div class="dinamica-foto">
              <picture>
                <source v-if="webp(dinamica.foto)" type="image/webp" :srcset="webp(dinamica.foto)" />
                <img :src="dinamica.foto" :alt="dinamica.titulo" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="dinamica-corpo">
              <div class="dinamica-cabecalho">
                <span class="dinamica-numero">{{ String(i + 1).padStart(2, '0') }}</span>
                <h3 class="dinamica-titulo">{{ dinamica.titulo }}</h3>
              </div>
              <p class="dinamica-texto">{{ dinamica.texto }}</p>
              <span class="dinamica-mais">Saiba mais →</span>
            </div>
          </button>
        </div>
      </section>

      <section>
        <span class="label-caps secao-rotulo">Notícias e Atualizações</span>

        <div class="noticias-grade grade-stagger" v-if="noticiasExibidas.length">
          <button
            v-for="noticia in noticiasExibidas"
            :key="noticia.titulo"
            class="noticia-card"
            v-reveal
            @click="abrirNoticia(noticia)"
          >
            <div class="noticia-imagem" :style="{ aspectRatio: noticia.imagemProporcao || '4 / 5' }">
              <picture v-if="noticia.imagem">
                <source v-if="webp(noticia.imagem)" type="image/webp" :srcset="webp(noticia.imagem)" />
                <img :src="noticia.imagem" :alt="noticia.titulo" loading="lazy" decoding="async" />
              </picture>
              <span v-else class="noticia-cidade" aria-hidden="true"></span>
            </div>
            <div class="noticia-corpo">
              <span class="noticia-data">{{ formatarData(noticia.data) }}</span>
              <h3 class="noticia-titulo">{{ noticia.titulo }}</h3>
              <p class="noticia-resumo">{{ noticia.resumo || noticia.corpo?.[0] }}</p>
              <span class="noticia-mais">Ler notícia →</span>
            </div>
          </button>
        </div>
        <div class="noticias-placeholder" v-else v-reveal>
          <span class="label-caps">Espaço reservado</span>
          <p>
            Aqui entram notas curtas sobre as atividades do Instituto: um
            Encontro Horizontal recente, uma nova parceria, um núcleo que
            fechou o semestre. Formato sugerido: foto 16:10, título curto e
            duas linhas de resumo, como nos cards acima.
          </p>
        </div>
      </section>

      <section v-if="ultimaEdicao">
        <span class="label-caps secao-rotulo">Última edição</span>
        <div class="ultima-edicao" v-reveal>
          <router-link :to="`/revista/edicoes/${ultimaEdicao.numero}`" class="ultima-capa">
            <CapaEdicao :capa="ultimaEdicao.capa" :alt="`Capa da edição ${ultimaEdicao.numero}`" />
          </router-link>
          <div class="ultima-corpo">
            <span class="ultima-meta">
              Edição {{ String(ultimaEdicao.numero).padStart(2, '0') }} · {{ ultimaEdicao.semestre }} ·
              {{ ultimaEdicao.trabalhos?.length || 0 }} trabalhos
            </span>
            <h3 class="ultima-titulo">{{ ultimaEdicao.chamada }}</h3>
            <p class="ultima-nucleo">Núcleo de {{ ultimaEdicao.nucleo }}</p>
            <div class="ultima-acoes">
              <router-link :to="`/revista/edicoes/${ultimaEdicao.numero}`" class="btn-primario">
                Ler edição →
              </router-link>
              <router-link to="/revista/edicoes" class="btn-secundario">Todas as edições</router-link>
            </div>
          </div>
        </div>
      </section>

      <section v-if="proximos.length">
        <span class="label-caps secao-rotulo">Próximos encontros</span>
        <div class="encontros-lista">
          <AgendaItem
            v-for="evento in proximos"
            :key="evento.titulo"
            :evento="evento"
            @click="abrirNoticia(evento)"
          />
        </div>
        <router-link to="/atividades#agenda" class="encontros-mais">Ver agenda completa →</router-link>
      </section>
    </div>

    <section class="cta-banda">
      <div class="cta-textura"></div>
      <div class="cta-conteudo" v-reveal>
        <h2 class="cta-titulo">Interessado em aprofundar o Direito Empresarial entre pares?</h2>
        <router-link to="/membros#seja-membro" class="btn-claro btn-claro--grande">
          Seja membro →
        </router-link>
      </div>
    </section>

    <CardDinamica v-model="dinamicaCardAberto" :dinamica="dinamicaSelecionada" />
    <CardMateria v-model="noticiaCardAberto" :materia="noticiaSelecionada" />
  </div>
</template>

<style scoped>
.grid-missao {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: clamp(40px, 6vw, 80px);
}

.bloco-missao {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 24px;
  border-top: 1px solid var(--verde);
}

.bloco-cabecalho {
  display: flex;
  align-items: baseline;
  gap: 14px;
}

.bloco-numeral {
  font-family: var(--font-titulo);
  font-size: 15px;
  color: var(--sage-texto);
}

.bloco-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(24px, 2.4vw, 30px);
  color: var(--verde);
}

.bloco-missao p {
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.8;
  color: var(--texto-corpo);
}

.dinamicas-grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: clamp(28px, 3vw, 40px) clamp(20px, 2.4vw, 32px);
}

/* Em destaque */
.foco {
  display: flex;
  flex-direction: column;
}

.foco .foco-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.foco-todos {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 700;
  color: var(--verde);
  transition: gap 0.4s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.foco-todos:hover {
  gap: 14px;
}

.foco-grade {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: stretch;
}

.foco-lateral {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--verde);
}

.foco-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 28px 0;
  border-bottom: 1px solid var(--borda);
  color: var(--verde);
  transition: padding-left 0.45s cubic-bezier(0.22, 0.8, 0.2, 1), background 0.3s ease;
}

.foco-item:hover {
  padding-left: 14px;
  background: var(--fundo-sutil);
}

.foco-item-rotulo {
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.foco-item-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(18px, 1.8vw, 22px);
  line-height: 1.4;
  color: var(--verde);
}

.foco-item-mais {
  display: inline-flex;
  gap: 8px;
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 700;
}

/* Números */
.numeros {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--verde);
  border-bottom: 1px solid var(--borda);
}

.numero {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: clamp(24px, 3vw, 40px) clamp(16px, 2vw, 28px);
  border-left: 1px solid var(--borda);
}

.numero:first-child {
  border-left: none;
  padding-left: 0;
}

.numero-valor {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(40px, 5vw, 64px);
  line-height: 1;
  color: var(--verde);
}

.numero-sufixo {
  color: var(--sage);
}

.numero-rotulo {
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

@media (max-width: 900px) {
  .foco-grade {
    grid-template-columns: minmax(0, 1fr);
  }

  .numeros {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .numero:nth-child(3) {
    border-left: none;
    padding-left: 0;
  }

  .numero:nth-child(n + 3) {
    border-top: 1px solid var(--borda);
  }
}

.dinamica-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0;
  background: none;
  border: none;
  text-align: left;
  color: var(--verde);
  transition: opacity 0.2s ease;
}

.dinamica-card:hover {
  opacity: 0.92;
}

.dinamica-foto {
  aspect-ratio: 16 / 10;
  width: 100%;
  overflow: hidden;
  border-radius: var(--raio);
  background: var(--fundo-sutil);
}

.dinamica-foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dinamica-corpo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dinamica-cabecalho {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.dinamica-numero {
  font-family: var(--font-titulo);
  font-size: 14px;
  color: var(--sage-texto);
}

.dinamica-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 20px;
  line-height: 1.3;
  color: var(--verde);
}

.dinamica-texto {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--texto-sec);
}

.dinamica-mais,
.noticia-mais {
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--verde);
  margin-top: 2px;
}

.ultima-edicao {
  display: grid;
  grid-template-columns: minmax(160px, 260px) minmax(0, 1fr);
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
}

.ultima-capa :deep(.capa) {
  box-shadow: 0 22px 34px -16px rgba(50, 75, 48, 0.4);
}

.ultima-corpo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ultima-meta {
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.ultima-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(22px, 2.4vw, 30px);
  line-height: 1.35;
  color: var(--verde);
}

.ultima-nucleo {
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.6;
  color: var(--texto-sec);
}

.ultima-acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.noticias-grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr));
  gap: clamp(32px, 4vw, 56px);
}

.noticia-card {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  text-align: left;
  color: var(--verde);
  transition: opacity 0.2s ease;
}

.noticia-card:hover {
  opacity: 0.9;
}

.noticia-imagem {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: var(--raio);
  border: 1px solid var(--borda);
  background: var(--fundo-sutil);
  display: flex;
  align-items: center;
  justify-content: center;
}

.noticia-imagem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.noticia-imagem {
  position: relative;
}

.noticia-imagem .noticia-cidade {
  position: absolute;
  inset: 0;
  background-color: #b9bfb1;
  background-image: url('/img/textura-sage.svg');
  background-size: cover;
  background-position: center;
}

.noticia-corpo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
}

.noticia-data {
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.noticia-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(18px, 1.7vw, 22px);
  line-height: 1.35;
  color: var(--verde);
}

.noticia-resumo {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--texto-sec);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.noticia-mais {
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--verde);
  margin-top: 4px;
}

.noticias-placeholder {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  border: 1px dashed var(--borda);
  border-radius: var(--raio);
  background: var(--fundo-sutil);
  padding: 28px 32px;
}

.noticias-placeholder p {
  font-family: var(--font-corpo);
  font-style: italic;
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--texto-sec);
  max-width: 560px;
}

@media (max-width: 560px) {
  .noticia-card {
    grid-template-columns: 1fr;
  }
}

.encontros-lista {
  border-top: 1px solid var(--borda);
}

.encontros-mais {
  display: inline-block;
  margin-top: 24px;
  font-family: var(--font-corpo);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--verde);
}

.cta-banda {
  position: relative;
  z-index: 2;
  overflow: hidden;
  background-color: var(--verde);
}

.cta-textura {
  position: absolute;
  inset: -40px;
  background-image: linear-gradient(rgba(50, 75, 48, 0.86), rgba(50, 75, 48, 0.86)),
    url('/img/textura-verde.svg');
  background-size: 120% auto;
  background-position: center;
  animation: deriva-cta 34s ease-in-out infinite;
}

@keyframes deriva-cta {
  0% {
    background-position: 45% 45%;
  }
  50% {
    background-position: 55% 55%;
  }
  100% {
    background-position: 45% 45%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta-textura {
    animation: none;
  }
}

.cta-conteudo {
  position: relative;
  z-index: 1;
  max-width: 820px;
  margin: 0 auto;
  padding: clamp(72px, 10vw, 120px) var(--padding-h);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;
}

.cta-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(26px, 3.4vw, 40px);
  line-height: 1.3;
  color: var(--branco);
}

@media (max-width: 700px) {
  .ultima-edicao {
    grid-template-columns: minmax(0, 1fr);
  }

  .ultima-capa {
    max-width: 200px;
  }
}

/* refinamento: fio verde que se desenha sob a foto ao passar o mouse */
.dinamica-corpo {
  position: relative;
  padding-top: 16px;
  border-top: 1px solid var(--borda);
}

.dinamica-corpo::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--verde);
  transition: width 0.8s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.dinamica-card:hover .dinamica-corpo::before {
  width: 100%;
}

.dinamica-foto {
  box-shadow: 0 18px 30px -22px rgba(26, 26, 26, 0.5);
  transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1), box-shadow 0.6s ease;
}

.dinamica-card:hover .dinamica-foto {
  transform: translateY(-5px);
  box-shadow: 0 30px 40px -24px rgba(26, 26, 26, 0.55);
}
</style>
