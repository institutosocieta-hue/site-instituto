<script setup>
import HeroVerde from '../components/HeroVerde.vue'
</script>

<template>
  <div class="vista">
    <HeroVerde label="404" titulo="Página não encontrada.">
      <template #acoes>
        <router-link to="/" class="btn-claro">Home</router-link>
        <router-link to="/revista" class="btn-secundario btn-secundario--claro">QuotaParte</router-link>
        <router-link to="/membros#seja-membro" class="btn-secundario btn-secundario--claro">
          Seja Membro
        </router-link>
      </template>
    </HeroVerde>
  </div>
</template>

<style scoped>
.vista :deep(.hero-verde) {
  position: relative;
  top: 0;
  padding-bottom: clamp(72px, 10vw, 112px);
}
</style>
