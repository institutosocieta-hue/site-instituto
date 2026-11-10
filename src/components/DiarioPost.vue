<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const rotulos = {
  comentario: 'Comentário',
  encontro: 'Encontro Inaugural',
  atualizacao: 'Atualização',
}

const rotulo = computed(() => rotulos[props.post.tipo] || props.post.tipo)

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>

<template>
  <article class="diario-post" :class="`diario-post--${post.tipo}`">
    <div class="diario-post-cabecalho">
      <span class="diario-post-tipo">{{ rotulo }}</span>
      <span class="diario-post-data">{{ formatarData(post.data) }}</span>
    </div>
    <p class="diario-post-texto">{{ post.texto }}</p>
    <span class="diario-post-autor" v-if="post.autor">{{ post.autor }}</span>
  </article>
</template>

<style scoped>
.diario-post {
  padding: 18px 22px;
}

.diario-post-cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.diario-post-tipo {
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--verde);
  font-weight: 600;

}

.diario-post-data {
  font-family: var(--font-corpo);
  font-size: 12px;
  color: var(--sage-texto);
}

.diario-post-texto {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--texto-corpo);
}

.diario-post-autor {
  display: block;
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 600;
  color: var(--sage-texto);
  margin-top: 10px;
}

.diario-post--comentario {
  background: var(--fundo-sutil);
  border-top: 2px solid var(--verde);

}

.diario-post--comentario .diario-post-texto {
  font-style: italic;
  font-size: 17px;
  color: var(--texto-corpo);
}

.diario-post--encontro {
  position: relative;
  overflow: hidden;
  background-color: var(--branco);
  background-image: linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)),
    url('/img/textura-sage.svg');
  background-size: cover;
  background-position: center;
  border-top: 3px solid var(--sage);

}

.diario-post--encontro .diario-post-tipo {
  color: var(--sage-texto);
}

.diario-post--atualizacao {
  padding-left: 0;
}

.diario-post--atualizacao .diario-post-texto {
  color: var(--texto-sec);
}
</style>
