export const TAXA_ADMIN = 79

export const PERCENTUAL_POR_TIPO = {
  carros: 0.006,
  motos: 0.019,
  'caminhoes-34': 0.011,
  'caminhoes-pesados': 0.009,
}

const AJUSTE_VEICULO_ANTIGO = 0.12
const AJUSTE_VEICULO_NOVO = -0.08

// Converte para número apenas formas que representam um número de verdade:
// `number`, ou string não vazia (após trim). Rejeita null, undefined,
// booleanos, arrays e objetos em geral — todos coagem "silenciosamente" via
// `Number()` nativo (Number('') === 0, Number([]) === 0, Number(true) === 1),
// o que faria o guarda seguinte (isFinite) aceitar um valor que nunca foi
// digitado pelo usuário.
function paraNumeroValido(entrada) {
  if (typeof entrada === 'number') return entrada
  if (typeof entrada === 'string') {
    const texto = entrada.trim()
    if (texto === '') return NaN
    return Number(texto)
  }
  return NaN
}

export function calcularMensalidade({ tipo, valor, ano, anoAtual = new Date().getFullYear() }) {
  // Object.hasOwn (em vez de `percentual === undefined`) porque tipo viaja na
  // URL como ?tipo= — entrada controlada pelo usuário — e chaves herdadas de
  // Object.prototype ('toString', 'constructor', 'valueOf', 'hasOwnProperty')
  // devolveriam a função herdada em vez de undefined, produzindo "R$ NaN".
  if (!Object.hasOwn(PERCENTUAL_POR_TIPO, tipo)) {
    throw new Error(`Tipo de veículo desconhecido: ${tipo}`)
  }
  const percentual = PERCENTUAL_POR_TIPO[tipo]

  const valorNum = paraNumeroValido(valor)
  if (!Number.isFinite(valorNum) || !(valorNum > 0)) {
    throw new Error('Valor do veículo deve ser maior que zero')
  }

  const anoNum = paraNumeroValido(ano)
  if (!Number.isFinite(anoNum)) {
    throw new Error('Ano do veículo inválido')
  }

  const idade = anoAtual - anoNum
  const ajuste =
    idade > 10 ? AJUSTE_VEICULO_ANTIGO : idade <= 3 ? AJUSTE_VEICULO_NOVO : 0

  const base = valorNum * percentual
  // Math.round sobre float perde o ".5" exato em alguns casos de ponto
  // flutuante (ex.: 11500 * 0.011 = 126.49999999999999, que arredonda para
  // 126 e não 127). É sempre R$ 1 de diferença, sempre para baixo, e o valor
  // já é declaradamente uma estimativa — comportamento deliberado, não
  // "consertar" isso depois numa resposta diferente.
  const baseAjustada = Math.round(base * (1 + ajuste))
  const mensalidade = baseAjustada + TAXA_ADMIN

  return { base, baseAjustada, ajuste, taxaAdmin: TAXA_ADMIN, mensalidade }
}
