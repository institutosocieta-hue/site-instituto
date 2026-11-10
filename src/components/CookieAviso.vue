<script setup>
import { onMounted, ref } from 'vue'

const CHAVE = 'aviso-privacidade-ciente'
const visivel = ref(false)

onMounted(() => {
  let ciente = false
  try {
    ciente = localStorage.getItem(CHAVE) === '1'
  } catch {
    ciente = false
  }
  if (!ciente) setTimeout(() => (visivel.value = true), 1200)
})

function entendi() {
  visivel.value = false
  window.dispatchEvent(new CustomEvent('aviso-ciente'))
  try {
    localStorage.setItem(CHAVE, '1')
  } catch {
    // armazenamento indisponível: o aviso apenas fecha nesta visita
  }
}
</script>

<template>
  <transition name="aviso-sobe">
    <div class="aviso" v-if="visivel" role="region" aria-label="Aviso de privacidade">
      <p class="aviso-texto">
        Este site guarda no seu navegador apenas o necessário para funcionar, como a preferência
        sobre o aviso de newsletter. Não usamos cookies de publicidade. Saiba mais na
        <router-link to="/privacidade" class="aviso-link">Política de Privacidade</router-link>.
      </p>
      <button class="btn-primario aviso-botao" @click="entendi">Entendi</button>
    </div>
  </transition>
</template>

<style scoped>
.aviso {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px var(--padding-h);
  background: var(--branco);
  border-top: 1px solid var(--borda);
  box-shadow: 0 -18px 40px -24px rgba(26, 26, 26, 0.35);
}

.aviso-texto {
  max-width: 860px;
  font-family: var(--font-corpo);
  font-size: 14px;
  line-height: 1.6;
  color: var(--texto-corpo);
}

.aviso-link {
  font-weight: 600;
  color: var(--verde);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.aviso-botao {
  flex-shrink: 0;
  min-height: 44px;
}

.aviso-sobe-enter-active,
.aviso-sobe-leave-active {
  transition: transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1), opacity 0.4s ease;
}

.aviso-sobe-enter-from,
.aviso-sobe-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 700px) {
  .aviso {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding: 16px var(--padding-h-m);
  }
}
</style>
