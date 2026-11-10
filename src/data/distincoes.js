// O conteúdo mora em src/content/distincoes.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
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
