import Secao from '../ui/Secao.jsx'
import Botao from '../ui/Botao.jsx'
import Revelar from '../ui/Revelar.jsx'
import { posts } from '../../dados/posts.js'
import estilos from './BlogRecente.module.css'

// `posts[].data` é ISO. `toLocaleDateString` sem `timeZone` interpreta a
// meia-noite UTC no fuso local (America/Sao_Paulo, UTC-3) e imprime o dia
// anterior — ver comentário em `dados/posts.js` (Tarefa 4, 3.2).
function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

// Lista tipográfica, sem capa (Tarefa 8, 7.7): as três capas eram as únicas
// imagens sem filtro da página (hero em saturate(.5), veículos em
// grayscale(1), aqui sem filtro nenhum) — a seção que menos avança o
// argumento era a banda mais barulhenta, e a quinta grade de fotos seguida.
// Categoria, data, título e resumo bastam; nenhum leitor espera clicar numa
// bibliografia, então "sem link" para de precisar de justificativa.
export default function BlogRecente() {
  const recentes = posts.slice(0, 3)

  return (
    <Secao
      id="blog-recente"
      fundo="noite"
      ar="compacto"
      etiqueta="Conteúdo"
      titulo="Últimas do blog"
      className={estilos.medida}
    >
      <div className={estilos.lista}>
        {recentes.map((post, indice) => (
          <Revelar key={post.id} as="article" atraso={indice * 90} className={estilos.item}>
            <span className={estilos.categoria}>{post.categoria}</span>
            <time className={estilos.data} dateTime={post.data}>
              {formatarData(post.data)}
            </time>
            <h3 className={estilos.titulo}>{post.titulo}</h3>
            <p className={estilos.resumo}>{post.resumo}</p>
          </Revelar>
        ))}
      </div>
      <Botao para="/blog" variante="contorno" className={estilos.cta}>
        Ver todos
      </Botao>
    </Secao>
  )
}
