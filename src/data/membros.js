// O conteúdo mora em src/content/membros.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Quadro de membros do Instituto.
//   efetivos: aparecem com foto (nome de exibição igual ao cadastrado em Governança, se houver card).
//   transitorios: aparecem só com o nome, em lista.
// Quando alguém passa de transitório a efetivo, mova-o de uma lista para a outra no painel.
import dados from '../content/membros.json'
import { limpar } from '../utils/conteudo.js'

const d = limpar(dados)

export const efetivos = (d.efetivos || []).map((m) => ({ nucleo: null, foto: null, linkedin: null, ...m }))
export const transitorios = d.transitorios || []
