// Entrada do site: abertura em cena (portas que se abrem sobre a marca) na primeira
// visita de cada sessão. Quem prefere menos movimento (sistema ou botão de
// acessibilidade) não vê a abertura. Para rever: abra o site com ?entrada na URL.

const CHAVE = 'entrada-vista'

// instante (em segundos) em que as portas começam a abrir
export const TEMPO_PORTAS = 2.5

function semMovimento() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
    return !!JSON.parse(localStorage.getItem('acessibilidade') || '{}').semMovimento
  } catch {
    return false
  }
}

export function deveEntrar() {
  if (semMovimento()) return false
  try {
    if (new URLSearchParams(location.search).has('entrada')) return true
    return !sessionStorage.getItem(CHAVE)
  } catch {
    return true
  }
}

export function marcarEntradaVista() {
  try {
    sessionStorage.setItem(CHAVE, '1')
  } catch {
    // sem armazenamento: a abertura volta a cada carregamento
  }
}

// enquanto a abertura roda, o conteúdo da página fica em espera (as animações de entrada
// estão pausadas); ao abrir as portas, a classe sai e a página entra em cena
export function esperarConteudo(esperar) {
  document.documentElement.classList.toggle('entrada-pendente', esperar)
}
