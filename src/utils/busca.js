// Índice e busca do site (páginas, notícias, membros e trabalhos da revista).
// Tudo vem dos arquivos em src/data, então o que for atualizado lá aparece aqui.
import { agenda } from '../data/agenda.js'
import { efetivos, transitorios } from '../data/membros.js'
import { edicoes } from '../data/edicoes.js'

const normalizar = (texto) =>
  (texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

const paginas = [
  { titulo: 'Início', to: '/', chaves: 'home instituto societa' },
  { titulo: 'Comunidade', to: '/comunidade', chaves: 'atividades fundacao celulas regionais youtube encontros horizontais verticais' },
  { titulo: 'Pessoas', to: '/membros', chaves: 'governanca diretoria coordenadores quadro de membros efetivos transitorios' },
  { titulo: 'Seja Membro', to: '/membros#seja-membro', chaves: 'inscricao processo seletivo candidatura faq modalidades' },
  { titulo: 'Distinções', to: '/distincoes', chaves: 'premio unita indice iterare excelencia' },
  { titulo: 'Atividades', to: '/atividades', chaves: 'noticias agenda encontros horizontais semestre conferencias' },
  { titulo: 'Apoio', to: '/apoio', chaves: 'parcerias apoiadores patrocinio' },
  { titulo: 'QuotaParte', to: '/revista', chaves: 'revista periodico publicacoes' },
  { titulo: 'Edições da QuotaParte', to: '/revista/edicoes', chaves: 'edicoes trabalhos artigos busca' },
  { titulo: 'Núcleos de estudo', to: '/revista/nucleos', chaves: 'nucleos pesquisa verticais' },
  { titulo: 'Sobre a revista', to: '/revista/sobre', chaves: 'quotaparte sobre' },
  { titulo: 'Política de Privacidade', to: '/privacidade', chaves: 'privacidade lgpd dados cookies' },
]

function montarIndice() {
  const itens = []

  for (const p of paginas) {
    itens.push({ grupo: 'paginas', titulo: p.titulo, detalhe: '', to: p.to, texto: normalizar(`${p.titulo} ${p.chaves}`) })
  }

  for (const n of agenda) {
    itens.push({
      grupo: 'noticias',
      titulo: n.titulo,
      detalhe: n.tipo,
      to: `/atividades?noticia=${n.slug}`,
      texto: normalizar(`${n.titulo} ${n.tipo} ${(n.etiquetas || []).join(' ')} ${(n.corpo || []).join(' ')} ${(n.convidados || []).join(' ')}`),
    })
  }

  for (const m of efetivos) {
    itens.push({
      grupo: 'membros',
      titulo: m.nome,
      detalhe: `Membro efetivo · desde ${m.ingresso}`,
      to: `/membros?q=${encodeURIComponent(m.nome)}#quadro-membros`,
      texto: normalizar(`${m.nome} ${m.completo}`),
    })
  }
  for (const t of transitorios) {
    itens.push({
      grupo: 'membros',
      titulo: t.nome,
      detalhe: `Membro transitório · desde ${t.ingresso}`,
      to: `/membros?q=${encodeURIComponent(t.nome)}#quadro-membros`,
      texto: normalizar(t.nome),
    })
  }

  for (const e of edicoes) {
    const numero = String(e.numero).padStart(2, '0')
    itens.push({
      grupo: 'trabalhos',
      titulo: `Edição ${numero} · ${e.nucleo}`,
      detalhe: e.chamada,
      to: `/revista/edicoes/${e.numero}`,
      texto: normalizar(`edicao ${numero} ${e.nucleo} ${e.chamada} ${e.linhaPesquisa || ''}`),
    })
    for (const t of e.trabalhos || []) {
      if (!t.slug || /^\[/.test(t.titulo)) continue // trabalhos ainda sem dados
      itens.push({
        grupo: 'trabalhos',
        titulo: t.titulo,
        detalhe: `Edição ${numero} · ${(t.autores || []).join(', ')}`,
        to: `/revista/trabalhos/${t.slug}`,
        texto: normalizar(`${t.titulo} ${(t.autores || []).join(' ')} ${(t.palavrasChave || []).join(' ')} ${t.resumo || ''}`),
      })
    }
  }
  return itens
}

let indice = null

export const ROTULOS = {
  paginas: 'Páginas',
  noticias: 'Notícias e atividades',
  membros: 'Membros',
  trabalhos: 'QuotaParte',
}

// Devolve os resultados agrupados; sem termo, devolve só as páginas principais.
export function buscar(termo, limitePorGrupo = 5) {
  indice = indice || montarIndice()
  const partes = normalizar(termo).split(/\s+/).filter(Boolean)
  const grupos = { paginas: [], noticias: [], membros: [], trabalhos: [] }

  if (!partes.length) {
    grupos.paginas = indice.filter((i) => i.grupo === 'paginas').slice(0, 8)
    return grupos
  }
  for (const item of indice) {
    if (partes.every((p) => item.texto.includes(p)) && grupos[item.grupo].length < limitePorGrupo) {
      grupos[item.grupo].push(item)
    }
  }
  return grupos
}
