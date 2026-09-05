import Wizard from '../componentes/cotacao/Wizard.jsx'
import estilos from './Cotacao.module.css'

export default function Cotacao() {
  return (
    <div className={`container ${estilos.pagina}`}>
      <Wizard />
    </div>
  )
}
