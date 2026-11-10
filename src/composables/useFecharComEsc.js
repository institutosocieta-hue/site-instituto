import { nextTick, onMounted, onUnmounted, watch } from 'vue'

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Comportamento padrão dos modais: fecha com Esc, prende o foco (Tab) dentro
// do diálogo e devolve o foco ao elemento que o abriu.
// `estaAberto` é uma função que devolve se o modal está aberto; `fechar` é
// chamada quando Esc é pressionado.
export function useFecharComEsc(estaAberto, fechar) {
  let anterior = null

  function dialogoAtivo() {
    const todos = document.querySelectorAll('[role="dialog"][aria-modal="true"]')
    return todos[todos.length - 1] || null
  }

  function aoPressionar(evento) {
    if (!estaAberto()) return
    if (evento.key === 'Escape') {
      fechar()
      return
    }
    if (evento.key !== 'Tab') return
    const dialogo = dialogoAtivo()
    if (!dialogo) return
    const itens = [...dialogo.querySelectorAll(FOCAVEIS)].filter((el) => el.offsetParent !== null)
    if (!itens.length) {
      evento.preventDefault()
      dialogo.focus()
      return
    }
    const primeiro = itens[0]
    const ultimo = itens[itens.length - 1]
    const dentro = dialogo.contains(document.activeElement)
    if (evento.shiftKey && (document.activeElement === primeiro || !dentro)) {
      evento.preventDefault()
      ultimo.focus()
    } else if (!evento.shiftKey && (document.activeElement === ultimo || !dentro)) {
      evento.preventDefault()
      primeiro.focus()
    }
  }

  watch(
    estaAberto,
    async (aberto) => {
      if (aberto) {
        anterior = document.activeElement
        await nextTick()
        const dialogo = dialogoAtivo()
        if (!dialogo) return
        // nome acessível a partir do título do próprio modal
        if (!dialogo.hasAttribute('aria-label') && !dialogo.hasAttribute('aria-labelledby')) {
          const titulo = dialogo.querySelector('h2, h3')
          if (titulo) dialogo.setAttribute('aria-label', titulo.textContent.trim())
        }
        dialogo.setAttribute('tabindex', '-1')
        const botaoFechar = dialogo.querySelector('button')
        ;(botaoFechar || dialogo).focus({ preventScroll: true })
      } else if (anterior && typeof anterior.focus === 'function' && document.contains(anterior)) {
        anterior.focus({ preventScroll: true })
        anterior = null
      }
    },
    { flush: 'post' }
  )

  onMounted(() => window.addEventListener('keydown', aoPressionar))
  onUnmounted(() => window.removeEventListener('keydown', aoPressionar))
}
