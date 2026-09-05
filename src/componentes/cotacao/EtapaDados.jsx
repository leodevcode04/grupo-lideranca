import { useEffect, useRef } from 'react'
import Campo from './Campo.jsx'
import estilosEtapa from './etapa.module.css'
import estilos from './EtapaDados.module.css'

// Máscara do campo valor: dígitos viram o número puro guardado no estado —
// nunca uma string como '60.000' ou '' com espaços, que é exatamente a zona
// cinzenta que `calculo.js` (Tarefa 9) decidiu não resolver sozinho.
// `calcularMensalidade` recebe daqui só número ou vazio.
//
// Colar "60.000,50" (Tarefa 10, 8.4) não pode virar `6000050`: isso não é
// "centavos não são representáveis", é corromper a ordem de grandeza de um
// veículo de R$ 60 mil para R$ 6 milhões. O ponto é sempre separador de
// milhar; a vírgula, quando presente, é separador decimal — arredondada
// para o real inteiro mais próximo, já que o estado guarda só reais.
function paraNumeroFormatado(texto) {
  const partes = texto.split(',')
  const inteiroDigitos = partes[0].replace(/\D/g, '')
  if (inteiroDigitos === '' && partes.length < 2) return ''
  const inteiro = Number(inteiroDigitos || '0')
  if (partes.length < 2) return inteiro
  const decimalDigitos = partes[1].replace(/\D/g, '').slice(0, 2)
  const decimal = decimalDigitos ? Number(decimalDigitos.padEnd(2, '0')) / 100 : 0
  return Math.round(inteiro + decimal)
}

function formatarValorExibicao(valor) {
  if (valor === '' || valor == null) return ''
  return Number(valor).toLocaleString('pt-BR')
}

export default function EtapaDados({ valores, erros, aoMudarCampo }) {
  const erro = erros ?? {}
  const valorRef = useRef(null)
  // Dígitos à esquerda do cursor no instante da edição — capturados no
  // `onChange` (antes do reformate) e usados para recolocar o cursor depois
  // que o novo valor formatado for pintado. Sem isto, a máscara reformata a
  // cada tecla e editar no meio de "60.000" joga o cursor para o fim
  // (Tarefa 10, 8.4).
  const digitosAntesCursor = useRef(null)

  function aoMudarValor(textoDigitado) {
    const el = valorRef.current
    const pos = el?.selectionStart ?? textoDigitado.length
    digitosAntesCursor.current = textoDigitado.slice(0, pos).replace(/\D/g, '').length
    aoMudarCampo('valor', paraNumeroFormatado(textoDigitado))
  }

  useEffect(() => {
    const alvo = digitosAntesCursor.current
    const el = valorRef.current
    if (alvo == null || !el) return
    digitosAntesCursor.current = null
    const texto = el.value
    let vistos = 0
    let pos = texto.length
    for (let i = 0; i < texto.length; i++) {
      if (/\d/.test(texto[i])) vistos++
      if (vistos === alvo) {
        pos = i + 1
        break
      }
    }
    if (alvo === 0) pos = 0
    el.setSelectionRange(pos, pos)
  }, [valores.valor])

  return (
    <div>
      <h2 tabIndex={-1} className={estilosEtapa.titulo}>
        Dados do veículo
      </h2>
      <div className={`${estilosEtapa.grade} ${estilos.grade}`}>
        <div className={estilos.campoMarca}>
          <Campo
            id="marca"
            rotulo="Marca"
            valor={valores.marca}
            erro={erro.marca}
            autoComplete="off"
            onChange={(v) => aoMudarCampo('marca', v)}
          />
        </div>
        <div className={estilos.campoModelo}>
          <Campo
            id="modelo"
            rotulo="Modelo"
            valor={valores.modelo}
            erro={erro.modelo}
            autoComplete="off"
            onChange={(v) => aoMudarCampo('modelo', v)}
          />
        </div>
        <div className={estilos.campoAno}>
          <Campo
            id="ano"
            rotulo="Ano"
            valor={valores.ano}
            erro={erro.ano}
            inputMode="numeric"
            maxLength={4}
            onChange={(v) => aoMudarCampo('ano', v.replace(/\D/g, '').slice(0, 4))}
          />
        </div>
        <div className={estilos.campoValor}>
          <Campo
            id="valor"
            rotulo="Valor do veículo"
            valor={formatarValorExibicao(valores.valor)}
            erro={erro.valor}
            inputMode="numeric"
            prefixo="R$"
            inputRef={valorRef}
            onChange={aoMudarValor}
          />
        </div>
      </div>
    </div>
  )
}
