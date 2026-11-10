<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useParallax } from '../composables/useParallax.js'

defineProps({
  label: {
    type: String,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    default: null,
  },
  imagemFundo: {
    type: String,
    default: null,
  },
  // título maior, para a Home
  grande: {
    type: Boolean,
    default: false,
  },
})

// *trecho* no título vira destaque de cor (o texto não muda)
function partesTitulo(titulo) {
  return titulo.split(/(\*[^*]+\*)/).filter(Boolean).map((t) =>
    t.startsWith('*') ? { texto: t.slice(1, -1), destaque: true } : { texto: t, destaque: false }
  )
}

// título em palavras, cada uma com seu índice (a entrada sobe palavra por palavra)
function palavras(titulo) {
  let i = 0
  return partesTitulo(titulo).flatMap((parte) =>
    parte.texto
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => ({ t, destaque: parte.destaque, i: i++ }))
  )
}

const route = useRoute()
// trilha de navegação: Início › (QuotaParte ›) página atual
const trilha = computed(() => {
  if (route.path === '/') return []
  const itens = [{ texto: 'Início', to: '/' }]
  if (route.path.startsWith('/revista/')) itens.push({ texto: 'QuotaParte', to: '/revista' })
  return itens
})

const deslocamentoTextura = useParallax(0.18)
const deslocamentoTexto = useParallax(0.06)
</script>

<template>
  <section class="hero-verde">
    <div
      class="hero-textura"
      :class="{ 'hero-textura--foto': imagemFundo }"
      :style="{
        transform: `translateY(${deslocamentoTextura}px)`,
        '--hero-imagem': imagemFundo ? `url('${imagemFundo}')` : undefined,
      }"
    ></div>
    <div class="hero-limite">
      <div class="hero-conteudo" :style="{ transform: `translateY(${-deslocamentoTexto}px)` }">
        <nav class="hero-trilha" aria-label="Você está em" v-if="trilha.length">
          <template v-for="item in trilha" :key="item.to">
            <router-link :to="item.to" class="hero-trilha-link">{{ item.texto }}</router-link>
            <span class="hero-trilha-sep" aria-hidden="true">›</span>
          </template>
          <span class="hero-trilha-atual" aria-current="page">{{ label }}</span>
        </nav>
        <span class="hero-label">{{ label }}</span>
        <h1 class="hero-titulo" :class="{ 'hero-titulo--grande': grande }">
          <template v-for="w in palavras(titulo)" :key="w.i">
            <span class="palavra"><span class="palavra-in" :class="{ 'hero-destaque': w.destaque }" :style="{ '--i': w.i }">{{ w.t }}</span></span>{{ ' ' }}
          </template>
        </h1>
        <p class="hero-sub" v-if="sub">{{ sub }}</p>
        <div class="hero-acoes" v-if="$slots.acoes">
          <slot name="acoes" />
        </div>
        <slot />
      </div>
    </div>
    <span v-if="grande" class="hero-rolar" aria-hidden="true"><i></i></span>
  </section>
</template>

<style scoped>
/* Hero: imagem em sangria sob véu verde profundo; texto centralizado, leve e espaçado */
.hero-verde {
  position: sticky;
  top: var(--nav-h);
  z-index: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: min(58vh, 560px);
  color: #fff;
  background-color: var(--hero-fundo, #324b30);
  padding: clamp(56px, 7vw, 96px) 0 clamp(88px, 10vw, 136px);
}

.hero-limite {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--padding-h);
}

