// O conteúdo mora em src/content/governanca.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
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
