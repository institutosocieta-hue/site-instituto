<script setup>
defineProps({
  etapas: {
    type: Array,
    required: true, // [{ numeral, titulo, texto }]
  },
})
</script>

<template>
  <ol class="fluxo">
    <li class="fluxo-etapa" v-for="etapa in etapas" :key="etapa.numeral" v-reveal>
      <span class="fluxo-marco"></span>
      <span class="fluxo-numeral">{{ etapa.numeral }}</span>
      <h3 class="fluxo-titulo">{{ etapa.titulo }}</h3>
      <p class="fluxo-texto">{{ etapa.texto }}</p>
    </li>
  </ol>
</template>

<style scoped>
.fluxo {
  --fluxo-gap: clamp(24px, 3vw, 40px);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 var(--fluxo-gap);
  position: relative;
}

.fluxo-etapa {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 32px;
}

.fluxo-etapa::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 0;
  right: calc(var(--fluxo-gap) * -1);
  height: 1px;
  background: var(--verde);
}

.fluxo-etapa:last-child::before {
  right: 0;
}

.fluxo-marco {
  position: absolute;
  top: 0;
  left: 0;
  width: 7px;
  height: 7px;
  background: var(--verde);
}

.fluxo-numeral {
  font-family: var(--font-titulo);
  font-size: 15px;
  color: var(--sage-texto);
}

.fluxo-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 20px;
  line-height: 1.3;
  color: var(--verde);
}

.fluxo-texto {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--texto-sec);
}

@media (max-width: 900px) {
  .fluxo {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px 0;
    padding-left: 28px;
  }

  .fluxo::before {
    content: '';
    position: absolute;
    top: 3px;
    bottom: 0;
    left: 3px;
    width: 1px;
    background: var(--verde);
  }

  .fluxo-etapa {
    padding-top: 0;
  }

  .fluxo-etapa::before {
    display: none;
  }

  .fluxo-marco {
    top: 5px;
    left: -28px;
  }
}
</style>
