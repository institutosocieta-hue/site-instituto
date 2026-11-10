// Gera sitemap.xml e robots.txt no build, a partir das rotas públicas e dos
// dados (edições e trabalhos). Requer VITE_SITE_URL (ex.: https://seudominio.com.br);
// sem ele, avisa e não gera nada (a URL do sitemap precisa ser absoluta).
import { edicoes } from '../src/data/edicoes.js'

const ROTAS_FIXAS = [
  '/',
  '/comunidade',
  '/membros',
  '/distincoes',
  '/atividades',
  '/apoio',
  '/privacidade',
  '/revista',
  '/revista/edicoes',
  '/revista/nucleos',
  '/revista/sobre',
]

export default function sitemap(urlSite) {
  return {
    name: 'quotaparte-sitemap',
    apply: 'build',
    generateBundle() {
      const base = (urlSite || '').replace(/\/$/, '')
      if (!base) {
        this.warn(
          'VITE_SITE_URL não definida: sitemap.xml e robots.txt NÃO foram gerados. Defina-a no build (veja .env.example).'
        )
        return
      }
      const caminhos = [...ROTAS_FIXAS]
      for (const edicao of edicoes) {
        caminhos.push(`/revista/edicoes/${edicao.numero}`)
        for (const trabalho of edicao.trabalhos || []) {
          if (trabalho.slug) caminhos.push(`/revista/trabalhos/${trabalho.slug}`)
        }
      }
      const corpo = caminhos.map((c) => `  <url><loc>${base}${c}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${corpo}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
      })
    },
  }
}
