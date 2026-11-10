import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vReveal } from './directives/reveal.js'
import { vContar } from './directives/contar.js'
import './assets/main.css'
import './assets/luxo.css'
import { deveEntrar, esperarConteudo } from './utils/entrada.js'

// durante a abertura do site o conteúdo espera; ver EntradaSite.vue
esperarConteudo(deveEntrar())

createApp(App).use(router).directive('reveal', vReveal).directive('contar', vContar).mount('#app')
