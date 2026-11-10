<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { deveEntrar, esperarConteudo, marcarEntradaVista, TEMPO_PORTAS } from '../utils/entrada.js'

// Abertura: a cidade em penumbra, um fio de luz que desce, a marca que surge do desfoque
// e duas portas que se abrem para revelar a página.
const visivel = ref(deveEntrar())
const saindo = ref(false)
let aoAbrir = null
let aoFim = null

function bloquearRolagem(bloquear) {
  document.documentElement.style.overflow = bloquear ? 'hidden' : ''
}

function abrir() {
  if (saindo.value) return
  saindo.value = true
  clearTimeout(aoAbrir)
  // o conteúdo da página começa a entrar junto com as portas
  esperarConteudo(false)
  aoFim = setTimeout(() => {
    visivel.value = false
    bloquearRolagem(false)
  }, 1500)
}

function aoTeclar(e) {
  if (e.key === 'Escape' || e.key === 'Enter') abrir()
}

onMounted(() => {
  if (!visivel.value) {
    esperarConteudo(false)
    return
  }
  marcarEntradaVista()
  bloquearRolagem(true)
  window.addEventListener('keydown', aoTeclar)
  aoAbrir = setTimeout(() => abrir(), TEMPO_PORTAS * 1000)
})

onBeforeUnmount(() => {
  clearTimeout(aoAbrir)
  clearTimeout(aoFim)
  esperarConteudo(false)
  window.removeEventListener('keydown', aoTeclar)
  bloquearRolagem(false)
})
</script>

<template>
  <div v-if="visivel" class="entrada" :class="{ saindo }" role="presentation" @click="abrir()">
    <div class="porta porta--e" aria-hidden="true"></div>
    <div class="porta porta--d" aria-hidden="true"></div>

    <div class="palco" aria-hidden="true">
      <span class="fio-v"></span>
      <img class="marca" src="/logo/instituto/nav-logo-claro.svg" alt="" />
      <span class="fio-h"></span>
    </div>

    <button class="pular" type="button" @click.stop="abrir()">Entrar</button>
  </div>
</template>

<style scoped>
.entrada {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  overflow: hidden;
  cursor: pointer;
}

/* as duas portas: verde profundo com a cidade em penumbra, continuando de uma à outra */
.porta {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50.2%;
  background-color: #182816;
  background-image: linear-gradient(rgba(24, 40, 22, 0.8), rgba(24, 40, 22, 0.9)), url('/img/textura-verde.svg');
  background-size: 200% auto, 200vw auto;
  background-repeat: no-repeat;
  transition: transform 1.4s cubic-bezier(0.76, 0, 0.24, 1);
  will-change: transform;
  animation: luz-porta 7s ease-in-out both;
}

.porta--e {
  left: 0;
  background-position: 0 0, left center;
}

.porta--d {
  right: 0;
  background-position: 0 0, right center;
}

@keyframes luz-porta {
  from {
    background-size: 200% auto, 230vw auto;
  }
  to {
    background-size: 200% auto, 200vw auto;
  }
}

.saindo .porta--e {
  transform: translateX(-101%);
}

.saindo .porta--d {
  transform: translateX(101%);
}

/* palco central */
.palco {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  transition: opacity 0.6s ease, transform 1.2s cubic-bezier(0.76, 0, 0.24, 1);
}

.saindo .palco {
  opacity: 0;
  transform: scale(1.06);
}

.fio-v {
  width: 1px;
  height: clamp(56px, 10vh, 96px);
  background: linear-gradient(to bottom, rgba(183, 198, 177, 0), #b7c6b1);
  transform-origin: top;
  animation: fio-desce 1.1s cubic-bezier(0.22, 0.7, 0.18, 1) 0.15s both;
}

.marca {
  width: clamp(210px, 26vw, 340px);
  height: auto;
  animation: marca-surge 1.7s cubic-bezier(0.22, 0.7, 0.18, 1) 0.7s both;
}

.fio-h {
  width: clamp(120px, 14vw, 200px);
  height: 1px;
  background: #b7c6b1;
  transform-origin: center;
  animation: fio-abre 1.2s cubic-bezier(0.22, 0.7, 0.18, 1) 1.5s both;
}

@keyframes fio-desce {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes marca-surge {
  from {
    opacity: 0;
    filter: blur(14px);
    transform: translateY(10px) scale(1.05);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: none;
  }
}

@keyframes fio-abre {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.pular {
  position: absolute;
  z-index: 3;
  bottom: clamp(24px, 5vh, 48px);
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 14px;
  background: none;
  border: 0;
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  opacity: 0;
  animation: pular-surge 1s ease 1.8s both;
  transition: color 0.4s ease;
}

.pular:hover,
.pular:focus-visible {
  color: #fff;
}

.saindo .pular {
  opacity: 0;
  animation: none;
}

@keyframes pular-surge {
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .entrada {
    display: none;
  }
}
</style>
