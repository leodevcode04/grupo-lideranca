// Copy dos três passos exibidos em `ComoFunciona` (Home). Extraído para
// `dados/` pela mesma razão que `diferenciais.js` e `depoimentos.js`: é
// conteúdo que um editor pode querer mudar sem tocar no JSX. O layout (grid
// de 3 colunas + conector) assume exatamente estes três itens — o mesmo tipo
// de acoplamento que `Diferenciais` já tem com 4 itens e `FaixaNumeros` com 4.
export const passos = [
  {
    id: 'cotacao',
    titulo: 'Faça sua cotação',
    texto: 'Preencha o formulário online e receba o valor do seu plano em minutos.',
  },
  {
    id: 'vistoria',
    titulo: 'Vistoria simples',
    texto: 'Agende a vistoria do veículo na unidade mais próxima, sem burocracia.',
  },
  {
    id: 'protecao',
    titulo: 'Proteção ativa',
    texto: 'Assistência 24 horas e indenização de até 100% da FIPE a partir da adesão.',
  },
]
