import Revelar from './Revelar.jsx'
import Etiqueta from './Etiqueta.jsx'
import estilos from './Secao.module.css'

export default function Secao({
  id,
  etiqueta,
  titulo,
  subtitulo,
  fundo = 'noite',
  centralizado = false,
  className,
  children,
  ...resto
}) {
  const temCabecalho = etiqueta || titulo || subtitulo
  const idTitulo = id && titulo ? `${id}-titulo` : undefined

  const classeBase = `${estilos.secao} ${estilos[fundo] ?? estilos.noite}`
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
