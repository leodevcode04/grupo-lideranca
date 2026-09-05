import { forwardRef, useEffect, useReducer, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion, useIsPresent } from 'framer-motion'
import Botao from '../ui/Botao.jsx'
import BarraProgresso from './BarraProgresso.jsx'
import EtapaVeiculo from './EtapaVeiculo.jsx'
import EtapaDados from './EtapaDados.jsx'
import EtapaContato from './EtapaContato.jsx'
import EtapaResumo from './EtapaResumo.jsx'
import { ETAPAS, estadoInicialComTipo, redutor, validarEtapa } from './estadoWizard.js'
import estilos from './Wizard.module.css'

const variantes = {
  entra: (direcao) => ({ x: direcao > 0 ? 40 : -40, opacity: 0 }),
  centro: { x: 0, opacity: 1 },
  sai: (direcao) => ({ x: direcao > 0 ? -40 : 40, opacity: 0 }),
}

// Envolve o conteúdo de cada etapa dentro do `AnimatePresence`. Existe só
// para chamar `useIsPresent` (Tarefa 10, 8.1): com `mode="popLayout"` a
// etapa que sai continua montada — tirada do fluxo, mas viva no DOM — até a
// animação de saída terminar. Sem tratamento extra ela fica com
// `pointer-events: auto`, na ordem de tabulação e na árvore de
// acessibilidade: um clique num card fantasma despachava `campo` +
// `avancar` direto no redutor, pulando `validarEtapa` inteiro (reproduzido,
// não suposto). `inert` fecha os três buracos de uma vez — não dá pra
// expressar isso só com CSS de `pointer-events`, por isso o atributo do DOM
// em vez de uma classe.
// `forwardRef` (revisão, 6.10): componente de função simples faz o
// `PopChild` interno do Framer Motion (que faz `cloneElement(children, {
// ref })` para medir o elemento durante a animação de saída) emitir aviso
// de console a cada transição de etapa. Os refs que importam para foco e
// `inert` são outros, internos a este componente, e continuam funcionando
// sem isto — o `forwardRef` só cala o ruído.
const PainelEtapa = forwardRef(function PainelEtapa({ children, ...motionProps }, refExterno) {
  const isPresent = useIsPresent()
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.inert = !isPresent
  }, [isPresent])

  return (
    <motion.div
      ref={(el) => {
        ref.current = el
        if (typeof refExterno === 'function') refExterno(el)
        else if (refExterno) refExterno.current = el
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
})

export default function Wizard() {
  const [searchParams] = useSearchParams()
  // `?tipo=` (revisão, 6.9): `veiculos.js` já documentava que os ids
  // "viajam na URL como ?tipo= em /beneficios e /cotacao", e o passo 2 da
  // Tarefa 12 termina num CTA para `/cotacao?tipo={ativo}` — mas nada aqui
  // lia o parâmetro, então esse link caía na etapa 0 sem nada
  // pré-selecionado. `estadoInicialComTipo` valida o id contra `veiculos`
  // antes de semear `tipo` e pular direto para a etapa 1 (Dados do
  // veículo); um id desconhecido (ou ausente) degrada para o estado
  // inicial normal, etapa 0. Passado como função de inicialização lenta do
  // `useReducer` — roda uma vez no mount, não a cada render.
  const [estado, despachar] = useReducer(redutor, searchParams.get('tipo'), estadoInicialComTipo)
  const semMovimento = useReducedMotion()
  const painelRef = useRef(null)
  const primeiroRender = useRef(true)
  const [mensagemErro, setMensagemErro] = useState('')

  // Foco entre etapas: ao trocar de etapa (avançar ou voltar), o conteúdo
  // sob o usuário muda inteiro — sem mover o foco, um usuário de teclado ou
  // leitor de tela fica com o foco "no vazio". O alvo é o `<h2>` da etapa,
  // não um `role="group"` genérico ao redor dela (Tarefa 10, 8.6): o título
  // anuncia "nome da etapa, título nível 2" — onde no documento se está, não
  // só um rótulo solto — e elimina a duplicidade de fonte de verdade entre
  // `ETAPAS[etapa]` e o próprio `<h2>`, que já divergiam na etapa 0
  // ("Veículo" contra "Qual veículo você quer proteger?").
  //
  // `:not([inert])` exclui a etapa que ainda está saindo: as duas ficam
  // montadas lado a lado por um instante, e só uma delas — a que está
  // entrando — é a atual.
  useEffect(() => {
    if (primeiroRender.current) {
      primeiroRender.current = false
      return
    }
    painelRef.current?.querySelector(':scope > div:not([inert]) h2')?.focus()
  }, [estado.etapa])

  // Falha na validação: o foco vai para o primeiro campo inválido, e a
  // região viva anuncia a contagem — mas só uma vez por tentativa. As duas
  // reações ficam presas a `estado.tentativa`, não a `estado.erros`
  // (Tarefa 10, 8.2/8.3): `case 'campo'` reescreve `erros` a cada tecla
  // (para limpar o erro do campo que está sendo corrigido), então o objeto
  // muda de identidade a cada tecla também — chavear nele fazia o foco
  // pular para o próximo campo e a contagem reanunciar ("4 campos", depois
  // "3", depois "2") no meio da digitação. `tentativa` só muda quando
  // `case 'erros'` roda, ou seja, só quando uma validação de fato falhou.
  useEffect(() => {
    if (estado.tentativa === 0) return
    painelRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    const total = Object.values(estado.erros).filter(Boolean).length
    setMensagemErro(
      total > 0 ? `${total} campo${total > 1 ? 's' : ''} com erro. Revise os campos destacados.` : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.tentativa])

  // Limpa o anúncio ao trocar de etapa — sem isto, a mensagem da última
  // tentativa falhada ficaria pendurada na etapa seguinte, já sem sentido.
  useEffect(() => {
    setMensagemErro('')
  }, [estado.etapa])

  function aoMudarCampo(campo, valor) {
    despachar({ tipo: 'campo', campo, valor })
  }

  function avancar() {
    const erros = validarEtapa(estado)
    if (Object.keys(erros).length > 0) {
      despachar({ tipo: 'erros', erros })
      return
    }
    despachar({ tipo: 'avancar' })
  }

  function voltar() {
    despachar({ tipo: 'voltar' })
  }

  function escolherVeiculo(id) {
    despachar({ tipo: 'campo', campo: 'tipo', valor: id })
    despachar({ tipo: 'avancar' })
  }

  function aoSubmeter(evento) {
    evento.preventDefault()
    avancar()
  }

  return (
    <div className={estilos.wizard}>
      <BarraProgresso etapas={ETAPAS} atual={estado.etapa} />

      {/* Região viva separada do painel: o painel recebe foco silenciosamente
          (não é `aria-live`), então sem isto uma falha de validação nunca
          seria anunciada — só o texto de cada erro individual, que o leitor
          de tela só lê se o usuário tabular até o campo.
          `role="status"` (não `alert`): o movimento de foco já é o sinal
          assertivo desta troca, e duas regiões assertivas disparando juntas
          fazem leitores de tela descartarem uma das duas de forma
          imprevisível (Tarefa 10, 8.3). A contagem ainda merece existir —
          é o que o campo focado sozinho não consegue dizer — só que uma
          vez por tentativa, não uma vez por tecla. */}
      <p className={estilos.somenteLeitor} role="status">
        {mensagemErro}
      </p>

      <form onSubmit={aoSubmeter} noValidate>
        <div ref={painelRef} className={estilos.painelFoco}>
          {/* Modo padrão ("sync"), não "wait" nem "popLayout" (revisão, 6.4):
              "wait" só monta a etapa nova quando a animação de saída da
              anterior termina — depende de um callback via
              requestAnimationFrame, e se o rAF não dispara (aba oculta, por
              exemplo) a troca trava indefinidamente. "popLayout" evitava
              isso tirando a etapa que sai do fluxo do documento (Tarefa 10,
              8.1), mas uma etapa fora do fluxo não conta para o tamanho do
              `.painelFoco`, que agora depende de as duas etapas —
              entrando e saindo — ocuparem a mesma célula de grade ao mesmo
              tempo para que o contêiner assuma `max(entrando, saindo)`
              (6.4). "sync" mantém as duas montadas e no fluxo durante a
              transição, sem esperar rAF nenhum para a entrada começar. O
              `inert` do `PainelEtapa` (Tarefa 10, 8.1) já resolve
              pointer-events/tabulação da etapa que sai independentemente
              do modo — nunca dependeu do "popLayout" para isso. */}
          <AnimatePresence initial={false}>
            <PainelEtapa
              key={estado.etapa}
              custom={estado.direcao}
              variants={variantes}
              initial="entra"
              animate="centro"
              exit="sai"
              transition={{ duration: semMovimento ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {estado.etapa === 0 && (
                <EtapaVeiculo tipoSelecionado={estado.tipo} aoEscolher={escolherVeiculo} />
              )}
              {estado.etapa === 1 && (
                <EtapaDados
                  valores={{ marca: estado.marca, modelo: estado.modelo, ano: estado.ano, valor: estado.valor }}
                  erros={estado.erros}
                  aoMudarCampo={aoMudarCampo}
                />
              )}
              {estado.etapa === 2 && (
                <EtapaContato
                  valores={{
                    nome: estado.nome,
                    telefone: estado.telefone,
                    cidade: estado.cidade,
                    email: estado.email,
                  }}
                  erros={estado.erros}
                  aoMudarCampo={aoMudarCampo}
                />
              )}
              {estado.etapa === 3 && (
                <EtapaResumo
                  estado={estado}
                  aoReiniciar={() => despachar({ tipo: 'reiniciar' })}
                  aoIrParaEtapa={(etapa) => despachar({ tipo: 'irPara', etapa })}
                />
              )}
            </PainelEtapa>
          </AnimatePresence>
        </div>

        <div className={estilos.acoes}>
          {estado.etapa > 0 && (
            <Botao variante="contorno" tipo="button" onClick={voltar}>
              Voltar
            </Botao>
          )}
          {/* Na última etapa o "Continuar" dá lugar aos botões próprios do
              resumo (Enviar no WhatsApp / Refazer) — não há mais nada para
              validar ou avançar, então nenhum botão de formulário aqui
              precisaria ser `type="submit"` para esta etapa. */}
          {estado.etapa !== 0 && estado.etapa !== ETAPAS.length - 1 && (
            <Botao variante="primario" tipo="submit" className={estilos.continuar}>
              Continuar
            </Botao>
          )}
        </div>
      </form>
    </div>
  )
}
