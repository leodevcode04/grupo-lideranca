import Revelar from './Revelar.jsx'
import estilos from './Secao.module.css'

export default function Secao({
  id,
  etiqueta,
  titulo,
  subtitulo,
  fundo = 'noite',
  centralizado = false,
  children,
}) {
  const temCabecalho = etiqueta || titulo || subtitulo

  return (
    <section id={id} className={`${estilos.secao} ${estilos[fundo] ?? estilos.noite}`}>
      <div className={`container ${estilos.container}`}>
        {temCabecalho && (
          <Revelar
            as="div"
            className={`${estilos.cabecalho} ${centralizado ? estilos.centralizado : ''}`}
          >
            {etiqueta && (
              <p className={estilos.etiqueta}>
                <span className={estilos.filete} aria-hidden="true" />
                {etiqueta}
              </p>
            )}
            {titulo && <h2 className={estilos.titulo}>{titulo}</h2>}
            {subtitulo && <p className={estilos.subtitulo}>{subtitulo}</p>}
          </Revelar>
        )}
        {children}
      </div>
    </section>
  )
}
