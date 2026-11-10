// O conteúdo mora em src/content/avisos.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Ticker rotativo no hero da página da revista.
import dados from '../content/avisos.json'

export const avisos = dados.itens.filter(Boolean)
