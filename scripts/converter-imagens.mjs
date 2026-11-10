// Converte PNG/JPG de /public para WebP (mantém os originais como fallback).
// Uso: npm run imagens
import { readdir, stat, writeFile } from 'node:fs/promises'
import { join, extname, basename, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const RAIZ = fileURLToPath(new URL('../public/', import.meta.url))
const EXTENSOES = new Set(['.png', '.jpg', '.jpeg'])
// Pastas de entrega (originais soltos pelo Instituto): os arquivos de uso ficam em outras pastas
const IGNORAR = new Set(['Atividades', 'Fotos Membros'])

async function percorrer(pasta) {
  const entradas = await readdir(pasta, { withFileTypes: true })
  const arquivos = []
  for (const entrada of entradas) {
    const caminho = join(pasta, entrada.name)
    if (entrada.isDirectory() && IGNORAR.has(entrada.name)) continue
    if (entrada.isDirectory()) arquivos.push(...(await percorrer(caminho)))
    else arquivos.push(caminho)
  }
  return arquivos
}

let convertidos = 0
let ignorados = 0
for (const arquivo of await percorrer(RAIZ)) {
  const ext = extname(arquivo).toLowerCase()
  if (!EXTENSOES.has(ext)) continue
  // Banco de fotos de membros: converte só os arquivos em kebab-case (sem espaço/acentos)
  const nome = basename(arquivo)
  if (/[\sÀ-ÿ]/.test(nome)) {
    ignorados++
    continue
  }
  const destino = arquivo.slice(0, -ext.length) + '.webp'
  try {
    const origem = await stat(arquivo)
    const existente = await stat(destino).catch(() => null)
    if (existente && existente.mtimeMs >= origem.mtimeMs) continue
    await sharp(arquivo).webp({ quality: 82 }).toFile(destino)
    convertidos++
  } catch (erro) {
    console.warn('Falhou:', arquivo, erro.message)
  }
}
// Manifesto com os WebP existentes: o <picture> só aponta para arquivos que de fato existem.
const existentes = (await percorrer(RAIZ))
  .filter((arquivo) => extname(arquivo).toLowerCase() === '.webp')
  .map((arquivo) => '/' + relative(RAIZ, arquivo).split(sep).join('/'))
  .sort()
const destinoManifesto = fileURLToPath(new URL('../src/utils/webp-manifesto.js', import.meta.url))
await writeFile(
  destinoManifesto,
  '// Gerado por `npm run imagens`. Não editar à mão.\nexport default ' + JSON.stringify(existentes, null, 2) + '\n'
)
console.log(`WebP: ${convertidos} convertidos, ${ignorados} ignorados (nomes com espaço/acento).`)
