// ─────────────────────────────────────────────────────────────
// v-reveal: anima um elemento (fade + 12px de subida) quando ele
// entra na viewport pela primeira vez, via IntersectionObserver.
// Uso: <div v-reveal>...</div>
// ─────────────────────────────────────────────────────────────

import { movimentoReduzido } from '../composables/useAcessibilidade.js'

const prefereReduzido = () => movimentoReduzido()

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        const alvo = entrada.target
        alvo.classList.add('reveal-ativo')
        observador.unobserve(alvo)
        // limpa o atraso do stagger depois da entrada, para não afetar o hover
        if (alvo.style.transitionDelay) setTimeout(() => (alvo.style.transitionDelay = ''), 1200)
      }
    })
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
)

export const vReveal = {
  mounted(el) {
    if (prefereReduzido()) {
      el.classList.add('reveal-ativo')
      return
    }
    el.classList.add('reveal')
    // stagger entre colunas de uma grade (pai com .grade-stagger): cada linha repete o mesmo
    // desenho da esquerda para a direita, em vez de depender da posição na lista inteira
    const pai = el.parentElement
    if (pai && pai.classList.contains('grade-stagger')) {
      requestAnimationFrame(() => {
        const filhos = [...pai.children]
        const topo = filhos[0]?.offsetTop ?? 0
        const colunas = Math.max(1, filhos.filter((f) => Math.abs(f.offsetTop - topo) < 4).length)
        el.style.transitionDelay = `${(filhos.indexOf(el) % colunas) * 70}ms`
      })
    }
    observador.observe(el)
  },
  unmounted(el) {
    observador.unobserve(el)
  },
}
