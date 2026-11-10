<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const emRevista = computed(() => route.path.startsWith('/revista'))

const menuAberto = ref(false)

function fecharMenu() {
  menuAberto.value = false
}

function abrirBusca() {
  fecharMenu()
  window.dispatchEvent(new CustomEvent('abrir-busca'))
}
</script>

<template>
  <header class="nav" :class="{ 'tema-verde': emRevista }">
    <div class="nav-conteudo">
      <router-link to="/" class="nav-marca" @click="fecharMenu">
        <img
          :src="emRevista ? '/logo/instituto/nav-logo-claro.svg' : '/logo/instituto/nav-logo.svg'"
          alt="Instituto Società"
          class="nav-logo-img"
        />
        <template v-if="emRevista">
          <span class="nav-marca-separador"></span>
          <img src="/logo/wordmark-nav.svg" alt="QuotaParte" class="nav-logo-quotaparte" />
        </template>
      </router-link>

      <nav class="nav-links" :class="{ aberto: menuAberto }" aria-label="Principal">
        <router-link
          to="/"
          class="nav-link"
          active-class="nav-link--ancestral"
          exact-active-class="router-link-active"
          @click="fecharMenu"
        >
          Home
        </router-link>
        <router-link to="/comunidade" class="nav-link" @click="fecharMenu">Comunidade</router-link>
        <router-link to="/membros" class="nav-link" @click="fecharMenu">Pessoas</router-link>
        <router-link to="/distincoes" class="nav-link" @click="fecharMenu">Distinções</router-link>
        <router-link to="/atividades" class="nav-link" @click="fecharMenu">Atividades</router-link>
        <router-link to="/apoio" class="nav-link" @click="fecharMenu">Apoio</router-link>

        <div class="nav-acoes">
          <button class="nav-busca nav-busca--menu" @click="abrirBusca">Buscar no site</button>
          <router-link to="/membros#seja-membro" class="nav-botao btn-secundario" @click="fecharMenu">
            Seja membro
          </router-link>
          <router-link to="/revista" class="nav-botao btn-primario" @click="fecharMenu">QuotaParte</router-link>
        </div>
      </nav>

      <div class="nav-dir">
        <button class="nav-busca" aria-label="Buscar no site" title="Buscar (atalho: /)" @click="abrirBusca">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5L21 21" />
          </svg>
        </button>

        <button
          class="nav-toggle"
          :class="{ ativo: menuAberto }"
          aria-label="Abrir menu"
          :aria-expanded="menuAberto"
          @click="menuAberto = !menuAberto"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Barra discreta: marfim, filete inferior, menu centralizado em caixa-alta espaçada */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--borda);
}

.nav.tema-verde {
  background: rgba(40, 62, 38, 0.97);
  border-bottom-color: rgba(255, 255, 255, 0.14);
}

.nav-conteudo {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(20px, 3vw, 48px);
  height: var(--nav-h);
  padding: 0 var(--padding-h);
  max-width: 1600px;
  margin: 0 auto;
}

/* entrada: o menu desce com suavidade quando a página aparece */
.nav-conteudo {
  animation: nav-desce 1.4s cubic-bezier(0.22, 0.7, 0.18, 1) 0.2s both;
}

