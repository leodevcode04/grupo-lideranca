import { describe, it, expect } from 'vitest'
import { mascararTelefone } from './EtapaContato.jsx'

describe('mascararTelefone', () => {
  it('não fecha o parêntese do DDD sozinho — só quando algo vem depois', () => {
    expect(mascararTelefone('4')).toBe('(4')
    expect(mascararTelefone('48')).toBe('(48')
  })

  it('fecha o parêntese assim que o terceiro dígito chega', () => {
    expect(mascararTelefone('489')).toBe('(48) 9')
  })

  // Regressão (revisão, 6.1): a versão antiga fechava o parêntese assim que
  // o DDD completava dois dígitos ("(48) "), então um backspace nesse
  // estado apagava o espaço, mas a máscara relia os mesmos dígitos "48" e
  // devolvia "(48) " de novo — o DDD ficava impossível de apagar por
  // backspace. Simula a sequência inteira: digitar até "489" e depois
  // apagar de trás para frente deve reduzir um dígito por vez, sem nunca
  // travar num estado que se repete.
  it('backspace reduz um dígito por vez até esvaziar, sem travar no DDD', () => {
    // Estado do campo após digitar "489": "(48) 9". Backspace remove o
    // último caractere digitado (o "9"), sobrando "(48) " no campo — a
    // máscara roda de novo sobre os dígitos crus desse texto.
    let valor = mascararTelefone('(48) ')
    expect(valor).toBe('(48')

    // Backspace de novo: "(48" perde o "8" -> "(4".
    valor = mascararTelefone('(4')
    expect(valor).toBe('(4')

    // Backspace de novo: "(4" perde o "4" -> "(".
    valor = mascararTelefone('(')
    expect(valor).toBe('')
  })

  it('formata celular (11 dígitos) e fixo (10 dígitos) nos dois formatos', () => {
    expect(mascararTelefone('48991452750')).toBe('(48) 99145-2750')
    expect(mascararTelefone('4832251234')).toBe('(48) 3225-1234')
  })

  it('ignora dígitos além do 11º', () => {
    expect(mascararTelefone('489914527509999')).toBe('(48) 99145-2750')
  })

  it('ignora caracteres não numéricos na entrada', () => {
    expect(mascararTelefone('(48) 99145-2750')).toBe('(48) 99145-2750')
  })
})
