import estilos from './Estrelas.module.css'

const ICONES = [0, 1, 2, 3, 4]

function IconeEstrela({ preenchida }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      className={preenchida ? estilos.preenchida : estilos.vazia}
    >
      <path
        fill="currentColor"
        d="M12 2.5l2.9 6.05 6.6.79-4.86 4.6 1.28 6.56L12 17.4l-5.92 3.1 1.28-6.56-4.86-4.6 6.6-.79z"
      />
    </svg>
  )
}

export default function Estrelas({ nota = 5 }) {
  const notaNormalizada = Math.max(0, Math.min(5, Math.round(nota)))

  return (
    <span
      className={estilos.estrelas}
      role="img"
      aria-label={`${notaNormalizada} de 5 estrelas`}
    >
      {ICONES.map((indice) => (
        <IconeEstrela key={indice} preenchida={indice < notaNormalizada} />
      ))}
    </span>
  )
}
