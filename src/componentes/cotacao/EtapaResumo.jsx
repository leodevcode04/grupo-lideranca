import { veiculos } from '../../dados/veiculos.js'
import { contato } from '../../dados/contato.js'
import { calcularMensalidade } from '../../dados/calculo.js'
import { validarEtapa } from './estadoWizard.js'
import Botao from '../ui/Botao.jsx'
import estilosEtapa from './etapa.module.css'
import estilos from './EtapaResumo.module.css'

const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function AvisoIncompleto({ despachar }) {
  return (
    <div>
      <h2 tabIndex={-1} className={estilosEtapa.titulo}>
        Faltam algumas informações
      </h2>
      <p className={estilos.aviso}>
        Não encontramos os dados da sua cotação — isso acontece quando esta etapa é
        aberta direto, sem passar pelo restante do wizard. Volte ao início para
        recomeçar.
      </p>
      <Botao variante="primario" tipo="button" onClick={() => despachar({ tipo: 'irPara', etapa: 0 })}>
        Voltar ao início
      </Botao>
    </div>
  )
}

// `estado` inteiro (não `valores`/`erros` como as outras etapas): é a única
// que precisa de tudo — tipo, dados do veículo e dados de contato viram o
// resumo, o cálculo e a mensagem do WhatsApp (Tarefa 11).
export default function EtapaResumo({ estado, despachar }) {
  const veiculo = veiculos.find((v) => v.id === estado.tipo)

  // Guarda antes de calcular, não só `try/catch` ao redor de
  // `calcularMensalidade` (Tarefa 11, decisão de projeto): a validação da
  // etapa 1/2 já describe exatamente quais dados faltam ou são inválidos, e
  // reaproveitar `validarEtapa` aqui é a mesma pergunta que `avancar` já faz
  // — "esta etapa está completa?" — sem duplicar as regras. `tipo` nulo cai
  // fora da tabela de validadores (só 1 e 2 existem), por isso o `!veiculo`
  // extra.
  const incompleto =
    !veiculo ||
    Object.keys(validarEtapa(estado, 1)).length > 0 ||
    Object.keys(validarEtapa(estado, 2)).length > 0

  if (incompleto) return <AvisoIncompleto despachar={despachar} />

  let resultado
  try {
    resultado = calcularMensalidade({ tipo: estado.tipo, valor: estado.valor, ano: estado.ano })
  } catch {
    // Rede de segurança, não o caminho esperado: as guardas acima já cobrem
    // os três casos que `calcularMensalidade` rejeita (tipo desconhecido,
    // valor não positivo, ano inválido) para todo dado que passou pela
    // validação normal do wizard. Isto só dispara se uma edição futura da
    // tela permitir voltar e alterar um campo já validado para um valor
    // inválido sem revalidar — melhor mostrar o mesmo aviso do que deixar o
    // wizard quebrar com uma tela em branco.
    return <AvisoIncompleto despachar={despachar} />
  }

  const valorFormatado = formatador.format(Number(estado.valor))
  const estimativaFormatada = formatador.format(resultado.mensalidade)

  // Só os dados que o plano pede (nome, cidade, veículo, ano, valor,
  // estimativa) — nunca telefone ou e-mail: o telefone já é conhecido pelo
  // consultor (é o número que está mandando a mensagem) e o e-mail não some
  // no cálculo nem no atendimento por WhatsApp, então incluí-los na URL só
  // duplicaria dado pessoal sem necessidade.
  const mensagem = [
    'Olá! Vim do simulador de cotação e gostaria de seguir com o atendimento.',
    '',
    `Nome: ${estado.nome}`,
    `Cidade: ${estado.cidade}`,
    `Veículo: ${veiculo.nome} — ${estado.marca} ${estado.modelo} (${estado.ano})`,
    `Valor do veículo: ${valorFormatado}`,
    `Estimativa mensal: ${estimativaFormatada}`,
  ].join('\n')

  const linkWhatsApp = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`

  return (
    <div>
      <h2 tabIndex={-1} className={estilosEtapa.titulo}>
        Resumo da sua cotação
      </h2>

      <div className={estilos.destaque}>
        <p className={estilos.nomePlano}>Plano {veiculo.nome}</p>
        <p className={estilos.valor}>
          {estimativaFormatada}
          <span className={estilos.porMes}> /mês</span>
        </p>
      </div>

      <ul className={estilos.coberturas}>
        {veiculo.coberturas.map((cobertura) => (
          <li key={cobertura}>{cobertura}</li>
        ))}
      </ul>

      <dl className={estilos.dados}>
        <div>
          <dt>Nome</dt>
          <dd>{estado.nome}</dd>
        </div>
        <div>
          <dt>Telefone</dt>
          <dd>{estado.telefone}</dd>
        </div>
        <div>
          <dt>Cidade</dt>
          <dd>{estado.cidade}</dd>
        </div>
        {estado.email && (
          <div>
            <dt>E-mail</dt>
            <dd>{estado.email}</dd>
          </div>
        )}
        <div>
          <dt>Veículo</dt>
          <dd>{estado.marca} {estado.modelo} ({estado.ano})</dd>
        </div>
        <div>
          <dt>Valor informado</dt>
          <dd>{valorFormatado}</dd>
        </div>
      </dl>

      <p className={estilos.disclaimer}>
        Valor estimado para fins de simulação. A proposta definitiva é elaborada por
        um consultor após a vistoria.
      </p>

      <div className={estilos.acoes}>
        <Botao variante="primario" href={linkWhatsApp}>
          Enviar no WhatsApp
        </Botao>
        <Botao variante="contorno" tipo="button" onClick={() => despachar({ tipo: 'reiniciar' })}>
          Refazer
        </Botao>
      </div>
    </div>
  )
}
