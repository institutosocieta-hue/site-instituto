// O conteúdo mora em src/content/agenda.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Notícias e agenda do Instituto (exibidas em /atividades e na Home). Um item por evento;
// as páginas separam "Próximos" e "Anteriores" pela data. Campos: ver o painel (/admin).
import dados from '../content/agenda.json'
import { limpar, porData } from '../utils/conteudo.js'

export const agenda = porData(
  limpar(dados.itens).map((n) => ({ etiquetas: [], convidados: [], corpo: [], ...n }))
)
