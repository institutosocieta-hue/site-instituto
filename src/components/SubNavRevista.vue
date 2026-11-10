<script setup></script>

<template>
  <nav class="subnav">
    <router-link to="/revista" class="subnav-link" exact-active-class="ativa">Início</router-link>
    <router-link to="/revista/edicoes" class="subnav-link" active-class="ativa">Edições</router-link>
    <router-link to="/revista/nucleos" class="subnav-link" active-class="ativa">Núcleos</router-link>
    <router-link to="/revista/sobre" class="subnav-link" active-class="ativa">Sobre</router-link>
    <router-link to="/apoio" class="subnav-link" active-class="ativa">Apoio</router-link>
  </nav>
</template>

<style scoped>
.subnav {
  display: flex;
  justify-content: center;
  gap: 8px;
  border-bottom: 1px solid var(--borda);
  margin: -32px 0 calc(48px - var(--secao-gap));
  overflow-x: auto;
  scrollbar-width: none;
}

.subnav::-webkit-scrollbar {
  display: none;
}

.subnav-link {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  min-height: 44px;
  font-family: var(--font-titulo);
  font-size: 15px;
  color: var(--sage-texto);
  padding: 12px 20px;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.35s ease;
}

.subnav-link:hover {
  color: var(--verde);
  border-bottom-color: var(--sage);
}

.subnav-link.ativa {
  color: var(--verde);
  border-bottom-color: var(--verde);
}

@media (max-width: 700px) {
  .subnav {
    justify-content: flex-start;
  }
}
</style>
