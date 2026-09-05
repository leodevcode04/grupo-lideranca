// Costura do wizard: estado inicial, redutor e validação — nada de UI aqui.
// Fica em arquivo próprio (Tarefa 10, 8.14) porque nada fora do `Wizard`
// consumia os exports antes, e a Tarefa 11 acrescenta `EtapaContato` e
// `EtapaResumo`, que precisam do mesmo redutor e da mesma tabela de
// validadores — melhor um arquivo de estado só, que os dois lados importam,
// do que reexportar tudo a partir do componente do wizard.

export const ETAPAS = ['Veículo', 'Dados do veículo', 'Seus dados', 'Resumo']

// Modelos de fábrica saem à venda antes do ano-calendário virar (um carro
// "2027" já roda em concessionária em outubro de 2026), então o limite usa
// o ano corrente + 1 em vez do ano corrente puro — um limite igual a
// `getFullYear()` recusaria esse veículo legítimo. Nunca o literal 2026:
// mesma deriva silenciosa que a Tarefa 9 removeu de `calculo.js`.
function anoLimite() {
  return new Date().getFullYear() + 1
}

export const estadoInicial = {
  etapa: 0,
  tipo: null,
  marca: '', modelo: '', ano: '', valor: '',
  nome: '', telefone: '', cidade: '', email: '',
  erros: {},
  // Incrementado só pelo `case 'erros'` (Tarefa 10, 8.2/8.3) — é o
  // discriminador entre "a validação acabou de falhar" (precisa mover foco e
  // anunciar) e "um campo foi corrigido" (não precisa de nenhum dos dois).
  // `erros` sozinho não serve pra isso: `case 'campo'` também reescreve o
  // objeto a cada tecla.
  tentativa: 0,
  // Direção da transição do `AnimatePresence`: propriedade da transição que
  // o redutor acabou de executar, não do componente que a anima (Tarefa 10,
  // 8.5). Fica no estado, não em ref, porque um ref lido durante o render é
  // impuro e porque `reiniciar` (Tarefa 11) precisa poder fixar `-1` sem
  // depender de um ref que só `avancar`/`voltar` sabiam atualizar.
  direcao: 1,
}

export function redutor(estado, acao) {
  switch (acao.tipo) {
    case 'campo':
      return {
        ...estado,
        [acao.campo]: acao.valor,
        erros: { ...estado.erros, [acao.campo]: undefined },
      }
    case 'avancar':
      return {
        ...estado,
        etapa: Math.min(estado.etapa + 1, ETAPAS.length - 1),
        erros: {},
        direcao: 1,
      }
    case 'voltar':
      return {
        ...estado,
        etapa: Math.max(estado.etapa - 1, 0),
        erros: {},
        direcao: -1,
      }
    case 'erros':
      return { ...estado, erros: acao.erros, tentativa: estado.tentativa + 1 }
    case 'reiniciar':
      // -1: o "Refazer" da Tarefa 11 desfaz quatro etapas de progresso, então
      // anima como retrocesso, não como avanço — é exatamente o bug que um
      // `direcaoRef` preso em `1` da última chamada de `avancar` causaria.
      return { ...estadoInicial, direcao: -1 }
    case 'irPara':
      // Usado só pelo aviso de `EtapaResumo` (Tarefa 11) quando alguém entra
      // direto na última etapa sem `tipo` ou sem os dados da etapa 2 — o
      // salto é sempre para trás (etapa 0), nunca para a frente, então
      // `direcao: -1` sem condicional é suficiente; um `avancar`/`voltar`
      // genérico não serviria porque ambos só andam uma etapa por vez.
      return { ...estado, etapa: acao.etapa, erros: {}, direcao: -1 }
    default:
      return estado
  }
}

// Tabela indexada por etapa em vez de um `validarEtapa` que lê
// `estado.etapa` internamente (Tarefa 10, 8.14): custa as mesmas linhas e
// permite perguntar "a etapa 2 está completa?" sem estar nela — o
// `EtapaResumo` da Tarefa 11 usa isso para recusar calcular com dados
// incompletos quando alguém entra direto na última etapa.
const validadores = {
  1(estado) {
    const erros = {}
    if (!estado.marca.trim()) erros.marca = 'Informe a marca'
    if (!estado.modelo.trim()) erros.modelo = 'Informe o modelo'
    if (!/^\d{4}$/.test(estado.ano)) erros.ano = 'Ano com 4 dígitos'
    else if (Number(estado.ano) < 1980 || Number(estado.ano) > anoLimite()) erros.ano = 'Ano fora do intervalo'
    if (!(Number(estado.valor) > 0)) erros.valor = 'Informe o valor do veículo'
    return erros
  },
  2(estado) {
    const erros = {}
    if (estado.nome.trim().length < 3) erros.nome = 'Informe seu nome completo'
    if (estado.telefone.replace(/\D/g, '').length < 10) erros.telefone = 'Telefone incompleto'
    if (!estado.cidade.trim()) erros.cidade = 'Informe sua cidade'
    if (estado.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(estado.email)) erros.email = 'E-mail inválido'
    return erros
  },
}

// O e-mail é opcional; se preenchido, precisa ser válido.
export function validarEtapa(estado, etapa = estado.etapa) {
  const validador = validadores[etapa]
  return validador ? validador(estado) : {}
}
