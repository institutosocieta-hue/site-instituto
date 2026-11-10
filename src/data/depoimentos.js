// O conteúdo mora em src/content/depoimentos.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Depoimentos de membros (/membros). A seção fica oculta enquanto a lista estiver vazia.
import dados from '../content/depoimentos.json'
import { limpar } from '../utils/conteudo.js'

export const depoimentos = limpar(dados.itens)
