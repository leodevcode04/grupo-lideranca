// Ordem é load-bearing: BlogRecente (Tarefa 8) fatia os três primeiros.
// Mantenha do mais recente para o mais antigo ao adicionar posts.
//
// Datas ISO. Ao formatar, passe timeZone: 'UTC' —
// toLocaleDateString('pt-BR', { timeZone: 'UTC' }) — senão sai um dia antes.
export const posts = [
  {
    id: 4,
    titulo: 'Como agir em caso de sinistro: um guia rápido para associados',
    resumo:
      'Passo a passo do que fazer logo após um acidente ou uma ocorrência, dos primeiros contatos até a abertura do processo.',
    categoria: 'Dicas',
    data: '2025-11-20',
    capa: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=1200&q=80',
  },
  {
    id: 3,
    titulo: 'Grupo Liderança participa de feira regional do setor automotivo',
    resumo:
      'A associação marcou presença em evento que reuniu associados e parceiros para apresentar novidades sobre proteção veicular.',
    categoria: 'Eventos',
    data: '2025-08-09',
    capa: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80',
  },
  {
    id: 2,
    titulo: '5 cuidados essenciais para viagens longas de carro',
    resumo:
      'Confira uma lista prática de verificações antes de pegar a estrada, da calibragem dos pneus ao planejamento de paradas.',
    categoria: 'Dicas',
    data: '2025-05-22',
    capa: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80',
  },
  {
    id: 1,
    titulo: 'Grupo Liderança completa mais um ano de atuação em Santa Catarina',
    resumo:
      'Relembramos a trajetória da associação e os principais marcos que consolidaram a presença em cidades catarinenses e gaúchas.',
    categoria: 'Institucional',
    data: '2025-03-14',
    capa: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1200&q=80',
  },
]
