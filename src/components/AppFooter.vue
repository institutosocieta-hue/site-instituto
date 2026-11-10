<script setup>
import { contato } from '../data/contato.js'
import IconeContato from './IconeContato.vue'

const ano = new Date().getFullYear()

function abrirNewsletter() {
  window.dispatchEvent(new CustomEvent('abrir-newsletter'))
}
</script>

<template>
  <footer class="footer" v-reveal>
    <div class="footer-limite">
      <div class="footer-newsletter">
        <div class="footer-newsletter-texto">
          <span class="footer-newsletter-rotulo">Newsletter</span>
          <p class="footer-newsletter-titulo">Acompanhe o Instituto também pelo seu e-mail.</p>
        </div>
        <button class="btn-claro footer-newsletter-botao" @click="abrirNewsletter">Cadastrar e-mail →</button>
      </div>

      <div class="footer-topo">
        <div class="footer-bloco-marca">
          <div class="footer-marca">
            <span class="footer-titulo">Instituto Società</span>
            <span class="footer-quadrado"></span>
            <span class="footer-quotaparte">QuotaParte</span>
          </div>
          <p class="footer-tagline">
            Uma comunidade acadêmica independente dedicada ao estudo do Direito
            Empresarial.
          </p>
          <div class="footer-contato">
            <a
              v-if="contato.email"
              :href="`mailto:${contato.email}`"
              class="footer-icone"
              title="E-mail"
            >
              <IconeContato tipo="email" :size="18" />
            </a>
            <a
              v-if="contato.instagram"
              :href="contato.instagram"
              target="_blank"
              rel="noopener"
              class="footer-icone"
              title="Instagram"
            >
              <IconeContato tipo="instagram" :size="18" />
            </a>
            <a
              v-if="contato.youtube"
              :href="`https://youtube.com/${contato.youtube}`"
              target="_blank"
              rel="noopener"
              class="footer-icone"
              title="YouTube"
            >
              <IconeContato tipo="youtube" :size="18" />
            </a>
            <a
              v-if="contato.linkedin"
              :href="contato.linkedin"
              target="_blank"
              rel="noopener"
              class="footer-icone"
              title="LinkedIn"
            >
              <IconeContato tipo="linkedin" :size="18" />
            </a>
          </div>
        </div>

        <nav class="footer-coluna">
          <span class="footer-coluna-titulo">Instituto</span>
          <router-link to="/comunidade" class="footer-link">Comunidade</router-link>
          <router-link to="/atividades" class="footer-link">Atividades</router-link>
          <router-link to="/membros#seja-membro" class="footer-link">Seja Membro</router-link>
          <router-link to="/distincoes" class="footer-link">Distinções</router-link>
          <router-link to="/membros" class="footer-link">Pessoas</router-link>
        </nav>

        <nav class="footer-coluna">
          <span class="footer-coluna-titulo">QuotaParte</span>
          <router-link to="/revista" class="footer-link">Início</router-link>
          <router-link to="/revista/edicoes" class="footer-link">Edições</router-link>
          <router-link to="/revista/nucleos" class="footer-link">Núcleos</router-link>
          <router-link to="/revista/sobre" class="footer-link">Sobre</router-link>
        </nav>

        <nav class="footer-coluna">
          <span class="footer-coluna-titulo">Contato</span>
          <router-link to="/apoio" class="footer-link">Seja um Apoiador</router-link>
          <a v-if="contato.email" :href="`mailto:${contato.email}`" class="footer-link">
            {{ contato.email }}
          </a>
        </nav>
      </div>

      <div class="footer-base">
        <span class="footer-copyright">© {{ ano }} Instituto Società · Comunidade acadêmica independente</span>
        <router-link to="/privacidade" class="footer-legal">Política de Privacidade</router-link>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Rodapé: verde profundo, filetes finos, colunas amplas e silenciosas */
.footer {
  position: relative;
  z-index: 2;
  background: #1b2c1a;
  color: #eef1ea;
  --borda: rgba(255, 255, 255, 0.14);
  --verde: #ffffff;
  --sage: #8fa38b;
  --sage-texto: #a9b8a4;
  --texto-sec: #cfd8cb;
  padding: 0 var(--padding-h) 28px;
}

.footer-limite {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-newsletter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  padding: clamp(64px, 8vw, 104px) 0;
  text-align: center;
  border-bottom: 1px solid var(--borda);
}

.footer-newsletter-texto {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.footer-newsletter-rotulo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--ouro-claro);
}

.footer-newsletter-titulo {
  max-width: 620px;
  font-family: var(--font-titulo);
  font-weight: 400;
  font-size: clamp(22px, 2.6vw, 34px);
  line-height: 1.35;
  letter-spacing: 0.04em;
  color: #fff;
}

.footer-topo {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.3fr;
  gap: 40px clamp(32px, 5vw, 72px);
  padding: clamp(48px, 6vw, 80px) 0;
}

.footer-bloco-marca {
  min-width: 0;
  max-width: 400px;
}

.footer-marca {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.footer-titulo {
  font-family: var(--font-titulo);
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
}

.footer-quadrado {
  width: 5px;
  height: 5px;
  background: var(--ouro-claro);
  flex-shrink: 0;
}

.footer-quotaparte {
  font-family: var(--font-titulo);
  font-size: 16px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-texto);
}

.footer-tagline {
  font-family: var(--font-corpo);
  font-size: 15px;
  font-weight: 300;
  line-height: 1.85;
  color: var(--texto-sec);
  margin-bottom: 26px;
}

.footer-contato {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-icone {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.28);
  transition: background 0.5s var(--ease-lento), color 0.5s var(--ease-lento), border-color 0.5s var(--ease-lento);
}

.footer-icone:hover {
  background: #fff;
  color: #1b2c1a;
  border-color: #fff;
}

.footer-coluna {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-coluna-titulo {
  margin-bottom: 8px;
  font-family: var(--font-corpo);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--ouro-claro);
}

.footer-link {
  width: fit-content;
  font-family: var(--font-corpo);
  font-size: 15px;
  font-weight: 300;
  color: #fff;
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0 1px;
  padding-bottom: 2px;
  transition: background-size 0.6s var(--ease-lento);
}

.footer-link:hover {
  background-size: 100% 1px;
}

.footer-base {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  padding-top: 26px;
  border-top: 1px solid var(--borda);
}

.footer-copyright {
  font-family: var(--font-corpo);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--sage-texto);
}

.footer-legal {
  font-family: var(--font-corpo);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--sage-texto);
  transition: color 0.4s ease;
}

.footer-legal:hover {
  color: #fff;
}

@media (max-width: 900px) {
  .footer-topo {
    grid-template-columns: 1fr 1fr;
  }

  .footer-bloco-marca {
    grid-column: 1 / -1;
    max-width: none;
  }
}

@media (max-width: 540px) {
  .footer-topo {
    grid-template-columns: 1fr;
  }
}
</style>
