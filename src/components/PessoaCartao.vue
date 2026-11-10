<script setup>
import { webp } from '../utils/imagem.js'
import IconeContato from './IconeContato.vue'

// Cartão de pessoa usado em todo o site (Diretoria, Coordenação e quadro de membros):
// foto 4:5, legenda sempre visível e véu elegante ao passar o mouse.
defineProps({
  pessoa: { type: Object, required: true },
  legenda: { type: String, default: '' },
  grande: { type: Boolean, default: false },
})

defineEmits(['abrir'])

function iniciais(nome) {
  const partes = nome.split(' ')
  return partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')
}
</script>

<template>
  <div class="pc" :class="{ 'pc--grande': grande }">
    <button class="pc-foto" @click="$emit('abrir')" :aria-label="`Ver ${pessoa.nome}`">
      <picture v-if="pessoa.foto">
        <source v-if="webp(pessoa.foto)" type="image/webp" :srcset="webp(pessoa.foto)" />
        <img :src="pessoa.foto" :alt="pessoa.nome" loading="lazy" decoding="async" />
      </picture>
      <span v-else class="pc-iniciais" aria-hidden="true">{{ iniciais(pessoa.nome) }}</span>
      <span class="pc-veu" aria-hidden="true">
        <span class="pc-ver">Ver perfil <span class="pc-seta">→</span></span>
      </span>
    </button>

    <div class="pc-legenda">
      <span class="pc-textos">
        <span class="pc-nome">{{ pessoa.nome }}</span>
        <span class="pc-sub" :title="legenda || undefined">{{ legenda || '\u00a0' }}</span>
      </span>
      <a
        v-if="pessoa.linkedin"
        :href="pessoa.linkedin"
        target="_blank"
        rel="noopener"
        class="pc-linkedin"
        :aria-label="`LinkedIn de ${pessoa.nome}`"
      >
        <IconeContato tipo="linkedin" :size="14" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.pc {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.pc-foto {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  aspect-ratio: 4 / 5;
  border-radius: var(--raio);
  overflow: hidden;
  background: var(--fundo-sutil);
  box-shadow: 0 12px 22px -16px rgba(26, 26, 26, 0.4);
  cursor: pointer;
  transition: transform 0.45s cubic-bezier(0.22, 0.8, 0.2, 1), box-shadow 0.45s ease;
}

.pc-foto:hover,
.pc-foto:focus-visible {
  transform: translateY(-6px);
  box-shadow: 0 26px 34px -18px rgba(26, 26, 26, 0.5);
}

.pc-foto picture,
.pc-foto img {
  display: block;
  width: 100%;
  height: 100%;
}

.pc-foto img {
  object-fit: cover;
  object-position: center top;
  transition: transform 0.8s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.pc-foto:hover img {
  transform: scale(1.06);
}

.pc-iniciais {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 0.04em;
  color: var(--sage-texto);
}

/* véu: degradê verde embaixo, moldura fina interna e chamada em Cinzel */
.pc-veu {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 12px 18px;
  background: linear-gradient(to top, rgba(26, 44, 24, 0.82) 0%, rgba(26, 44, 24, 0.28) 42%, rgba(26, 44, 24, 0) 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.pc-veu::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  opacity: 0;
  transform: scale(1.06);
  transition: opacity 0.5s ease, transform 0.7s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.pc-ver {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
  font-family: var(--font-titulo);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #fff;
  transform: translateY(10px);
  transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.pc-ver::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1px;
  width: 0;
  background: #fff;
  transition: width 0.7s cubic-bezier(0.22, 0.8, 0.2, 1) 0.1s;
}

.pc-seta {
  transition: transform 0.5s cubic-bezier(0.22, 0.8, 0.2, 1);
}

.pc-foto:hover .pc-veu,
.pc-foto:focus-visible .pc-veu {
  opacity: 1;
}

.pc-foto:hover .pc-veu::before,
.pc-foto:focus-visible .pc-veu::before {
  opacity: 1;
  transform: scale(1);
}

.pc-foto:hover .pc-ver,
.pc-foto:focus-visible .pc-ver {
  transform: translateY(0);
}

.pc-foto:hover .pc-ver::after,
.pc-foto:focus-visible .pc-ver::after {
  width: 100%;
}

.pc-foto:hover .pc-seta {
  transform: translateX(4px);
}

.pc-legenda {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.pc-textos {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.pc-nome {
  min-width: 0;
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: 15px;
  line-height: 1.3;
  color: var(--verde);
}

.pc-sub {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-corpo);
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.4;
  color: var(--sage-texto);
}

.pc-linkedin {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  margin: -4px -6px 0 0;
  color: var(--verde);
  transition: transform 0.25s ease;
}

.pc-linkedin:hover {
  transform: scale(1.2);
}

/* versão grande (Presidente e Vice) */
.pc--grande .pc-nome {
  font-size: clamp(20px, 2vw, 26px);
}

.pc--grande .pc-sub {
  font-size: 12.5px;
}

@media (prefers-reduced-motion: reduce) {
  .pc-foto,
  .pc-foto img,
  .pc-veu,
  .pc-veu::before,
  .pc-ver,
  .pc-ver::after,
  .pc-seta {
    transition: none;
  }
}
</style>
