<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { iniciarAcessibilidade, redefinirAcessibilidade } from '../composables/useAcessibilidade.js'

const estado = iniciarAcessibilidade()
const aberto = ref(false)

const opcoes = [
  { chave: 'contraste', rotulo: 'Alto contraste', ajuda: 'Escurece textos e reforça contornos.' },
  { chave: 'leitura', rotulo: 'Fonte de leitura', ajuda: 'Usa uma tipografia simples nos títulos.' },
  { chave: 'sublinhar', rotulo: 'Sublinhar links', ajuda: 'Destaca tudo o que é clicável.' },
  { chave: 'semMovimento', rotulo: 'Reduzir animações', ajuda: 'Desliga efeitos e transições.' },
]

function aoPressionar(evento) {
  if (evento.key === 'Escape' && aberto.value) aberto.value = false
}

onMounted(() => window.addEventListener('keydown', aoPressionar))
onUnmounted(() => window.removeEventListener('keydown', aoPressionar))
</script>

<template>
  <div class="a11y">
    <button
      class="a11y-aba"
      :aria-expanded="aberto"
      aria-controls="a11y-painel"
      aria-label="Opções de acessibilidade"
      @click="aberto = !aberto"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="4.5" r="1.8" />
        <path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M9 20l3-5.5 3 5.5" />
      </svg>
    </button>

    <transition name="a11y-painel">
      <div class="a11y-painel" id="a11y-painel" v-if="aberto" role="group" aria-label="Acessibilidade">
        <div class="a11y-topo">
          <span class="a11y-titulo">Acessibilidade</span>
          <button class="a11y-fechar" @click="aberto = false" aria-label="Fechar">×</button>
        </div>

        <ul class="a11y-lista">
          <li v-for="opcao in opcoes" :key="opcao.chave">
            <button
              class="a11y-opcao"
              :class="{ ligada: estado[opcao.chave] }"
              :aria-pressed="estado[opcao.chave]"
              @click="estado[opcao.chave] = !estado[opcao.chave]"
            >
              <span class="a11y-textos">
                <span class="a11y-rotulo">{{ opcao.rotulo }}</span>
                <span class="a11y-ajuda">{{ opcao.ajuda }}</span>
              </span>
              <span class="a11y-chave" aria-hidden="true"><span></span></span>
            </button>
          </li>
        </ul>

        <button class="a11y-redefinir" @click="redefinirAcessibilidade">Redefinir</button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.a11y {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 140;
  transform: translateY(-50%);
}

.a11y-aba {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 52px;
  background: var(--verde);
  color: var(--branco);
  border: none;
  border-radius: 6px 0 0 6px;
  box-shadow: -8px 10px 24px -14px rgba(26, 26, 26, 0.6);
  transition: width 0.35s cubic-bezier(0.22, 0.8, 0.2, 1), background 0.25s ease;
}

.a11y-aba:hover {
  width: 52px;
  background: #1f3220;
}

.a11y-painel {
  position: absolute;
  top: 50%;
  right: 56px;
  width: 320px;
  max-width: calc(100vw - 80px);
  transform: translateY(-50%);
  padding: 20px;
  background: var(--branco);
  border: 1px solid var(--borda);
  border-radius: 6px;
  box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.4);
}

.a11y-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.a11y-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 18px;
  color: var(--verde);
}

.a11y-fechar {
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  font-family: var(--font-titulo);
  font-size: 22px;
  color: var(--verde);
  transition: transform 0.35s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.a11y-fechar:hover {
  transform: rotate(90deg);
}

.a11y-lista {
  display: flex;
  flex-direction: column;
}

.a11y-opcao {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 14px 0;
  background: none;
  border: none;
  border-top: 1px solid var(--borda);
  text-align: left;
  color: var(--verde);
}

.a11y-textos {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.a11y-rotulo {
  font-family: var(--font-corpo);
  font-weight: 700;
  font-size: 14.5px;
}

.a11y-ajuda {
  font-family: var(--font-corpo);
  font-size: 12.5px;
  line-height: 1.4;
  color: var(--texto-sec);
}

.a11y-chave {
  flex: 0 0 40px;
  height: 22px;
  padding: 2px;
  border: 1px solid var(--sage);
  border-radius: 999px;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.a11y-chave span {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--sage);
  transition: transform 0.3s cubic-bezier(0.22, 0.8, 0.2, 1), background 0.3s ease;
}

.a11y-opcao.ligada .a11y-chave {
  background: var(--verde);
  border-color: var(--verde);
}

.a11y-opcao.ligada .a11y-chave span {
  transform: translateX(18px);
  background: var(--branco);
}

.a11y-redefinir {
  width: 100%;
  margin-top: 6px;
  min-height: 40px;
  background: none;
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 600;
  color: var(--verde);
  transition: border-color 0.25s ease, background 0.25s ease;
}

.a11y-redefinir:hover {
  border-color: var(--verde);
  background: var(--fundo-sutil);
}

.a11y-painel-enter-active,
.a11y-painel-leave-active {
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.a11y-painel-enter-from,
.a11y-painel-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(16px);
}

@media (max-width: 700px) {
  .a11y {
    top: auto;
    bottom: 96px;
    transform: none;
  }

  .a11y-painel {
    top: auto;
    bottom: 0;
    transform: none;
  }

  .a11y-painel-enter-from,
  .a11y-painel-leave-to {
    transform: translateX(16px);
  }
}
</style>
