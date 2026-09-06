import Cabecalho from '../componentes/ui/Cabecalho.jsx'
import Secao from '../componentes/ui/Secao.jsx'
import Botao from '../componentes/ui/Botao.jsx'
import Revelar from '../componentes/ui/Revelar.jsx'
import FaixaNumeros from '../componentes/ui/FaixaNumeros.jsx'
import { numeros } from '../dados/numeros.js'
import { textoInstitucional, compromissos, marcos } from '../dados/quemSomos.js'
import { FOTO_QUEM_SOMOS } from '../dados/cabecalhos.js'
import estilos from './QuemSomos.module.css'

export default function QuemSomos() {
  return (
    <>
      <Cabecalho
        etiqueta="Quem somos"
        titulo="Uma associação feita para proteger, não para complicar"
        texto="Conheça a história do Grupo Liderança e o que nos trouxe até aqui."
        foto={FOTO_QUEM_SOMOS}
      />

      <Secao
        id="institucional"
        fundo="noite"
        ar="padrao"
        etiqueta="Nossa história"
        titulo="Quase uma década cuidando de quem confia na gente"
        className={estilos.medidaInstitucional}
      >
        <div className={estilos.colunas}>
          <div className={estilos.textoLongo}>
            {textoInstitucional.map((paragrafo, indice) => (
              <p key={indice}>{paragrafo}</p>
            ))}
          </div>
          <ul className={estilos.compromissos}>
            {compromissos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <FaixaNumeros itens={numeros} className={estilos.faixa} />
      </Secao>

      <Secao
        id="trajetoria"
        fundo="elevado"
        ar="padrao"
        etiqueta="Linha do tempo"
        titulo="Nossa trajetória"
      >
        <ol className={estilos.linha}>
          {marcos.map((marco, indice) => (
            <Revelar key={marco.id} as="li" atraso={indice * 90} className={estilos.marco}>
              <time className={estilos.ano} dateTime={marco.ano}>
                {marco.ano}
              </time>
              <div className={estilos.marcoConteudo}>
                <h3 className={estilos.marcoTitulo}>{marco.titulo}</h3>
                <p className={estilos.marcoTexto}>{marco.texto}</p>
              </div>
            </Revelar>
          ))}
        </ol>
      </Secao>

      <Secao
        id="quem-somos-cta"
        fundo="profundo"
        ar="amplo"
        centralizado
        etiqueta="Faça parte"
        titulo="Venha para o Grupo Liderança"
      >
        <div className={estilos.ctaConteudo}>
          <p className={estilos.ctaTexto}>
            Simule agora mesmo e descubra o quanto sua proteção veicular pode custar.
          </p>
          <div className={estilos.ctaBotoes}>
            <Botao para="/cotacao" variante="primario">
              Fazer cotação
            </Botao>
            <Botao para="/unidades" variante="contorno">
              Ver unidades
            </Botao>
          </div>
        </div>
      </Secao>
    </>
  )
}
