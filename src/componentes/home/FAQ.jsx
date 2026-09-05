import Secao from '../ui/Secao.jsx'
import Acordeao from '../ui/Acordeao.jsx'
import { faq } from '../../dados/faq.js'
import estilos from './FAQ.module.css'

export default function FAQ() {
  return (
    <Secao
      id="faq"
      fundo="profundo"
      ar="padrao"
      titulo="Dúvidas frequentes"
      className={estilos.medida}
    >
      <div className={estilos.container}>
        <Acordeao itens={faq} />
      </div>
    </Secao>
  )
}
