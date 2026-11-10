// O conteúdo mora em src/content/contato.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Canais de contato do Instituto. Campo vazio oculta o link correspondente no site.
import dados from '../content/contato.json'
import { limpar } from '../utils/conteudo.js'

export const contato = limpar(dados)
