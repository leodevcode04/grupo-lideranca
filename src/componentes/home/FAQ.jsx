import Secao from '../ui/Secao.jsx'
import Acordeao from '../ui/Acordeao.jsx'
import Revelar from '../ui/Revelar.jsx'
import { faq } from '../../dados/faq.js'
import estilos from './FAQ.module.css'

// `Acordeao` (ui/) não conhece domínio — o mapeamento pergunta/resposta →
// titulo/conteudo é responsabilidade de quem tem esse conhecimento (Tarefa
// 8, 7.3).
const itensAcordeao = faq.map((item) => ({
  id: item.id,
  titulo: item.pergunta,
  conteudo: item.resposta,
}))

export default function FAQ() {
  return (
    <Secao id="faq" fundo="profundo" ar="padrao" titulo="Dúvidas frequentes" className={estilos.medida}>
      {/* Um único Revelar em volta do acordeão inteiro, não um por pergunta
          (Tarefa 8, 7.2): dez perguntas escalonadas a 90ms fariam o décimo
          item entrar 810ms depois do primeiro — travamento, não cadência.
          Além disso, `Acordeao` é peça de `ui/` sem domínio: não deveria
          decidir a própria coreografia de scroll, que aqui é do chamador. */}
      <Revelar as="div" className={estilos.container}>
        <Acordeao itens={itensAcordeao} />
      </Revelar>
    </Secao>
  )
}
