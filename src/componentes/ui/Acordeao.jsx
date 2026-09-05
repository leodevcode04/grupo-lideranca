import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import estilos from './Acordeao.module.css'

// Peça de UI sem domínio: qualquer lista de `{ id, titulo, conteudo }` serve
// — `conteudo` aceita string ou nó (lista, link, etc.), não só texto. Um item
// aberto por vez — abrir um fecha o outro, mas cada item anima sua própria
// altura de forma independente (dois `motion.div` distintos, cada um só
// reage à própria prop `isOpen`), então não há duas animações competindo
// pelo mesmo elemento.
//
// `height: 'auto'` é a armadilha clássica de acordeão: o Framer mede o
// valor de destino e anima até ele, e ao terminar deixa o estilo como
// `height: 'auto'` de verdade (não um pixel congelado) — por isso um
// resize com o painel aberto e em repouso continua correto.
//
// Altura zero com `overflow: hidden` NÃO poda a subárvore da acessibilidade
// (Tarefa 8, 7.1): um painel fechado com `height: 0` continua com
// `visibility: visible` por padrão, e um leitor de tela lê o conteúdo dele
// mesmo que nada apareça na tela. Por isso cada painel rastreia o próprio
// `assentado` (a animação para o `isOpen` atual já terminou) e, só então,
// aplica `visibility: hidden` quando fechado. Durante a transição em si —
// abrindo ou fechando — o painel fica `visible` (senão o conteúdo some
// antes/depois da hora); `overflow` só volta a `visible` quando aberto E
// assentado, para não vazar conteúdo da caixa enquanto ela ainda cresce ou
// encolhe (esse cuidado é o que protege o anel de foco de um link dentro da
// resposta, hoje texto puro mas contemplado pelo contrato de `conteudo`).
export default function Acordeao({
  itens,
  abertoInicial = null,
  // `tituloComo`: tag do cabeçalho de cada item (h3 por padrão) — ajuste
  // quando o acordeão for usado sob um nível de título diferente.
  tituloComo: TituloTag = 'h3',
  // `className`: composto ao contêiner raiz, para o chamador ajustar
  // layout (largura, margens) sem o componente precisar saber por quê.
  className,
}) {
  // Semente de useState: só vale na montagem. Trocar `abertoInicial` depois
  // de montado não reabre nada — se uma tarefa futura precisar abrir um
  // item por link (ex.: Tarefa 13), vai precisar de `key` para remontar ou
  // de um modo controlado (não existe hoje, com um único chamador).
  const [aberto, setAberto] = useState(abertoInicial)
  const [assentados, setAssentados] = useState({})
  const semMovimento = useReducedMotion()
  const idBase = useId()

  if (import.meta.env.DEV && itemsInvalidos(itens)) {
    console.warn(
      'Acordeao: "itens" precisa ser um array de { id, titulo, conteudo } — verifique os dados passados.'
    )
  }

  function alternar(id) {
    setAssentados((atual) => {
      const proximo = { ...atual, [id]: false }
      if (aberto !== null && aberto !== id) proximo[aberto] = false
      return proximo
    })
    setAberto((atual) => (atual === id ? null : id))
  }

  const classeFinal = className ? `${estilos.acordeao} ${className}` : estilos.acordeao

  return (
    <div className={classeFinal}>
      {itens.map((item) => {
        const isOpen = aberto === item.id
        const idCabecalho = `${idBase}-cab-${item.id}`
        const idPainel = `${idBase}-painel-${item.id}`
        // Ausente em `assentados` = assentado (estado de repouso na
        // montagem, sem animação a concluir).
        const assentado = assentados[item.id] ?? true
        const visivel = isOpen || !assentado

        return (
          <div key={item.id} className={estilos.item}>
            <TituloTag className={estilos.cabecalhoTitulo}>
              <button
                type="button"
                id={idCabecalho}
                className={estilos.cabecalho}
                aria-expanded={isOpen}
                aria-controls={idPainel}
                onClick={() => alternar(item.id)}
              >
                <span className={estilos.pergunta}>{item.titulo}</span>
                <span
                  className={isOpen ? `${estilos.sinal} ${estilos.sinalAberto}` : estilos.sinal}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </TituloTag>
            <motion.div
              id={idPainel}
              aria-labelledby={idCabecalho}
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0 }}
              transition={{ duration: semMovimento ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() =>
                setAssentados((atual) => ({ ...atual, [item.id]: true }))
              }
              className={estilos.painel}
              style={{
                overflow: isOpen && assentado ? 'visible' : 'hidden',
                visibility: visivel ? 'visible' : 'hidden',
              }}
            >
              <div className={estilos.painelConteudo}>{item.conteudo}</div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

function itemsInvalidos(itens) {
  return (
    !Array.isArray(itens) ||
    itens.some(
      (item) =>
        !item ||
        item.id === undefined ||
        item.titulo === undefined ||
        item.conteudo === undefined
    )
  )
}
