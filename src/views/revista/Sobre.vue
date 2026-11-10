<script setup>
import { webp } from '../../utils/imagem.js'
import { computed } from 'vue'
import HeroVerde from '../../components/HeroVerde.vue'
import SubNavRevista from '../../components/SubNavRevista.vue'
import { edicoes } from '../../data/edicoes.js'

const nucleosExplorados = computed(() => new Set(edicoes.map((e) => e.nucleo)).size)

const primeiraEdicao = computed(() => {
  if (!edicoes.length) return '—'
  return Math.min(...edicoes.map((e) => Number(e.semestre.split('/')[0])))
})
</script>

<template>
  <div class="vista">
    <HeroVerde
      label="Sobre a QuotaParte"
      titulo="Uma revista que nasce da inquietação de quem pesquisa."
    />

    <div class="pagina pagina--sobrepoe">
      <SubNavRevista />

      <div class="estatisticas">
        <div class="estatistica">
          <span class="estatistica-numero">{{ String(edicoes.length).padStart(2, '0') }}</span>
          <span class="label-caps">Edições publicadas</span>
        </div>
        <div class="estatistica">
          <span class="estatistica-numero">{{ String(nucleosExplorados).padStart(2, '0') }}</span>
          <span class="label-caps">Núcleos já explorados</span>
        </div>
        <div class="estatistica">
          <span class="estatistica-numero">{{ primeiraEdicao }}</span>
          <span class="label-caps">Primeira edição</span>
        </div>
      </div>

      <div class="grid-sobre" v-reveal>
        <section class="bloco-texto">
          <h2 class="bloco-titulo">A proposta editorial</h2>
          <p>
            A QuotaParte é a revista acadêmica do Instituto Società. Publicada
            semestralmente, cada edição é dedicada a um núcleo de estudo e reúne
            os resumos expandidos produzidos por seus membros ao longo do
            semestre.
          </p>
          <p>
            Mais do que um periódico tradicional, a QuotaParte é um registro do
            pensamento coletivo do Instituto, um documento de cada ciclo de
            pesquisa, produzido de dentro para fora.
          </p>
        </section>

        <section class="bloco-texto">
          <h2 class="bloco-titulo">Como funcionam os núcleos</h2>
          <p>
            Os núcleos de estudo são a principal, mas não a única, dinâmica do
            Instituto Società. Diferentemente de uma estrutura fixa, eles são
            itinerantes: a cada semestre, novos temas são propostos e novos
            grupos se formam em torno deles.
          </p>
          <p>
            Cada núcleo começa com um Encontro Vertical inaugural, no qual um
            convidado externo apresenta um panorama geral da linha de estudo
            proposta. Ao final do semestre, os membros entregam um resumo
            expandido, que dá origem a uma edição da QuotaParte.
          </p>
        </section>
      </div>

      <div class="grafico-imagem grafico-imagem-viva" v-reveal>
        <picture>
          <source v-if="webp('/dinamicas/quotaparte.png')" type="image/webp" :srcset="webp('/dinamicas/quotaparte.png')" />
          <img src="/dinamicas/quotaparte.png" alt="A Revista QuotaParte" loading="lazy" decoding="async" />
        </picture>
      </div>

      <div class="grid-sobre" v-reveal>
        <section class="bloco-texto">
          <h2 class="bloco-titulo">Por que "QuotaParte"?</h2>
          <p>
            O nome remete a um conceito central do Direito Empresarial: a quota,
            a parte que cabe a cada sócio na composição de uma sociedade. Da
            mesma forma, cada resumo expandido publicado pela revista é a
            quota-parte de um membro: a materialização do empenho que dedica à
            estrutura do Instituto Società.
          </p>
        </section>

        <section class="bloco-texto">
          <h2 class="bloco-titulo">Como tudo começou</h2>
          <p>
            Antes da revista, o Instituto Società era um grupo de estudos:
            jovens em fase final de graduação e recém-formados que se reuniam
            para estudar, discutir e apresentar temas de seu interesse dentro do
            Direito Empresarial.
          </p>
          <p>
            Diante da repercussão dessas atividades, sentimos a necessidade de
            compartilhar com a comunidade comercialista fragmentos daquilo que é
            discutido entre os membros. Assim nasceu a QuotaParte.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.estatisticas {
  display: flex;
  gap: 40px;
  max-width: 480px;
}

.estatistica {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.estatistica-numero {
  font-family: var(--font-titulo);
  font-size: 30px;
  color: var(--verde);
}

.grid-sobre {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: clamp(40px, 6vw, 80px);
}

.bloco-titulo {
  font-family: var(--font-titulo);
  font-size: clamp(24px, 2.4vw, 30px);
  color: var(--verde);
  margin-bottom: 20px;
  font-weight: 600;
  padding-top: 24px;
  border-top: 1px solid var(--verde);

}

.bloco-texto p {
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.8;
  color: var(--texto-corpo);
  margin-bottom: 16px;
}

.grafico-imagem {
  aspect-ratio: 16 / 9;
  border-radius: var(--raio);
  overflow: hidden;
}

.grafico-imagem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.grafico-imagem-viva img {
  animation: deriva-grafico 8s ease-in-out infinite alternate;
}

.grafico-imagem-viva:hover img {
  transform: scale(1.06);
  animation-play-state: paused;
}

@keyframes deriva-grafico {
  from {
    transform: scale(1.06) translateX(-1.5%);
  }
  to {
    transform: scale(1.06) translateX(1.5%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .grafico-imagem-viva img {
    animation: none;
  }
}

@media (max-width: 768px) {
  .estatisticas {
    gap: 24px;
  }

  .grid-sobre {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
