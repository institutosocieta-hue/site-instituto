// Confere se o painel de edição (public/admin/config.yml) cobre todos os campos dos
// arquivos de conteúdo (src/content/*.json). Campo que existe no JSON mas não está no
// painel corre o risco de ser apagado ao editar a entrada pelo painel.
// Uso: npm run validar-painel
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'

const raiz = resolve(import.meta.dirname, '..')
const config = parse(readFileSync(resolve(raiz, 'public/admin/config.yml'), 'utf8'))

let problemas = 0
const avisar = (msg) => {
  problemas++
  console.log('  ✗', msg)
}

function conferir(valor, campos, caminho) {
  if (valor === null || valor === undefined) return
  const por = new Map((campos || []).map((c) => [c.name, c]))
  if (Array.isArray(valor)) {
    for (const item of valor) conferir(item, campos, caminho)
    return
  }
  if (typeof valor !== 'object') return
  for (const [chave, v] of Object.entries(valor)) {
    const campo = por.get(chave)
    if (!campo) {
      avisar(`${caminho}.${chave} existe no conteúdo mas não está no painel`)
      continue
    }
    if (campo.widget === 'object') conferir(v, campo.fields, `${caminho}.${chave}`)
    if (campo.widget === 'list' && campo.fields) conferir(v, campo.fields, `${caminho}.${chave}[]`)
  }
}

for (const colecao of config.collections) {
  for (const arquivo of colecao.files || []) {
    const caminho = resolve(raiz, arquivo.file)
    console.log(`${colecao.label} › ${arquivo.label}`)
    let dados
    try {
      dados = JSON.parse(readFileSync(caminho, 'utf8'))
    } catch (erro) {
      avisar(`não foi possível ler ${arquivo.file}: ${erro.message}`)
      continue
    }
    conferir(dados, arquivo.fields, arquivo.name)
    // campos do painel sem equivalente no conteúdo apenas são opcionais: não é problema
  }
}

console.log(problemas ? `\n${problemas} problema(s).` : '\nTudo coberto: o painel conhece todos os campos do conteúdo.')
process.exit(problemas ? 1 : 0)
