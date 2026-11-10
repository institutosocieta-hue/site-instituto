// O conteúdo mora em src/content/nucleosEmAndamento.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Núcleos em produção no semestre atual — ainda sem edição publicada.
import dados from '../content/nucleosEmAndamento.json'
import { limpar } from '../utils/conteudo.js'

const d = limpar(dados)

export const nucleosEmAndamento = {
  semestre: d.semestre,
  nucleos: (d.nucleos || []).map((n) => ({ coordenadores: [], ...n })),
}
