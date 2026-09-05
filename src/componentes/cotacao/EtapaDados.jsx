import estilos from './EtapaDados.module.css'

// Máscara do campo valor: qualquer tecla não-numérica é descartada antes de
// chegar ao estado. O que sobra é sempre '' (campo vazio) ou um Number
// inteiro não-negativo — nunca uma string como '60.000' ou '' com espaços,
// que é exatamente a zona cinzenta que `calculo.js` (Tarefa 9) decidiu não
// resolver sozinho. `calcularMensalidade` recebe daqui só número ou vazio.
function paraNumeroDigitado(texto) {
  const digitos = texto.replace(/\D/g, '')
  return digitos === '' ? '' : Number(digitos)
}

function formatarValorExibicao(valor) {
  if (valor === '' || valor == null) return ''
  return Number(valor).toLocaleString('pt-BR')
}

export default function EtapaDados({ estado, aoMudarCampo }) {
  const erro = estado.erros ?? {}

  return (
    <div>
      <h2 className={estilos.titulo}>Dados do veículo</h2>
      <div className={estilos.grade}>
        <Campo
          id="marca"
          rotulo="Marca"
          valor={estado.marca}
          erro={erro.marca}
          onChange={(v) => aoMudarCampo('marca', v)}
        />
        <Campo
          id="modelo"
          rotulo="Modelo"
          valor={estado.modelo}
          erro={erro.modelo}
          onChange={(v) => aoMudarCampo('modelo', v)}
        />
        <Campo
          id="ano"
          rotulo="Ano"
          valor={estado.ano}
          erro={erro.ano}
          inputMode="numeric"
          maxLength={4}
          onChange={(v) => aoMudarCampo('ano', v.replace(/\D/g, '').slice(0, 4))}
        />
        <Campo
          id="valor"
          rotulo="Valor do veículo"
          valor={formatarValorExibicao(estado.valor)}
          erro={erro.valor}
          inputMode="numeric"
          prefixo="R$"
          onChange={(v) => aoMudarCampo('valor', paraNumeroDigitado(v))}
        />
      </div>
    </div>
  )
}

function Campo({ id, rotulo, valor, erro, onChange, prefixo, ...resto }) {
  const idErro = `${id}-erro`
  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.rotulo}>
        {rotulo}
      </label>
      <div className={estilos.envolveInput}>
        {prefixo && <span className={estilos.prefixo}>{prefixo}</span>}
        <input
          id={id}
          type="text"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={erro ? 'true' : undefined}
          aria-describedby={erro ? idErro : undefined}
          className={`${estilos.input} ${prefixo ? estilos.comPrefixo : ''}`}
          {...resto}
        />
      </div>
      {erro && (
        <p id={idErro} className={estilos.mensagemErro}>
          {erro}
        </p>
      )}
    </div>
  )
}
