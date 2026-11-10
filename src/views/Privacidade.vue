<script setup>
import HeroVerde from '../components/HeroVerde.vue'
import { contato } from '../data/contato.js'

// TODO: conteúdo do Instituto — texto-base; revisar com assessoria jurídica antes de publicar.
const secoes = [
  {
    titulo: 'Quem somos',
    paragrafos: [
      'O Instituto Società é uma comunidade acadêmica independente dedicada ao estudo do Direito Empresarial. Esta política explica como tratamos os dados pessoais de quem visita este site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
    ],
  },
  {
    titulo: 'Quais dados tratamos',
    lista: [
      'Dados que você informa voluntariamente: por exemplo, o e-mail para receber nossos conteúdos e as informações preenchidas nos formulários de inscrição para membro e de parceria institucional.',
      'Dados armazenados no seu navegador: preferências estritamente necessárias ao funcionamento do site, como o registro de que você já viu o aviso de newsletter ou este aviso de privacidade.',
      'O site não utiliza cookies de publicidade nem ferramentas de rastreamento de comportamento.',
    ],
  },
  {
    titulo: 'Para que usamos',
    lista: [
      'Enviar conteúdos e novidades do Instituto, quando você pedir.',
      'Processar inscrições de membros e contatos de possíveis apoiadores.',
      'Manter o funcionamento e a segurança do site.',
    ],
  },
  {
    titulo: 'Com quem compartilhamos',
    paragrafos: [
      'Os formulários de inscrição e de parceria são hospedados em plataformas de terceiros (Google Formulários), que tratam os dados conforme suas próprias políticas. Os vídeos e perfis do Instituto em YouTube, Instagram e LinkedIn também pertencem a plataformas externas. Não vendemos dados pessoais.',
    ],
  },
  {
    titulo: 'Seus direitos',
    paragrafos: [
      'Você pode solicitar a confirmação do tratamento, o acesso, a correção ou a eliminação dos seus dados, a revogação de consentimento e informações sobre compartilhamento, nos termos do art. 18 da LGPD.',
    ],
  },
  {
    titulo: 'Por quanto tempo guardamos',
    paragrafos: [
      'Mantemos os dados pelo tempo necessário para cumprir a finalidade para a qual foram informados. Quem se descadastra da newsletter tem o e-mail removido da lista de envio.',
    ],
  },
]
</script>

<template>
  <div class="vista">
    <HeroVerde label="Privacidade" titulo="Política de Privacidade." />

    <div class="pagina pagina--sobrepoe">
      <article class="politica">
        <section class="politica-secao" v-for="secao in secoes" :key="secao.titulo" v-reveal>
          <h2 class="politica-titulo">{{ secao.titulo }}</h2>
          <p v-for="paragrafo in secao.paragrafos" :key="paragrafo">{{ paragrafo }}</p>
          <ul v-if="secao.lista">
            <li v-for="item in secao.lista" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section class="politica-secao" v-reveal>
          <h2 class="politica-titulo">Fale conosco</h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas sobre esta política, escreva para
            <a v-if="contato.email" :href="`mailto:${contato.email}`" class="politica-link">{{ contato.email }}</a>.
          </p>
        </section>
      </article>
    </div>
  </div>
</template>

<style scoped>
.politica {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: clamp(36px, 4vw, 52px);
}

.politica-secao {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--borda);
}

.politica-titulo {
  font-family: var(--font-titulo);
  font-weight: 600;
  font-size: clamp(20px, 2vw, 24px);
  color: var(--verde);
}

.politica-secao p,
.politica-secao li {
  font-family: var(--font-corpo);
  font-size: 17px;
  line-height: 1.8;
  color: var(--texto-corpo);
}

.politica-secao ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.politica-secao li {
  position: relative;
  padding-left: 20px;
}

.politica-secao li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  width: 6px;
  height: 6px;
  background: var(--verde);
}

.politica-link {
  font-weight: 600;
  color: var(--verde);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
