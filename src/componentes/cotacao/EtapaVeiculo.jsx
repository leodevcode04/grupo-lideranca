import { veiculos } from '../../dados/veiculos.js'
import estilosEtapa from './etapa.module.css'
import estilos from './EtapaVeiculo.module.css'

// Etapa 1: escolha do tipo de veículo. Cada card é um <button> — não uma
// navegação (diferente dos cards de `TiposVeiculo` na home, que são `Link`),
// então precisa ser operável por teclado como qualquer outro controle: Tab
// alcança o card e Enter/Espaço ativam o clique nativamente por ser um
// <button>, sem handler de tecla extra.
export default function EtapaVeiculo({ tipoSelecionado, aoEscolher }) {
  return (
    <div>
      <h2 tabIndex={-1} className={estilosEtapa.titulo}>
        Qual veículo você quer proteger?
      </h2>
      <div className={`${estilosEtapa.grade} ${estilos.grade}`}>
        {veiculos.map((veiculo) => {
          const selecionado = veiculo.id === tipoSelecionado
          return (
            <button
              key={veiculo.id}
              type="button"
              className={`${estilos.card} ${selecionado ? estilos.selecionado : ''}`}
              aria-pressed={selecionado}
              onClick={() => aoEscolher(veiculo.id)}
            >
              <img
                src={`${veiculo.foto}&fm=webp&auto=format`}
                srcSet={`${veiculo.foto}&fm=webp&auto=format&w=400 400w, ${veiculo.foto}&fm=webp&auto=format&w=800 800w`}
                sizes="(max-width: 640px) 90vw, 280px"
                alt=""
                loading="lazy"
                className={estilos.foto}
              />
              <div className={estilos.texto}>
                <h3 className={estilos.nome}>{veiculo.nome}</h3>
                <p className={estilos.chamada}>{veiculo.chamada}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
