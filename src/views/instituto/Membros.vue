<script setup>
import HeroVerde from '../../components/HeroVerde.vue'
import GovernancaSecao from './secoes/GovernancaSecao.vue'
import SejaMembroSecao from './secoes/SejaMembroSecao.vue'
</script>

<template>
  <div class="vista">
    <HeroVerde
      label="Pessoas"
      titulo="Quem estrutura o Instituto Società."
      sub="A Diretoria conduz as decisões institucionais. Os coordenadores respondem por cada núcleo de estudo ao longo do semestre."
    >
      <template #acoes>
        <router-link :to="{ hash: '#seja-membro' }" class="btn-claro">Seja membro →</router-link>
      </template>
    </HeroVerde>

    <div class="pagina pagina--sobrepoe pagina--blocos">
      <GovernancaSecao sem-cabecalho />
      <SejaMembroSecao />
    </div>
  </div>
</template>

<style scoped>
.pagina--blocos {
  gap: 0;
  padding-bottom: 0;
}
</style>
