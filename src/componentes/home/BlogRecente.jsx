import Secao from '../ui/Secao.jsx'
import Botao from '../ui/Botao.jsx'
import Revelar from '../ui/Revelar.jsx'
import { posts } from '../../dados/posts.js'
import estilos from './BlogRecente.module.css'

// Mesmo helper de srcset do TiposVeiculo: adiciona largura e formato à URL da
// Unsplash sem duplicar a query inteira por variante. As três capas estão
// abaixo da dobra: `loading="lazy"`.
function comLargura(url, largura) {
  const u = new URL(url)
  u.searchParams.set('w', largura)
  u.searchParams.set('fm', 'webp')
  u.searchParams.set('auto', 'format')
  return u.toString()
}

// `posts[].data` é ISO. `toLocaleDateString` sem `timeZone` interpreta a
// meia-noite UTC no fuso local (America/Sao_Paulo, UTC-3) e imprime o dia
// anterior — ver comentário em `dados/posts.js` (Tarefa 4, 3.2).
function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

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
      <div className={estilos.grade}>
        {recentes.map((post, indice) => (
          // Sem link — rota de post individual está fora de escopo (Tarefa
          // 8). `<article>` puro, ao contrário do TiposVeiculo (card inteiro
          // é `Link`) e do Diferenciais (sem foto): os três só compartilham
          // "grade + Revelar com atraso por índice", não card compartilhado.
          <Revelar
            key={post.id}
            as="article"
            atraso={indice * 90}
            className={estilos.card}
          >
            <div className={estilos.capaWrapper}>
              <img
                className={estilos.capa}
                src={comLargura(post.capa, 700)}
                srcSet={`${comLargura(post.capa, 400)} 400w, ${comLargura(post.capa, 700)} 700w, ${comLargura(post.capa, 1000)} 1000w`}
                sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={estilos.conteudo}>
              <span className={estilos.categoria}>{post.categoria}</span>
              <time className={estilos.data} dateTime={post.data}>
                {formatarData(post.data)}
              </time>
              <h3 className={estilos.titulo}>{post.titulo}</h3>
              <p className={estilos.resumo}>{post.resumo}</p>
            </div>
          </Revelar>
        ))}
      </div>
      <Botao para="/blog" variante="contorno" className={estilos.cta}>
        Ver todos
      </Botao>
    </Secao>
  )
}
