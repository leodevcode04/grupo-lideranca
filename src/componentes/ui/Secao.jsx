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
  className,
  children,
  ...resto
}) {
  const temCabecalho = etiqueta || titulo || subtitulo
  const idTitulo = id && titulo ? `${id}-titulo` : undefined

  // Etiqueta sem título faz o `<h2>` não ser emitido: os `<h3>` dos filhos se
  // penduram no `<h2>` da seção anterior no sumário de títulos, e a seção
  // fica sem `aria-labelledby` resolvido (undefined). Ver Tarefa 7, 6.2.
  if (import.meta.env.DEV && etiqueta && !titulo) {
    console.warn(
      `Secao: etiqueta "${etiqueta}" sem "titulo" — a seção não emite <h2> e fica sem nome acessível.`
    )
  }

  const classeBase = `${estilos.secao} ${estilos[fundo] ?? estilos.noite} ${estilos[ar] ?? estilos.padrao}`
  const classeFinal = className ? `${classeBase} ${className}` : classeBase

  return (
    <section
      id={id}
      className={classeFinal}
      aria-labelledby={idTitulo}
      {...resto}
    >
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
