import { useId } from 'react'
import Secao from '../ui/Secao.jsx'
import Botao from '../ui/Botao.jsx'
import { contato } from '../../dados/contato.js'
import estilos from './CtaFinal.module.css'

// Mesmo padrão do WhatsAppFlutuante: o link é montado a partir de
// `dados/contato.js`, nunca hardcoded aqui.
const HREF_WHATSAPP = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(contato.mensagemWhatsApp)}`

export default function CtaFinal() {
  const idRotulo = useId()

  return (
    <Secao
      id="fale-conosco"
      fundo="profundo"
      ar="amplo"
      centralizado
      etiqueta="Fale com a gente"
      titulo="Leve a proteção do Grupo Liderança para o seu veículo"
      decoracao={<div className={estilos.halo} />}
    >
      <div className={estilos.conteudo}>
        {/* Filete de fechamento: a última seção muda de espécie, não só de
            número — nenhuma outra banda do site tem essa assinatura (Tarefa
            8, 7.8). */}
        <span className={estilos.assinatura} aria-hidden="true" />

        <div className={estilos.foneBloco}>
          <span id={idRotulo} className={estilos.foneRotulo}>
            Central de atendimento
          </span>
          {/* `telefoneHref` já vem pronto do dado — o 0800 tem uma forma de
              `tel:` diferente da de um fixo comum, e não deve ser derivada
              aqui a partir do texto exibido (Tarefa 4, 3.3).
              `aria-describedby` dá contexto ao link sem duplicar o texto: um
              leitor de tela anunciava só "link, 0800 150 5050" (Tarefa 8,
              7.11) — agora anuncia o rótulo visível também. */}
          <a href={contato.telefoneHref} className={estilos.telefone} aria-describedby={idRotulo}>
            {contato.telefone}
          </a>
        </div>

        <div className={estilos.botoes}>
          {/* "Fazer cotação" já apareceu três vezes (cabeçalho, hero,
              ComoFunciona) — o quarto vem em contorno, não primário (Tarefa
              8, 7.8). "Falar no WhatsApp" ainda não foi oferecido: fica
              primário, para o fim oferecer algo novo em vez de repetir a
              hierarquia pela quarta vez. */}
          <Botao para="/cotacao" variante="contorno">
            Fazer cotação
          </Botao>
          <Botao href={HREF_WHATSAPP} variante="primario">
            Falar no WhatsApp
          </Botao>
        </div>
      </div>
    </Secao>
  )
}
