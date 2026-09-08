import claraUrl from '../../assets/marca/logo-clara.png'
import escuraUrl from '../../assets/marca/logo-escura.png'
import estilos from './Logo.module.css'

// Lockup horizontal da marca. Antes disto o wordmark era texto em Fraunces
// copiado em Header, Footer e MenuMobile — trocar por imagem nos tres lugares
// repetiria a mesma duplicacao, entao vive aqui.
//
// Duas variantes porque o lockup nao e recolorivel por CSS: o simbolo tem
// cinco cores proprias. `clara` traz o texto em branco (para o azul-noite do
// cabecalho, rodape e menu); `escura` traz o azul da marca, para fundos claros.
//
// As dimensoes intrinsecas ficam nos atributos width/height para o navegador
// reservar o espaco antes de baixar o arquivo. A altura real vem do CSS de
// quem chama; a largura acompanha por `width: auto`.
const FONTES = { clara: claraUrl, escura: escuraUrl }

const LARGURA = 600
const ALTURA = 157

export default function Logo({ variante = 'clara', alt = 'Grupo Liderança — Proteção Veicular', className = '' }) {
  if (import.meta.env.DEV && !FONTES[variante]) {
    console.warn(`Logo: variante "${variante}" nao existe. Use "clara" ou "escura".`)
  }

  // alt vazio = uso decorativo, quando o nome da marca ja esta acessivel por
  // perto (o rodape, por exemplo, repete o cabecalho na mesma pagina).
  const decorativa = alt === ''

  return (
    <img
      src={FONTES[variante] ?? claraUrl}
      width={LARGURA}
      height={ALTURA}
      alt={alt}
      aria-hidden={decorativa || undefined}
      className={`${estilos.logo} ${className}`.trim()}
      draggable="false"
    />
  )
}
