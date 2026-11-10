// Tempo estimado de leitura (~200 palavras por minuto), no estilo "5 min".
// Aceita um texto ou uma lista de parágrafos; devolve '' quando não há texto.
export function tempoLeitura(texto) {
  const corrido = Array.isArray(texto) ? texto.join(' ') : texto || ''
  const palavras = corrido.trim().split(/\s+/).filter(Boolean).length
  if (!palavras) return ''
  return `${Math.max(1, Math.round(palavras / 200))} min`
}
