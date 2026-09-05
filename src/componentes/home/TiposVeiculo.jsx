import { Link } from 'react-router-dom'
import Secao from '../ui/Secao.jsx'
import Revelar from '../ui/Revelar.jsx'
import { veiculos } from '../../dados/veiculos.js'
import estilos from './TiposVeiculo.module.css'

// Adiciona largura e formato à URL da Unsplash sem duplicar a query inteira
// por variante — usado para montar o srcset abaixo. Essas quatro fotos estão
// abaixo da dobra: ganham `loading="lazy"`, ao contrário da do Hero.
function comLargura(url, largura) {
  const u = new URL(url)
  u.searchParams.set('w', largura)
  u.searchParams.set('fm', 'webp')
  u.searchParams.set('auto', 'format')
  return u.toString()
}

export default function TiposVeiculo() {
  return (
    <Secao
      id="tipos-veiculo"
      fundo="profundo"
      ar="compacto"
      etiqueta="Coberturas"
      titulo="Proteção para cada tipo de veículo"
      className={estilos.medida}
    >
      <div className={estilos.grade}>
        {veiculos.map((veiculo, indice) => (
          <Revelar key={veiculo.id} as="div" atraso={indice * 90}>
            <Link to={`/beneficios?tipo=${veiculo.id}`} className={estilos.cartao}>
              <img
                className={estilos.foto}
                src={comLargura(veiculo.foto, 700)}
                srcSet={`${comLargura(veiculo.foto, 400)} 400w, ${comLargura(veiculo.foto, 700)} 700w, ${comLargura(veiculo.foto, 1000)} 1000w`}
                sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 25vw"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
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
