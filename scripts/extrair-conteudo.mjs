// Extrai os dados de src/data/*.js para src/content/*.json (uma vez só, na migração
// para o painel de edição). Depois disso, o conteúdo mora nos JSON e os arquivos de
// src/data/*.js apenas os lêem. Rodar de novo sobrescreveria edições: não rode mais.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
const dados = (nome) => import(pathToFileURL(resolve(raiz, 'src/data', nome + '.js')).href)
const saida = resolve(raiz, 'src/content')
mkdirSync(saida, { recursive: true })

function gravar(nome, conteudo) {
  const caminho = resolve(saida, nome + '.json')
  if (existsSync(caminho) && !process.argv.includes('--forcar')) {
    console.log('já existe, ignorado:', nome)
    return
  }
  writeFileSync(caminho, JSON.stringify(conteudo, null, 2) + '\n', 'utf8')
  console.log('gravado:', nome)
}

const agenda = await dados('agenda')
gravar('agenda', { itens: agenda.agenda })

gravar('avisos', { itens: (await dados('avisos')).avisos })
gravar('avisosInstituto', { itens: (await dados('avisosInstituto')).avisosInstituto })
gravar('celulas', { itens: (await dados('celulas')).celulas })
gravar('contato', (await dados('contato')).contato)
gravar('depoimentos', { itens: (await dados('depoimentos')).depoimentos })
gravar('diarioNucleos', { itens: (await dados('diarioNucleos')).diarioNucleos })

const d = await dados('distincoes')
gravar('distincoes', {
  excelencia: d.excelenciaSocieta,
  demais: d.demaisDistincoes,
  ano: d.anoDistincoesSemestrais,
  semestres: d.semestresDistincoes,
})

gravar('edicoes', { itens: (await dados('edicoes')).edicoes })

const e = await dados('eventos')
gravar('eventos', { linkCanal: e.linkCanal, semestreEncontros: e.semestreEncontros, seriesYoutube: e.seriesYoutube })

// governança: o registro de pessoas vira lista (cada pessoa com o próprio nome)
const g = await dados('governanca')
gravar('governanca', {
  diretoria: [
    { nome: 'Pedro Puente', cargo: 'Presidente' },
    { nome: 'Vitória Richetti', cargo: 'Vice-Presidente' },
    { nome: 'Sofia Vollrath', cargo: 'Diretora Executiva' },
    { nome: 'Raissa Souza', cargo: 'Diretora de Integração' },
    { nome: 'Larissa Del Lhano', cargo: 'Diretora Acadêmica' },
  ],
  pessoas: Object.entries(g.pessoas).map(([nome, p]) => ({ nome, ...p })),
})

gravar('marcosInstituto', { itens: (await dados('marcosInstituto')).marcosInstituto })

const m = await dados('membros')
gravar('membros', { efetivos: m.efetivos, transitorios: m.transitorios })

gravar('nucleosEmAndamento', (await dados('nucleosEmAndamento')).nucleosEmAndamento)
gravar('nucleosPublicando', { itens: (await dados('nucleosPublicando')).nucleosPublicando })
gravar('parceiros', { itens: (await dados('parceiros')).parceiros })
gravar('processoSeletivo', (await dados('processoSeletivo')).processoSeletivo)