.hero-textura {
  position: absolute;
  inset: -60px 0;
  background-color: var(--hero-fundo, #324b30);
  background-image: linear-gradient(
      180deg,
      rgba(var(--hero-veu, 50, 75, 48), 0.7) 0%,
      rgba(var(--hero-veu, 50, 75, 48), 0.82) 55%,
      rgba(var(--hero-veu, 50, 75, 48), 0.94) 100%
    ),
    var(--hero-imagem, url("/img/textura-verde.svg"));
  background-size: 112% auto;
  background-position: center;
  will-change: transform, background-position;
  z-index: 0;
  animation: deriva-textura 44s ease-in-out infinite;
}

.hero-textura--foto {
  background-image: linear-gradient(
      180deg,
      rgba(var(--hero-veu, 50, 75, 48), 0.7) 0%,
      rgba(var(--hero-veu, 50, 75, 48), 0.82) 55%,
      rgba(var(--hero-veu, 50, 75, 48), 0.94) 100%
    ),
    var(--hero-imagem);
  background-size: cover;
  animation-duration: 60s;
}

@keyframes deriva-textura {
  0% {
    background-position: 46% 42%;
  }
  50% {
    background-position: 54% 58%;
  }
  100% {
    background-position: 46% 42%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-textura {
    animation: none;
  }
}

.hero-conteudo {
  max-width: 940px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  text-align: center;
  will-change: transform;
}

/* legenda: filete vertical sálvia + caixa-alta miúda */
.hero-label {
  display: flex;
  align-items: center;
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.hero-titulo {
  font-family: var(--font-titulo);
  font-weight: 400;
  font-size: clamp(32px, 4.8vw, 68px);
  line-height: 1.16;
  letter-spacing: 0.05em;
  color: #fff;
}

.hero-titulo--grande {
  font-size: clamp(34px, 5vw, 76px);
  line-height: 1.1;
}

.hero-destaque {
  color: #b7c6b1;
}

.hero-trilha {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: -6px;
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.hero-trilha-link {
  color: rgba(255, 255, 255, 0.85);
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 1px;
  padding-bottom: 3px;
  transition: background-size 0.6s var(--ease-lento), color 0.4s ease;
}

.hero-trilha-link:hover {
  color: #fff;
  background-size: 0 1px;
}

.hero-trilha-sep {
  opacity: 0.5;
}

.hero-sub {
  font-family: var(--font-corpo);
  font-size: clamp(16px, 1.5vw, 19px);
  font-weight: 300;
  line-height: 1.85;
  color: rgba(255, 255, 255, 0.9);
  max-width: 620px;
}

.hero-acoes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: 8px;
}

/* ── Entrada: a imagem se aproxima devagar; título sobe palavra a palavra; o resto surge em cascata ── */
.palavra {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  padding: 0.2em 0.04em 0.06em;
  margin: -0.2em -0.04em -0.06em;
}

.palavra-in {
  display: inline-block;
  animation: palavra-sobe 1.5s cubic-bezier(0.16, 1, 0.3, 1) calc(0.3s + var(--i, 0) * 0.1s) both;
}

@keyframes palavra-sobe {
  from {
    transform: translateY(115%);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

@keyframes surge {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes imagem-aproxima {
  from {
    scale: 1.2;
  }
  to {
    scale: 1;
  }
}

.hero-textura {
  animation: deriva-textura 44s ease-in-out infinite, imagem-aproxima 3.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-textura--foto {
  animation: deriva-textura 60s ease-in-out infinite, imagem-aproxima 3.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-label {
  animation: surge 1.2s cubic-bezier(0.22, 0.7, 0.18, 1) 0.05s both;
}

.hero-trilha {
  animation: surge 1.2s cubic-bezier(0.22, 0.7, 0.18, 1) 0.05s both;
}

.hero-sub {
  animation: surge 1.4s cubic-bezier(0.22, 0.7, 0.18, 1) 1s both;
}

.hero-acoes {
  animation: surge 1.4s cubic-bezier(0.22, 0.7, 0.18, 1) 1.25s both;
}

/* fio de rolagem (só na Home): um ponto de luz desce por um filete */
.hero-rolar {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: clamp(36px, 5vw, 64px);
  width: 1px;
  height: 68px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.22);
  animation: surge 1.4s ease 2s both;
}

.hero-rolar i {
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 26px;
  background: #fff;
  animation: rolar-desce 2.6s cubic-bezier(0.65, 0, 0.35, 1) 2.4s infinite;
}

@keyframes rolar-desce {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(280%);
  }
}

/* enquanto a abertura do site roda, o conteúdo espera pausado no estado inicial */
:global(html.entrada-pendente) .palavra-in,
:global(html.entrada-pendente) .hero-label,
:global(html.entrada-pendente) .hero-trilha,
:global(html.entrada-pendente) .hero-sub,
:global(html.entrada-pendente) .hero-acoes,
:global(html.entrada-pendente) .hero-rolar,
:global(html.entrada-pendente) .hero-rolar i {
  animation-play-state: paused;
}

:global(html.entrada-pendente) .hero-textura {
  animation-play-state: paused, paused;
}

@media (prefers-reduced-motion: reduce) {
  .hero-textura,
  .hero-textura--foto,
  .palavra-in,
  .hero-label,
  .hero-trilha,
  .hero-sub,
  .hero-acoes,
  .hero-rolar {
    animation: none;
  }

  .hero-rolar i {
    display: none;
  }
}

@media (max-width: 700px) {
  .hero-rolar {
    display: none;
  }

  .hero-verde {
    min-height: 0;
  }

  .hero-titulo {
    letter-spacing: 0.03em;
  }
}
</style>
