import Secao from '../ui/Secao.jsx'
import Revelar from '../ui/Revelar.jsx'
import { diferenciais } from '../../dados/diferenciais.js'
import estilos from './Diferenciais.module.css'

export default function Diferenciais() {
  return (
    <Secao
      id="diferenciais"
      fundo="noite"
      ar="amplo"
      etiqueta="Por que o Grupo Liderança"
      titulo="O que muda quando você é associado"
      className={`${estilos.medida} ${estilos.assimetrico}`}
    >
      <div className={estilos.grade}>
        {diferenciais.map((item, indice) => (
          <Revelar
            key={item.id}
            as="article"
            atraso={indice * 90}
            className={estilos.item}
          >
            <h3 className={estilos.titulo}>{item.titulo}</h3>
            <p className={estilos.texto}>{item.texto}</p>
          </Revelar>
        ))}
      </div>
    </Secao>
  )
}
