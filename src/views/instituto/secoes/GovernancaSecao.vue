<script setup>
import { webp } from '../../../utils/imagem.js'
import { computed, ref } from 'vue'
import CardPessoa from '../../../components/CardPessoa.vue'
import IconeContato from '../../../components/IconeContato.vue'
import DiretorioMembros from '../../../components/DiretorioMembros.vue'
import PessoaCartao from '../../../components/PessoaCartao.vue'
import { diretoria, pessoas } from '../../../data/governanca.js'
import { nucleosEmAndamento } from '../../../data/nucleosEmAndamento.js'
import { efetivos, transitorios } from '../../../data/membros.js'

const props = defineProps({
  semCabecalho: { type: Boolean, default: false },
})

const coordenadores = computed(() =>
  nucleosEmAndamento.nucleos
    .flatMap((nucleo) =>
      (nucleo.coordenadores || []).map((nome) => ({
        nome,
        nucleo: nucleo.nome,
        ...pessoas[nome],
      }))
    )
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
)

// Quadro de membros (diretório): todos os efetivos abrem o card; quem ainda não tem
// informações no registro (data/governanca.js) mostra os espaços prontos.
const cargosDiretoria = new Map(diretoria.map((d) => [d.nome, d.cargo]))
const nucleosCoordenados = computed(() => new Map(coordenadores.value.map((c) => [c.nome, c.nucleo])))

const membrosEfetivos = computed(() =>
  efetivos.map((m) => {
    const cargo = cargosDiretoria.get(m.nome)
    const nucleo = nucleosCoordenados.value.get(m.nome)
    return {
      ...m,
      associacao: [`Membro desde ${m.ingresso}.`],
      ...pessoas[m.nome],
      nucleo: m.nucleo || nucleo || null,
      funcao: cargo ? 'Diretoria' : nucleo ? 'Coordenação' : 'Membro',
      cargo: cargo || (nucleo ? `Coordenação · ${nucleo}` : null),
    }
  })
)


const cardAberto = ref(false)
const pessoaSelecionada = ref(null)
const listaAtual = ref([])
const indiceAtual = ref(0)

const temAnterior = computed(() => listaAtual.value.length > 1)
const temProxima = computed(() => listaAtual.value.length > 1)

function abrirCard(pessoa, lista) {
  pessoaSelecionada.value = pessoa
  listaAtual.value = lista
  indiceAtual.value = lista.findIndex((p) => p.nome === pessoa.nome)
  cardAberto.value = true
}

function navegarPessoa(delta) {
  const lista = listaAtual.value
  if (!lista.length) return
  indiceAtual.value = (indiceAtual.value + delta + lista.length) % lista.length
  pessoaSelecionada.value = lista[indiceAtual.value]
}
</script>

<template>
  <section id="governanca" class="secao-instituto">
    <header class="secao-cabecalho" v-if="!props.semCabecalho">
      <span class="label-caps secao-rotulo">Governança</span>
      <h2 class="secao-titulo">Quem estrutura o Instituto Società.</h2>
      <p class="secao-sub">A Diretoria conduz as decisões institucionais. Os coordenadores respondem por cada núcleo de estudo ao longo do semestre.</p>
    </header>

    <div class="blocos">
      <!-- Diretoria -->
      <section class="bloco" id="diretoria">
        <header class="bloco-cabecalho">
          <h3 class="bloco-titulo">Diretoria</h3>
        </header>

        <div class="diretoria-grade grade-stagger" v-if="diretoria.length">
          <div
            class="diretoria-item"
            v-for="membro in diretoria"
            :key="membro.nome"
            v-reveal
          >
            <PessoaCartao
              :pessoa="membro"
              :legenda="membro.cargo"
              @abrir="abrirCard(membro, diretoria)"
            />
          </div>
        </div>
        <p v-else class="em-breve">Composição da Diretoria em atualização.</p>
      </section>

      <!-- Coordenação, por núcleo -->
      <section class="bloco" id="coordenadores">
        <header class="bloco-cabecalho">
          <h3 class="bloco-titulo">
            Diretoria Acadêmica
            <span class="bloco-quadrado"></span>
            Coordenadores
            <span class="bloco-quadrado"></span>
            {{ nucleosEmAndamento.semestre }}
          </h3>
        </header>

        <div class="coordenadores-grade grade-stagger" v-if="coordenadores.length">
          <div class="coordenador" v-for="c in coordenadores" :key="c.nome + c.nucleo" v-reveal>
            <PessoaCartao :pessoa="c" :legenda="c.nucleo" @abrir="abrirCard(c, coordenadores)" />
          </div>
        </div>
        <p v-else class="em-breve">Nenhum núcleo em produção neste momento.</p>
      </section>

      <!-- III · Quadro de Membros -->
      <section class="bloco bloco--faixa" id="quadro-membros">
        <header class="bloco-cabecalho">
          <h3 class="bloco-titulo">
            Quadro de Membros
            <span class="bloco-quadrado"></span>
            Encontre um membro
          </h3>
        </header>

        <DiretorioMembros :efetivos="membrosEfetivos" :transitorios="transitorios" @abrir="abrirCard" />
      </section>
    </div>

    <CardPessoa
      v-model="cardAberto"
      :pessoa="pessoaSelecionada"
      :tem-anterior="temAnterior"
      :tem-proxima="temProxima"
      @anterior="navegarPessoa(-1)"
      @proxima="navegarPessoa(1)"
    />
  </section>
</template>

<style scoped>
.blocos {
  display: flex;
  flex-direction: column;
}

.em-breve {
  font-family: var(--font-corpo);
  font-size: 15.5px;
  color: var(--texto-sec);
  font-style: italic;
}

/* Diretoria: Presidente e Vice em destaque, demais em linha */
.diretoria-grade {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(28px, 3vw, 44px) clamp(16px, 2vw, 28px);
}

/* Coordenação: grade única, com o núcleo sob o nome */
.coordenadores-grade {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(28px, 3vw, 44px) clamp(16px, 2vw, 28px);
}

@media (max-width: 1024px) {
  .coordenadores-grade,
  .diretoria-grade {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .diretoria-grade {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .coordenadores-grade {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

</style>
