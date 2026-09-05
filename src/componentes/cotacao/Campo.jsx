import estilos from './Campo.module.css'

// Campo de formulário do wizard, extraído de `EtapaDados.jsx` (Tarefa 10,
// 8.13): já fazia o trabalho inteiro de associação rótulo/input,
// `aria-invalid`, `aria-describedby` ligado ao id do erro, parágrafo de erro
// condicional e prefixo opcional — o `EtapaContato` da Tarefa 11 precisa dos
// mesmos quatro fios de ARIA, com marcação idêntica. Mover o arquivo custa
// menos do que deixar a Tarefa 11 copiar 25 linhas de fiação que só pode
// derivar (uma cópia esquece o `aria-describedby`, por exemplo).
//
// `name`/`autoComplete`, `opcional` e `type` foram acrescentados aqui porque
// ficam mais baratos agora do que depois que o segundo consumidor já tiver
// copiado a forma atual: o `EtapaContato` precisa de `autoComplete` (`name`,
// `tel`, `address-level2`, `email`) e de e-mail opcional com teclado
// `type="email"` no celular.
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
  ...resto
}) {
  const idErro = `${id}-erro`
  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.rotulo}>
        {rotulo}
        {opcional && <span className={estilos.opcional}> (opcional)</span>}
      </label>
      <div className={estilos.envolveInput}>
        {prefixo && <span className={estilos.prefixo}>{prefixo}</span>}
        <input
          ref={inputRef}
          id={id}
          name={name ?? id}
          type={type}
          autoComplete={autoComplete}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={erro ? 'true' : undefined}
          aria-describedby={erro ? idErro : undefined}
          className={`${estilos.input} ${prefixo ? estilos.comPrefixo : ''} ${erro ? estilos.comErro : ''}`}
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
