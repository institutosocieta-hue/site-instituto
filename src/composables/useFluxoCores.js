import { onMounted, onUnmounted, ref } from 'vue'

// Fluxo contínuo de painéis com cor de fundo guiada pela rolagem.
//
// Cada painel (elemento com [data-painel]) declara seu tom em data-tom
// ("claro" ou "verde"). Conforme a fronteira entre dois painéis cruza o
// centro da tela, o fundo e as cores de texto do container são
// interpolados continuamente (não há "salto" de cor).
//
// Expõe `ativo` (índice do painel no centro da tela), `progresso` (0–1 ao
// longo do fluxo todo) e `visivel` (o fluxo está na tela). O preenchimento
// de cada painel vai para o CSS como --p0, --p1, … no próprio container.

const PALETA = {
  claro: {
    fundo: [255, 255, 255],
    verde: [50, 75, 48],
    corpo: [44, 58, 43],
    sec: [79, 84, 70],
    sage: [149, 153, 136],
    sageTexto: [111, 115, 100],
    borda: [224, 224, 216],
    sutil: [247, 247, 245],
  },
  verde: {
    fundo: [50, 75, 48],
    verde: [255, 255, 255],
    corpo: [236, 240, 232],
    sec: [208, 217, 203],
    sage: [150, 170, 145],
    sageTexto: [176, 190, 171],
    borda: [88, 113, 85],
    sutil: [60, 87, 57],
  },
}

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const suave = (t) => t * t * (3 - 2 * t)
const mistura = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`

export function useFluxoCores(container) {
  const ativo = ref(0)
  const progresso = ref(0)
  const visivel = ref(false)

  let paineis = []
  let quadro = 0

  function medir() {
    const el = container.value
    if (!el) return
    if (!paineis.length) paineis = [...el.querySelectorAll('[data-painel]')]
    if (!paineis.length) return

    const alturaTela = window.innerHeight
    const meio = alturaTela * 0.5
    const folga = alturaTela * 0.28
    const retangulos = paineis.map((p) => p.getBoundingClientRect())
    const tons = paineis.map((p) => (p.dataset.tom === 'verde' ? 1 : 0))

    // peso do verde (0–1): cada fronteira acrescenta sua transição quando cruza o centro
    let peso = tons[0]
    for (let i = 1; i < paineis.length; i++) {
      const fronteira = retangulos[i].top
      const t = clamp((meio - (fronteira - folga)) / (folga * 2))
      peso += (tons[i] - peso) * suave(t)
    }

    const c = PALETA.claro
    const v = PALETA.verde
    const tema = {
      '--fundo-pagina': mistura(c.fundo, v.fundo, peso),
      '--verde': mistura(c.verde, v.verde, peso),
      '--texto-corpo': mistura(c.corpo, v.corpo, peso),
      '--texto-sec': mistura(c.sec, v.sec, peso),
      '--sage': mistura(c.sage, v.sage, peso),
      '--sage-texto': mistura(c.sageTexto, v.sageTexto, peso),
      '--borda': mistura(c.borda, v.borda, peso),
      '--fundo-sutil': mistura(c.sutil, v.sutil, peso),
    }
    for (const [chave, valor] of Object.entries(tema)) el.style.setProperty(chave, valor)

    // preenchimento por painel e painel ativo
    let indice = 0
    retangulos.forEach((r, i) => {
      const cheio = clamp((meio - r.top) / r.height)
      el.style.setProperty(`--p${i}`, cheio.toFixed(3))
      if (r.top <= meio) indice = i
    })
    ativo.value = indice

    const inicio = retangulos[0].top
    const fim = retangulos[retangulos.length - 1].bottom
    progresso.value = clamp((meio - inicio) / (fim - inicio))
    el.style.setProperty('--progresso', progresso.value.toFixed(3))

    const caixa = el.getBoundingClientRect()
    visivel.value = caixa.top < alturaTela * 0.6 && caixa.bottom > alturaTela * 0.4
  }

  function agendar() {
    if (quadro) return
    quadro = requestAnimationFrame(() => {
      quadro = 0
      medir()
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    // painéis podem mudar de altura quando imagens/fontes carregam
    setTimeout(medir, 60)
    setTimeout(medir, 600)
    medir()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', agendar)
    window.removeEventListener('resize', agendar)
    if (quadro) cancelAnimationFrame(quadro)
  })

  return { ativo, progresso, visivel, medir }
}
