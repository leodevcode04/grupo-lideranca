export const contato = {
  telefone: '0800 150 5050',
  telefoneHref: 'tel:08001505050',
  whatsapp: '5548991452750',
  mensagemWhatsApp: 'Olá! Gostaria de saber mais sobre a proteção veicular do Grupo Liderança.',
  email: 'contato@liderancaassociacao.com.br',
  // Também aparece em unidades.js (unidade Tubarão, matriz).
  // Atualize os dois juntos ao corrigir o endereço da matriz.
  endereco: 'R. Hermes Esmeraldino, 90 — São João Margem Esquerda, Tubarão — SC',
  cnpj: '',
  redes: [
    { id: 'instagram', rotulo: 'Instagram', url: 'https://www.instagram.com/lideranca.associacao' },
    { id: 'facebook', rotulo: 'Facebook', url: 'https://www.facebook.com/lidernacaassociacaomatriz/' },
  ],
}

// Mensagem de WhatsApp do resumo da cotação (Tarefa 11), extraída do
// `EtapaResumo` para junto de `mensagemWhatsApp` acima (revisão, 6.6): é
// conteúdo puro com regra de domínio real — quais campos viajam e quais
// deliberadamente não —, sem JSX e sem hooks, então mora aqui, ao lado do
// resto do texto de contato, e é testável sem renderizar componente nenhum.
//
// O telefone nunca entra na mensagem: quem recebe já é o número que está
// enviando via WhatsApp, então repeti-lo no texto seria redundante. Esse
// argumento não vale para o e-mail — é o único dado de contato que uma
// conversa de WhatsApp não carrega consigo —, por isso ele entra quando
// preenchido (revisão, 6.7).
export function montarMensagemCotacao({
  nome,
  cidade,
  email,
  veiculo,
  marca,
  modelo,
  ano,
  valorFormatado,
  estimativaFormatada,
}) {
  const linhas = [
    'Olá! Vim do simulador de cotação e gostaria de seguir com o atendimento.',
    '',
    `Nome: ${nome}`,
    `Cidade: ${cidade}`,
  ]
  if (email) linhas.push(`E-mail: ${email}`)
  linhas.push(
    `Veículo: ${veiculo} — ${marca} ${modelo} (${ano})`,
    `Valor do veículo: ${valorFormatado}`,
    `Estimativa mensal: ${estimativaFormatada}`
  )
  return linhas.join('\n')
}

export function montarLinkWhatsAppCotacao(dados) {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(montarMensagemCotacao(dados))}`
}
