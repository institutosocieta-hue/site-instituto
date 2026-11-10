// O conteúdo mora em src/content/nucleosPublicando.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Núcleos do ciclo mais recente já concluído, por semestre. edicaoNumero vazio = ainda sem edição.
import dados from '../content/nucleosPublicando.json'
import { limpar } from '../utils/conteudo.js'

export const nucleosPublicando = limpar(dados.itens).map((s) => ({
  ...s,
  nucleos: (s.nucleos || []).map((n) => ({ edicaoNumero: null, ...n })),
}))
