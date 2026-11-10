<script setup>
import { useFecharComEsc } from '../composables/useFecharComEsc.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

function fechar() {
  emit('update:modelValue', false)
}

useFecharComEsc(() => props.modelValue, fechar)
</script>

<template>
  <Teleport to="body">
    <transition name="janela-fade">
      <div class="janela-fundo" v-if="modelValue" @click="fechar"></div>
    </transition>
    <transition name="painel-subir">
      <div class="painel-meio" v-if="modelValue" role="dialog" aria-modal="true">
        <button class="painel-fechar" @click="fechar" aria-label="Fechar">×</button>
        <div class="painel-corpo">
          <slot />
        </div>
        <span class="painel-emblema" aria-hidden="true"><span></span><span></span><span></span></span>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.painel-meio {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 52vh;
  background: var(--branco);
  border-radius: 14px 14px 0 0;
  box-shadow: 0 -30px 80px -30px rgba(0, 0, 0, 0.5);
  z-index: 201;
  overflow-y: auto;
  padding: 56px var(--padding-h) 44px;
}

/* fio verde que se desenha no topo e a alça da folha */
.painel-meio::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--verde);
  transform-origin: left;
  animation: painel-fio 0.9s 0.2s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

.painel-meio::after {
  content: '';
  position: absolute;
  top: 14px;
  left: 50%;
  width: 44px;
  height: 3px;
  margin-left: -22px;
  border-radius: 2px;
  background: var(--borda);
}

@keyframes painel-fio {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.painel-fechar {
  position: absolute;
  top: 18px;
  right: var(--padding-h);
  width: 44px;
  height: 44px;
  background: none;
  border: 1px solid transparent;
  border-radius: 50%;
  font-family: var(--font-titulo);
  font-size: 22px;
  line-height: 1;
  color: var(--sage-texto);
  transition: transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1), color 0.2s ease, border-color 0.2s ease;
}

.painel-fechar:hover {
  color: var(--verde);
  border-color: var(--borda);
  transform: rotate(90deg);
}

.painel-corpo {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
}

.painel-emblema {
  position: absolute;
  right: var(--padding-h);
  bottom: 28px;
  width: 84px;
  height: 84px;
  opacity: 0.45;
  pointer-events: none;
}

.painel-emblema span {
  position: absolute;
  border: 1px solid var(--sage);
}

.painel-emblema span:nth-child(1) { inset: 0; }
.painel-emblema span:nth-child(2) { inset: 18%; transform: rotate(8deg); }
.painel-emblema span:nth-child(3) { inset: 36%; background: var(--verde); border-color: var(--verde); transform: rotate(16deg); }

.painel-subir-enter-active {
  transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.painel-subir-leave-active {
  transition: transform 0.3s ease;
}

.painel-subir-enter-from,
.painel-subir-leave-to {
  transform: translateY(100%);
}

@media (max-width: 768px) {
  .painel-meio {
    padding: 48px var(--padding-h-m) 32px;
    height: 62vh;
  }

  .painel-fechar {
    right: var(--padding-h-m);
  }

  .painel-emblema {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .painel-meio::before {
    animation: none;
  }
}
</style>
