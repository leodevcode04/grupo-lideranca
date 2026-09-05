// Rastreio de cursor por contagem de dígitos, extraído do `EtapaDados`
// (Tarefa 10, 8.4) para o `EtapaContato` também usar (Tarefa 11, 6.2): toda
// máscara que reformata o valor a cada tecla tem o mesmo problema — o
// campo reformatado muda de comprimento, e o navegador por padrão joga o
// cursor para o fim do texto. Editar no meio de "60.000" (ou de
// "(48) 99145-2750") sem isto faz toda tecla seguinte cair no lugar errado.
//
// A técnica: no `onChange`, antes de aplicar a máscara, conta quantos
// dígitos existem à esquerda do cursor no texto ainda cru. Depois que o
// valor mascarado for pintado, varre o texto final e recoloca o cursor
// depois do dígito de mesma posição — a máscara pode ter inserido ou
// removido pontuação em qualquer lugar, mas a contagem de dígitos à
// esquerda do cursor é o que continua estável entre o texto cru e o
// mascarado.

export function digitosAntesDoCursor(elemento, textoDigitado) {
  const pos = elemento?.selectionStart ?? textoDigitado.length
  return textoDigitado.slice(0, pos).replace(/\D/g, '').length
}

export function restaurarCursorPorDigitos(elemento, alvoDigitos) {
  if (alvoDigitos == null || !elemento) return
  const texto = elemento.value
  let vistos = 0
  let pos = texto.length
  for (let i = 0; i < texto.length; i++) {
    if (/\d/.test(texto[i])) vistos++
    if (vistos === alvoDigitos) {
      pos = i + 1
      break
    }
  }
  if (alvoDigitos === 0) pos = 0
  elemento.setSelectionRange(pos, pos)
}
