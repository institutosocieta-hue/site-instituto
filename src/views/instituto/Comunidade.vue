<script setup>
import HeroVerde from '../../components/HeroVerde.vue'
import ComunidadeSecao from './secoes/ComunidadeSecao.vue'
</script>

<template>
  <div class="vista">
    <HeroVerde
      label="Comunidade"
      titulo="Uma rede de conexões e experiências."
      sub="O Instituto é, antes de tudo, uma comunidade: um espaço de encontro entre jovens com o mesmo entusiasmo pelo Direito Empresarial."
    />

    <div class="pagina pagina--sobrepoe">
      <ComunidadeSecao />
    </div>
  </div>
</template>

<style scoped>
.pagina {
  gap: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
