<script setup>
import AppNav from './components/AppNav.vue'
import AppFooter from './components/AppFooter.vue'
import NewsletterPopup from './components/NewsletterPopup.vue'
import CookieAviso from './components/CookieAviso.vue'
import AcessibilidadeBotao from './components/AcessibilidadeBotao.vue'
import BuscaGlobal from './components/BuscaGlobal.vue'
import EntradaSite from './components/EntradaSite.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// o portal da QuotaParte (/revista) tem a página inteira em verde
const portalVerde = computed(() => route.path.startsWith('/revista'))

function irParaConteudo() {
  const principal = document.getElementById('conteudo')
  if (!principal) return
  principal.focus({ preventScroll: true })
  principal.scrollIntoView()
}
</script>

<template>
  <a href="#conteudo" class="pular-conteudo" @click.prevent="irParaConteudo">Ir para o conteúdo</a>
  <AppNav />
  <main id="conteudo" tabindex="-1" :class="{ 'tema-verde': portalVerde }">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter />
  <NewsletterPopup />
  <CookieAviso />
  <AcessibilidadeBotao />
  <BuscaGlobal />
  <EntradaSite />
</template>

<style>
main {
  min-height: calc(100vh - 200px);
}

main:focus {
  outline: none;
}

.pular-conteudo {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1000;
  padding: 12px 20px;
  border-radius: var(--raio, 3px);
  background: var(--verde);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transform: translateY(-200%);
  transition: transform 0.15s ease;
}

.pular-conteudo:focus-visible {
  transform: none;
  outline: 2px solid #fff;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--verde);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
