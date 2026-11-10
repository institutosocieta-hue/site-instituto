<script setup>
import { computed } from 'vue'
import HeroVerde from '../../components/HeroVerde.vue'
import SubNavRevista from '../../components/SubNavRevista.vue'
import AvisoTicker from '../../components/AvisoTicker.vue'
import CapaEdicao from '../../components/CapaEdicao.vue'
import { edicoes } from '../../data/edicoes.js'
import { avisos } from '../../data/avisos.js'
import { nucleosEmAndamento } from '../../data/nucleosEmAndamento.js'
import { nucleosPublicando } from '../../data/nucleosPublicando.js'

const edicaoAtual = computed(() => [...edicoes].sort((a, b) => b.numero - a.numero)[0])

const cicloEmPublicacao = computed(() => {
  if (!edicaoAtual.value) return null
  return nucleosPublicando.find((g) => g.semestre === edicaoAtual.value.semestre) ?? null
})
</script>

<template>
  <div class="vista">
    <HeroVerde
      label="Revista do Instituto Società"
      titulo="O pensamento coletivo do Direito Empresarial."
      sub="Publicada semestralmente, a QuotaParte reúne os resumos expandidos produzidos pelos núcleos de estudo do Instituto Società: um registro de cada ciclo de pesquisa, da discussão à publicação."
    >
      <AvisoTicker :mensagens="avisos" />
    </HeroVerde>

    <div class="pagina pagina--sobrepoe" v-if="edicaoAtual">
      <SubNavRevista />

      <section>
      <span class="label-caps secao-rotulo">Última Edição</span>

      <div class="edicao-grid" v-reveal>
        <router-link :to="`/revista/edicoes/${edicaoAtual.numero}`" class="edicao-capa">
          <CapaEdicao :capa="edicaoAtual.capa" :alt="`Capa da edição ${edicaoAtual.numero}`" />
        </router-link>

        <div class="edicao-corpo">
          <span class="edicao-tag">
            NÚCLEO DE {{ edicaoAtual.nucleo.toUpperCase() }} · {{ edicaoAtual.semestre }} ·
            EDIÇÃO {{ edicaoAtual.numero }}
          </span>

          <h2 class="edicao-chamada">{{ edicaoAtual.chamada }}</h2>

          <p class="edicao-conexao" v-if="edicaoAtual.textoConexao">
            {{ edicaoAtual.textoConexao }}
          </p>

          <router-link :to="`/revista/edicoes/${edicaoAtual.numero}`" class="btn-primario">
            Ver edição →
          </router-link>
        </div>
      </div>
      </section>

      <div class="nucleos-blocos" v-reveal>
        <div class="nucleos-bloco" v-if="cicloEmPublicacao?.nucleos.length">
          <span class="label-caps secao-rotulo nucleos-bloco-titulo">
            Em publicação · {{ cicloEmPublicacao.semestre }}
          </span>
          <ul class="lista-nucleos-status">
            <component
              :is="nucleo.edicaoNumero ? 'router-link' : 'li'"
              v-for="nucleo in cicloEmPublicacao.nucleos"
              :key="nucleo.nome"
              :to="nucleo.edicaoNumero ? `/revista/edicoes/${nucleo.edicaoNumero}` : undefined"
              class="linha-nucleo"
              :class="{ 'nucleo-pendente': !nucleo.edicaoNumero, 'linha-clicavel': nucleo.edicaoNumero }"
            >
              <div class="nucleo-producao-texto">
                <span class="nucleo-status-nome">{{ nucleo.nome }}</span>
                <span class="nucleo-producao-linha">{{ nucleo.linhaPesquisa }}</span>
              </div>
              <span class="nucleo-status-pill" :class="{ ativo: nucleo.edicaoNumero }">
                {{ nucleo.edicaoNumero ? 'Publicada' : 'Em publicação' }}
              </span>
              <span class="linha-seta" v-if="nucleo.edicaoNumero">→</span>
            </component>
          </ul>
        </div>

        <div class="nucleos-bloco" v-if="nucleosEmAndamento.nucleos.length">
          <span class="label-caps secao-rotulo nucleos-bloco-titulo">
            Em produção · {{ nucleosEmAndamento.semestre }}
          </span>
          <ul class="lista-nucleos-producao">
            <li class="linha-nucleo" v-for="nucleo in nucleosEmAndamento.nucleos" :key="nucleo.nome">
              <div class="nucleo-producao-texto">
                <span class="nucleo-producao-nome">{{ nucleo.nome }}</span>
                <span class="nucleo-producao-linha">{{ nucleo.linhaPesquisa }}</span>
              </div>
              <span class="nucleo-status-pill">Em produção</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="pagina pagina--sobrepoe" v-else>
      <SubNavRevista />
      <p class="label-caps">Nenhuma edição publicada ainda.</p>
    </div>

    <section class="cta-banda">
      <div class="cta-conteudo">
        <p class="cta-texto">Explore o arquivo completo de edições da QuotaParte.</p>
        <router-link to="/revista/edicoes" class="btn-secundario btn-secundario--claro">
          Ver todas as edições →
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>

