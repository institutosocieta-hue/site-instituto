<script setup>
import { webp } from '../../utils/imagem.js'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import HeroVerde from '../../components/HeroVerde.vue'
import MateriaCard from '../../components/MateriaCard.vue'
import CardMateria from '../../components/CardMateria.vue'
import SerieYoutubeCard from '../../components/SerieYoutubeCard.vue'
import { semestreEncontros, seriesYoutube } from '../../data/eventos.js'
import { agenda } from '../../data/agenda.js'

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const hoje = new Date().toISOString().slice(0, 10)

// ── Portal de notícias ──
const tipos = [...new Set(agenda.map((e) => e.tipo))]
const filtro = ref('')

const materias = computed(() =>
  agenda
    .filter((e) => !filtro.value || e.tipo === filtro.value)
    .sort((a, b) => b.data.localeCompare(a.data))
)
const manchete = computed(() => materias.value[0] || null)
const ultimas = computed(() => materias.value.slice(1, 4))
const demais = computed(() => materias.value.slice(4))
const proximos = computed(() =>
  agenda.filter((e) => e.data >= hoje).sort((a, b) => a.data.localeCompare(b.data))
)

const atualizadoEm = computed(() => {
  const recente = [...agenda].sort((a, b) => b.data.localeCompare(a.data))[0]
  if (!recente) return ''
  const [ano, mes, dia] = recente.data.split('-').map(Number)
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

function partesData(data) {
  const [ano, mes, dia] = data.split('-')
  return { dia, mes: MESES[Number(mes) - 1], ano }
}

// ── Cartão (modal) ──
const cardAberto = ref(false)
const materiaSelecionada = ref(null)
function abrir(materia) {
  materiaSelecionada.value = materia
  cardAberto.value = true
}

const route = useRoute()
onMounted(() => {
  const achada = agenda.find((e) => e.slug === route.query.noticia)
  if (achada) abrir(achada)
})

// ── Encontros Horizontais do semestre ──
const encontros = computed(() =>
  [...semestreEncontros.encontros].sort((a, b) => a.data.localeCompare(b.data))
)
function abrirEncontro(e) {
  abrir({
    data: e.data,
    tipo: 'Encontro Horizontal',
    titulo: `${e.tema}, com ${e.convidado}`,
    corpo: [e.descricao],
    convidados: [e.convidado],
    host: e.host,
    local: e.local,
    cidade: e.cidade,
    formato: e.formato,
    canal: e.canal,
    horario: e.horario,
    imagem: e.foto,
  })
}

// ── YouTube: só episódios dos últimos 30 dias (os demais ficam no portal da Comunidade) ──
function diasDesde(data) {
  const [ano, mes, dia] = data.split('-').map(Number)
  return (Date.now() - new Date(ano, mes - 1, dia).getTime()) / 86400000
}
const seriesRecentes = computed(() =>
  seriesYoutube.filter((s) => s.ultimoEpisodio?.data && diasDesde(s.ultimoEpisodio.data) <= 30)
)
</script>

<template>
  <div class="vista">
    <HeroVerde
      label="Atividades"
      titulo="Onde o estudo se encontra com a prática."
      imagem-fundo="/dinamicas/encontros-horizontais.png"
    />

    <div class="pagina pagina--sobrepoe">
      <section id="agenda" class="portal">
        <header class="portal-masthead">
          <div class="portal-titulos">
            <span class="label-caps">Agenda</span>
            <h2 class="portal-titulo">Notícias e Atualizações</h2>
            <span class="portal-edicao" v-if="atualizadoEm">Atualizado em {{ atualizadoEm }}</span>
          </div>

          <div class="portal-filtros" role="group" aria-label="Filtrar por tipo" v-if="tipos.length > 1">
            <button class="filtro" :class="{ ativo: filtro === '' }" :aria-pressed="filtro === ''" @click="filtro = ''">
              Todas
            </button>
            <button
              v-for="tipo in tipos"
              :key="tipo"
              class="filtro"
              :class="{ ativo: filtro === tipo }"
              :aria-pressed="filtro === tipo"
              @click="filtro = tipo"
            >
              {{ tipo }}
            </button>
          </div>
        </header>

        <div class="agenda-faixa" v-if="proximos.length && !filtro">
          <span class="agenda-faixa-rotulo">Agenda</span>
          <button class="agenda-chip" v-for="evento in proximos" :key="evento.slug" @click="abrir(evento)">
            <span class="agenda-chip-data">
              <strong>{{ partesData(evento.data).dia }}</strong>
              {{ partesData(evento.data).mes }}
            </span>
            <span class="agenda-chip-titulo">{{ evento.titulo }}</span>
            <span class="agenda-chip-seta" aria-hidden="true">→</span>
          </button>
        </div>

        <template v-if="manchete">
          <div class="portal-topo">
            <MateriaCard :materia="manchete" variante="destaque" :key="manchete.slug" @abrir="abrir" />

            <div class="portal-ultimas" v-if="ultimas.length">
              <h3 class="ultimas-titulo">Últimas</h3>
              <MateriaCard
                v-for="materia in ultimas"
                :key="materia.slug"
                :materia="materia"
                variante="lista"
                @abrir="abrir"
              />
            </div>
          </div>

          <div class="portal-grade grade-stagger" v-if="demais.length">
            <MateriaCard
              v-for="materia in demais"
              :key="materia.slug"
              :materia="materia"
              v-reveal
              @abrir="abrir"
            />
          </div>
        </template>
        <p v-else class="em-breve">Em breve, acompanhe nossas redes.</p>
      </section>

      <section class="editoria" id="encontros-semestre">
        <header class="editoria-cabecalho">
          <h2 class="editoria-titulo">Encontros Horizontais do semestre</h2>
          <span class="editoria-semestre">{{ semestreEncontros.semestre }}</span>
          <span class="editoria-contagem">{{ encontros.length }} {{ encontros.length === 1 ? 'encontro' : 'encontros' }}</span>
          <span class="editoria-linha"></span>
        </header>

        <ol class="trajetoria grade-stagger">
          <li class="encontro" v-for="encontro in encontros" :key="encontro.data" v-reveal>
            <button class="encontro-botao" @click="abrirEncontro(encontro)">
              <span class="encontro-trilha" aria-hidden="true"><span class="encontro-ponto"></span></span>
              <span class="encontro-data">
                <strong>{{ partesData(encontro.data).dia }}</strong>
                {{ partesData(encontro.data).mes }} {{ partesData(encontro.data).ano }}
              </span>

              <span class="encontro-foto">
                <picture v-if="encontro.foto">
                  <source v-if="webp(encontro.foto)" type="image/webp" :srcset="webp(encontro.foto)" />
                  <img :src="encontro.foto" :alt="`Encontro Horizontal com ${encontro.convidado}`" loading="lazy" decoding="async" />
                </picture>
                <span v-else class="encontro-cidade" aria-hidden="true"></span>
              </span>

              <span class="encontro-nome">{{ encontro.convidado }}</span>
              <span class="encontro-tema">{{ encontro.tema }}</span>
              <span class="encontro-mais">
                Abrir
                <span class="encontro-seta" aria-hidden="true">→</span>
              </span>
            </button>
          </li>
        </ol>
      </section>

      <section class="editoria editoria--verde">
        <header class="editoria-cabecalho">
          <h2 class="editoria-titulo">YouTube</h2>
          <span class="editoria-linha"></span>
        </header>

        <div class="youtube-grade" v-if="seriesRecentes.length">
          <SerieYoutubeCard v-for="serie in seriesRecentes" :key="serie.nome" :serie="serie" />
        </div>
        <p v-else class="em-breve">Nenhum episódio publicado ainda este mês.</p>
      </section>
    </div>

    <CardMateria v-model="cardAberto" :materia="materiaSelecionada" />
  </div>
</template>

<style scoped>
.em-breve {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  color: var(--texto-sec);
  font-style: italic;
}

/* ── Portal ── */
.portal {
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 4vw, 52px);
  scroll-margin-top: calc(var(--nav-h) + 16px);
}

.portal-masthead {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px 40px;
  padding-bottom: 22px;
  border-bottom: 3px double var(--verde);
}

.portal-titulos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.portal-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.1;
  letter-spacing: 0.01em;
  color: var(--verde);
}

