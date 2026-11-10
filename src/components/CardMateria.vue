<script setup>
import { computed, ref, watch } from 'vue'
import { webp } from '../utils/imagem.js'
import { tempoLeitura } from '../utils/leitura.js'
import { useFecharComEsc } from '../composables/useFecharComEsc.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  materia: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

function fechar() {
  emit('update:modelValue', false)
}

useFecharComEsc(() => props.modelValue, fechar)

// capa + galeria: a foto do quadro troca ao clicar na miniatura
const fotos = computed(() => {
  const m = props.materia
  if (!m) return []
  const lista = m.imagem ? [{ src: m.imagem, legenda: m.titulo }] : []
  return lista.concat(m.imagens || [])
})
const indiceFoto = ref(0)
watch(
  () => props.materia,
  () => (indiceFoto.value = 0)
)
const fotoAtual = computed(() => fotos.value[indiceFoto.value] || null)

const leitura = computed(() => (props.materia ? tempoLeitura(props.materia.corpo) : ''))

const dataLonga = computed(() => {
  if (!props.materia) return ''
  const [ano, mes, dia] = props.materia.data.split('-').map(Number)
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', { dateStyle: 'long' })
})

const ficha = computed(() => {
  const m = props.materia
  if (!m) return []
  const formato = m.formato ? m.formato.charAt(0).toUpperCase() + m.formato.slice(1) : null
  const programacao = m.programacao?.map((p) => `${p.item} · ${p.data}${p.horario ? ', ' + p.horario : ''}`)
  return [
    { rotulo: programacao ? 'Último encontro' : 'Data', valor: dataLonga.value },
    { rotulo: 'Programação', lista: programacao },
    { rotulo: 'Horário', valor: programacao ? null : m.horario },
    { rotulo: 'Local', valor: [m.local, m.cidade].filter(Boolean).join(' · ') || null },
    { rotulo: 'Formato', valor: [formato, m.canal].filter(Boolean).join(' · ') || null },
    { rotulo: 'Convidados', valor: m.convidados?.length ? m.convidados.join(', ') : null },
    { rotulo: 'Host', valor: m.host },
  ].filter((linha) => linha.valor || linha.lista?.length)
})
</script>

<template>
  <Teleport to="body">
    <transition name="janela-fade">
      <div class="janela-fundo" v-if="modelValue" @click="fechar"></div>
    </transition>

    <transition name="palco">
      <div class="palco" v-if="modelValue && materia" role="dialog" aria-modal="true">
        <button class="card-fechar" @click="fechar" aria-label="Fechar">×</button>

        <div class="palco-foto">
          <transition name="foto-troca" mode="out-in">
            <picture v-if="fotoAtual" :key="fotoAtual.src">
              <source v-if="webp(fotoAtual.src)" type="image/webp" :srcset="webp(fotoAtual.src)" />
              <img :src="fotoAtual.src" :alt="fotoAtual.legenda" decoding="async" />
            </picture>
            <span v-else class="palco-cidade" aria-hidden="true"></span>
          </transition>
        </div>

        <div class="palco-gaveta">
          <div class="palco-info">
            <span class="card-tipo label-caps">
              {{ materia.tipo }}<template v-if="leitura"> · {{ leitura }} de leitura</template>
            </span>
            <h2 class="card-titulo">{{ materia.titulo }}</h2>
            <div class="card-etiquetas" v-if="materia.etiquetas?.length">
              <span class="etiqueta" v-for="e in materia.etiquetas" :key="e">{{ e }}</span>
            </div>

            <dl class="card-ficha">
              <div class="ficha-linha" v-for="linha in ficha" :key="linha.rotulo">
                <dt>{{ linha.rotulo }}</dt>
                <dd v-if="linha.lista">
                  <ul class="ficha-lista"><li v-for="item in linha.lista" :key="item">{{ item }}</li></ul>
                </dd>
                <dd v-else>{{ linha.valor }}</dd>
              </div>
            </dl>

            <div class="card-texto">
              <p v-for="(par, i) in materia.corpo" :key="i">{{ par }}</p>
            </div>

            <div class="card-miniaturas" v-if="fotos.length > 1">
              <button
                v-for="(foto, i) in fotos"
                :key="foto.src"
                class="miniatura"
                :class="{ ativa: i === indiceFoto }"
                :aria-label="foto.legenda"
                @click="indiceFoto = i"
              >
                <picture>
                  <source v-if="webp(foto.src)" type="image/webp" :srcset="webp(foto.src)" />
                  <img :src="foto.src" :alt="foto.legenda" loading="lazy" decoding="async" />
                </picture>
              </button>
            </div>

            <a v-if="materia.link" :href="materia.link" target="_blank" rel="noopener" class="btn-primario card-assistir">
              Assistir →
            </a>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.card-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 26, 0.6);
  z-index: 200;
}

