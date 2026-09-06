// Ordem é load-bearing: BlogRecente (Tarefa 8) fatia os três primeiros.
// Mantenha do mais recente para o mais antigo ao adicionar posts.
//
// Datas ISO. Ao formatar, passe timeZone: 'UTC' —
// toLocaleDateString('pt-BR', { timeZone: 'UTC' }) — senão sai um dia antes.
//
// Sem campo de capa: desde a reescrita do BlogRecente (Tarefa 8, 7.7) os posts
// são lista tipográfica, sem imagem. O campo existia e não era lido por ninguém.
export const posts = [
  {
    id: 9,
    titulo: 'Rastreador: o que ele cobre e o que ele não resolve',
    resumo:
      'O equipamento ajuda na recuperação do veículo, mas não substitui as demais coberturas. Entenda onde cada uma começa.',
    categoria: 'Dicas',
    data: '2026-08-18',
  },
  {
    id: 8,
    titulo: 'Nova unidade em Chapecó amplia a presença no oeste catarinense',
    resumo:
      'A décima segunda unidade da associação começa a operar atendendo associados de Chapecó e das cidades vizinhas.',
    categoria: 'Institucional',
    data: '2026-06-30',
  },
  {
    id: 7,
    titulo: 'Encontro de associados reúne mais de 200 pessoas em Criciúma',
    resumo:
      'O encontro anual trouxe oficinas sobre manutenção preventiva e uma conversa aberta sobre como funciona o rateio.',
    categoria: 'Eventos',
    data: '2026-04-25',
  },
  {
    id: 6,
    titulo: 'Granizo no Sul: o que fazer quando a previsão assusta',
    resumo:
      'Onde abrigar o veículo, o que registrar antes de sair do lugar e como a cobertura de fenômenos naturais funciona na prática.',
    categoria: 'Dicas',
    data: '2026-02-11',
  },
  {
    id: 5,
    titulo: 'Proteção veicular e seguro: as diferenças que importam na hora de escolher',
    resumo:
      'Uma comparação direta entre os dois modelos, sem jargão, para quem está decidindo qual faz mais sentido.',
    categoria: 'Institucional',
    data: '2025-12-15',
  },
  {
    id: 4,
    titulo: 'Como agir em caso de sinistro: um guia rápido para associados',
    resumo:
      'Passo a passo do que fazer logo após um acidente ou uma ocorrência, dos primeiros contatos até a abertura do processo.',
    categoria: 'Dicas',
    data: '2025-11-20',
  },
  {
    id: 3,
    titulo: 'Grupo Liderança participa de feira regional do setor automotivo',
    resumo:
      'A associação marcou presença em evento que reuniu associados e parceiros para apresentar novidades sobre proteção veicular.',
    categoria: 'Eventos',
    data: '2025-08-09',
  },
  {
    id: 2,
    titulo: '5 cuidados essenciais para viagens longas de carro',
    resumo:
      'Confira uma lista prática de verificações antes de pegar a estrada, da calibragem dos pneus ao planejamento de paradas.',
    categoria: 'Dicas',
    data: '2025-05-22',
  },
  {
    id: 1,
    titulo: 'Grupo Liderança completa mais um ano de atuação em Santa Catarina',
    resumo:
      'Relembramos a trajetória da associação e os principais marcos que consolidaram a presença em cidades catarinenses e gaúchas.',
    categoria: 'Institucional',
    data: '2025-03-14',
  },
]
