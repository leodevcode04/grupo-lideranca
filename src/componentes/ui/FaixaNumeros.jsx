import estilos from './FaixaNumeros.module.css'

// Faixa de números institucionais (Hero da Tarefa 6, QuemSomos da Tarefa 13).
// Sem domínio: recebe `itens` no formato de `dados/numeros.js` e não sabe de
// hero, header ou qualquer posicionamento — isso é responsabilidade de quem
// a monta (ver `.faixaWrapper` em Hero.module.css).
export default function FaixaNumeros({ itens, className, ...resto }) {
  const classeFinal = className ? `${estilos.faixa} ${className}` : estilos.faixa

  return (
    <dl className={classeFinal} {...resto}>
      {itens.map((item) => (
        <div key={item.id} className={estilos.item}>
          <dt className={estilos.valor}>{item.valor}</dt>
          <dd className={estilos.rotulo}>{item.rotulo}</dd>
        </div>
      ))}
    </dl>
  )
}
