import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Abas, { idAba, idPainel } from '../componentes/ui/Abas.jsx'
import Botao from '../componentes/ui/Botao.jsx'
import { veiculos, coberturasUniao, coberturasUniversais } from '../dados/veiculos.js'
import { comLargura } from '../utils/imagem.js'
import estilos from './Beneficios.module.css'

const PREFIXO_ABAS = 'beneficios'

// `Abas` espera `{ id, rotulo }`; `veiculos` traz `{ id, nome }` — convertido
// aqui, sem mudar o formato dos dados (Tarefa 12, passo 2). `veiculos` é uma
// constante de módulo, então o mapeamento também pode ser: `useMemo(..., [])`
// sobre uma constante era cerimônia (Tarefa 12, 4.10).
const itensAba = veiculos.map(({ id, nome }) => ({ id, rotulo: nome }))

export default function Beneficios() {
  const [searchParams, setSearchParams] = useSearchParams()
  const semMovimento = useReducedMotion()

  // Estado derivado da URL, não duplicado em useState: `?tipo=` já é a fonte
  // de verdade, e ler direto evita os dois ficarem fora de sincronia.
  // Fallback no primeiro veículo quando o parâmetro está ausente ou não
  // existe em `veiculos` (ex.: `?tipo=aviao`) — sem lançar, só ignora o valor
  // inválido. Antes o fallback era o literal `'carros'`, duplicando um id
  // load-bearing (Tarefa 12, 4.10); `veiculos[0].id` é a mesma garantia sem a
  // segunda cópia.
  const tipoParam = searchParams.get('tipo')
  const ativo = veiculos.some((veiculo) => veiculo.id === tipoParam) ? tipoParam : veiculos[0].id
  const veiculoAtivo = veiculos.find((veiculo) => veiculo.id === ativo)

  function trocar(id) {
    // `replace: true`: o link fica compartilhável (a URL reflete a aba
    // aberta) sem empilhar uma entrada de histórico por clique — "Voltar"
    // depois de trocar de aba tira da página, não aba por aba.
    setSearchParams(
      (atual) => {
        const proximo = new URLSearchParams(atual)
        proximo.set('tipo', id)
        return proximo
      },
      { replace: true }
    )
  }

  const duracao = semMovimento ? 0 : 0.4
  const atraso = semMovimento ? 0 : 0.08

  const variantesPainel = {
    escondido: { opacity: 0 },
    visivel: {
      opacity: 1,
      transition: { duration: duracao, staggerChildren: atraso, delayChildren: atraso },
    },
    saida: { opacity: 0, transition: { duration: duracao } },
  }

  const variantesItem = {
    escondido: { opacity: 0, y: semMovimento ? 0 : 12 },
    visivel: { opacity: 1, y: 0, transition: { duration: duracao, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <div className={`container ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Benefícios por tipo de veículo</h1>
      <p className={estilos.subtitulo}>
        Cada categoria tem uma cobertura própria. Escolha o tipo de veículo abaixo para ver
        exatamente o que está incluído.
      </p>

      <Abas
        itens={itensAba}
        ativo={ativo}
        aoTrocar={trocar}
        idPrefixo={PREFIXO_ABAS}
        aria-label="Tipos de veículo"
        className={estilos.abas}
      />

      {/* `mode` padrão (`sync`): o painel novo monta no mesmo instante em que
          o antigo começa a sair, sem esperar um callback de fim de animação.
          `mode="wait"` fazia exatamente esse tipo de espera — e como esse
          callback depende de um `requestAnimationFrame` que pode não
          disparar (aba em segundo plano, economia de energia, e
          reproduzido aqui sob teste), o painel novo simplesmente nunca
          montava: a troca de aba atualizava `aria-selected`, mas o
          `[role=tabpanel]` continuava sendo o antigo, congelado em
          `opacity: 0`. Mesmo bug que o `Wizard.jsx` já diagnosticou e
          corrigiu (Tarefa 12, 4.1) — lá a correção foi a mesma: usar o
          `sync` padrão. */}
      <AnimatePresence>
        <motion.div
          key={ativo}
          role="tabpanel"
          id={idPainel(PREFIXO_ABAS, ativo)}
          aria-labelledby={idAba(PREFIXO_ABAS, ativo)}
          className={estilos.painel}
          variants={variantesPainel}
          initial="escondido"
          animate="visivel"
          exit="saida"
        >
          <motion.div variants={variantesItem} className={estilos.fotoWrapper}>
            <img
              className={estilos.foto}
              src={comLargura(veiculoAtivo.foto, 900)}
              srcSet={`${comLargura(veiculoAtivo.foto, 500)} 500w, ${comLargura(veiculoAtivo.foto, 900)} 900w, ${comLargura(veiculoAtivo.foto, 1400)} 1400w`}
              sizes="(max-width: 900px) 100vw, 640px"
              alt=""
              aria-hidden="true"
              fetchpriority="high"
              decoding="async"
            />
          </motion.div>

          <motion.div variants={variantesItem} className={estilos.texto}>
            {/* A `chamada` mora aqui agora, não o nome do veículo (Tarefa 12,
                4.8): a aba selecionada, ~40px acima, já diz o nome — repeti-lo
                no <h2> não acrescentava nada que o leitor não tivesse. */}
            <h2 className={estilos.nome}>{veiculoAtivo.chamada}</h2>
            <p className={estilos.descricao}>{veiculoAtivo.descricao}</p>
          </motion.div>

          <motion.div variants={variantesItem} className={estilos.coberturas}>
            <h3 className={estilos.subtituloCoberturas}>Coberturas incluídas</h3>
            {/* Grade de união (Tarefa 12, 4.5): as 11 linhas — cinco
                universais, seis diferenciadoras — renderizam em toda aba, na
                mesma posição. Presentes ganham o check dourado; ausentes
                ficam em baixa ênfase com um traço; as diferenciadoras
                presentes no veículo ativo (as "exclusivas") ganham um realce
                discreto. É o que torna a ausência visível e mantém as
                células paradas sob o crossfade. */}
            <ul className={estilos.grade}>
              {coberturasUniao.map((cobertura) => {
                const presente = veiculoAtivo.coberturas.includes(cobertura)
                const universal = coberturasUniversais.has(cobertura)
                const exclusiva = presente && !universal
                const estadoClasse = presente
                  ? exclusiva
                    ? estilos.exclusiva
                    : estilos.presente
                  : estilos.ausente

                return (
                  <li key={cobertura} className={`${estilos.item} ${estadoClasse}`}>
                    {presente ? (
                      <svg className={estilos.check} viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          d="M4 10.5l4 4 8-9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span className={estilos.traco} aria-hidden="true">
                        –
                      </span>
                    )}
                    <span>
                      {cobertura}
                      <span className={estilos.somenteLeitor}>
                        {presente ? ', incluído' : ', não incluído'}
                        {exclusiva ? ' — diferencial deste veículo' : ''}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </motion.div>

          <motion.div variants={variantesItem} className={estilos.cta}>
            <Botao variante="primario" para={`/cotacao?tipo=${ativo}`}>
              Fazer cotação para {veiculoAtivo.nome.toLowerCase()}
            </Botao>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Tabela comparativa 11×4 (Tarefa 12, 4.5, segunda camada): as abas
          voltam a fazer o que abas fazem bem — detalhe sob demanda — e a
          tabela carrega a comparação entre os quatro veículos de uma vez,
          sem exigir troca de aba nem memória do leitor. */}
      <section className={estilos.comparativo} aria-labelledby="beneficios-comparativo-titulo">
        <h2 id="beneficios-comparativo-titulo" className={estilos.comparativoTitulo}>
          Compare as coberturas entre veículos
        </h2>
        <div className={estilos.tabelaRolagem}>
          <table className={estilos.tabela}>
            <thead>
              <tr>
                <th scope="col">Cobertura</th>
                {veiculos.map((veiculo) => (
                  <th scope="col" key={veiculo.id}>
                    {veiculo.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coberturasUniao.map((cobertura) => (
                <tr key={cobertura}>
                  <th scope="row">{cobertura}</th>
                  {veiculos.map((veiculo) => {
                    const presente = veiculo.coberturas.includes(cobertura)
                    return (
                      <td key={veiculo.id} className={presente ? undefined : estilos.celulaAusente}>
                        {presente ? (
                          <svg className={estilos.check} viewBox="0 0 20 20" aria-hidden="true">
                            <path
                              d="M4 10.5l4 4 8-9"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <span aria-hidden="true">–</span>
                        )}
                        <span className={estilos.somenteLeitor}>
                          {presente ? 'Incluído' : 'Não incluído'}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
