import Secao from '../ui/Secao.jsx'
import Botao from '../ui/Botao.jsx'
import CardPost from '../ui/CardPost.jsx'
import { posts } from '../../dados/posts.js'
import estilos from './BlogRecente.module.css'

// Lista tipográfica, sem capa (Tarefa 8, 7.7): as três capas eram as únicas
// imagens sem filtro da página (hero em saturate(.5), veículos em
// grayscale(1), aqui sem filtro nenhum) — a seção que menos avança o
// argumento era a banda mais barulhenta, e a quinta grade de fotos seguida.
// Categoria, data, título e resumo bastam; nenhum leitor espera clicar numa
// bibliografia, então "sem link" para de precisar de justificativa.
//
// O card foi extraído para `ui/CardPost` na Tarefa 13, que precisava do
// mesmo card na grade de `/blog` — evita duplicar a marcação.
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
          <CardPost key={post.id} post={post} atraso={indice * 90} className={estilos.item} />
        ))}
      </div>
      <Botao para="/blog" variante="contorno" className={estilos.cta}>
        Ver todos
      </Botao>
    </Secao>
  )
}
