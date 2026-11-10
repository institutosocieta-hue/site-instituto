// O conteúdo mora em src/content/celulas.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Células regionais: cidades que, ao concentrarem 15 membros, passam a atuar como célula.
import dados from '../content/celulas.json'
import { limpar } from '../utils/conteudo.js'

export const celulas = limpar(dados.itens).map((c) => ({
  embaixadores: [],
  ...c,
  eventos: (c.eventos || []).filter((e) => e && e.titulo),
}))
