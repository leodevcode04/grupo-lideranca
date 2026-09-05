import Revelar from './Revelar.jsx'
import estilos from './CardPost.module.css'

// `posts[].data` é ISO. `toLocaleDateString` sem `timeZone` interpreta a
// meia-noite UTC no fuso local (America/Sao_Paulo, UTC-3) e imprime o dia
// anterior — ver comentário em `dados/posts.js` (Tarefa 4, 3.2).
function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

// Extraído de `BlogRecente` (Tarefa 8, 7.7 rewrite) para `ui/` na Tarefa 13,
// que precisava do mesmo card na grade de `/blog`. Lista tipográfica, sem
// capa — a decisão da Tarefa 8 continua valendo aqui: categoria, data,
// título e resumo bastam, sem reintroduzir imagem.
export default function CardPost({ post, atraso = 0, className }) {
  const classeFinal = className ? `${estilos.item} ${className}` : estilos.item

  return (
    <Revelar as="article" atraso={atraso} className={classeFinal}>
      <span className={estilos.categoria}>{post.categoria}</span>
      <time className={estilos.data} dateTime={post.data}>
        {formatarData(post.data)}
      </time>
      <h3 className={estilos.titulo}>{post.titulo}</h3>
      <p className={estilos.resumo}>{post.resumo}</p>
    </Revelar>
  )
}
