// Ajuda a ler o conteúdo editável (src/content/*.json), gravado pelo painel de edição.
// O painel salva campos vazios como texto vazio ou os omite; o site trata os dois como
// "sem valor" (null).

export function limpar(valor) {
  if (Array.isArray(valor)) return valor.map(limpar)
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([chave, v]) => [chave, limpar(v)]))
  }
  return valor === '' ? null : valor
}

// lista vazia (ou nula) vira null: usado onde "sem itens" mostra "Em breve" em vez de uma lista vazia
export function listaOuNulo(lista) {
  return Array.isArray(lista) && lista.length ? lista : null
}

// ordena por data (AAAA-MM-DD) — decrescente por padrão (mais recente primeiro)
export function porData(lista, campo = 'data', crescente = false) {
  return [...lista].sort((a, b) => {
    const r = String(a[campo] || '').localeCompare(String(b[campo] || ''))
    return crescente ? r : -r
  })
}
