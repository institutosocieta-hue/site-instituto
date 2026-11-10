// O conteúdo mora em src/content/edicoes.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
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
