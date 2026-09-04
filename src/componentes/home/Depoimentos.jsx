import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Secao from '../ui/Secao.jsx'
import Estrelas from '../ui/Estrelas.jsx'
import { depoimentos } from '../../dados/depoimentos.js'
import estilos from './Depoimentos.module.css'

const INTERVALO_MS = 7000

export default function Depoimentos() {
  const semMovimento = useReducedMotion()
  const total = depoimentos.length

  const [indice, setIndice] = useState(0)
  // `pausado` junta hover, foco e o botão manual num único interruptor —
  // qualquer um dos três basta para parar o avanço automático. Cobre mouse
  // (hover), teclado (foco entra em algum controle do carrossel) e toque
  // (não dispara hover de forma confiável, então o botão é o mecanismo
  // garantido — WCAG 2.2.2 exige uma forma de pausar que não dependa de
  // hover).
  const [pausadoHover, setPausadoHover] = useState(false)
  const [pausadoFoco, setPausadoFoco] = useState(false)
  const [pausadoManual, setPausadoManual] = useState(false)

  const pausado = pausadoHover || pausadoFoco || pausadoManual

  function irPara(novoIndice) {
    setIndice((novoIndice + total) % total)
  }

  const avancar = useCallback(() => {
    setIndice((atual) => (atual + 1) % total)
  }, [total])

  const voltar = useCallback(() => {
    setIndice((atual) => (atual - 1 + total) % total)
  }, [total])

  // Avanço automático via `setTimeout` reagendado a cada troca de `indice`
  // (não `setInterval`): clicar numa bolinha muda `indice` diretamente para
  // o valor absoluto desejado, o que cancela este efeito (cleanup do
  // `useEffect` anterior) e agenda um novo temporizador — o relógio do
  // auto-avanço reinicia sozinho, sem avanço duplo e sem estado travado,
  // porque só existe um timer vivo por vez e ele nunca soma incrementos
  // relativos ao `indice` anterior.
  useEffect(() => {
    if (semMovimento || pausado) return undefined
    const id = setTimeout(avancar, INTERVALO_MS)
    return () => clearTimeout(id)
  }, [indice, pausado, semMovimento, avancar])

  const atual = depoimentos[indice]

  return (
    <Secao
      id="depoimentos"
      fundo="elevado"
      etiqueta="Quem já é associado"
      titulo="Depoimentos"
    >
      <div
        className={estilos.carrossel}
        role="group"
        aria-roledescription="carrossel"
        aria-label="Depoimentos de associados"
        onMouseEnter={() => setPausadoHover(true)}
        onMouseLeave={() => setPausadoHover(false)}
        onFocus={() => setPausadoFoco(true)}
        onBlur={(evento) => {
          if (!evento.currentTarget.contains(evento.relatedTarget)) {
            setPausadoFoco(false)
          }
        }}
      >
        <span className={estilos.aspa} aria-hidden="true">
          “
        </span>

        {/* `aria-live` fica no `.palco`, que nunca desmonta — é o container
            estável que o leitor de tela observa. O `<motion.figure>` de
            dentro entra e sai por `key`; se o `aria-live` estivesse nele,
            o próprio nó anunciado desapareceria a cada troca em vez de
            apenas ter seu conteúdo atualizado. */}
        <div className={estilos.palco} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={atual.id}
              className={estilos.slide}
              initial={{ opacity: semMovimento ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: semMovimento ? 1 : 0 }}
              transition={{ duration: semMovimento ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Estrelas nota={atual.nota} />
              <blockquote className={estilos.texto}>{atual.texto}</blockquote>
              <figcaption className={estilos.assinatura}>
                <span className={estilos.nome}>{atual.nome}</span>
                <span className={estilos.cidade}>{atual.cidade}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className={estilos.controles}>
          <button
            type="button"
            className={estilos.seta}
            onClick={voltar}
            aria-label="Depoimento anterior"
          >
            ←
          </button>

          <div className={estilos.pontos} aria-label="Escolher depoimento">
            {depoimentos.map((depoimento, i) => (
              <button
                key={depoimento.id}
                type="button"
                className={`${estilos.ponto} ${i === indice ? estilos.pontoAtivo : ''}`}
                aria-current={i === indice ? 'true' : undefined}
                aria-label={`Ver depoimento de ${depoimento.nome}`}
                onClick={() => irPara(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className={estilos.seta}
            onClick={avancar}
            aria-label="Próximo depoimento"
          >
            →
          </button>

          <button
            type="button"
            className={estilos.pausa}
            onClick={() => setPausadoManual((valor) => !valor)}
            aria-pressed={pausadoManual}
            aria-label={pausadoManual ? 'Retomar avanço automático' : 'Pausar avanço automático'}
          >
            {pausadoManual ? '▶' : '❚❚'}
          </button>
        </div>
      </div>
    </Secao>
  )
}
