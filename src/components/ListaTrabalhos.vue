<script setup>
defineProps({
  trabalhos: {
    type: Array,
    required: true,
  },
})

import { tempoLeitura } from '../utils/leitura.js'

function autoresTexto(trabalho) {
  const lista = trabalho.autores?.length ? trabalho.autores : [trabalho.autor].filter(Boolean)
  return lista.join(', ')
}
</script>

<template>
  <ol class="lista-trabalhos">
    <li v-for="(trabalho, i) in trabalhos" :key="trabalho.slug || i">
      <component
        :is="trabalho.slug ? 'router-link' : 'div'"
        :to="trabalho.slug ? `/revista/trabalhos/${trabalho.slug}` : undefined"
        class="trabalho-linha"
      >
        <span class="trabalho-indice">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="trabalho-texto">
          <span class="trabalho-titulo">{{ trabalho.titulo }}</span>
          <span class="trabalho-autor">{{ autoresTexto(trabalho) }}</span>
          <span class="trabalho-leitura" v-if="trabalho.resumo">
            {{ trabalho.nucleo }} · {{ tempoLeitura(trabalho.resumo) }} de leitura
          </span>
        </span>
        <span v-if="trabalho.pdf || trabalho.link" class="trabalho-link">Ler trabalho →</span>
        <span v-else class="trabalho-link trabalho-link-desabilitado">Em preparação</span>
      </component>
    </li>
  </ol>
</template>

<style scoped>
.trabalho-linha {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 8px;
  border-bottom: 1px solid var(--borda);
  transition: background 0.2s ease;
}

.trabalho-leitura {
  display: block;
  margin-top: 4px;
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--sage-texto);
}

a.trabalho-linha:hover {
  background: var(--fundo-sutil);
}

.lista-trabalhos li:first-child .trabalho-linha {
  border-top: 1px solid var(--borda);
}

.trabalho-indice {
  font-family: var(--font-titulo);
  font-size: 15px;
  color: var(--sage-texto);
  min-width: 28px;
}

.trabalho-texto {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.trabalho-titulo {
  font-family: var(--font-titulo);
  font-size: 18px;
  line-height: 1.4;
  color: var(--verde);
}

.trabalho-autor {
  font-family: var(--font-corpo);
  font-size: 15px;
  color: var(--texto-sec);
}

.trabalho-link {
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--verde);
  flex-shrink: 0;
}

.trabalho-link-desabilitado {
  color: var(--sage-texto);
}

@media (max-width: 560px) {
  .trabalho-linha {
    flex-wrap: wrap;
  }

  .trabalho-link {
    padding-left: 48px;
  }
}
</style>
