export const TAXA_ADMIN = 79

export const PERCENTUAL_POR_TIPO = {
  carros: 0.0135,
  motos: 0.019,
  'caminhoes-34': 0.011,
  'caminhoes-pesados': 0.009,
}

const AJUSTE_VEICULO_ANTIGO = 0.12
const AJUSTE_VEICULO_NOVO = -0.08

export function calcularMensalidade({ tipo, valor, ano, anoAtual = new Date().getFullYear() }) {
  const percentual = PERCENTUAL_POR_TIPO[tipo]
  if (percentual === undefined) {
    throw new Error(`Tipo de veículo desconhecido: ${tipo}`)
  }
  if (!(valor > 0)) {
    throw new Error('Valor do veículo deve ser maior que zero')
  }

  const anoNum = Number(ano)
  if (!Number.isFinite(anoNum)) {
    throw new Error('Ano do veículo inválido')
  }

  const idade = anoAtual - anoNum
  const ajuste =
    idade > 10 ? AJUSTE_VEICULO_ANTIGO : idade <= 3 ? AJUSTE_VEICULO_NOVO : 0

  const base = valor * percentual
  const mensalidade = Math.round(base * (1 + ajuste)) + TAXA_ADMIN

  return { base, ajuste, taxaAdmin: TAXA_ADMIN, mensalidade }
}
