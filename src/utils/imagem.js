// Versão WebP de uma imagem PNG/JPG de /public, quando existir (veja `npm run imagens`).
// Usado nos <picture>: o <img> continua apontando para o original como fallback.
import manifesto from './webp-manifesto.js'

const disponiveis = new Set(manifesto)

export function webp(caminho) {
  if (!caminho || typeof caminho !== 'string') return null
  const destino = caminho.replace(/\.(png|jpe?g)$/i, '.webp')
  if (destino === caminho || !disponiveis.has(destino)) return null
  return encodeURI(destino)
}
