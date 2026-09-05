import { veiculos } from '../../dados/veiculos.js'
import { montarLinkWhatsAppCotacao } from '../../dados/contato.js'
import { calcularMensalidade } from '../../dados/calculo.js'
import { validarEtapa } from './estadoWizard.js'
import Botao from '../ui/Botao.jsx'
import Revelar from '../ui/Revelar.jsx'
import estilosEtapa from './etapa.module.css'
import estilos from './EtapaResumo.module.css'

const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function AvisoIncompleto({ aoIrParaEtapa }) {
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
      <Botao variante="primario" tipo="button" onClick={() => aoIrParaEtapa(0)}>
        Voltar ao início
      </Botao>
    </div>
  )
}

// `estado` inteiro (não `valores`/`erros` como as outras etapas): é a única
// que precisa de tudo — tipo, dados do veículo e dados de contato viram o
// resumo, o cálculo e a mensagem do WhatsApp (Tarefa 11). Já `aoReiniciar`
// e `aoIrParaEtapa` (não `despachar` cru) — receber o dispatcher inteiro
// entrega ao componente o vocabulário de ações do redutor, três formatos
// fixados numa folha que só o `Wizard` deveria conhecer; as duas funções
// escondem isso e deixam o componente testável com props simples (revisão,
// 6.10).
export default function EtapaResumo({ estado, aoReiniciar, aoIrParaEtapa }) {
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

  if (incompleto) return <AvisoIncompleto aoIrParaEtapa={aoIrParaEtapa} />

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
    return <AvisoIncompleto aoIrParaEtapa={aoIrParaEtapa} />
  }

  const valorFormatado = formatador.format(Number(estado.valor))
  const estimativaFormatada = formatador.format(resultado.mensalidade)

  // Montagem da mensagem movida para `dados/contato.js` (revisão, 6.6): é
  // conteúdo puro, com regra de domínio real sobre quais campos viajam —
  // pertence ao lado do resto do texto de contato, não a este componente,
  // e passou a ser testável sem renderizar nada.
  const linkWhatsApp = montarLinkWhatsAppCotacao({
    nome: estado.nome,
    cidade: estado.cidade,
    email: estado.email,
    veiculo: veiculo.nome,
    marca: estado.marca,
    modelo: estado.modelo,
    ano: estado.ano,
    valorFormatado,
    estimativaFormatada,
  })

  return (
    <div>
      <h2 tabIndex={-1} className={`${estilosEtapa.titulo} ${estilos.tituloEtiqueta}`}>
        Resumo da sua cotação
      </h2>

      <div className={estilos.destaque}>
        <p className={estilos.nomePlano}>Plano {veiculo.nome}</p>
        {/* Entra no próprio tempo, depois que o painel assenta (revisão,
            6.5): o número é o desfecho de quatro etapas de trabalho, não
            mais um bloco igual aos outros. `Revelar` já respeita
            `prefers-reduced-motion` via CSS (tokens.css), então não precisa
            de tratamento extra aqui. */}
        <Revelar atraso={150} className={estilos.valorRevelar}>
          <p className={estilos.valor}>
            {estimativaFormatada}
            <span className={estilos.porMes}> /mês</span>
          </p>
          <div className={estilos.filete} aria-hidden="true" />
        </Revelar>
      </div>

      <ul className={estilos.coberturas}>
        {veiculo.coberturas.map((cobertura) => (
          <li key={cobertura}>{cobertura}</li>
        ))}
      </ul>

      <div className={estilos.grupo}>
        <div className={estilos.grupoCabecalho}>
          <p className={estilos.grupoRotulo}>Veículo</p>
          <button type="button" className={estilos.editar} onClick={() => aoIrParaEtapa(1)}>
            Editar
          </button>
        </div>
        <dl className={estilos.dados}>
          <div>
            <dt>Veículo</dt>
            <dd>{estado.marca} {estado.modelo} ({estado.ano})</dd>
          </div>
          <div>
            <dt>Valor informado</dt>
            <dd>{valorFormatado}</dd>
          </div>
        </dl>
      </div>

      <div className={estilos.grupo}>
        <div className={estilos.grupoCabecalho}>
          <p className={estilos.grupoRotulo}>Contato</p>
          <button type="button" className={estilos.editar} onClick={() => aoIrParaEtapa(2)}>
            Editar
          </button>
        </div>
        {/* Separa em silêncio o que ia para o consultor do que não ia — o
            recap misturava as duas categorias sem dizer qual era qual
            (revisão, 6.8). O telefone não viaja na mensagem porque o
            consultor já vê o número de quem está enviando; o e-mail viaja
            quando preenchido (6.7). */}
        <p className={estilos.aviso}>
          Enviaremos ao consultor: nome, cidade, veículo, valor informado
          {estado.email ? ' e e-mail' : ''}. O telefone não vai na mensagem — o
          consultor já vê o número de quem está enviando.
        </p>
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
        </dl>
      </div>

      <p className={estilos.disclaimer}>
        Valor estimado para fins de simulação. A proposta definitiva é elaborada por
        um consultor após a vistoria.
      </p>

      <div className={estilos.acoes}>
        <Botao variante="primario" href={linkWhatsApp}>
          Enviar no WhatsApp
        </Botao>
        <Botao variante="contorno" tipo="button" onClick={aoReiniciar}>
          Refazer
        </Botao>
      </div>
    </div>
  )
}
