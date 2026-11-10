import { reactive, watch } from 'vue'

// Preferências de acessibilidade do visitante, guardadas no navegador.
// Cada opção liga uma classe em <html>; o CSS está em assets/main.css.
const CHAVE = 'acessibilidade'
const CLASSES = {
  contraste: 'a11y-contraste',
  semMovimento: 'a11y-sem-movimento',
  sublinhar: 'a11y-sublinhar',
  leitura: 'a11y-leitura',
}

const estado = reactive({ contraste: false, semMovimento: false, sublinhar: false, leitura: false })
let iniciado = false

function aplicar() {
  const raiz = document.documentElement
  for (const [chave, classe] of Object.entries(CLASSES)) raiz.classList.toggle(classe, estado[chave])
}

export function iniciarAcessibilidade() {
  if (iniciado) return estado
  iniciado = true
  try {
    Object.assign(estado, JSON.parse(localStorage.getItem(CHAVE) || '{}'))
  } catch {
    // preferências indisponíveis: começa com tudo desligado
  }
  aplicar()
  watch(estado, () => {
    aplicar()
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado))
    } catch {
      // sem armazenamento: vale só nesta visita
    }
  })
  return estado
}

// true quando o visitante pediu menos movimento (no sistema ou no botão de acessibilidade)
export function movimentoReduzido() {
  return (
    document.documentElement.classList.contains('a11y-sem-movimento') ||
    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  )
}

export function redefinirAcessibilidade() {
  Object.keys(CLASSES).forEach((chave) => (estado[chave] = false))
}
