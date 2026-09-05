import { useEffect, useId, useRef } from 'react'
import { motion } from 'framer-motion'
import estilos from './Abas.module.css'

// Ids compartilhados entre `Abas` (que renderiza os botões `role="tab"`) e
// quem renderiza os painéis (`role="tabpanel"`) — os dois vivem em
// componentes diferentes e precisam concordar em `aria-controls` /
// `aria-labelledby` sem se importar um ao outro. `idPrefixo` é a única
// costura: o chamador usa as mesmas duas funções para gerar os ids do lado
// do painel.
export function idAba(idPrefixo, id) {
  return `${idPrefixo}-aba-${id}`
}

export function idPainel(idPrefixo, id) {
  return `${idPrefixo}-painel-${id}`
}

// Peça de UI sem domínio: qualquer lista de `{ id, rotulo }` serve. Segue o
// padrão ARIA de abas com ativação automática — as setas movem o foco e a
// seleção juntos (`role="tablist"` no contêiner, `tabIndex` em rodízio, só a
// aba ativa é alcançável por Tab). O indicador dourado é um único
// `motion.span` com `layoutId` compartilhado: ele "pula" de botão em botão
// porque só é renderizado dentro do botão ativo a cada render, e o Framer
// anima a diferença de posição via FLIP (transform, não layout).
// `layoutId` é uma animação de layout — já coberta pelo
// `<MotionConfig reducedMotion="user">` do `main.jsx`, que desliga
// transformações e layout quando o usuário prefere menos movimento (ver
// "Nota sobre movimento reduzido" no plano). Nada a fazer aqui além disso.
//
// O que o chamador faz com `aoTrocar` (crossfade, `AnimatePresence`, etc.) é
// dele: esta primitiva não sabe e não deveria documentar a fiação de
// animação de quem a usa (Tarefa 12, 4.1).
export default function Abas({
  itens,
  ativo,
  aoTrocar,
  idPrefixo,
  className,
  ...resto
}) {
  const idBase = useId()
  const prefixo = idPrefixo || idBase
  const botoesRef = useRef({})
  const tablistRef = useRef(null)

  if (import.meta.env.DEV && itensInvalidos(itens)) {
    console.warn(
      'Abas: "itens" precisa ser um array de { id, rotulo } — verifique os dados passados.'
    )
  }

  // Rola a aba ativa para dentro da faixa na montagem e a cada troca (Tarefa
  // 12, 4.2): um link direto para uma aba distante (ex.: `?tipo=` no fim da
  // lista) abre com `scrollLeft: 0`, deixando a aba ativa inteiramente fora
  // da faixa visível no mobile, sem nada aparentando estar selecionado.
  useEffect(() => {
    botoesRef.current[ativo]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    })
  }, [ativo])

  // Poda refs de itens que saíram da lista, para não acumular indefinidamente
  // (Tarefa 12, 4.10).
  useEffect(() => {
    const idsAtuais = new Set(itens.map((item) => item.id))
    for (const id of Object.keys(botoesRef.current)) {
      if (!idsAtuais.has(id)) delete botoesRef.current[id]
    }
  }, [itens])

  function irPara(indice) {
    const item = itens[indice]
    aoTrocar(item.id)
    botoesRef.current[item.id]?.focus()
  }

  function aoTeclar(evento, indice) {
    const total = itens.length
    switch (evento.key) {
      case 'ArrowRight':
        evento.preventDefault()
        irPara((indice + 1) % total)
        return
      case 'ArrowLeft':
        evento.preventDefault()
        irPara((indice - 1 + total) % total)
        return
      case 'Home':
        evento.preventDefault()
        irPara(0)
        return
      case 'End':
        evento.preventDefault()
        irPara(total - 1)
        return
      default:
        return
    }
  }

  const classeFinal = className ? `${estilos.tablist} ${className}` : estilos.tablist

  return (
    <div role="tablist" ref={tablistRef} className={classeFinal} {...resto}>
      {itens.map((item, indice) => {
        const isAtivo = item.id === ativo
        return (
          <button
            key={item.id}
            ref={(el) => {
              botoesRef.current[item.id] = el
            }}
            type="button"
            role="tab"
            id={idAba(prefixo, item.id)}
            aria-selected={isAtivo}
            aria-controls={idPainel(prefixo, item.id)}
            tabIndex={isAtivo ? 0 : -1}
            className={estilos.tab}
            onClick={() => aoTrocar(item.id)}
            onKeyDown={(evento) => aoTeclar(evento, indice)}
          >
            {item.rotulo}
            {isAtivo && (
              <motion.span
                layoutId={`${idBase}-indicador`}
                className={estilos.indicador}
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

function itensInvalidos(itens) {
  return (
    !Array.isArray(itens) ||
    itens.some((item) => !item || item.id === undefined || item.rotulo === undefined)
  )
}