@keyframes nav-desce {
  from {
    opacity: 0;
    transform: translateY(-14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

:global(html.entrada-pendente) .nav-conteudo {
  animation-play-state: paused;
}

.nav-marca {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.nav-logo-img {
  display: block;
  height: 38px;
  width: auto;
}

.nav-marca-separador {
  width: 1px;
  height: 22px;
  background: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.nav-logo-quotaparte {
  display: block;
  height: 18px;
  width: auto;
}

.tema-verde .nav-logo-quotaparte {
  filter: invert(1) grayscale(1);
  mix-blend-mode: screen;
}

/* menu e botões: o menu fica ao centro, os botões à direita */
.nav-links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(20px, 2.6vw, 44px);
  min-width: 0;
}

.nav-links > .nav-link:first-child {
  margin-left: auto;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  height: var(--nav-h);
  font-family: var(--font-titulo);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--texto-corpo);
  white-space: nowrap;
  transition: color 0.5s var(--ease-lento);
}

.tema-verde .nav-link {
  color: rgba(255, 255, 255, 0.82);
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 24px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.7s var(--ease-lento);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--verde);
}

.tema-verde .nav-link:hover,
.tema-verde .nav-link.router-link-active {
  color: #fff;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  transform: scaleX(1);
}

.nav-acoes {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.nav-botao {
  min-height: 42px;
  padding: 0 24px;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  white-space: nowrap;
}

.tema-verde .nav-botao.btn-secundario {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
}

.tema-verde .nav-botao.btn-secundario::before {
  background: #fff;
}

.tema-verde .nav-botao.btn-secundario:hover {
  color: #324b30;
}

.tema-verde .nav-botao.btn-primario {
  background: #fff;
  color: #324b30;
  border-color: #fff;
}

.tema-verde .nav-botao.btn-primario::before {
  background: #dde5d8;
}

.nav-busca {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  color: var(--verde);
  transition: opacity 0.4s ease;
}

.tema-verde .nav-busca {
  color: #fff;
}

.nav-busca:hover {
  opacity: 0.6;
}

.nav-busca--menu {
  display: none;
}

.nav-dir {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 44px;
  height: 44px;
  background: none;
  border: 0;
  padding: 0;
}

.nav-toggle span {
  display: block;
  width: 24px;
  height: 1px;
  background: var(--verde);
  transition: transform 0.35s ease, opacity 0.25s ease;
}

.tema-verde .nav-toggle span {
  background: #fff;
}

.nav-toggle.ativo span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.nav-toggle.ativo span:nth-child(2) {
  opacity: 0;
}
.nav-toggle.ativo span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

@media (max-width: 1500px) {
  .nav-marca-separador,
  .nav-logo-quotaparte {
    display: none;
  }
}

@media (max-width: 1380px) {
  .nav-link {
    font-size: 11.5px;
    letter-spacing: 0.14em;
  }

  .nav-links {
    gap: 24px;
  }
}

/* menu recolhido: painel marfim em largura total */
@media (max-width: 1240px) {
  .nav-conteudo {
    grid-template-columns: auto 1fr;
  }

  .nav-dir {
    margin-left: auto;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: var(--branco);
    border-bottom: 1px solid var(--borda);
    max-height: 0;
    overflow: hidden;
    visibility: hidden;
    transition: max-height 0.5s var(--ease-lento), visibility 0s linear 0.5s;
  }

  .nav-links > .nav-link:first-child {
    margin-left: 0;
  }

  .nav.tema-verde .nav-links {
    background: #2a3f28;
  }

  .nav-links.aberto {
    max-height: 720px;
    visibility: visible;
    transition: max-height 0.5s var(--ease-lento);
  }

  .nav-link {
    height: auto;
    min-height: 58px;
    padding: 0 var(--padding-h);
    font-size: 13px;
    border-bottom: 1px solid var(--borda);
  }

  .tema-verde .nav-link {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  .nav-link::after {
    display: none;
  }

  .nav-acoes {
    flex-direction: column;
    align-items: stretch;
    margin-left: 0;
    padding: 24px var(--padding-h) 28px;
    gap: 12px;
  }

  .nav-botao {
    min-height: 50px;
  }

  .nav-busca--menu {
    display: flex;
    width: auto;
    height: auto;
    justify-content: flex-start;
    padding: 0 0 8px;
    font-family: var(--font-corpo);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--verde);
  }

  .tema-verde .nav-busca--menu {
    color: #fff;
  }
}

@media (max-width: 480px) {
  .nav-logo-img {
    height: 32px;
  }
}
</style>
