import estilos from './Etiqueta.module.css'

// Rótulo com filete dourado usado no cabeçalho de `Secao` e no `Hero`. Peça de
// UI sem domínio: recebe só o texto e, opcionalmente, a tag e as props do
// elemento raiz — quem anima (Framer, no Hero) embrulha por fora.
export default function Etiqueta({ children, as: Tag = 'p', className, ...resto }) {
  const classeFinal = className ? `${estilos.etiqueta} ${className}` : estilos.etiqueta

  return (
    <Tag className={classeFinal} {...resto}>
      <span className={estilos.filete} aria-hidden="true" />
      {children}
    </Tag>
  )
}
