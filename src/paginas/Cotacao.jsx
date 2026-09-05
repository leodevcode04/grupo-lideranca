import Wizard from '../componentes/cotacao/Wizard.jsx'
import estilos from './Cotacao.module.css'

export default function Cotacao() {
  return (
    <div className={`container ${estilos.pagina}`}>
      {/* Regressão da Tarefa 10 (8.7): a página estava sem `<h1>` — todas as
          outras rotas têm um, e o primeiro título que sobrava era o `<h2>`
          da etapa. A linha abaixo dele preenche a lacuna de conteúdo que a
          revisão apontou: uma associação que pede o valor do veículo e,
          duas etapas depois, um telefone, precisa de uma linha de
          tranquilização antes da barra de progresso — o que é isto, quanto
          tempo leva, que é simulação sem compromisso — não só na etapa 4,
          quando a ansiedade do telefone já passou (é na etapa 3 que ela
          aparece). */}
      <h1 className={estilos.titulo}>Cotação em poucos passos</h1>
      <p className={estilos.subtitulo}>
        Leva menos de dois minutos: escolha o veículo, informe alguns dados e receba uma
        simulação sem compromisso.
      </p>
      <Wizard />
    </div>
  )
}
