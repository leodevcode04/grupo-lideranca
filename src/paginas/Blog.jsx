import { useId, useMemo, useState } from 'react'
import Cabecalho from '../componentes/ui/Cabecalho.jsx'
import CardPost from '../componentes/ui/CardPost.jsx'
import { posts } from '../dados/posts.js'
import { FOTO_BLOG } from '../dados/cabecalhos.js'
import estilos from './Blog.module.css'

const TODAS = 'Todas'

export default function Blog() {
  const categorias = useMemo(() => {
    const unicas = [...new Set(posts.map((post) => post.categoria))]
    return [TODAS, ...unicas]
  }, [])

  const [categoriaAtiva, setCategoriaAtiva] = useState(TODAS)
  const idStatus = useId()

  const filtrados =
    categoriaAtiva === TODAS ? posts : posts.filter((post) => post.categoria === categoriaAtiva)

  return (
    <>
      <Cabecalho
        etiqueta="Blog"
        titulo="Novidades, dicas e conteúdo do Grupo Liderança"
        texto="Fique por dentro do que acontece na associação e receba dicas úteis para o dia a dia no trânsito."
        foto={FOTO_BLOG}
      />

      <div className={`container ${estilos.pagina}`}>
        {/* Cabeçalho de seção sem etiqueta visual repetida — só existe para
            os <h3> dos cards de `CardPost` terem um <h2> a que se pendurar
            no sumário de títulos (nenhum outro elemento visível serviria de
            título de seção aqui: as pílulas são controles, não título). */}
        <h2 className="sr-only">Publicações</h2>

        {/* Pílulas de filtro — NÃO são abas: não há painel único associado a
            cada pílula, e a grade de posts abaixo não é "controlada" por
            nenhuma delas isoladamente (Tarefa 12, nota para a Tarefa 13).
            `aria-pressed` marca o estado de alternância de cada botão, sem
            reivindicar a semântica de `role="tablist"`/`tabpanel`. */}
        <div className={estilos.pilulas} role="group" aria-label="Filtrar por categoria">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={estilos.pilula}
              aria-pressed={categoriaAtiva === categoria}
              onClick={() => setCategoriaAtiva(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>

        {/* Mesmo padrão de anúncio ao vivo de `/unidades`: a contagem muda
            silenciosamente a cada clique de pílula, sem foco se mover — a
            região `aria-live="polite"` avisa quem usa leitor de tela sem
            interromper nada. */}
        <p id={idStatus} className={estilos.status} aria-live="polite">
          {filtrados.length} post{filtrados.length === 1 ? '' : 's'} em “{categoriaAtiva}”.
        </p>

        <div className={estilos.grade}>
          {filtrados.map((post, indice) => (
            <CardPost key={post.id} post={post} atraso={indice * 90} className={estilos.item} />
          ))}
        </div>
      </div>
    </>
  )
}
