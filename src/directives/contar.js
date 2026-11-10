// ─────────────────────────────────────────────────────────────
// v-contar: conta de 0 até o valor quando o elemento entra na tela.
// Uso: <span v-contar="27">0</span>
// ─────────────────────────────────────────────────────────────

import { movimentoReduzido } from '../composables/useAcessibilidade.js'

const prefereReduzido = () => movimentoReduzido()

function animar(el, valor) {
  if (prefereReduzido()) {
    el.textContent = String(valor)
    return
  }
  const duracao = 1400
  const inicio = performance.now()
  const passo = (agora) => {
    const t = Math.min(1, (agora - inicio) / duracao)
    const suave = 1 - Math.pow(1 - t, 3)
    el.textContent = String(Math.round(valor * suave))
    if (t < 1) requestAnimationFrame(passo)
  }
  requestAnimationFrame(passo)
}

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return
      observador.unobserve(entrada.target)
      animar(entrada.target, Number(entrada.target.dataset.contar))
    })
  },
  { threshold: 0.4 }
)

export const vContar = {
  mounted(el, binding) {
    el.dataset.contar = String(binding.value)
    el.textContent = prefereReduzido() ? String(binding.value) : '0'
    observador.observe(el)
  },
  unmounted(el) {
    observador.unobserve(el)
  },
}
