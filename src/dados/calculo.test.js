import { describe, it, expect } from 'vitest'
import { calcularMensalidade, TAXA_ADMIN, PERCENTUAL_POR_TIPO } from './calculo.js'

describe('calcularMensalidade', () => {
  it('soma percentual do tipo com a taxa administrativa', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2020, anoAtual: 2026 })
    // 60000 * 0.0135 = 810; sem ajuste de ano; + 79 = 889
    expect(r.base).toBe(810)
    expect(r.ajuste).toBe(0)
    expect(r.taxaAdmin).toBe(TAXA_ADMIN)
    expect(r.mensalidade).toBe(889)
  })

  it('encarece veículos com mais de dez anos', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2010, anoAtual: 2026 })
    // 810 * 1.12 = 907.2 -> 907; + 79 = 986
    expect(r.ajuste).toBeCloseTo(0.12)
    expect(r.mensalidade).toBe(986)
  })

  it('barateia veículos com até três anos', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2025, anoAtual: 2026 })
    // 810 * 0.92 = 745.2 -> 745; + 79 = 824
    expect(r.ajuste).toBeCloseTo(-0.08)
    expect(r.mensalidade).toBe(824)
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
})
