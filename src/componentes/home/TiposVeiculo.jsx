import { Link } from 'react-router-dom'
import Secao from '../ui/Secao.jsx'
import Revelar from '../ui/Revelar.jsx'
import { veiculos } from '../../dados/veiculos.js'
import estilos from './TiposVeiculo.module.css'

export default function TiposVeiculo() {
  return (
    <Secao
      id="tipos-veiculo"
      etiqueta="Coberturas"
      titulo="Proteção para cada tipo de veículo"
    >
      <div className={estilos.grade}>
        {veiculos.map((veiculo, indice) => (
          <Revelar key={veiculo.id} as="div" atraso={indice * 90}>
            <Link to={`/beneficios?tipo=${veiculo.id}`} className={estilos.cartao}>
              <div
                className={estilos.foto}
                style={{ backgroundImage: `url(${veiculo.foto})` }}
                aria-hidden="true"
              />
              <div className={estilos.sobreposicao} aria-hidden="true" />
              <div className={estilos.texto}>
                <h3 className={estilos.nome}>{veiculo.nome}</h3>
                <p className={estilos.chamada}>{veiculo.chamada}</p>
                <span className={estilos.seta} aria-hidden="true">→</span>
              </div>
            </Link>
          </Revelar>
        ))}
      </div>
    </Secao>
  )
}
