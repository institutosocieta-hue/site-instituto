// ─────────────────────────────────────────────────────────────
// SEO por rota: title, description, Open Graph, canonical e
// dados estruturados (JSON-LD). Chamado a cada navegação pelo router.
//
// Defina VITE_SITE_URL (ex.: https://seudominio.com.br) no ambiente de
// build para fixar o domínio canônico; sem isso usa a origem atual.
// ─────────────────────────────────────────────────────────────

import { edicoes } from '../data/edicoes.js'
import { agenda } from '../data/agenda.js'
import { contato } from '../data/contato.js'

const NOME_SITE = 'Instituto Società'
const IMAGEM_PADRAO = '/dinamicas/encontros-horizontais.png'

export function urlBase() {
  const configurada = import.meta.env.VITE_SITE_URL
  return (configurada || window.location.origin).replace(/\/$/, '')
}

function absoluta(caminho) {
  if (!caminho) return urlBase() + IMAGEM_PADRAO
  return /^https?:/.test(caminho) ? caminho : urlBase() + caminho
}

function achaEdicao(numero) {
  return edicoes.find((e) => String(e.numero) === String(numero)) || null
}

function achaTrabalho(slug) {
  for (const edicao of edicoes) {
    const trabalho = (edicao.trabalhos || []).find((t) => t.slug === slug)
    if (trabalho) return { edicao, trabalho }
  }
  return null
}

// Descrições: reaproveitam textos já existentes nas páginas.
const DESCRICOES = {
  'instituto-inicio':
    'Uma comunidade acadêmica independente, formada por jovens advogados e estudantes dedicados ao estudo do Direito Empresarial.',
  comunidade:
    'O Instituto é, antes de tudo, uma comunidade: um espaço de encontro entre jovens com o mesmo entusiasmo pelo Direito Empresarial.',
  membros:
    'A Diretoria conduz as decisões institucionais. Os coordenadores respondem por cada núcleo de estudo ao longo do semestre.',
  distincoes:
    'O Instituto Società confere, ao final de cada semestre, distinções que reconhecem diferentes dimensões da vida acadêmica de seus membros.',
  atividades:
    'Reúnem, horizontalmente, os integrantes de todos os núcleos de estudo em torno de um convidado especialista.',
  privacidade:
    'Como o Instituto Società trata os dados pessoais de quem visita o site, em conformidade com a LGPD.',
  apoio:
    'Escritórios e entidades interessados em apoiar o Instituto Società e a Revista QuotaParte encontram aqui o primeiro passo.',
  'revista-inicio':
    'QuotaParte é a revista acadêmica do Instituto Società, publicação semestral dedicada ao Direito Empresarial, reunindo os resumos expandidos produzidos por seus núcleos de estudo.',
  'revista-edicoes': 'Arquivo completo da Revista QuotaParte, organizado por ano.',
  'revista-nucleos':
    'Os núcleos de estudo são a principal dinâmica de pesquisa do Instituto Società: grupos itinerantes que mudam a cada semestre, do primeiro debate à edição publicada.',
  'revista-sobre':
    'A QuotaParte é a revista acadêmica do Instituto Società. Publicada semestralmente, cada edição é dedicada a um núcleo de estudo e reúne os resumos expandidos produzidos por seus membros ao longo do semestre.',
}

const IMAGENS = {
  'instituto-inicio': '/dinamicas/encontros-horizontais.png',
  comunidade: '/dinamicas/encontros-horizontais.png',
  membros: '/dinamicas/governanca.png',
  distincoes: '/dinamicas/distincoes.png',
  atividades: '/dinamicas/encontros-horizontais.png',
  'revista-inicio': '/dinamicas/quotaparte.png',
  'revista-nucleos': '/dinamicas/nucleos.png',
  'revista-sobre': '/dinamicas/quotaparte.png',
}

