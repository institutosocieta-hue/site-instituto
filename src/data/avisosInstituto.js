// O conteúdo mora em src/content/avisosInstituto.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Ticker rotativo no hero institucional (página Início).
import dados from '../content/avisosInstituto.json'

export const avisosInstituto = dados.itens.filter(Boolean)
