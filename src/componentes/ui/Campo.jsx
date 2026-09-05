import estilos from './Campo.module.css'

// Campo de formulário, movido de `cotacao/` para `ui/` na Tarefa 13: o
// segundo consumidor (o formulário de Contato) precisa de uma coisa que o
// `Campo` não fazia ainda — `textarea` — e a Tarefa 11 deliberadamente
// deferiu a mudança para agora, em vez de deixar o formulário de contato
// copiar a fiação de rótulo/input, `aria-invalid` e `aria-describedby`
// ligado ao id do erro (Tarefa 10, 8.13).
//
// `multilinha` troca o elemento renderizado por `<textarea>`, mantendo toda
// a fiação de acessibilidade idêntica — é a única diferença de contrato
// entre os dois usos.
export default function Campo({
  id,
  rotulo,
  valor,
  erro,
  onChange,
  prefixo,
  opcional = false,
  type = 'text',
  name,
  autoComplete,
  inputRef,
  multilinha = false,
  linhas = 4,
  ...resto
}) {
  const idErro = `${id}-erro`
  const Elemento = multilinha ? 'textarea' : 'input'

  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.rotulo}>
        {rotulo}
        {opcional && <span className={estilos.opcional}> (opcional)</span>}
      </label>
      <div className={estilos.envolveInput}>
        {prefixo && <span className={estilos.prefixo}>{prefixo}</span>}
        <Elemento
          ref={inputRef}
          id={id}
          name={name ?? id}
          {...(multilinha ? { rows: linhas } : { type })}
          autoComplete={autoComplete}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={erro ? 'true' : undefined}
          aria-describedby={erro ? idErro : undefined}
          className={`${estilos.input} ${multilinha ? estilos.textarea : ''} ${prefixo ? estilos.comPrefixo : ''} ${erro ? estilos.comErro : ''}`}
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
