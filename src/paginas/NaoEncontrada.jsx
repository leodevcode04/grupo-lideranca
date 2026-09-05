import Botao from '../componentes/ui/Botao.jsx'
import estilos from './NaoEncontrada.module.css'

// Sem `Cabecalho` aqui: uma página de erro não é conteúdo institucional com
// foto de 55vh — é feedback, e precisa se ler como tal (decisão de projeto,
// Tarefa 13). O "404" gigante em baixa opacidade cumpre o mesmo papel
// decorativo que a foto cumpre nas outras páginas, sem competir com a
// mensagem.
export default function NaoEncontrada() {
  return (
    <div className={`container ${estilos.pagina}`}>
      <span className={estilos.numero} aria-hidden="true">
        404
      </span>
      <div className={estilos.conteudo}>
        <h1 className={estilos.titulo}>Página não encontrada</h1>
        <p className={estilos.texto}>
          O endereço que você tentou acessar não existe ou foi movido. Volte para o início ou
          simule uma cotação.
        </p>
        <div className={estilos.botoes}>
          <Botao para="/" variante="primario">
            Voltar ao início
          </Botao>
          <Botao para="/cotacao" variante="contorno">
            Fazer cotação
          </Botao>
        </div>
      </div>
    </div>
  )
}
