<script setup>
import { computed } from 'vue'

const props = defineProps({
  evento: {
    type: Object,
    required: true,
  },
})

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const dia = computed(() => props.evento.data.split('-')[2])
const mes = computed(() => MESES[Number(props.evento.data.split('-')[1]) - 1])
const ano = computed(() => props.evento.data.split('-')[0])
const detalhe = computed(() => [props.evento.local, props.evento.cidade].filter(Boolean).join(' · '))
</script>

<template>
  <button class="agenda-item" type="button">
    <span class="agenda-data">
      <span class="agenda-dia">{{ dia }}</span>
      <span class="agenda-mes">{{ mes }} {{ ano }}</span>
    </span>
    <span class="agenda-corpo">
      <span class="agenda-tipo">{{ evento.tipo }}</span>
      <span class="agenda-titulo">{{ evento.titulo }}</span>
      <span class="agenda-detalhe" v-if="detalhe">{{ detalhe }}</span>
      <span class="agenda-detalhe" v-if="evento.convidados?.length">
        {{ evento.convidados.join(', ') }}
      </span>
    </span>
    <span class="agenda-seta" aria-hidden="true">→</span>
  </button>
</template>

<style scoped>
.agenda-item {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto;
  gap: clamp(16px, 3vw, 32px);
  align-items: start;
  width: 100%;
  padding: 28px 0;
  background: none;
  border: none;
  border-bottom: 1px solid var(--borda);
  text-align: left;
  color: var(--verde);
  transition: background 0.2s ease;
}

.agenda-item:hover {
  background: var(--fundo-sutil);
}

.agenda-data {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding-left: 4px;
}

.agenda-dia {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 32px;
  line-height: 1;
  color: var(--verde);
}

.agenda-mes {
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.agenda-corpo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.agenda-tipo {
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.agenda-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(18px, 1.7vw, 22px);
  line-height: 1.35;
  color: var(--verde);
}

.agenda-detalhe {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.5;
  color: var(--texto-sec);
}

.agenda-seta {
  font-size: 18px;
  padding: 4px 8px 0 0;
  transition: transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.agenda-item:hover .agenda-seta {
  transform: translateX(8px);
}

@media (max-width: 560px) {
  .agenda-item {
    grid-template-columns: 64px minmax(0, 1fr);
  }

  .agenda-seta {
    display: none;
  }
}
</style>
