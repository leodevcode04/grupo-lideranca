import { describe, it, expect } from 'vitest'
import { calcularMensalidade, TAXA_ADMIN, PERCENTUAL_POR_TIPO } from './calculo.js'

describe('calcularMensalidade', () => {
  it('soma percentual do tipo com a taxa administrativa', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2020, anoAtual: 2026 })
    // 60000 * 0.006 = 360; sem ajuste de ano; + 79 = 439
    expect(r.base).toBe(360)
    expect(r.ajuste).toBe(0)
    expect(r.taxaAdmin).toBe(TAXA_ADMIN)
    expect(r.mensalidade).toBe(439)
  })

  it('encarece veículos com mais de dez anos', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2010, anoAtual: 2026 })
    // 360 * 1.12 = 403.2 -> 403; + 79 = 482
    expect(r.ajuste).toBeCloseTo(0.12)
    expect(r.mensalidade).toBe(482)
  })

  it('barateia veículos com até três anos', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2025, anoAtual: 2026 })
    // 360 * 0.92 = 331.2 -> 331; + 79 = 410
    expect(r.ajuste).toBeCloseTo(-0.08)
    expect(r.mensalidade).toBe(410)
  })

  it('usa percentual próprio de cada tipo de veículo', () => {
    const moto = calcularMensalidade({ tipo: 'motos', valor: 20000, ano: 2020, anoAtual: 2026 })
    expect(moto.base).toBe(20000 * PERCENTUAL_POR_TIPO.motos)
  })

  it('rejeita tipo desconhecido', () => {
    expect(() => calcularMensalidade({ tipo: 'aviao', valor: 60000, ano: 2020, anoAtual: 2026 }))
      .toThrow('Tipo de veículo desconhecido: aviao')
  })

  it('rejeita valor não positivo', () => {
    expect(() => calcularMensalidade({ tipo: 'carros', valor: 0, ano: 2020, anoAtual: 2026 }))
      .toThrow('Valor do veículo deve ser maior que zero')
  })

  it('usa o ano atual real quando anoAtual não é informado', () => {
    const anoReal = new Date().getFullYear()
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: anoReal })
    // idade 0 -> dentro da faixa "até três anos" -> ajuste de -8%
    expect(r.ajuste).toBeCloseTo(-0.08)
  })

  it('rejeita ano que não converte para número', () => {
    expect(() => calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 'abc', anoAtual: 2026 }))
      .toThrow('Ano do veículo inválido')
    expect(() => calcularMensalidade({ tipo: 'carros', valor: 60000, ano: undefined, anoAtual: 2026 }))
      .toThrow('Ano do veículo inválido')
  })

  // 5.1 — Number('') === 0, e 0 é finito: o guarda antigo deixava passar string
  // vazia (e null/espaços/array, que coagem para 0 ou NaN de formas diferentes)
  // como se fosse um ano válido, produzindo silenciosamente idade = anoAtual.
  it('rejeita ano vazio, em branco, nulo ou array em vez de coagir para zero', () => {
    for (const ano of ['', '  ', null, []]) {
      expect(() => calcularMensalidade({ tipo: 'carros', valor: 60000, ano, anoAtual: 2026 }))
        .toThrow('Ano do veículo inválido')
    }
  })

  // 5.2 — PERCENTUAL_POR_TIPO['toString'] devolve a função herdada de
  // Object.prototype, então `percentual === undefined` é falso e o cálculo
  // sai NaN. tipo vem de ?tipo= na URL, então é entrada controlada pelo usuário.
  it('rejeita chaves herdadas de Object.prototype como tipo de veículo', () => {
    for (const tipo of ['toString', 'constructor', 'valueOf', 'hasOwnProperty']) {
      expect(() => calcularMensalidade({ tipo, valor: 60000, ano: 2020, anoAtual: 2026 }))
        .toThrow(`Tipo de veículo desconhecido: ${tipo}`)
    }
  })

  // 5.3 — bordas das faixas de idade. Mutar `idade > 10` para `>= 10`, ou
  // `idade <= 3` para `< 3`, deve fazer estes quatro testes falharem.
  it('não ajusta veículo de exatamente dez anos (dez não é "mais de dez")', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2016, anoAtual: 2026 })
    expect(r.ajuste).toBe(0)
  })

  it('ajusta veículo de onze anos como antigo', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2015, anoAtual: 2026 })
    expect(r.ajuste).toBe(0.12)
  })

  it('ajusta veículo de exatamente três anos como novo', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2023, anoAtual: 2026 })
    expect(r.ajuste).toBe(-0.08)
  })

  it('não ajusta veículo de quatro anos', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2022, anoAtual: 2026 })
    expect(r.ajuste).toBe(0)
  })

  // 5.4 — `!(valor > 0)` deixa passar o que o JS coage por trás de uma
  // comparação: `true` vira 1, `[60000]` coage via toString por acidente.
  it('rejeita valor que não seja number/string numérica (booleano, array, vazio, nulo)', () => {
    for (const valor of [true, [60000], '', '  ', null]) {
      expect(() => calcularMensalidade({ tipo: 'carros', valor, ano: 2020, anoAtual: 2026 }))
        .toThrow('Valor do veículo deve ser maior que zero')
    }
  })

  // 5.5 — base + taxaAdmin não fecha com a mensalidade sempre que há ajuste;
  // baseAjustada existe para que um futuro detalhamento feche por construção.
  it('devolve baseAjustada já arredondada e consistente com a mensalidade', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2010, anoAtual: 2026 })
    expect(r.baseAjustada).toBe(403)
    expect(r.baseAjustada + r.taxaAdmin).toBe(r.mensalidade)
  })
})
