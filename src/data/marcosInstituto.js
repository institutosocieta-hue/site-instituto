// O conteúdo mora em src/content/marcosInstituto.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Linha do tempo com os marcos históricos do Instituto (aba Fundação de Comunidade);
// mais antigos primeiro, na ordem em que foram cadastrados.
import dados from '../content/marcosInstituto.json'
import { limpar } from '../utils/conteudo.js'

export const marcosInstituto = limpar(dados.itens)
