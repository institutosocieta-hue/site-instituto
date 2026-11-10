// O conteúdo mora em src/content/eventos.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Encontros Horizontais do semestre (lista permanente durante o semestre, mais antigos
// primeiro) e séries do YouTube (cada série mostra sempre o último episódio publicado).
import dados from '../content/eventos.json'
import { limpar, porData } from '../utils/conteudo.js'

const d = limpar(dados)

export const semestreEncontros = {
  semestre: d.semestreEncontros.semestre,
  encontros: porData(d.semestreEncontros.encontros || [], 'data', true),
}

export const linkCanal = d.linkCanal

export const seriesYoutube = (d.seriesYoutube || []).map((s) => ({
  ...s,
  ultimoEpisodio: s.ultimoEpisodio?.titulo ? s.ultimoEpisodio : null,
}))
