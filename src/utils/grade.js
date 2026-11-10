// ─────────────────────────────────────────────────────────────
// Calcula um número de colunas que divide n itens em linhas
// completas (sem uma última linha mais curta que as demais).
// Usar em conjunto com :style="{ gridTemplateColumns: `repeat(${colunas(n)}, 1fr)` }"
// ─────────────────────────────────────────────────────────────

export function colunasCompletas(n, max = 5, preferidas = [4, 3, 5, 2]) {
  if (n <= 1) return n || 1
  for (const c of preferidas) {
    if (c <= Math.min(n, max) && n % c === 0) return c
  }
  return Math.min(n, max)
}
