// Reescreve src/data/*.js como leitores finos de src/content/*.json (migração única).
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
const escrever = (nome, texto) => writeFileSync(resolve(raiz, 'src/data', nome + '.js'), texto.trimStart(), 'utf8')

const aviso = (arquivo) => `// O conteúdo mora em src/content/${arquivo}.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
`

escrever(
  'agenda',
  `${aviso('agenda')}//
// Notícias e agenda do Instituto (exibidas em /atividades e na Home). Um item por evento;
// as páginas separam "Próximos" e "Anteriores" pela data. Campos: ver o painel (/admin).
import dados from '../content/agenda.json'
import { limpar, porData } from '../utils/conteudo.js'

export const agenda = porData(
  limpar(dados.itens).map((n) => ({ etiquetas: [], convidados: [], corpo: [], ...n }))
)
`
)

escrever(
  'avisos',
  `${aviso('avisos')}//
// Ticker rotativo no hero da página da revista.
import dados from '../content/avisos.json'

export const avisos = dados.itens.filter(Boolean)
`
)

escrever(
  'avisosInstituto',
  `${aviso('avisosInstituto')}//
// Ticker rotativo no hero institucional (página Início).
import dados from '../content/avisosInstituto.json'

export const avisosInstituto = dados.itens.filter(Boolean)
`
)

escrever(
  'celulas',
  `${aviso('celulas')}//
// Células regionais: cidades que, ao concentrarem 15 membros, passam a atuar como célula.
import dados from '../content/celulas.json'
import { limpar } from '../utils/conteudo.js'

export const celulas = limpar(dados.itens).map((c) => ({
  embaixadores: [],
  ...c,
  eventos: (c.eventos || []).filter((e) => e && e.titulo),
}))
`
)

escrever(
  'contato',
  `${aviso('contato')}//
// Canais de contato do Instituto. Campo vazio oculta o link correspondente no site.
import dados from '../content/contato.json'
import { limpar } from '../utils/conteudo.js'

export const contato = limpar(dados)
`
)

escrever(
  'depoimentos',
  `${aviso('depoimentos')}//
// Depoimentos de membros (/membros). A seção fica oculta enquanto a lista estiver vazia.
import dados from '../content/depoimentos.json'
import { limpar } from '../utils/conteudo.js'

export const depoimentos = limpar(dados.itens)
`
)

escrever(
  'diarioNucleos',
  `${aviso('diarioNucleos')}//
// Posts do Diário de Produção. tipo: "comentario" | "encontro" | "atualizacao".
import dados from '../content/diarioNucleos.json'
import { limpar, porData } from '../utils/conteudo.js'

export const diarioNucleos = porData(limpar(dados.itens))
`
)

escrever(
  'distincoes',
  `${aviso('distincoes')}//
// Distinções do Instituto: Excelência Società (anual), descrição das demais distinções
// e vencedores de cada semestre (unita: um vencedor; indice: um por núcleo; iterare: lista de nomes).
import dados from '../content/distincoes.json'
import { limpar } from '../utils/conteudo.js'

const d = limpar(dados)

export const excelenciaSocieta = d.excelencia || []
export const demaisDistincoes = d.demais || []
export const anoDistincoesSemestrais = d.ano

export const semestresDistincoes = (d.semestres || []).map((s) => ({
  ...s,
  resultados: {
    unita: s.resultados?.unita?.nome ? s.resultados.unita : null,
    indice: (s.resultados?.indice || []).filter((v) => v && v.nome),
    iterare: (s.resultados?.iterare || []).filter(Boolean),
  },
}))
`
)

escrever(
  'edicoes',
  `${aviso('edicoes')}//
// Edições da revista QuotaParte, cada uma com seus trabalhos.
import dados from '../content/edicoes.json'
import { limpar } from '../utils/conteudo.js'

export const edicoes = limpar(dados.itens)
  .map((e) => ({
    ...e,
    trabalhos: (e.trabalhos || []).map((t) => ({ autores: [], palavrasChave: [], ...t })),
  }))
  .sort((a, b) => a.numero - b.numero)

// Lista plana de todos os trabalhos, cada um com a edição de origem.
export function todosTrabalhos() {
  return edicoes.flatMap((edicao) => (edicao.trabalhos || []).map((trabalho) => ({ ...trabalho, edicao })))
}
`
)

