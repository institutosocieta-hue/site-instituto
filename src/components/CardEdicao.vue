<script setup>
import CapaEdicao from './CapaEdicao.vue'

defineProps({
  edicao: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <router-link :to="`/revista/edicoes/${edicao.numero}`" class="card-edicao">
    <CapaEdicao :capa="edicao.capa" :alt="`Capa da edição ${edicao.numero}`" />
    <div class="card-corpo">
      <span class="card-nucleo">{{ edicao.nucleo.toUpperCase() }}</span>
      <h3 class="card-numero">Edição {{ edicao.numero }}</h3>
      <span class="card-semestre">{{ edicao.semestre }}</span>
      <span class="card-link">Acessar →</span>
    </div>
  </router-link>
</template>

<style scoped>
.card-edicao {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.card-edicao:hover {
  transform: translateY(-4px);
}

.card-edicao:hover :deep(.capa) {
  border-color: var(--verde);
}

.card-corpo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
}

.card-nucleo {
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--sage-texto);
  font-weight: 600;

}

.card-numero {
  font-family: var(--font-titulo);
  font-size: 20px;
  color: var(--verde);
  font-weight: 600;
  line-height: 1.3;

}

.card-semestre {
  font-family: var(--font-corpo);
  font-size: 14px;
  color: var(--sage-texto);
  margin-bottom: 4px;
}

.card-link {
  font-family: var(--font-corpo);
  font-size: 13px;
  color: var(--verde);
  font-weight: 600;
  letter-spacing: 0.03em;

}

.card-edicao:hover .card-link {
  opacity: 0.7;
}

.card-edicao :deep(.capa) {
  box-shadow: 0 20px 30px -22px rgba(0, 0, 0, 0.55);
  transition: box-shadow 0.5s ease, transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1), border-color 0.3s ease;
}

.card-edicao:hover :deep(.capa) {
  box-shadow: 0 34px 44px -26px rgba(0, 0, 0, 0.65);
  transform: rotate(-1.2deg);
}

.card-edicao {
  transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.card-corpo {
  position: relative;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--borda);
}

.card-corpo::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--verde);
  transition: width 0.8s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.card-edicao:hover .card-corpo::before {
  width: 100%;
}

.card-edicao:hover .card-link {
  opacity: 1;
  letter-spacing: 0.08em;
}

.card-link {
  transition: letter-spacing 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
}
</style>
