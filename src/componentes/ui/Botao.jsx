import { Link } from 'react-router-dom'
import estilos from './Botao.module.css'

export default function Botao({
  variante = 'primario',
  para,
  href,
  onClick,
  tipo,
  desabilitado = false,
  children,
  ...resto
}) {
  const className = `${estilos.botao} ${estilos[variante] ?? estilos.primario}`

  // Precedência: para > href > onClick/tipo — link interno é o caso mais comum
  // de CTA no site, então ganha quando mais de uma prop é passada por engano.
  if (para) {
    if (desabilitado) {
      // Link/`<a>` não têm estado `disabled` nativo: renderiza um `<span>` com a
      // aparência do botão desabilitado, focável e anunciado como tal, em vez de
      // um link clicável que finge estar bloqueado.
      return (
        <span
          className={`${className} ${estilos.desabilitado}`}
          role="link"
          aria-disabled="true"
          tabIndex={0}
          {...resto}
        >
          {children}
        </span>
      )
    }
    return (
      <Link to={para} className={className} {...resto}>
        {children}
      </Link>
    )
  }

  if (href) {
    if (desabilitado) {
      return (
        <span
          className={`${className} ${estilos.desabilitado}`}
          role="link"
          aria-disabled="true"
          tabIndex={0}
          {...resto}
        >
          {children}
        </span>
      )
    }
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} {...resto}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={tipo ?? 'button'}
      onClick={onClick}
      disabled={desabilitado}
      className={className}
      {...resto}
    >
      {children}
    </button>
  )
}
