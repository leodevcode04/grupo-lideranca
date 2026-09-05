import { useId, useRef } from 'react'
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
// padrão ARIA de abas com ativação automática — Esquerda/Direita movem o
// foco e a seleção juntos (`role="tablist"` no contêiner, `tabIndex` em
// rodízio, só a aba ativa é alcançável por Tab). O indicador dourado é um
// único `motion.span` com `layoutId` compartilhado: ele "pula" de botão em
// botão porque só é renderizado dentro do botão ativo a cada render, e o
// Framer anima a diferença de posição via FLIP (transform, não layout).
// `layoutId` é uma animação de layout — já coberta pelo
// `<MotionConfig reducedMotion="user">` do `main.jsx`, que desliga
// transformações e layout quando o usuário prefere menos movimento (ver
// "Nota sobre movimento reduzido" no plano). Nada a fazer aqui além disso.
export default function Abas({
  itens,
  ativo,
  aoTrocar,
  idPrefixo = 'abas',
  className,
  ...resto
}) {
  const idBase = useId()
  const prefixo = idPrefixo || idBase
  const botoesRef = useRef({})

  if (import.meta.env.DEV && itensInvalidos(itens)) {
    console.warn(
      'Abas: "itens" precisa ser um array de { id, rotulo } — verifique os dados passados.'
    )
  }

  // Ativação automática (a seta já troca a seleção, não só o foco): a opção
  // certa para painéis baratos como os desta página — mover e escolher no
  // mesmo gesto é o padrão ARIA recomendado quando trocar de aba é barato.
  // Cada tecla dispara uma troca (e portanto um crossfade) por vez; seguurar
  // a seta (key repeat do SO) encadeia vários, mas o `AnimatePresence` do
  // painel absorve isso naturalmente — uma troca nova interrompe a
  // animação de saída em andamento em vez de empilhar.
  function aoTeclar(evento, indice) {
    if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return
    evento.preventDefault()
    const total = itens.length
    const proximo =
      evento.key === 'ArrowRight' ? (indice + 1) % total : (indice - 1 + total) % total
    const item = itens[proximo]
    aoTrocar(item.id)
    botoesRef.current[item.id]?.focus()
  }

  const classeFinal = className ? `${estilos.tablist} ${className}` : estilos.tablist

  return (
    <div role="tablist" className={classeFinal} {...resto}>
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
