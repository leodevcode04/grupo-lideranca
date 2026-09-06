import { useId } from 'react'
import { comLargura } from '../../utils/imagem.js'
import Etiqueta from './Etiqueta.jsx'
import Revelar from './Revelar.jsx'
import estilos from './Cabecalho.module.css'

// Cabeçalho interno das páginas — Quem Somos, Unidades, Blog, Contato e
// Benefícios (retrofit da Tarefa 12) o usam. Mesmo tratamento de foto e
// gradiente do Hero (Tarefa 6), mas mais contido (~55vh, não a tela
// inteira): dá unidade visual às páginas internas sem repetir código nelas.
//
// Sem `foto`, o cabeçalho ainda ocupa a mesma faixa e mantém a mesma folga
// de header, só sem a imagem de fundo — usado por páginas cujo assunto não
// tem uma foto que faça sentido (não há consumidor assim hoje, mas a prop é
// opcional por contrato, não por acidente).
export default function Cabecalho({ etiqueta, titulo, texto, foto }) {
  // `useId` (não um id fixo): dois `Cabecalho` na mesma página duplicariam o
  // id — mesma forma que a correção 4.10 apontou no `Abas` (revisão, 8.12).
  const idTitulo = useId()

  return (
    <header className={`${estilos.cabecalho} grao`}>
      {foto && (
        <img
          className={estilos.foto}
          src={comLargura(foto, 1600)}
          srcSet={`${comLargura(foto, 700)} 700w, ${comLargura(foto, 1200)} 1200w, ${comLargura(foto, 1600)} 1600w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          // Acima da dobra em todo tamanho — é o LCP desta página, não pode
          // ser lazy (mesmo raciocínio do Hero, Tarefa 6, e da correção 4.7
          // da Tarefa 12 para a foto de Benefícios).
          fetchpriority="high"
          decoding="async"
        />
      )}
      <div className={estilos.leitura} aria-hidden="true" />

      <div className={`container ${estilos.wrapper}`}>
        <Revelar as="div" className={estilos.conteudo}>
          {etiqueta && <Etiqueta>{etiqueta}</Etiqueta>}
          <h1 id={idTitulo} className={estilos.titulo}>
            {titulo}
          </h1>
          {texto && <p className={estilos.texto}>{texto}</p>}
        </Revelar>
      </div>
    </header>
  )
}
