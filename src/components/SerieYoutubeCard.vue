<script setup>
import { computed } from 'vue'
import { linkCanal } from '../data/eventos.js'

const props = defineProps({
  serie: { type: Object, required: true },
})

const episodio = computed(() => props.serie.ultimoEpisodio)
// episódio específico quando divulgado; senão, o canal do Instituto
const link = computed(() => episodio.value?.linkYoutube || linkCanal)
const chamada = computed(() => (episodio.value?.linkYoutube ? 'Assistir ao episódio' : 'Ver no YouTube'))

const dataTexto = computed(() => {
  if (!episodio.value?.data) return ''
  const [ano, mes, dia] = episodio.value.data.split('-').map(Number)
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
})
</script>

<template>
  <a class="serie" :href="link" target="_blank" rel="noopener">
    <span class="serie-rotulo">
      <span class="serie-play" aria-hidden="true"></span>
      YouTube
    </span>

    <h3 class="serie-nome">{{ serie.nome }}</h3>
    <span class="serie-linha" aria-hidden="true"></span>

    <p class="serie-descricao">{{ serie.descricao }}</p>

    <div class="serie-episodio" v-if="episodio">
      <span class="serie-episodio-rotulo">Último episódio</span>
      <span class="serie-episodio-titulo">{{ episodio.titulo }}</span>
      <span class="serie-episodio-meta" v-if="episodio.convidado || dataTexto">
        {{ [episodio.convidado, dataTexto].filter(Boolean).join(' · ') }}
      </span>
    </div>

    <span class="serie-chamada">
      {{ chamada }}
      <span class="serie-seta" aria-hidden="true">→</span>
    </span>
  </a>
</template>

<style scoped>
.serie {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
  padding: clamp(26px, 2.6vw, 36px);
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  color: var(--verde);
  transition: border-color 0.4s ease, transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
}

/* preenchimento que sobe ao passar o mouse */
.serie::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--fundo-sutil);
  transform: translateY(101%);
  transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.serie:hover {
  border-color: var(--verde);
  transform: translateY(-4px);
}

.serie:hover::before {
  transform: none;
}

.serie-rotulo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.serie-play {
  width: 0;
  height: 0;
  border-left: 8px solid currentColor;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}

.serie-nome {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(26px, 2.6vw, 36px);
  line-height: 1.15;
  letter-spacing: 0.01em;
  color: var(--verde);
}

.serie-linha {
  display: block;
  width: 40px;
  height: 1px;
  background: var(--verde);
  transition: width 0.6s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.serie:hover .serie-linha {
  width: 100%;
}

.serie-descricao {
  font-family: var(--font-corpo);
  font-size: 16px;
  line-height: 1.7;
  color: var(--texto-sec);
}

.serie-episodio {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 16px;
  border-top: 1px solid var(--borda);
}

.serie-episodio-rotulo {
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.serie-episodio-titulo {
  font-family: var(--font-corpo);
  font-weight: 600;
  font-size: 15.5px;
  line-height: 1.5;
  color: var(--texto-corpo);
}

.serie-episodio-meta {
  font-family: var(--font-corpo);
  font-size: 13.5px;
  color: var(--texto-sec);
}

.serie-chamada {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 8px;
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--verde);
}

.serie-seta {
  transition: transform 0.4s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.serie:hover .serie-seta {
  transform: translateX(8px);
}

@media (prefers-reduced-motion: reduce) {
  .serie,
  .serie::before,
  .serie-linha,
  .serie-seta {
    transition: none;
  }
}
</style>
