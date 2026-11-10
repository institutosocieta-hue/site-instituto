import { onMounted, onUnmounted, ref } from 'vue'
import { movimentoReduzido } from './useAcessibilidade.js'

// Retorna um deslocamento (em px) proporcional ao scroll da página,
// para aplicar como translateY em elementos do hero (efeito parallax).
// `fator` controla a velocidade relativa: valores menores = mais lento.
export function useParallax(fator = 0.15) {
  const deslocamento = ref(0)

  function aoRolar() {
    deslocamento.value = movimentoReduzido() ? 0 : window.scrollY * fator
  }

  onMounted(() => {
    window.addEventListener('scroll', aoRolar, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', aoRolar)
  })

  return deslocamento
}
