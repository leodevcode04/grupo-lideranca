import Secao from '../ui/Secao.jsx'
import Revelar from '../ui/Revelar.jsx'
import Estrelas from '../ui/Estrelas.jsx'
import { depoimentos } from '../../dados/depoimentos.js'
import estilos from './Depoimentos.module.css'

// Sem carrossel (Tarefa 7, 6.1 — decisão tomada com o usuário): os três
// depoimentos ficam visíveis ao mesmo tempo numa grade, reaproveitando o
// tratamento de divisores do `Diferenciais` (filete de 1px em `--azul-borda`
// entre colunas, sem moldura de card). Depoimento é conteúdo de força
// cumulativa — três vozes de três cidades é o argumento, uma só é anedota.
// Isso também apaga, de uma vez, os três problemas de acessibilidade do
// carrossel anterior: o `aria-live` que anunciava a cada 7s (o padrão APG
// manda `off` durante rotação automática), as bolinhas de 8×8px (abaixo do
// mínimo AA de 24×24 do WCAG 2.5.8) e o `aria-label` num `<div>` sem role.
export default function Depoimentos() {
  return (
    <Secao
      id="depoimentos"
      fundo="elevado"
      ar="amplo"
      etiqueta="Quem já é associado"
      titulo="Três cidades, a mesma tranquilidade"
      className={estilos.medida}
    >
      <div className={estilos.grade}>
        {depoimentos.map((depoimento, indice) => (
          <Revelar
            key={depoimento.id}
            as="figure"
            atraso={indice * 90}
            className={estilos.item}
          >
            {/* A aspa grande vai atrás só da coluna do meio — é onde há
                composição para sustentá-la (Tarefa 7, 6.1). Sem role/texto:
                é textura, não conteúdo. */}
            {indice === 1 && (
              <span className={estilos.aspa} aria-hidden="true">
                “
              </span>
            )}
            <div className={estilos.conteudo}>
              <Estrelas nota={depoimento.nota} />
              <blockquote className={estilos.texto}>{depoimento.texto}</blockquote>
              <figcaption className={estilos.assinatura}>
                <span className={estilos.nome}>{depoimento.nome}</span>
                <span className={estilos.cidade}>{depoimento.cidade}</span>
              </figcaption>
            </div>
          </Revelar>
        ))}
      </div>
    </Secao>
  )
}
