// Copy dos passos exibidos em `ComoFunciona` (Home). Extraído para `dados/`
// pela mesma razão que `diferenciais.js` e `depoimentos.js`: é conteúdo que
// um editor pode querer mudar sem tocar no JSX. Ao contrário do que um
// comentário anterior aqui afirmava, o layout NÃO assume exatamente três
// itens: `.trilha` é flex com `.passo { flex: 1 }`, e o conector só aparece
// quando `indice < passos.length - 1`. Um quarto passo funciona — só fica
// mais estreito, já que a largura da coluna é dividida igualmente. Ver
// Tarefa 7, 6.9.
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
