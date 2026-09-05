import { useEffect, useRef } from 'react'
import Campo from '../ui/Campo.jsx'
import { digitosAntesDoCursor, restaurarCursorPorDigitos } from './cursorPorDigitos.js'
import estilosEtapa from './etapa.module.css'
import estilos from './EtapaContato.module.css'

// Máscara do plano (Tarefa 11), com uma correção (revisão, 6.1): o
// parêntese só fecha quando há algo depois dele. A versão original
// (`a.length === 2 ? ') ' : ''`) fechava assim que o DDD completava dois
// dígitos, então digitar "48" produzia "(48) " — e um backspace nesse
// estado apagava o espaço, mas a máscara relia os mesmos dígitos "48" e
// devolvia "(48) " de novo: o DDD ficava impossível de apagar por
// backspace, só selecionando tudo e redigitando. Fechando o parêntese só
// quando `b` ou `c` já têm algo, "(48" fica sem nada depois dele até o
// terceiro dígito chegar, e um backspace a partir daí reduz normalmente.
export function mascararTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 10) return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
    [a && `(${a}`, a.length === 2 && (b || c) ? ') ' : '', b, c && `-${c}`].filter(Boolean).join(''))
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

export default function EtapaContato({ valores, erros, aoMudarCampo }) {
  const erro = erros ?? {}
  const telefoneRef = useRef(null)
  // Mesmo rastreio de cursor por contagem de dígitos do `EtapaDados`
  // (Tarefa 10, 8.4), extraído para `cursorPorDigitos.js` e usado aqui
  // (Tarefa 11, 6.2): sem isto, inserir um dígito no meio de
  // "(48) 99145-2750" jogava o cursor para o fim do campo.
  const digitosAntesCursor = useRef(null)

  function aoMudarTelefone(textoDigitado) {
    digitosAntesCursor.current = digitosAntesDoCursor(telefoneRef.current, textoDigitado)
    aoMudarCampo('telefone', mascararTelefone(textoDigitado))
  }

  useEffect(() => {
    const alvo = digitosAntesCursor.current
    if (alvo == null) return
    digitosAntesCursor.current = null
    restaurarCursorPorDigitos(telefoneRef.current, alvo)
  }, [valores.telefone])

  return (
    <div>
      <h2 tabIndex={-1} className={estilosEtapa.titulo}>
        Seus dados
      </h2>
      <div className={`${estilosEtapa.grade} ${estilos.grade}`}>
        <div className={estilos.campoNome}>
          <Campo
            id="nome"
            name="name"
            autoComplete="name"
            rotulo="Nome completo"
            valor={valores.nome}
            erro={erro.nome}
            onChange={(v) => aoMudarCampo('nome', v)}
          />
        </div>
        <div className={estilos.campoTelefone}>
          <Campo
            id="telefone"
            name="tel"
            autoComplete="tel"
            rotulo="Telefone"
            valor={valores.telefone}
            erro={erro.telefone}
            inputMode="tel"
            inputRef={telefoneRef}
            onChange={aoMudarTelefone}
          />
          {/* Tranquilização no ponto de maior atrito do wizard — pedir o
              telefone é onde a hesitação em preencher um formulário costuma
              aparecer (Tarefa 11, decisão de projeto). Fica ao lado deste
              campo, não perto do valor estimado no resumo: são duas
              preocupações diferentes — "o que fazem com meu telefone" aqui,
              "esse valor é garantido?" lá — e cada aviso pertence ao lugar
              onde a dúvida nasce. */}
          <p className={estilos.privacidade}>
            Usamos seu telefone só para falar sobre esta cotação.
          </p>
        </div>
        <div className={estilos.campoCidade}>
          <Campo
            id="cidade"
            name="address-level2"
            autoComplete="address-level2"
            rotulo="Cidade"
            valor={valores.cidade}
            erro={erro.cidade}
            onChange={(v) => aoMudarCampo('cidade', v)}
          />
        </div>
        <div className={estilos.campoEmail}>
          <Campo
            id="email"
            name="email"
            autoComplete="email"
            type="email"
            opcional
            rotulo="E-mail"
            valor={valores.email}
            erro={erro.email}
            onChange={(v) => aoMudarCampo('email', v)}
          />
        </div>
      </div>
    </div>
  )
}
