// O conteúdo mora em src/content/parceiros.json e é editado pelo painel (/admin).
// Este arquivo só o lê e entrega ao site no formato que as páginas esperam.
//
// Escritórios e instituições que já receberam o Instituto (apenas nomes, até haver logos).
import dados from '../content/parceiros.json'

export const parceiros = dados.itens.filter(Boolean)
