<script setup>
import { computed } from 'vue'
import { webp } from '../utils/imagem.js'
import { tempoLeitura } from '../utils/leitura.js'

const props = defineProps({
  materia: { type: Object, required: true },
  // 'destaque' (manchete) | 'normal' | 'lista' (miniatura ao lado do título)
  variante: { type: String, default: 'normal' },
})

defineEmits(['abrir'])

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const dataTexto = computed(() => {
  const [ano, mes, dia] = props.materia.data.split('-')
  return `${dia} ${MESES[Number(mes) - 1]} ${ano}`
})
const hoje = new Date().toISOString().slice(0, 10)
const selo = computed(() => {
  if (props.materia.data === hoje) return 'Hoje'
  return props.materia.data > hoje ? 'Próximo' : ''
})
const leitura = computed(() => tempoLeitura(props.materia.corpo))
const etiquetas = computed(() => (props.materia.etiquetas || []).slice(0, 3))
const excerto = computed(() => props.materia.resumo || props.materia.corpo?.[0] || '')
// o quadro assume a proporção da foto (padrão: pôster 4:5); sem foto, a cidade cinza padrão
const proporcao = computed(() => props.materia.imagemProporcao || '4 / 5')
</script>

<template>
  <button type="button" class="materia" :class="`materia--${variante}`" @click="$emit('abrir', materia)">
    <span class="materia-imagem" :style="variante === 'lista' ? null : { aspectRatio: proporcao }">
      <picture v-if="materia.imagem">
        <source v-if="webp(materia.imagem)" type="image/webp" :srcset="webp(materia.imagem)" />
        <img :src="materia.imagem" :alt="materia.titulo" loading="lazy" decoding="async" />
      </picture>
      <span v-else class="materia-cidade" aria-hidden="true"></span>
    </span>

    <span class="materia-corpo">
      <span class="materia-meta">
        <span class="materia-tipo" v-if="variante === 'lista'">{{ materia.tipo }}</span>
        <span class="materia-ponto" v-if="variante === 'lista'" aria-hidden="true"></span>
        <span class="materia-selo" v-if="selo && variante !== 'lista'">{{ selo }}</span>
        <span class="materia-tipo" v-if="variante !== 'lista'">{{ materia.tipo }}</span>
        <span class="materia-ponto" v-if="variante !== 'lista'" aria-hidden="true"></span>
        <time :datetime="materia.data">{{ dataTexto }}</time>
        <template v-if="leitura && variante !== 'lista'">
          <span class="materia-ponto" aria-hidden="true"></span>
          <span class="materia-leitura">{{ leitura }} de leitura</span>
        </template>
      </span>
      <span class="materia-titulo">{{ materia.titulo }}</span>
      <span class="materia-resumo" v-if="variante !== 'lista' && excerto">{{ excerto }}</span>
      <span class="materia-etiquetas" v-if="variante !== 'lista' && etiquetas.length">
        <span class="etiqueta" v-for="e in etiquetas" :key="e">{{ e }}</span>
      </span>
      <span class="materia-mais" v-if="variante !== 'lista'">
        Abrir
        <span class="materia-seta" aria-hidden="true">→</span>
      </span>
    </span>
  </button>
</template>

<style scoped>
.materia {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  text-align: left;
  color: var(--verde);
  cursor: pointer;
}

.materia-imagem {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: var(--raio);
  background: var(--fundo-sutil);
  box-shadow: 0 18px 30px -22px rgba(26, 26, 26, 0.5);
  transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1), box-shadow 0.6s ease;
}

.materia:hover .materia-imagem,
.materia:focus-visible .materia-imagem {
  transform: translateY(-5px);
  box-shadow: 0 30px 40px -24px rgba(26, 26, 26, 0.55);
}

.materia-imagem picture,
.materia-imagem img {
  display: block;
  width: 100%;
  height: 100%;
}

.materia-imagem img {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.9s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.materia:hover .materia-imagem img,
.materia:focus-visible .materia-imagem img {
  transform: scale(1.05);
}

/* Sem foto: a cidade cinza padrão do Instituto */
.materia-cidade {
  position: absolute;
  inset: 0;
  background-color: #b9bfb1;
  background-image: url('/img/textura-sage.svg');
  background-size: cover;
  background-position: center;
  transition: transform 0.9s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.materia:hover .materia-cidade {
  transform: scale(1.05);
}

.materia-selo {
  padding: 3px 9px;
  font-family: var(--font-corpo);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--branco);
  background: var(--verde);
}

.materia-corpo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.materia-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.materia-tipo {
  color: var(--verde);
}

.materia-ponto {
  width: 4px;
  height: 4px;
  background: var(--sage);
}

.materia-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(19px, 1.8vw, 23px);
  line-height: 1.35;
  color: var(--verde);
  background-image: linear-gradient(var(--verde), var(--verde));
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0 1px;
  padding-bottom: 2px;
  width: fit-content;
  max-width: 100%;
  transition: background-size 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.materia:hover .materia-titulo,
.materia:focus-visible .materia-titulo {
  background-size: 100% 1px;
}

.materia-resumo {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--texto-sec);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.materia-leitura {
  letter-spacing: 0.1em;
  text-transform: none;
  font-weight: 500;
}

.materia-etiquetas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.etiqueta {
  padding: 4px 10px;
  border: 1px solid var(--borda);
  border-radius: 999px;
  font-family: var(--font-corpo);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--texto-sec);
  transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease;
}

.materia:hover .etiqueta {
  border-color: var(--verde);
  color: var(--verde);
}

.materia-mais {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-corpo);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--verde);
}

.materia-seta {
  transition: transform 0.35s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.materia:hover .materia-seta,
.materia:focus-visible .materia-seta {
  transform: translateX(6px);
}

/* Manchete: pôster ao lado do texto */
.materia--destaque {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
  gap: clamp(24px, 3.5vw, 44px);
  align-items: center;
}

.materia--destaque .materia-titulo {
  font-size: clamp(24px, 2.6vw, 34px);
  line-height: 1.25;
}

.materia--destaque .materia-resumo {
  font-size: 17px;
  line-height: 1.75;
  -webkit-line-clamp: 5;
  line-clamp: 5;
}

.materia--destaque .materia-corpo {
  gap: 16px;
}

/* Lista de últimas: miniatura + título */
.materia--lista {
  flex-direction: row;
  align-items: center;
  gap: 18px;
  padding: 16px 0;
  border-bottom: 1px solid var(--borda);
  transition: padding-left 0.4s cubic-bezier(0.22, 0.8, 0.2, 1), background 0.3s ease;
}

.materia--lista:hover {
  padding-left: 10px;
  background: var(--fundo-sutil);
}

.materia--lista .materia-imagem {
  flex: 0 0 76px;
  aspect-ratio: 4 / 5;
  box-shadow: none;
}

.materia--lista:hover .materia-imagem {
  transform: none;
  box-shadow: none;
}

.materia--lista .materia-titulo {
  font-size: 16.5px;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .materia--destaque {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .materia-imagem,
  .materia-imagem img,
  .materia-cidade,
  .materia-seta,
  .materia-titulo,
  .materia--lista {
    transition: none;
  }
}
</style>
