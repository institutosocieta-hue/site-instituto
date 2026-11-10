<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  metricas: {
    type: Array,
    required: true,
  },
  intervalo: {
    type: Number,
    default: 3000,
  },
})

const indice = ref(0)
let temporizador = null

function reiniciar() {
  if (temporizador) clearInterval(temporizador)
  if (props.metricas.length > 1) {
    temporizador = setInterval(() => {
      indice.value = (indice.value + 1) % props.metricas.length
    }, props.intervalo)
  }
}

function selecionar(i) {
  indice.value = i
  reiniciar()
}

onMounted(reiniciar)
onUnmounted(() => {
  if (temporizador) clearInterval(temporizador)
})
</script>

<template>
  <div class="dashboard" v-if="metricas.length">
    <div class="dashboard-textura"></div>

    <div class="dashboard-corpo">
      <transition name="dashboard-desliza" mode="out-in">
        <div class="dashboard-metrica" :key="indice">
          <span class="dashboard-valor">{{ metricas[indice].valor }}</span>
          <span class="dashboard-label">{{ metricas[indice].label }}</span>
        </div>
      </transition>

      <div class="dashboard-lista" v-if="metricas.length > 1">
        <button
          v-for="(m, i) in metricas"
          :key="i"
          type="button"
          class="dashboard-item"
          :class="{ ativo: i === indice }"
          @click="selecionar(i)"
        >
          <span class="dashboard-item-valor">{{ m.valor }}</span>
          <span class="dashboard-item-label">{{ m.label }}</span>
        </button>
      </div>
    </div>

    <div class="dashboard-barras" v-if="metricas.length > 1">
      <span
        v-for="(m, i) in metricas"
        :key="i"
        class="dashboard-barra"
        :class="{ ativa: i === indice }"
      >
        <span
          v-if="i === indice"
          class="dashboard-barra-preenchimento"
          :style="{ animationDuration: `${intervalo}ms` }"
        ></span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 36px 44px;
  border-radius: var(--raio);
  background-color: var(--hero-fundo, #324b30);
}

.dashboard-textura {
  position: absolute;
  inset: -40px;
  background-image: linear-gradient(rgba(50, 75, 48, 0.85), rgba(50, 75, 48, 0.85)),
    url('/img/textura-verde.svg');
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.dashboard-corpo {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.dashboard-metrica {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
  min-width: 180px;
}

.dashboard-valor {
  font-family: var(--font-titulo);
  font-size: 44px;
  color: #fff;
  line-height: 1;
}

.dashboard-label {
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 600;

}

.dashboard-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.dashboard-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--raio);
  padding: 10px 16px;
  text-align: left;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.dashboard-item:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.dashboard-item.ativo {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.5);
}

.dashboard-item-valor {
  font-family: var(--font-titulo);
  font-size: 18px;
  color: #fff;
}

.dashboard-item-label {
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
}

.dashboard-barras {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 6px;
}

.dashboard-barra {
  position: relative;
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.25);
  overflow: hidden;
}

.dashboard-barra-preenchimento {
  position: absolute;
  inset: 0;
  transform-origin: left;
  transform: scaleX(0);
  background: #fff;
  animation-name: preencher;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes preencher {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.dashboard-desliza-enter-active,
.dashboard-desliza-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.dashboard-desliza-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.dashboard-desliza-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .dashboard {
    padding: 28px var(--padding-h-m);
  }

  .dashboard-valor {
    font-size: 36px;
  }

  .dashboard-lista {
    justify-content: flex-start;
  }
}
</style>