/* A foto entra primeiro; o cartão é puxado de trás dela */
.palco {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 201;
  display: flex;
  align-items: flex-start;
  width: min(1000px, calc(100vw - 48px));
}

.palco-foto {
  position: relative;
  z-index: 2;
  flex: 0 0 clamp(260px, 40%, 430px);
  aspect-ratio: 4 / 5;
  background: var(--fundo-sutil);
  border-radius: 6px 0 0 6px;
  overflow: hidden;
  box-shadow: 18px 0 38px -14px rgba(0, 0, 0, 0.45);
  animation: foto-entra 0.5s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

.palco-foto picture,
.palco-foto img {
  display: block;
  width: 100%;
  height: 100%;
}

.palco-foto img {
  object-fit: cover;
  object-position: center top;
}

.palco-cidade {
  position: absolute;
  inset: 0;
  background-color: #b9bfb1;
  background-image: url('/img/textura-sage.svg');
  background-size: cover;
  background-position: center;
}

.foto-troca-enter-active,
.foto-troca-leave-active {
  transition: opacity 0.25s ease;
}

.foto-troca-enter-from,
.foto-troca-leave-to {
  opacity: 0;
}

.palco-gaveta {
  position: relative;
  z-index: 1;
  align-self: stretch;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  border-radius: 0 6px 6px 0;
}

.palco-info {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding: clamp(26px, 3.6vw, 40px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--branco);
  animation: info-desliza 0.75s 0.28s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

@keyframes foto-entra {
  from {
    opacity: 0;
    transform: scale(0.94) translateX(-12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes info-desliza {
  from {
    transform: translateX(-102%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes info-desce {
  from {
    transform: translateY(-102%);
  }
  to {
    transform: translateY(0);
  }
}

.palco-enter-active {
  transition: opacity 0.2s ease;
}

.palco-leave-active {
  transition: opacity 0.15s ease;
}

.palco-enter-from,
.palco-leave-to {
  opacity: 0;
}

.card-fechar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  font-family: var(--font-titulo);
  font-size: 22px;
  color: var(--verde);
  line-height: 1;
  transition: transform 0.35s cubic-bezier(0.22, 0.8, 0.2, 1), background 0.2s ease,
    border-color 0.2s ease;
}

.card-fechar:hover {
  transform: rotate(90deg);
  background: var(--fundo-sutil);
  border-color: var(--borda);
}

.card-tipo {
  padding-right: 40px;
}

.card-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(21px, 2.3vw, 27px);
  line-height: 1.3;
  color: var(--verde);
}

.card-etiquetas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
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
}

.card-ficha {
  display: flex;
  flex-direction: column;
  margin: 10px 0 4px;
  border-top: 1px solid var(--borda);
}

.ficha-linha {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--borda);
}

.ficha-linha dt {
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
  padding-top: 3px;
}

.ficha-linha dd {
  margin: 0;
  font-family: var(--font-corpo);
  font-size: 15px;
  line-height: 1.5;
  color: var(--texto-corpo);
}

.ficha-lista {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-texto {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px;
}

.card-texto p {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  line-height: 1.75;
  color: var(--texto-corpo);
}

.card-miniaturas {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.miniatura {
  flex: 0 0 64px;
  aspect-ratio: 4 / 5;
  padding: 0;
  border: 1px solid var(--borda);
  border-radius: var(--raio);
  overflow: hidden;
  background: var(--fundo-sutil);
  opacity: 0.6;
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 0.8, 0.2, 1), border-color 0.25s ease;
}

.miniatura picture,
.miniatura img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.miniatura:hover,
.miniatura.ativa {
  opacity: 1;
  border-color: var(--verde);
}

.miniatura:hover {
  transform: translateY(-3px);
}

.card-assistir {
  align-self: flex-start;
  margin-top: 14px;
}

.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.25s ease;
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
}

/* Mobile: foto no topo; o cartão desce de trás dela */
@media (max-width: 700px) {
  .palco {
    flex-direction: column;
    align-items: center;
    width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
  }

  .palco-foto {
    flex: 0 0 auto;
    width: min(200px, 50vw);
    border-radius: 6px 6px 0 0;
    box-shadow: 0 18px 30px -14px rgba(0, 0, 0, 0.45);
  }

  .palco-gaveta {
    align-self: stretch;
    position: relative;
    flex: 0 1 auto;
    min-height: 0;
    border-radius: 0 0 6px 6px;
  }

  .palco-info {
    position: relative;
    inset: auto;
    max-height: calc(100vh - 32px - min(250px, 62.5vw));
    animation-name: info-desce;
  }

  .ficha-linha {
    grid-template-columns: 92px minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .palco-foto,
  .palco-info {
    animation: none;
  }
}
</style>
