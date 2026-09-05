import Secao from '../ui/Secao.jsx'
import Botao from '../ui/Botao.jsx'
import Revelar from '../ui/Revelar.jsx'
import { passos } from '../../dados/comoFunciona.js'
import estilos from './ComoFunciona.module.css'

export default function ComoFunciona() {
  return (
    <Secao
      id="como-funciona"
      fundo="profundo"
      etiqueta="Como funciona"
      titulo="Do orçamento à proteção ativa"
      className={estilos.medida}
    >
      <div className={estilos.trilha}>
        {passos.map((passo, indice) => (
          <Revelar
            as="div"
            key={passo.id}
            atraso={indice * 90}
            className={estilos.passo}
          >
            <div className={estilos.marcador} aria-hidden="true">
              <span className={estilos.circulo}>{indice + 1}</span>
              {indice < passos.length - 1 && <span className={estilos.conector} />}
            </div>
            <div className={estilos.texto}>
              <h3 className={estilos.tituloPasso}>{passo.titulo}</h3>
              <p className={estilos.descricao}>{passo.texto}</p>
            </div>
          </Revelar>
        ))}
      </div>
      <Botao para="/cotacao" variante="primario" className={estilos.cta}>
        Fazer cotação
      </Botao>
    </Secao>
  )
}
