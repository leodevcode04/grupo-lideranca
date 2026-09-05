import Secao from '../ui/Secao.jsx'
import Botao from '../ui/Botao.jsx'
import { contato } from '../../dados/contato.js'
import estilos from './CtaFinal.module.css'

// Mesmo padrão do WhatsAppFlutuante: o link é montado a partir de
// `dados/contato.js`, nunca hardcoded aqui.
const HREF_WHATSAPP = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(contato.mensagemWhatsApp)}`

export default function CtaFinal() {
  return (
    <Secao
      id="fale-conosco"
      fundo="noite"
      ar="amplo"
      centralizado
      etiqueta="Fale com a gente"
      titulo="Leve a proteção do Grupo Liderança para o seu veículo"
      className={`${estilos.medida} ${estilos.halo}`}
    >
      <div className={estilos.conteudo}>
        {/* `telefoneHref` já vem pronto do dado — o 0800 tem uma forma de
            `tel:` diferente da de um fixo comum, e não deve ser derivada
            aqui a partir do texto exibido (Tarefa 4, 3.3). */}
        <a href={contato.telefoneHref} className={estilos.telefone}>
          {contato.telefone}
        </a>
        <div className={estilos.botoes}>
          <Botao para="/cotacao" variante="primario">
            Fazer cotação
          </Botao>
          <Botao href={HREF_WHATSAPP} variante="contorno">
            Falar no WhatsApp
          </Botao>
        </div>
      </div>
    </Secao>
  )
}
