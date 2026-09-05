// Adiciona largura e formato à URL da Unsplash sem duplicar a query inteira
// por variante do srcset. Segunda cópia extraída na Tarefa 12 (4.10): a
// primeira vivia em `TiposVeiculo.jsx` e o comentário de lá já admitia a
// duplicação — mover um helper usado por dois consumidores, não abstração
// prematura.
export function comLargura(url, largura) {
  const u = new URL(url)
  u.searchParams.set('w', largura)
  u.searchParams.set('fm', 'webp')
  u.searchParams.set('auto', 'format')
  return u.toString()
}
