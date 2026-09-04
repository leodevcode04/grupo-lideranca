import { Link } from 'react-router-dom'
import estilos from './Botao.module.css'

export default function Botao({
  variante = 'primario',
  para,
  href,
  tipo,
  desabilitado = false,
  className,
  children,
  ...resto
}) {
  if (import.meta.env.DEV && !estilos[variante]) {
    console.warn(`Botao: variante "${variante}" não existe — usando "primario".`)
  }

  const classeBase = `${estilos.botao} ${estilos[variante] ?? estilos.primario}`
  const classeFinal = className ? `${classeBase} ${className}` : classeBase

  // Precedência: para > href > <button> — link interno é o caso mais comum de CTA
  // no site, então ganha quando mais de uma prop é passada por engano. `onClick`
  // não participa dessa escolha: cai em `...resto` e é repassado ao elemento que
  // for renderizado, qualquer que seja.
  if (para) {
    return (
      <Link to={para} className={classeFinal} {...resto}>
        {children}
      </Link>
    )
  }

  if (href) {
    const externo = /^https?:/i.test(href)
    return (
      <a
        href={href}
        className={classeFinal}
        {...(externo ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...resto}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={tipo ?? 'button'}
      disabled={desabilitado}
      className={classeFinal}
      {...resto}
    >
      {children}
    </button>
  )
}