.portal-edicao {
  font-family: var(--font-corpo);
  font-size: 13px;
  font-style: italic;
  color: var(--sage-texto);
}

.portal-filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filtro {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  min-height: 40px;
  padding: 0 16px;
  background: transparent;
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--verde);
  transition: color 0.3s ease, border-color 0.3s ease;
}

.filtro::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--verde);
  transform: translateY(101%);
  transition: transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1);
  z-index: -1;
}

.filtro:hover {
  border-color: var(--verde);
  color: var(--branco);
}

.filtro:hover::before,
.filtro.ativo::before {
  transform: translateY(0);
}

.filtro.ativo {
  border-color: var(--verde);
  color: var(--branco);
}

/* Faixa de agenda (só aparece com eventos de hoje em diante) */
.agenda-faixa {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 12px;
}

.agenda-faixa-rotulo {
  display: flex;
  align-items: center;
  padding: 0 18px;
  background: var(--verde);
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--branco);
}

.agenda-chip {
  flex: 1 1 280px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  background: var(--fundo-sutil);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  text-align: left;
  color: var(--verde);
  transition: border-color 0.3s ease, transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1),
    background 0.3s ease;
}

.agenda-chip:hover {
  border-color: var(--verde);
  background: var(--branco);
  transform: translateY(-2px);
}

