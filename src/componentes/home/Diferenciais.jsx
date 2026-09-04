import Secao from '../ui/Secao.jsx'
import Revelar from '../ui/Revelar.jsx'
import { diferenciais } from '../../dados/diferenciais.js'
import estilos from './Diferenciais.module.css'

export default function Diferenciais() {
  return (
    <Secao id="diferenciais" fundo="profundo" etiqueta="Por que o Grupo Liderança">
      <div className={estilos.grade}>
        {diferenciais.map((item, indice) => (
          <Revelar
            key={item.id}
            as="article"
            atraso={indice * 90}
            className={estilos.item}
          >
            <span className={estilos.numeral} aria-hidden="true">
              {String(indice + 1).padStart(2, '0')}
            </span>
            <h3 className={estilos.titulo}>{item.titulo}</h3>
            <p className={estilos.texto}>{item.texto}</p>
          </Revelar>
        ))}
      </div>
    </Secao>
  )
}
