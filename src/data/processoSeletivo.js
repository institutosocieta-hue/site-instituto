// O conteúdo mora em src/content/processoSeletivo.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Dados da página de Seja Membro. Campos de link vazios ocultam o botão correspondente.
import dados from '../content/processoSeletivo.json'
import { limpar } from '../utils/conteudo.js'

const d = limpar(dados)

export const processoSeletivo = {
  paraQuem: [],
  semestre: [],
  faq: [],
  ...d,
}
