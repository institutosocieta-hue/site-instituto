// O conteúdo mora em src/content/diarioNucleos.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Posts do Diário de Produção. tipo: "comentario" | "encontro" | "atualizacao".
import dados from '../content/diarioNucleos.json'
import { limpar, porData } from '../utils/conteudo.js'

export const diarioNucleos = porData(limpar(dados.itens))
