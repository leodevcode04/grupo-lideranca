import Secao from '../ui/Secao.jsx'
import Botao from '../ui/Botao.jsx'
import { passos } from '../../dados/comoFunciona.js'
import estilos from './ComoFunciona.module.css'

export default function ComoFunciona() {
  return (
    <Secao id="como-funciona" etiqueta="Como funciona" titulo="Do orçamento à proteção ativa">
      <div className={estilos.trilha}>
        {passos.map((passo, indice) => (
          <div className={estilos.passo} key={passo.id}>
            <div className={estilos.marcador} aria-hidden="true">
              <span className={estilos.circulo}>{indice + 1}</span>
              {indice < passos.length - 1 && <span className={estilos.conector} />}
            </div>
            <div className={estilos.texto}>
              <h3 className={estilos.tituloPasso}>{passo.titulo}</h3>
              <p className={estilos.descricao}>{passo.texto}</p>
            </div>
          </div>
        ))}
      </div>
      <Botao para="/cotacao" variante="primario" className={estilos.cta}>
        Fazer cotação
      </Botao>
    </Secao>
  )
}