function organizacao() {
  const redes = [contato.instagram, contato.linkedin].filter(Boolean)
  if (contato.youtube) redes.push(`https://youtube.com/${contato.youtube}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: NOME_SITE,
    url: urlBase(),
    logo: absoluta('/favicon.svg'),
    email: contato.email || undefined,
    sameAs: redes,
  }
}

function periodico() {
  return { '@type': 'Periodical', name: 'QuotaParte', publisher: { '@type': 'Organization', name: NOME_SITE } }
}

function eventoLd(evento) {
  const modo = {
    presencial: 'https://schema.org/OfflineEventAttendanceMode',
    online: 'https://schema.org/OnlineEventAttendanceMode',
    híbrido: 'https://schema.org/MixedEventAttendanceMode',
  }[evento.formato]
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: evento.titulo,
    description: evento.resumo || undefined,
    startDate: evento.data,
    eventAttendanceMode: modo,
    location: evento.local
      ? {
          '@type': 'Place',
          name: evento.local,
          address: evento.cidade || undefined,
        }
      : undefined,
    performer: (evento.convidados || []).map((nome) => ({ '@type': 'Person', name: nome })),
    image: evento.imagem ? absoluta(evento.imagem) : undefined,
    organizer: { '@type': 'Organization', name: NOME_SITE },
  }
}

function montar(rota) {
  const nome = rota.name
  let descricao = DESCRICOES[nome] || DESCRICOES['instituto-inicio']
  let imagem = IMAGENS[nome] || IMAGEM_PADRAO
  let tipo = 'website'
  let jsonLd = null

  if (nome === 'instituto-inicio') {
    jsonLd = organizacao()
  } else if (nome === 'atividades') {
    jsonLd = agenda.map(eventoLd)
  } else if (nome === 'revista-edicao-detalhe') {
    const edicao = achaEdicao(rota.params.numero)
    if (edicao) {
      descricao = edicao.chamada
      imagem = edicao.capa || imagem
      tipo = 'article'
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'PublicationIssue',
        issueNumber: String(edicao.numero),
        name: `Edição ${edicao.numero} · ${edicao.nucleo}`,
        datePublished: edicao.dataPublicacao || undefined,
        description: edicao.chamada,
        isPartOf: { ...periodico(), issn: edicao.issn || undefined },
      }
    }
  } else if (nome === 'revista-trabalho') {
    const achado = achaTrabalho(rota.params.slug)
    if (achado) {
      const { edicao, trabalho } = achado
      const autores = trabalho.autores?.length ? trabalho.autores : [trabalho.autor].filter(Boolean)
      descricao = trabalho.resumo || trabalho.titulo
      imagem = edicao.capa || imagem
      tipo = 'article'
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        headline: trabalho.titulo,
        author: autores.map((nomeAutor) => ({ '@type': 'Person', name: nomeAutor })),
        abstract: trabalho.resumo || undefined,
        keywords: trabalho.palavrasChave?.length ? trabalho.palavrasChave.join(', ') : undefined,
        datePublished: edicao.dataPublicacao || undefined,
        isPartOf: {
          '@type': 'PublicationIssue',
          issueNumber: String(edicao.numero),
          isPartOf: periodico(),
        },
      }
    }
  }

  return { descricao, imagem: absoluta(imagem), tipo, jsonLd }
}

function definirMeta(atributo, chave, conteudo) {
  let el = document.head.querySelector(`meta[${atributo}="${chave}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(atributo, chave)
    document.head.appendChild(el)
  }
  el.setAttribute('content', conteudo)
}

export function aplicarSeo(rota, titulo) {
  if (rota.meta?.semIndice) {
    definirMeta('name', 'robots', 'noindex')
  } else {
    document.head.querySelector('meta[name="robots"]')?.remove()
  }

  const { descricao, imagem, tipo, jsonLd } = montar(rota)
  const url = urlBase() + rota.path

  definirMeta('name', 'description', descricao)
  definirMeta('property', 'og:title', titulo)
  definirMeta('property', 'og:description', descricao)
  definirMeta('property', 'og:type', tipo)
  definirMeta('property', 'og:url', url)
  definirMeta('property', 'og:image', imagem)
  definirMeta('property', 'og:site_name', NOME_SITE)
  definirMeta('property', 'og:locale', 'pt_BR')
  definirMeta('name', 'twitter:card', 'summary_large_image')

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', url)

  let script = document.getElementById('jsonld')
  if (jsonLd) {
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'jsonld'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)
  } else if (script) {
    script.remove()
  }
}