.agenda-chip-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 44px;
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.agenda-chip-data strong {
  font-family: var(--font-titulo);
  font-size: 26px;
  line-height: 1;
  letter-spacing: 0;
  color: var(--verde);
}

.agenda-chip-titulo {
  flex: 1;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 15.5px;
  line-height: 1.35;
}

.agenda-chip-seta {
  transition: transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.agenda-chip:hover .agenda-chip-seta {
  transform: translateX(6px);
}

.portal-topo {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: clamp(32px, 5vw, 64px);
  align-items: stretch;
}

.portal-ultimas {
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.portal-ultimas :deep(.materia--lista) {
  flex: 1;
}

.ultimas-titulo {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--verde);
  font-family: var(--font-titulo);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--verde);
}

.portal-grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: clamp(36px, 4vw, 52px) clamp(24px, 3vw, 36px);
  padding-top: clamp(32px, 4vw, 52px);
  border-top: 1px solid var(--borda);
}

/* ── Editorias ── */
.editoria {
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding-top: clamp(32px, 4vw, 52px);
  border-top: 1px solid var(--borda);
}

.editoria-cabecalho {
  display: flex;
  align-items: center;
  gap: 18px;
}

.editoria-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(22px, 2.4vw, 30px);
  color: var(--verde);
}

.editoria-contagem {
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

/* YouTube: faixa verde cheia, no mesmo desenho da Excelência Società */
.editoria--verde {
  --verde: #ffffff;
  --branco: #324b30;
  --texto-corpo: #eef1ea;
  --texto-sec: #d3dccf;
  --sage-texto: #b9c7b4;
  --borda: rgba(255, 255, 255, 0.22);
  --fundo-sutil: #3d5a3b;
  position: relative;
  isolation: isolate;
  padding: clamp(56px, 7vw, 96px) 0;
  border-top: none;
  color: var(--verde);
}

.editoria--verde::before {
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

.editoria-semestre {
  padding: 5px 12px;
  background: var(--verde);
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--branco);
}

.editoria-linha {
  flex: 1;
  height: 1px;
  background: var(--borda);
}

/* Trajetória dos Encontros Horizontais */
.trajetoria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: 28px;
}

.encontro-botao {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  text-align: left;
  color: var(--verde);
  cursor: pointer;
}

.encontro-trilha {
  position: relative;
  display: block;
  height: 9px;
  border-top: 1px solid var(--verde);
}

.encontro:not(:last-child) .encontro-trilha {
  margin-right: -28px;
}

.encontro-ponto {
  position: absolute;
  top: -5px;
  left: 0;
  width: 9px;
  height: 9px;
  background: var(--verde);
  transition: transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.encontro-botao:hover .encontro:not(:last-child) .encontro-trilha {
  margin-right: -28px;
}

.encontro-ponto {
  transform: rotate(45deg) scale(1.2);
}

.encontro-data {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.encontro-data strong {
  font-family: var(--font-titulo);
  font-size: 34px;
  line-height: 1;
  letter-spacing: 0;
  color: var(--verde);
}

.encontro-foto {
  position: relative;
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: var(--raio);
  background: var(--fundo-sutil);
  box-shadow: 0 18px 30px -22px rgba(26, 26, 26, 0.5);
  transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1), box-shadow 0.6s ease;
}

.encontro-botao:hover .encontro-foto {
  transform: translateY(-5px);
  box-shadow: 0 30px 40px -24px rgba(26, 26, 26, 0.55);
}

.encontro-foto picture,
.encontro-foto img {
  display: block;
  width: 100%;
  height: 100%;
}

.encontro-foto img {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.9s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.encontro-botao:hover .encontro-foto img {
  transform: scale(1.05);
}

.encontro-cidade {
  position: absolute;
  inset: 0;
  background-color: #b9bfb1;
  background-image: url('/img/textura-sage.svg');
  background-size: cover;
  background-position: center;
}

.encontro-nome {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 20px;
  line-height: 1.3;
  color: var(--verde);
}

.encontro-tema {
  font-family: var(--font-corpo);
  font-size: 15px;
  line-height: 1.55;
  color: var(--texto-sec);
}

.encontro-mais {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 700;
  color: var(--verde);
}

.encontro-seta {
  transition: transform 0.35s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.encontro-botao:hover .encontro-seta {
  transform: translateX(6px);
}

.youtube-grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 28px;
}

@media (max-width: 1024px) {
  .portal-topo {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .agenda-faixa-rotulo {
    padding: 10px 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .filtro::before,
  .agenda-chip,
  .agenda-chip-seta,
  .encontro-foto,
  .encontro-foto img,
  .encontro-ponto,
  .encontro-seta {
    transition: none;
  }
}
</style>
