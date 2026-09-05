import { describe, it, expect } from 'vitest'
import { contato, montarMensagemCotacao, montarLinkWhatsAppCotacao } from './contato.js'

const dadosBase = {
  nome: 'Maria Silva',
  cidade: 'Tubarão',
  veiculo: 'Carros',
  marca: 'Fiat',
  modelo: 'Argo',
  ano: '2022',
  valorFormatado: 'R$ 60.000,00',
  estimativaFormatada: 'R$ 439,00',
}

describe('montarMensagemCotacao', () => {
  it('nunca inclui o telefone — o consultor já vê o número de quem envia', () => {
    const mensagem = montarMensagemCotacao({ ...dadosBase, telefone: '(48) 99145-2750' })
    expect(mensagem).not.toMatch(/telefone/i)
    expect(mensagem).not.toContain('99145-2750')
  })

  it('inclui o e-mail quando preenchido', () => {
    const mensagem = montarMensagemCotacao({ ...dadosBase, email: 'maria@exemplo.com' })
    expect(mensagem).toContain('E-mail: maria@exemplo.com')
  })

  it('omite a linha de e-mail quando o campo está vazio', () => {
    const mensagem = montarMensagemCotacao({ ...dadosBase, email: '' })
    expect(mensagem).not.toMatch(/e-mail/i)
  })

  it('traz nome, cidade, veículo, valor e estimativa', () => {
    const mensagem = montarMensagemCotacao({ ...dadosBase, email: '' })
    expect(mensagem).toContain('Nome: Maria Silva')
    expect(mensagem).toContain('Cidade: Tubarão')
    expect(mensagem).toContain('Veículo: Carros — Fiat Argo (2022)')
    expect(mensagem).toContain('Valor do veículo: R$ 60.000,00')
    expect(mensagem).toContain('Estimativa mensal: R$ 439,00')
  })
})

describe('montarLinkWhatsAppCotacao', () => {
  it('monta um link wa.me com a mensagem codificada, decodificável de volta', () => {
    const link = montarLinkWhatsAppCotacao({ ...dadosBase, email: 'maria@exemplo.com' })
    expect(link).toBe(`https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(montarMensagemCotacao({ ...dadosBase, email: 'maria@exemplo.com' }))}`)

    const url = new URL(link)
    const textoDecodificado = url.searchParams.get('text')
    expect(textoDecodificado).toContain('Nome: Maria Silva')
    expect(textoDecodificado).toContain('E-mail: maria@exemplo.com')
    expect(textoDecodificado).not.toMatch(/telefone/i)
  })

  it('sem e-mail, o texto decodificado não menciona e-mail', () => {
    const link = montarLinkWhatsAppCotacao({ ...dadosBase, email: '' })
    const url = new URL(link)
    expect(url.searchParams.get('text')).not.toMatch(/e-mail/i)
  })
})
