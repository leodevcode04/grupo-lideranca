import { useRevelar } from '../../hooks/useRevelar.js'
import estilos from './Revelar.module.css'

export default function Revelar({
  children,
  atraso = 0,
  as: Tag = 'div',
  margem,
  className,
  style,
  ...resto
}) {
  const { ref, visivel } = useRevelar({ margem })

  const classeRevelar = visivel ? `${estilos.revelar} ${estilos.visivel}` : estilos.revelar
  const classeFinal = className ? `${classeRevelar} ${className}` : classeRevelar

  return (
    <Tag
      ref={ref}
      className={classeFinal}
      style={{ transitionDelay: `${atraso}ms`, ...style }}
      {...resto}
    >
      {children}
    </Tag>
  )
}