.edicao-grid {
  display: grid;
  grid-template-columns: minmax(180px, 260px) 1fr;
  gap: clamp(24px, 4vw, 48px);
  align-items: start;
}

.edicao-capa {
  display: block;
  perspective: 1400px;
}

.edicao-capa :deep(.capa) {
  transform: rotateY(22deg) rotateX(3deg);
  transform-style: preserve-3d;
  box-shadow: 20px 16px 36px -18px rgba(50, 75, 48, 0.4);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.edicao-capa:hover :deep(.capa) {
  transform: rotateY(10deg) rotateX(1deg) translateY(-4px);
  box-shadow: 26px 22px 46px -18px rgba(50, 75, 48, 0.45);
}

.edicao-tag {
  display: inline-block;
  font-family: var(--font-corpo);
  font-size: 12px;
  color: var(--sage-texto);
  border: 1px solid var(--borda);
  padding: 6px 12px;
  border-radius: var(--raio);
  margin-bottom: 24px;
  letter-spacing: 0.1em;
  font-weight: 600;

}

.edicao-chamada {
  font-family: var(--font-titulo);
  font-size: clamp(22px, 2.4vw, 30px);
  color: var(--verde);
  line-height: 1.35;
  margin-bottom: 20px;
  font-weight: 600;

}

.edicao-conexao {
  font-family: var(--font-corpo);
  font-style: italic;
  font-size: 17px;
  color: var(--texto-corpo);
  max-width: 620px;
  line-height: 1.8;
  margin-bottom: 32px;
}

.nucleos-blocos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: clamp(40px, 6vw, 80px);
}

.nucleos-bloco-titulo {
  margin-bottom: 24px;
}

.linha-nucleo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 12px;
  margin: 0 -12px;
  border-radius: var(--raio);
  border-bottom: 1px solid var(--borda);
  transition: background 0.2s ease, transform 0.2s ease;
}

.lista-nucleos-status li:first-child,
.lista-nucleos-status a.linha-nucleo:first-child,
.lista-nucleos-producao li:first-child {
  border-top: none;
}

.linha-clicavel {
  cursor: pointer;
}

.linha-clicavel:hover {
  background: rgba(50, 75, 48, 0.06);
  transform: translateX(2px);
}

.nucleo-status-nome {
  font-family: var(--font-corpo);
  font-size: 17px;
  color: var(--verde);
  font-weight: 600;

}

.linha-seta {
  flex-shrink: 0;
  font-family: var(--font-corpo);
  font-size: 18px;
  color: var(--verde);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.linha-clicavel:hover .linha-seta {
  opacity: 1;
  transform: translateX(0);
}

.nucleo-pendente {
  opacity: 0.5;
}

.nucleo-producao-texto {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nucleo-producao-nome {
  font-family: var(--font-corpo);
  font-size: 17px;
  color: var(--verde);
  font-weight: 600;

}

.nucleo-producao-linha {
  font-family: var(--font-corpo);
  font-size: 15px;
  color: var(--texto-sec);
  line-height: 1.55;

}

.nucleo-status-pill {
  flex-shrink: 0;
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sage-texto);
  opacity: 1;
  border: 1px solid var(--borda);
  border-radius: 999px;
  padding: 6px 12px;
  white-space: nowrap;
  transition: opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  font-weight: 600;

}

.nucleo-status-pill.ativo {
  color: var(--verde);
  opacity: 1;
  border-color: var(--verde);
}

.cta-banda {
  position: relative;
  z-index: 2;
  background-color: var(--hero-fundo, #324b30);
  background-image: linear-gradient(rgba(var(--hero-veu, 50, 75, 48), 0.82), rgba(var(--hero-veu, 50, 75, 48), 0.82)),
    url('/img/textura-verde.svg');
  background-size: cover;
  background-position: center;
  padding: clamp(72px, 10vw, 120px) var(--padding-h);
}

.cta-conteudo {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.cta-texto {
  font-family: var(--font-titulo);
  font-size: clamp(22px, 2.6vw, 30px);
  color: #fff;
  font-weight: 600;
  line-height: 1.3;

}

@media (max-width: 768px) {
  .edicao-grid {
    grid-template-columns: 1fr;
  }

  .edicao-capa {
    max-width: 200px;
  }

  .nucleos-blocos {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .cta-banda {
    padding: 40px var(--padding-h-m);
  }
}
</style>
