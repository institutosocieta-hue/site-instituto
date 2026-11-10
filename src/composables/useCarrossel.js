import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { movimentoReduzido } from './useAcessibilidade.js'

// Carrossel lateral guiado pela rolagem da página.
//
// O container (`wrapper`) é alto; dentro dele o palco fica fixo (sticky) e os
// slides se movem na horizontal conforme a página rola. Cada slide declara
// seu tom em data-tom ("claro" ou "verde"); o fundo e as cores de texto são
// interpolados continuamente entre eles.
//
// Slides mais altos que a tela não ficam cortados: a rolagem primeiro "lê"
// o slide (conteúdo sobe) e só depois o carrossel avança para o próximo.
//
// Marcação esperada dentro do wrapper:
//   [data-palco]            palco sticky
//   [data-trilho]           faixa que recebe translateX (filhos: [data-slide])
//   [data-slide] > [data-conteudo]   conteúdo do slide
// O preenchimento de cada slide vai ao CSS como --p0, --p1, … no wrapper.

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
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const mistura = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`

export function useCarrossel(wrapper) {
  const ativo = ref(0)

  let palco = null
  let trilho = null
  let slides = []
  let conteudos = []
  let tons = []
  let excessos = []
  let inicios = []
  let comprimentos = []
  let passo = 0
  let corrida = 0
  let atual = { x: 0, ys: [] }
  let alvo = { x: 0, ys: [] }
  let quadro = 0
  let observador = null

  const reduzido = () => movimentoReduzido()

  function alturaNav() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72
  }

  function medir() {
    const el = wrapper.value
    if (!el) return
    palco = el.querySelector('[data-palco]')
    trilho = el.querySelector('[data-trilho]')
    slides = [...el.querySelectorAll('[data-slide]')]
    conteudos = slides.map((s) => s.querySelector('[data-conteudo]'))
    if (!palco || !trilho || !slides.length) return
    tons = slides.map((s) => (s.dataset.tom === 'verde' ? 1 : 0))

    const areaAltura = slides[0].clientHeight
    passo = Math.round(window.innerHeight * 0.85)
    excessos = conteudos.map((c) => Math.max(0, c.offsetHeight - areaAltura))

    let pos = 0
    inicios = []
    comprimentos = []
    slides.forEach((_, i) => {
      inicios.push(pos)
      const comp = excessos[i] + (i < slides.length - 1 ? passo : 0)
      comprimentos.push(comp)
      pos += comp
    })
    corrida = pos
    el.style.height = `${palco.offsetHeight + corrida}px`
    if (atual.ys.length !== slides.length) {
      atual.ys = slides.map(() => 0)
      alvo.ys = slides.map(() => 0)
    }
    mapear()
  }

  // posição da página → (x em slides, y de leitura por slide)
  function mapear() {
    const el = wrapper.value
    if (!el || !slides.length) return
    const topo = el.getBoundingClientRect().top
    const d = clamp(alturaNav() - topo, 0, corrida)

    let i = 0
    while (i < slides.length - 1 && d >= inicios[i] + comprimentos[i]) i++
    const local = d - inicios[i]
    let x = i
    let leitura = Math.min(local, excessos[i])
    if (local > excessos[i]) x = i + ease(clamp((local - excessos[i]) / passo))

    alvo.x = x
    alvo.ys = slides.map((_, k) => (k < i ? excessos[k] : k === i ? leitura : 0))

    // preenchimento por slide (barras de progresso)
    slides.forEach((_, k) => {
      const ultimo = k === slides.length - 1
      const cheio = ultimo
        ? clamp((d - (inicios[k] - passo * 0.5)) / (passo * 0.5))
        : clamp((d - inicios[k]) / (comprimentos[k] || 1))
      el.style.setProperty(`--p${k}`, cheio.toFixed(3))
    })

    if (reduzido()) {
      atual.x = alvo.x
      atual.ys = [...alvo.ys]
      pintar()
    } else {
      agendar()
    }
  }

  function pintar() {
    const el = wrapper.value
    if (!el || !trilho) return
    trilho.style.transform = `translate3d(${(-atual.x * 100).toFixed(3)}%, 0, 0)`
    conteudos.forEach((c, k) => {
      c.style.transform = `translate3d(0, ${(-(atual.ys[k] || 0)).toFixed(2)}px, 0)`
    })

    // cores: transição com "platô" entre um slide e o seguinte
    const i = Math.min(Math.floor(atual.x), slides.length - 1)
    const t = atual.x - i
    const proximo = Math.min(i + 1, slides.length - 1)
    const peso = tons[i] + (tons[proximo] - tons[i]) * suave(clamp((t - 0.2) / 0.6))
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
    ativo.value = Math.round(atual.x)
  }

  function passoAnimacao() {
    quadro = 0
    const f = 0.16
    let movendo = Math.abs(alvo.x - atual.x) > 0.0008
    atual.x += (alvo.x - atual.x) * f
    if (!movendo) atual.x = alvo.x
    atual.ys = atual.ys.map((y, k) => {
      const dif = (alvo.ys[k] || 0) - y
      if (Math.abs(dif) > 0.4) {
        movendo = true
        return y + dif * f
      }
      return alvo.ys[k] || 0
    })
    pintar()
    if (movendo) agendar()
  }

  function agendar() {
    if (!quadro) quadro = requestAnimationFrame(passoAnimacao)
  }

  function aoRolar() {
    mapear()
  }

  // leva a página até o início do slide `i`
  function irPara(i) {
    const el = wrapper.value
    if (!el || !slides.length) return
    const topoAbsoluto = el.getBoundingClientRect().top + window.scrollY
    const destino = topoAbsoluto - alturaNav() + (inicios[i] || 0)
    window.scrollTo({ top: destino, behavior: reduzido() ? 'auto' : 'smooth' })
  }

  onMounted(async () => {
    await nextTick()
    medir()
    atual.x = alvo.x
    atual.ys = [...alvo.ys]
    pintar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', medir)
    // fontes e imagens alteram a altura dos slides depois do primeiro desenho
    observador = new ResizeObserver(() => medir())
    conteudos.forEach((c) => observador.observe(c))
    if (palco) observador.observe(palco)
    setTimeout(medir, 400)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', aoRolar)
    window.removeEventListener('resize', medir)
    observador?.disconnect()
    if (quadro) cancelAnimationFrame(quadro)
  })

  return { ativo, irPara }
}
