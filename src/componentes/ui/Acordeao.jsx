import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Revelar from './Revelar.jsx'
import estilos from './Acordeao.module.css'

// Peça de UI sem domínio: qualquer lista de `{ id, pergunta, resposta }`
// serve. Um item aberto por vez — abrir um fecha o outro, mas cada item
// anima sua própria altura de forma independente (dois `motion.div`
// distintos, cada um só reage à própria prop `isOpen`), então não há duas
// animações competindo pelo mesmo elemento.
//
// `height: 'auto'` é a armadilha clássica de acordeão: o Framer mede o
// valor de destino e anima até ele, e ao terminar deixa o estilo como
// `height: 'auto'` de verdade (não um pixel congelado) — por isso um
// resize com o painel aberto e em repouso continua correto. O risco real
// é composto por dois cuidados que este componente toma:
//   1. `overflow: hidden` fica ligado durante toda a animação (senão o
//      conteúdo vaza da caixa que ainda está crescendo/encolhendo), e só
//      volta a `visible` depois que a abertura termina de verdade
//      (`onAnimationComplete`) — isso é o que salva o anel de foco de um
//      link dentro da resposta caso um dia seja adicionado: hoje as
//      respostas são texto puro, então nada foca ali, mas se um link
//      entrar, o foco não fica cortado enquanto o painel está assentado.
//   2. `alternar` zera esse estado "assentado" a cada clique, antes de
//      trocar `aberto` — sem isso, reabrir um item que já tinha ficado
//      assentado uma vez deixaria `overflow: visible` ligado desde o
//      primeiro quadro da nova animação, e o conteúdo vazaria da caixa
//      enquanto ela ainda estava crescendo.
export default function Acordeao({ itens, abertoInicial = null, tituloComo: TituloTag = 'h3', className }) {
  const [aberto, setAberto] = useState(abertoInicial)
  const [assentado, setAssentado] = useState(abertoInicial)
  const semMovimento = useReducedMotion()
  const idBase = useId()

  function alternar(id) {
    setAssentado(null)
    setAberto((atual) => (atual === id ? null : id))
  }

  const classeFinal = className ? `${estilos.acordeao} ${className}` : estilos.acordeao

  return (
    <div className={classeFinal}>
      {itens.map((item, indice) => {
        const isOpen = aberto === item.id
        const idCabecalho = `${idBase}-cab-${item.id}`
        const idPainel = `${idBase}-painel-${item.id}`
        const painelAssentado = isOpen && assentado === item.id

        // Atraso por índice, não um único Revelar em volta do acordeão
        // inteiro: com dez perguntas o bloco passa fácil dos ~5,9 viewports
        // em que o `threshold: 0` do `useRevelar` ainda dispara numa tela
        // baixa, e o acordeão inteiro ficaria em opacity:0 permanente. Ver
        // Tarefa 3, passo 1.
        return (
          <Revelar key={item.id} as="div" atraso={indice * 90} className={estilos.item}>
            <TituloTag className={estilos.cabecalhoTitulo}>
              <button
                type="button"
                id={idCabecalho}
                className={estilos.cabecalho}
                aria-expanded={isOpen}
                aria-controls={idPainel}
                onClick={() => alternar(item.id)}
              >
                <span className={estilos.pergunta}>{item.pergunta}</span>
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
              role="region"
              aria-labelledby={idCabecalho}
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0 }}
              transition={{ duration: semMovimento ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => {
                if (isOpen) setAssentado(item.id)
              }}
              className={estilos.painel}
              style={{ overflow: painelAssentado ? 'visible' : 'hidden' }}
            >
              <div className={estilos.painelConteudo}>
                <p className={estilos.resposta}>{item.resposta}</p>
              </div>
            </motion.div>
          </Revelar>
        )
      })}
    </div>
  )
}
