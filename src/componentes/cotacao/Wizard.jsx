import { useEffect, useReducer, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Botao from '../ui/Botao.jsx'
import BarraProgresso from './BarraProgresso.jsx'
import EtapaVeiculo from './EtapaVeiculo.jsx'
import EtapaDados from './EtapaDados.jsx'
import estilos from './Wizard.module.css'

const ETAPAS = ['Veículo', 'Dados do veículo', 'Seus dados', 'Resumo']

// Modelos de fábrica saem à venda antes do ano-calendário virar (um carro
// "2027" já roda em concessionária em outubro de 2026), então o limite usa
// o ano corrente + 1 em vez do ano corrente puro — um limite igual a
// `getFullYear()` recusaria esse veículo legítimo. Nunca o literal 2026:
// mesma deriva silenciosa que a Tarefa 9 removeu de `calculo.js`.
function anoLimite() {
  return new Date().getFullYear() + 1
}

export const estadoInicial = {
  etapa: 0,
  tipo: null,
  marca: '', modelo: '', ano: '', valor: '',
  nome: '', telefone: '', cidade: '', email: '',
  erros: {},
}

export function redutor(estado, acao) {
  switch (acao.tipo) {
    case 'campo':
      return {
        ...estado,
        [acao.campo]: acao.valor,
        erros: { ...estado.erros, [acao.campo]: undefined },
      }
    case 'avancar':
      return { ...estado, etapa: Math.min(estado.etapa + 1, ETAPAS.length - 1), erros: {} }
    case 'voltar':
      return { ...estado, etapa: Math.max(estado.etapa - 1, 0), erros: {} }
    case 'erros':
      return { ...estado, erros: acao.erros }
    case 'reiniciar':
      return estadoInicial
    default:
      return estado
  }
}

export function validarEtapa(estado) {
  const erros = {}
  if (estado.etapa === 1) {
    if (!estado.marca.trim()) erros.marca = 'Informe a marca'
    if (!estado.modelo.trim()) erros.modelo = 'Informe o modelo'
    if (!/^\d{4}$/.test(estado.ano)) erros.ano = 'Ano com 4 dígitos'
    else if (Number(estado.ano) < 1980 || Number(estado.ano) > anoLimite()) erros.ano = 'Ano fora do intervalo'
    if (!(Number(estado.valor) > 0)) erros.valor = 'Informe o valor do veículo'
  }
  if (estado.etapa === 2) {
    if (estado.nome.trim().length < 3) erros.nome = 'Informe seu nome completo'
    if (estado.telefone.replace(/\D/g, '').length < 10) erros.telefone = 'Telefone incompleto'
    if (!estado.cidade.trim()) erros.cidade = 'Informe sua cidade'
    if (estado.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(estado.email)) erros.email = 'E-mail inválido'
  }
  return erros
}

const variantes = {
  entra: (direcao) => ({ x: direcao > 0 ? 40 : -40, opacity: 0 }),
  centro: { x: 0, opacity: 1 },
  sai: (direcao) => ({ x: direcao > 0 ? -40 : 40, opacity: 0 }),
}

export default function Wizard() {
  const [estado, despachar] = useReducer(redutor, estadoInicial)
  const semMovimento = useReducedMotion()
  // Direção da transição: 1 ao avançar (conteúdo novo entra pela direita,
  // como "seguir em frente"), -1 ao voltar (entra pela esquerda, sensação de
  // retroceder). Fica em ref porque é lida pelo `AnimatePresence` via
  // `custom` no próximo render — não precisa disparar um render por si só.
  const direcaoRef = useRef(1)
  const painelRef = useRef(null)
  const primeiroRender = useRef(true)

  // Foco entre etapas: ao trocar de etapa (avançar ou voltar), o conteúdo
  // sob o usuário muda inteiro — sem mover o foco, um usuário de teclado ou
  // leitor de tela fica com o foco "no vazio", sobre um botão que já não é
  // mais o Continuar da etapa anterior. O painel da etapa corrente é um
  // contêiner focável (`tabIndex=-1`) com `role="group"` e rótulo da etapa,
  // então focá-lo tem o leitor de tela anunciando o nome da nova etapa.
  useEffect(() => {
    if (primeiroRender.current) {
      primeiroRender.current = false
      return
    }
    painelRef.current?.focus()
  }, [estado.etapa])

  function aoMudarCampo(campo, valor) {
    despachar({ tipo: 'campo', campo, valor })
  }

  // Falha na validação: o foco vai para o primeiro campo inválido, não para
  // o painel — é ali que a correção precisa acontecer, e é isso que o
  // `aria-describedby` de cada campo vai anunciar ao chegar. Roda em
  // `useEffect` (após o commit do DOM) em vez de logo depois do `despachar`
  // — o `querySelector` precisa dos atributos `aria-invalid` já escritos,
  // que só existem depois que React aplica o novo estado ao DOM.
  useEffect(() => {
    if (Object.values(estado.erros).some(Boolean)) {
      painelRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    }
  }, [estado.erros])

  function avancar() {
    const erros = validarEtapa(estado)
    if (Object.keys(erros).length > 0) {
      despachar({ tipo: 'erros', erros })
      return
    }
    direcaoRef.current = 1
    despachar({ tipo: 'avancar' })
  }

  function voltar() {
    direcaoRef.current = -1
    despachar({ tipo: 'voltar' })
  }

  function escolherVeiculo(id) {
    despachar({ tipo: 'campo', campo: 'tipo', valor: id })
    direcaoRef.current = 1
    despachar({ tipo: 'avancar' })
  }

  const totalErros = Object.values(estado.erros).filter(Boolean).length

  return (
    <div className={estilos.wizard}>
      <BarraProgresso etapas={ETAPAS} atual={estado.etapa} />

      {/* Região viva separada do painel: o painel recebe foco silenciosamente
          (não é `aria-live`), então sem isto uma falha de validação nunca
          seria anunciada — só o texto de cada erro individual, que o leitor
          de tela só lê se o usuário tabular até o campo. */}
      <p className={estilos.somenteLeitor} role="alert">
        {totalErros > 0
          ? `${totalErros} campo${totalErros > 1 ? 's' : ''} com erro. Revise os campos destacados.`
          : ''}
      </p>

      <div
        ref={painelRef}
        tabIndex={-1}
        role="group"
        aria-label={ETAPAS[estado.etapa]}
        className={estilos.painelFoco}
      >
        {/* "popLayout" (não "wait"): a etapa que sai é tirada do fluxo (position:
            absolute) e anima por conta própria, sem bloquear a montagem da
            etapa que entra. Com "wait" a etapa nova só monta quando a
            animação de saída da anterior termina — que depende de um
            callback via requestAnimationFrame; se o rAF não dispara (aba
            oculta, por exemplo), a troca trava indefinidamente. */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={estado.etapa}
            custom={direcaoRef.current}
            variants={variantes}
            initial="entra"
            animate="centro"
            exit="sai"
            transition={{ duration: semMovimento ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {estado.etapa === 0 && (
              <EtapaVeiculo tipoSelecionado={estado.tipo} aoEscolher={escolherVeiculo} />
            )}
            {estado.etapa === 1 && <EtapaDados estado={estado} aoMudarCampo={aoMudarCampo} />}
            {estado.etapa >= 2 && (
              <p className={estilos.emBreve}>
                Etapas seguintes do wizard chegam na próxima tarefa.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={estilos.acoes}>
        {estado.etapa > 0 && (
          <Botao variante="contorno" tipo="button" onClick={voltar}>
            Voltar
          </Botao>
        )}
        {estado.etapa !== 0 && (
          <Botao variante="primario" tipo="button" onClick={avancar} className={estilos.continuar}>
            Continuar
          </Botao>
        )}
      </div>
    </div>
  )
}
