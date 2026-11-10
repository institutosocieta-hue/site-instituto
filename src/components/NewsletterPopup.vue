<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { contato } from '../data/contato.js'

const CHAVE_SESSAO = 'newsletter-dispensada'

const visivel = ref(false)
const email = ref('')
const enviado = ref(false)

function abrirPorPedido() {
  enviado.value = false
  visivel.value = true
}

onMounted(() => {
  window.addEventListener('abrir-newsletter', abrirPorPedido)
  let jaViu = false
  try {
    jaViu = sessionStorage.getItem(CHAVE_SESSAO) === '1'
  } catch {
    jaViu = false
  }
  // o aviso de newsletter só aparece depois que o aviso de privacidade foi dispensado
  let avisoCiente = false
  try {
    avisoCiente = localStorage.getItem('aviso-privacidade-ciente') === '1'
  } catch {
    avisoCiente = false
  }
  if (jaViu) return
  const agendar = () =>
    setTimeout(() => {
      visivel.value = true
    }, 2500)
  if (avisoCiente) agendar()
  else window.addEventListener('aviso-ciente', agendar, { once: true })
})

onUnmounted(() => window.removeEventListener('abrir-newsletter', abrirPorPedido))

function dispensar() {
  visivel.value = false
  try {
    sessionStorage.setItem(CHAVE_SESSAO, '1')
  } catch {
    // armazenamento indisponível: apenas fecha nesta visita
  }
}

function inscrever() {
  if (!email.value) return
  if (contato.newsletterLink) {
    window.open(contato.newsletterLink, '_blank', 'noopener')
  }
  enviado.value = true
  setTimeout(dispensar, 1600)
}
</script>

<template>
  <transition name="newsletter-subir">
    <div class="newsletter" v-if="visivel" role="dialog" aria-label="Inscrição na newsletter">
      <button class="newsletter-fechar" @click="dispensar" aria-label="Dispensar">
        Agora não
      </button>

      <div class="newsletter-conteudo" v-if="!enviado">
        <span class="label-caps">Newsletter</span>
        <p class="newsletter-titulo">Mais informações sobre o Instituto, direto no seu e-mail.</p>
        <form class="newsletter-form" @submit.prevent="inscrever">
          <input
            v-model="email"
            type="email"
            required
            aria-label="E-mail"
            autocomplete="email"
            placeholder="seu@email.com"
            class="newsletter-input"
          />
          <button type="submit" class="btn-primario newsletter-btn">Inscrever-se</button>
        </form>
      </div>

      <div class="newsletter-conteudo" v-else>
        <p class="newsletter-titulo">Obrigado! Confirme sua inscrição pelo formulário aberto.</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.newsletter {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 300;
  width: min(340px, calc(100vw - 48px));
  background: var(--branco);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  padding: 22px 22px 16px;
  box-shadow: 0 24px 48px -16px rgba(26, 26, 26, 0.3);
}

.newsletter-conteudo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.newsletter-titulo {
  font-family: var(--font-titulo);
  font-size: 16px;
  line-height: 1.4;
  color: var(--verde);
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.newsletter-input {
  font-family: var(--font-corpo);
  font-size: 15px;
  padding: 0 14px;
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  color: var(--verde);
  background: var(--branco);
  min-height: 46px;

}

.newsletter-input:focus {
  outline: none;
  border-color: var(--verde);
  box-shadow: 0 0 0 1px var(--verde);
}

.newsletter-btn {
  width: 100%;
  text-align: center;
  font-size: 14px;
}

.newsletter-fechar {
  display: block;
  margin-left: auto;
  margin-bottom: 12px;
  background: none;
  border: none;
  font-family: var(--font-corpo);
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--sage-texto);
  transition: color 0.15s ease;
  min-height: 44px;
  padding: 0 4px;

}

.newsletter-fechar:hover {
  color: var(--verde);
}

.newsletter-subir-enter-active,
.newsletter-subir-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.newsletter-subir-enter-from,
.newsletter-subir-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@media (max-width: 600px) {
  .newsletter {
    left: 16px;
    right: 16px;
    bottom: 16px;
    width: auto;
  }
}
</style>
