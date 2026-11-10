<script setup>
import { useFecharComEsc } from '../composables/useFecharComEsc.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: null,
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
    <div class="card-palco" v-if="modelValue && item">
      <transition name="card-vira">
        <div class="card-flash" role="dialog" aria-modal="true">
          <button class="card-fechar" @click="fechar" aria-label="Fechar">×</button>
          <span class="card-flash-emblema" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="card-flash-valor">{{ item.valor }}</span>
          <span class="card-flash-label">{{ item.label }}</span>
          <div class="card-flash-linha"></div>
          <p class="card-flash-texto">{{ item.descricao }}</p>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<style scoped>
.card-palco {
  position: fixed;
  inset: 0;
  z-index: 201;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1400px;
  pointer-events: none;
}

.card-flash {
  pointer-events: auto;
  position: relative;
  overflow: hidden;
  width: min(480px, calc(100vw - 32px));
  background-color: #233722;
  background-image: linear-gradient(rgba(35, 55, 34, 0.88), rgba(35, 55, 34, 0.88)),
    url('/img/textura-verde.svg');
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  padding: clamp(36px, 5vw, 52px) clamp(28px, 4vw, 44px);
  box-shadow: 0 44px 100px -34px rgba(0, 0, 0, 0.7);
  color: #fff;
}

.card-flash::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #fff;
  transform-origin: left;
  animation: flash-fio 0.9s 0.3s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

@keyframes flash-fio {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.card-fechar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid transparent;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-family: var(--font-titulo);
  font-size: 22px;
  color: #fff;
  line-height: 1;
  transition: transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1), border-color 0.2s ease;
}

.card-fechar:hover {
  transform: rotate(90deg);
  border-color: rgba(255, 255, 255, 0.5);
}

.card-flash-emblema {
  position: absolute;
  right: -24px;
  bottom: -24px;
  width: 150px;
  height: 150px;
  opacity: 0.28;
  pointer-events: none;
}

.card-flash-emblema span {
  position: absolute;
  border: 1px solid #fff;
}

.card-flash-emblema span:nth-child(1) { inset: 0; }
.card-flash-emblema span:nth-child(2) { inset: 20%; transform: rotate(10deg); }
.card-flash-emblema span:nth-child(3) { inset: 40%; transform: rotate(20deg); background: #fff; }

.card-flash-valor {
  position: relative;
  display: block;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(64px, 11vw, 96px);
  line-height: 1;
  margin-bottom: 14px;
  animation: flash-numero 0.8s 0.25s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

@keyframes flash-numero {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

.card-flash-label {
  position: relative;
  display: block;
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.card-flash-linha {
  position: relative;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
  margin: 22px 0;
  transform-origin: left;
  animation: flash-fio 1s 0.5s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

.card-flash-texto {
  position: relative;
  font-family: var(--font-corpo);
  font-size: 16.5px;
  line-height: 1.85;
  color: rgba(255, 255, 255, 0.93);
  animation: flash-numero 0.8s 0.5s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

.card-vira-enter-active {
  transition: transform 0.7s cubic-bezier(0.22, 0.8, 0.2, 1), opacity 0.35s ease;
}

.card-vira-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.card-vira-enter-from {
  transform: rotateY(-100deg);
  opacity: 0;
}

.card-vira-leave-to {
  transform: rotateY(100deg);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .card-flash::before,
  .card-flash-valor,
  .card-flash-linha,
  .card-flash-texto {
    animation: none;
  }

  .card-vira-enter-active,
  .card-vira-leave-active {
    transition: opacity 0.25s ease;
  }

  .card-vira-enter-from,
  .card-vira-leave-to {
    transform: none;
  }
}
</style>
