import Campo from './Campo.jsx'
import estilosEtapa from './etapa.module.css'
import estilos from './EtapaContato.module.css'

// Máscara verbatim do plano (Tarefa 11): dígitos viram '(DD) DDDD-DDDD' (fixo,
// 10 dígitos) ou '(DD) DDDDD-DDDD' (celular, 11 dígitos) conforme a
// quantidade de dígitos já digitados — não há como saber de antemão qual dos
// dois o usuário está discando, só o comprimento decide.
export function mascararTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 10) return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
    [a && `(${a}`, a.length === 2 ? ') ' : '', b, c && `-${c}`].filter(Boolean).join(''))
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

export default function EtapaContato({ valores, erros, aoMudarCampo }) {
  const erro = erros ?? {}

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
            onChange={(v) => aoMudarCampo('telefone', mascararTelefone(v))}
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
