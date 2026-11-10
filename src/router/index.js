import { createRouter, createWebHistory } from 'vue-router'
import { edicoes } from '../data/edicoes.js'
import { aplicarSeo } from '../utils/seo.js'

const routes = [
  {
    path: '/',
    name: 'instituto-inicio',
    component: () => import('../views/instituto/Inicio.vue'),
    meta: { title: 'Instituto Società' },
  },
  {
    path: '/comunidade',
    name: 'comunidade',
    component: () => import('../views/instituto/Comunidade.vue'),
    meta: { title: 'Comunidade · Instituto Società' },
  },
  {
    path: '/membros',
    name: 'membros',
    component: () => import('../views/instituto/Membros.vue'),
    meta: { title: 'Pessoas · Instituto Società' },
  },
  {
    path: '/distincoes',
    name: 'distincoes',
    component: () => import('../views/instituto/Distincoes.vue'),
    meta: { title: 'Distinções · Instituto Società' },
  },
  {
    path: '/atividades',
    name: 'atividades',
    component: () => import('../views/instituto/Atividades.vue'),
    meta: { title: 'Atividades · Instituto Società' },
  },
  { path: '/atividades/:slug', redirect: '/atividades' },
  {
    path: '/privacidade',
    name: 'privacidade',
    component: () => import('../views/Privacidade.vue'),
    meta: { title: 'Política de Privacidade · Instituto Società' },
  },
  {
    path: '/apoio',
    name: 'apoio',
    component: () => import('../views/instituto/Apoio.vue'),
    meta: { title: 'Seja um Apoiador · Instituto Società' },
  },
  {
    path: '/revista',
    name: 'revista-inicio',
    component: () => import('../views/revista/RevistaInicio.vue'),
    meta: { title: 'QuotaParte · Instituto Società' },
  },
  {
    path: '/revista/edicoes',
    name: 'revista-edicoes',
    component: () => import('../views/revista/Edicoes.vue'),
    meta: { title: 'Edições · QuotaParte · Instituto Società' },
  },
  {
    path: '/revista/edicoes/:numero',
    name: 'revista-edicao-detalhe',
    component: () => import('../views/revista/EdicaoDetalhe.vue'),
    meta: {
      title: (route) => {
        const ed = edicoes.find((e) => String(e.numero) === route.params.numero)
        return ed
          ? `Edição ${String(ed.numero).padStart(2, '0')} · QuotaParte · Instituto Società`
          : 'Edição · QuotaParte · Instituto Società'
      },
    },
  },
  {
    path: '/revista/trabalhos/:slug',
    name: 'revista-trabalho',
    component: () => import('../views/revista/TrabalhoDetalhe.vue'),
    meta: {
      title: (route) => {
        for (const ed of edicoes) {
          const t = (ed.trabalhos || []).find((x) => x.slug === route.params.slug)
          if (t) return `${t.titulo} · QuotaParte · Instituto Società`
        }
        return 'Trabalho · QuotaParte · Instituto Società'
      },
    },
  },
  {
    path: '/revista/nucleos',
    name: 'revista-nucleos',
    component: () => import('../views/revista/Nucleos.vue'),
    meta: { title: 'Núcleos · QuotaParte · Instituto Società' },
  },
  {
    path: '/revista/sobre',
    name: 'revista-sobre',
    component: () => import('../views/revista/Sobre.vue'),
    meta: { title: 'Sobre · QuotaParte · Instituto Società' },
  },

  // Redirects das rotas antigas
  { path: '/instituto', redirect: '/comunidade' },
  { path: '/governanca', redirect: '/membros' },
  { path: '/seja-membro', redirect: { path: '/membros', hash: '#seja-membro' } },
  { path: '/revista/apoio', redirect: '/apoio' },

  {
    path: '/:caminho(.*)*',
    name: 'nao-encontrado',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Página não encontrada · Instituto Società', semIndice: true },
  },
]

function alturaNav() {
  const valor = getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  return parseInt(valor, 10) || 72
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, salvo) {
    if (salvo) return salvo
    // mudanças só de filtro (?query) na mesma página não movem a rolagem
    if (to.path === from.path && to.hash === from.hash) return false
    if (to.hash) {
      // Aguarda o elemento existir (rotas carregadas sob demanda)
      return new Promise((resolve) => {
        let tentativas = 0
        const procurar = () => {
          if (document.querySelector(to.hash) || tentativas++ > 40) {
            resolve({
              el: to.hash,
              top: alturaNav() + 16,
              behavior: from.name ? 'smooth' : 'auto',
            })
          } else {
            setTimeout(procurar, 50)
          }
        }
        procurar()
      })
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const titulo = to.meta.title
  const texto = typeof titulo === 'function' ? titulo(to) : titulo || 'Instituto Società'
  document.title = texto
  aplicarSeo(to, texto)
})

export default router