escrever(
  'eventos',
  `${aviso('eventos')}//
// Encontros Horizontais do semestre (lista permanente durante o semestre, mais antigos
// primeiro) e séries do YouTube (cada série mostra sempre o último episódio publicado).
import dados from '../content/eventos.json'
import { limpar, porData } from '../utils/conteudo.js'

const d = limpar(dados)

export const semestreEncontros = {
  semestre: d.semestreEncontros.semestre,
  encontros: porData(d.semestreEncontros.encontros || [], 'data', true),
}

export const linkCanal = d.linkCanal

export const seriesYoutube = (d.seriesYoutube || []).map((s) => ({
  ...s,
  ultimoEpisodio: s.ultimoEpisodio?.titulo ? s.ultimoEpisodio : null,
}))
`
)

escrever(
  'governanca',
  `${aviso('governanca')}//
// Registro de pessoas (Diretoria e Coordenadores): foto, LinkedIn e a trajetória dividida em
// quatro blocos para o card que abre ao clicar no nome ou na foto. Cada bloco é uma lista de tópicos.
//   associacao: desde quando é membro      trajetoria: núcleos que integrou como membro
//   gestao: cargos e coordenações ocupados  distincoes: distinções recebidas
import dados from '../content/governanca.json'
import { limpar, listaOuNulo } from '../utils/conteudo.js'

const d = limpar(dados)

export const pessoas = Object.fromEntries(
  (d.pessoas || []).map(({ nome, ...p }) => [
    nome,
    {
      ...p,
      associacao: listaOuNulo(p.associacao),
      gestao: listaOuNulo(p.gestao),
      trajetoria: listaOuNulo(p.trajetoria),
      distincoes: listaOuNulo(p.distincoes),
    },
  ])
)

// Diretoria do Instituto.
export const diretoria = (d.diretoria || []).map((membro) => ({ ...membro, ...pessoas[membro.nome] }))
`
)

escrever(
  'marcosInstituto',
  `${aviso('marcosInstituto')}//
// Linha do tempo com os marcos históricos do Instituto (aba Fundação de Comunidade);
// mais antigos primeiro, na ordem em que foram cadastrados.
import dados from '../content/marcosInstituto.json'
import { limpar } from '../utils/conteudo.js'

export const marcosInstituto = limpar(dados.itens)
`
)

escrever(
  'membros',
  `${aviso('membros')}//
// Quadro de membros do Instituto.
//   efetivos: aparecem com foto (nome de exibição igual ao cadastrado em Governança, se houver card).
//   transitorios: aparecem só com o nome, em lista.
// Quando alguém passa de transitório a efetivo, mova-o de uma lista para a outra no painel.
import dados from '../content/membros.json'
import { limpar } from '../utils/conteudo.js'

const d = limpar(dados)

export const efetivos = (d.efetivos || []).map((m) => ({ nucleo: null, foto: null, linkedin: null, ...m }))
export const transitorios = d.transitorios || []
`
)

escrever(
  'nucleosEmAndamento',
  `${aviso('nucleosEmAndamento')}//
// Núcleos em produção no semestre atual — ainda sem edição publicada.
import dados from '../content/nucleosEmAndamento.json'
import { limpar } from '../utils/conteudo.js'

const d = limpar(dados)

export const nucleosEmAndamento = {
  semestre: d.semestre,
  nucleos: (d.nucleos || []).map((n) => ({ coordenadores: [], ...n })),
}
`
)

escrever(
  'nucleosPublicando',
  `${aviso('nucleosPublicando')}//
// Núcleos do ciclo mais recente já concluído, por semestre. edicaoNumero vazio = ainda sem edição.
import dados from '../content/nucleosPublicando.json'
import { limpar } from '../utils/conteudo.js'

export const nucleosPublicando = limpar(dados.itens).map((s) => ({
  ...s,
  nucleos: (s.nucleos || []).map((n) => ({ edicaoNumero: null, ...n })),
}))
`
)

escrever(
  'parceiros',
  `${aviso('parceiros')}//
// Escritórios e instituições que já receberam o Instituto (apenas nomes, até haver logos).
import dados from '../content/parceiros.json'

export const parceiros = dados.itens.filter(Boolean)
`
)

escrever(
  'processoSeletivo',
  `${aviso('processoSeletivo')}//
// Dados da página de Seja Membro. Campos de link vazios ocultam o botão correspondente.
import dados from '../content/processoSeletivo.json'
import { limpar } from '../utils/conteudo.js'

const d = limpar(dados)

export const processoSeletivo = {
  paraQuem: [],
  semestre: [],
  faq: [],
  ...d,
}
`
)
console.log('módulos reescritos')
