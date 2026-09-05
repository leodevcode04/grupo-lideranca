import estilos from './BarraProgresso.module.css'

// Trilho + rótulos da progressão do wizard. `etapas` são os rótulos (uma
// string por etapa) e `atual` é o índice da etapa corrente — a mesma dupla
// que o `Wizard` já mantém no estado, sem recalcular nada aqui.
export default function BarraProgresso({ etapas, atual }) {
  // Piso mínimo (Tarefa 10, 8.14): sem ele a etapa 0 mostra um trilho de 2px
  // a 10% de branco com preenchimento zero, o que não comunica progresso
  // nenhum — só ausência de conteúdo.
  const fracao = Math.max(atual / (etapas.length - 1), 0.06)

  return (
    <div className={estilos.barra}>
      <p className={estilos.mobile}>
        Etapa {atual + 1} de {etapas.length}
      </p>

      <ol className={estilos.rotulos} aria-hidden="true">
        {etapas.map((rotulo, indice) => (
          <li
            key={rotulo}
            className={`${estilos.rotulo} ${
              indice === atual
                ? estilos.atual
                : indice < atual
                  ? estilos.concluido
                  : estilos.futuro
            }`}
          >
            {rotulo}
          </li>
        ))}
      </ol>

      <div
        className={estilos.trilho}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={etapas.length}
        aria-valuenow={atual + 1}
        aria-valuetext={`Etapa ${atual + 1} de ${etapas.length}: ${etapas[atual]}`}
      >
        <div
          className={estilos.preenchimento}
          style={{ transform: `scaleX(${fracao})` }}
        />
      </div>
    </div>
  )
}
