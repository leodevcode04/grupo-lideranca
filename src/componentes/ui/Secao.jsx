import { useEffect, useRef } from 'react'
import Revelar from './Revelar.jsx'
import Etiqueta from './Etiqueta.jsx'
import estilos from './Secao.module.css'

export default function Secao({
  id,
  etiqueta,
  titulo,
  subtitulo,
  fundo = 'noite',
  ar = 'padrao',
  centralizado = false,
  // Encaixe de decoração (Tarefa 8, 7.6): renderizado atrás de um container
  // sempre elevado, para o padrão "decoração ao fundo, conteúdo por cima"
  // existir uma vez em `Secao` em vez de cada chamador reimplementar o
  // próprio `:global(.container) { z-index: 1 }`.
  decoracao,
  className,
  children,
  ...resto
}) {
  const temCabecalho = etiqueta || titulo || subtitulo
  const idTitulo = id && titulo ? `${id}-titulo` : undefined
  const secaoRef = useRef(null)

  // Etiqueta sem título faz o `<h2>` não ser emitido: os `<h3>` dos filhos se
  // penduram no `<h2>` da seção anterior no sumário de títulos, e a seção
  // fica sem `aria-labelledby` resolvido (undefined). Ver Tarefa 7, 6.2.
  if (import.meta.env.DEV && etiqueta && !titulo) {
    console.warn(
      `Secao: etiqueta "${etiqueta}" sem "titulo" — a seção não emite <h2> e fica sem nome acessível.`
    )
  }

  // `.centralizado` sobrescreve `--secao-medida` em silêncio (max-width:720px
  // fixo), então uma `--secao-medida` declarada pelo chamador vira letra
  // morta sem aviso — foi exatamente o caso do `CtaFinal` (Tarefa 7, 6.6 /
  // Tarefa 8, 7.6). Medido via `getComputedStyle` em vez de inspecionar
  // `className` porque `--secao-medida` é herdada de uma classe do módulo do
  // chamador, que `Secao` não tem como ler estaticamente.
  useEffect(() => {
    if (!import.meta.env.DEV || !centralizado) return
    const el = secaoRef.current
    if (!el) return
    const valor = getComputedStyle(el).getPropertyValue('--secao-medida').trim()
    if (valor) {
      console.warn(
        `Secao: "centralizado" e "--secao-medida" (${valor}) foram usados juntos — .centralizado sobrescreve a medida em silêncio.`
      )
    }
  }, [centralizado])

  const classeBase = `${estilos.secao} ${estilos[fundo] ?? estilos.noite} ${estilos[ar] ?? estilos.padrao} ${decoracao ? estilos.temDecoracao : ''}`
  const classeFinal = className ? `${classeBase} ${className}` : classeBase

  return (
    <section id={id} className={classeFinal} aria-labelledby={idTitulo} ref={secaoRef} {...resto}>
      {decoracao && (
        <div className={estilos.decoracao} aria-hidden="true">
          {decoracao}
        </div>
      )}
      <div className={`container ${estilos.container}`}>
        {temCabecalho && (
          <Revelar
            as="div"
            className={`${estilos.cabecalho} ${centralizado ? estilos.centralizado : ''}`}
          >
            {etiqueta && <Etiqueta>{etiqueta}</Etiqueta>}
            {titulo && (
              <h2 id={idTitulo} className={estilos.titulo}>
                {titulo}
              </h2>
            )}
            {subtitulo && <p className={estilos.subtitulo}>{subtitulo}</p>}
          </Revelar>
        )}
        {children}
      </div>
    </section>
  )
}
