import { useEffect, useRef, useState } from 'react'
import Cabecalho from '../componentes/ui/Cabecalho.jsx'
import Botao from '../componentes/ui/Botao.jsx'
import Campo from '../componentes/ui/Campo.jsx'
import IconeRede from '../componentes/ui/IconeRede.jsx'
import { contato } from '../dados/contato.js'
import { FOTO_CONTATO } from '../dados/cabecalhos.js'
import estilos from './Contato.module.css'

const HREF_WHATSAPP = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(contato.mensagemWhatsApp)}`

const ESTADO_INICIAL = { nome: '', email: '', telefone: '', assunto: '', mensagem: '' }

function validar(valores) {
  const erros = {}
  if (!valores.nome.trim()) erros.nome = 'Informe seu nome.'
  if (!valores.email.trim()) {
    erros.email = 'Informe seu e-mail.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email)) {
    erros.email = 'Informe um e-mail válido.'
  }
  if (!valores.assunto.trim()) erros.assunto = 'Informe o assunto.'
  if (!valores.mensagem.trim()) erros.mensagem = 'Escreva uma mensagem.'
  return erros
}

export default function Contato() {
  const [valores, setValores] = useState(ESTADO_INICIAL)
  const [erros, setErros] = useState({})
  const [enviado, setEnviado] = useState(false)
  // Mesmo padrão do Wizard (Tarefa 10, 8.2/8.3): o foco e o anúncio de erro
  // ficam presos a um contador de tentativas, não ao objeto `erros` em si
  // — `erros` também muda a cada tecla (para limpar o erro do campo sendo
  // corrigido), e chavear nele faria o foco pular a cada dígito digitado.
  const [tentativa, setTentativa] = useState(0)
  const [mensagemErro, setMensagemErro] = useState('')
  const formRef = useRef(null)
  const confirmacaoRef = useRef(null)

  function mudarCampo(campo, valor) {
    setValores((atual) => ({ ...atual, [campo]: valor }))
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  function aoSubmeter(evento) {
    evento.preventDefault()
    const proximosErros = validar(valores)
    if (Object.values(proximosErros).some(Boolean)) {
      setErros(proximosErros)
      setTentativa((atual) => atual + 1)
      return
    }
    setErros({})
    setMensagemErro('')
    setEnviado(true)
  }

  // Roda depois do re-render que já pintou `aria-invalid="true"` nos campos
  // com erro — por isso depende de `tentativa`, e não é chamado direto no
  // handler de submit (o DOM ainda não teria os atributos novos nesse
  // instante).
  useEffect(() => {
    if (tentativa === 0) return
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    const total = Object.values(erros).filter(Boolean).length
    setMensagemErro(
      total > 0 ? `${total} campo${total > 1 ? 's' : ''} com erro. Revise os campos destacados.` : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativa])

  // Sem backend real, "enviar" só troca o formulário por um cartão de
  // confirmação — nunca `alert` (Tarefa 13, decisão de projeto). O foco
  // move para o cartão (tabIndex=-1 + focus), mesmo mecanismo do `<main>`
  // de `Transicao.jsx`: quem usa leitor de tela ouve o texto do cartão
  // porque o foco chegou nele, não porque um `alert` interrompeu a página.
  useEffect(() => {
    if (enviado) confirmacaoRef.current?.focus()
  }, [enviado])

  function enviarNovamente() {
    setValores(ESTADO_INICIAL)
    setErros({})
    setTentativa(0)
    setMensagemErro('')
    setEnviado(false)
  }

  return (
    <>
      <Cabecalho
        etiqueta="Contato"
        titulo="Fale com o Grupo Liderança"
        texto="Estamos à disposição por telefone, WhatsApp, e-mail ou nas nossas unidades."
        foto={FOTO_CONTATO}
      />

      <div className={`container ${estilos.pagina}`}>
        <div className={estilos.colunas}>
          <section className={estilos.canais} aria-labelledby="contato-canais-titulo">
            <h2 id="contato-canais-titulo" className={estilos.tituloColuna}>
              Canais de atendimento
            </h2>

            <ul className={estilos.listaCanais}>
              <li>
                <span className={estilos.rotuloCanal}>Telefone</span>
                <a href={contato.telefoneHref} className={estilos.valorCanal}>
                  {contato.telefone}
                </a>
              </li>
              <li>
                <span className={estilos.rotuloCanal}>WhatsApp</span>
                <a href={HREF_WHATSAPP} className={estilos.valorCanal}>
                  Enviar mensagem
                  <span className={estilos.somenteLeitor}> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <span className={estilos.rotuloCanal}>E-mail</span>
                <a href={`mailto:${contato.email}`} className={estilos.valorCanal}>
                  {contato.email}
                </a>
              </li>
              <li>
                <span className={estilos.rotuloCanal}>Endereço</span>
                <span className={estilos.valorCanal}>{contato.endereco}</span>
              </li>
            </ul>

            <div className={estilos.redes}>
              <span className={estilos.rotuloCanal}>Redes sociais</span>
              <div className={estilos.iconesRedes}>
                {contato.redes.map((rede) => (
                  <a
                    key={rede.id}
                    href={rede.url}
                    className={estilos.iconeRede}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconeRede id={rede.id} />
                    <span className={estilos.somenteLeitor}>
                      {rede.rotulo} (abre em nova aba)
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className={estilos.formularioSecao} aria-labelledby="contato-form-titulo">
            <h2 id="contato-form-titulo" className={estilos.tituloColuna}>
              Envie uma mensagem
            </h2>

            {enviado ? (
              <div
                ref={confirmacaoRef}
                tabIndex={-1}
                role="status"
                className={estilos.confirmacao}
              >
                <span className={estilos.confirmacaoIcone} aria-hidden="true">
                  ✓
                </span>
                <p className={estilos.confirmacaoTitulo}>Mensagem "enviada"!</p>
                <p className={estilos.confirmacaoTexto}>
                  Esta é uma demonstração sem backend: nenhuma mensagem foi realmente enviada.
                  Em um ambiente de produção, você receberia uma resposta em até um dia útil.
                </p>
                <Botao variante="contorno" onClick={enviarNovamente}>
                  Enviar outra mensagem
                </Botao>
              </div>
            ) : (
              <>
                <p className={estilos.somenteLeitor} aria-live="assertive">
                  {mensagemErro}
                </p>
                <form ref={formRef} className={estilos.form} onSubmit={aoSubmeter} noValidate>
                <Campo
                  id="contato-nome"
                  name="name"
                  autoComplete="name"
                  rotulo="Nome"
                  valor={valores.nome}
                  erro={erros.nome}
                  onChange={(v) => mudarCampo('nome', v)}
                />
                <Campo
                  id="contato-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  rotulo="E-mail"
                  valor={valores.email}
                  erro={erros.email}
                  onChange={(v) => mudarCampo('email', v)}
                />
                <Campo
                  id="contato-telefone"
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                  opcional
                  rotulo="Telefone"
                  valor={valores.telefone}
                  erro={erros.telefone}
                  onChange={(v) => mudarCampo('telefone', v)}
                />
                <Campo
                  id="contato-assunto"
                  name="assunto"
                  rotulo="Assunto"
                  valor={valores.assunto}
                  erro={erros.assunto}
                  onChange={(v) => mudarCampo('assunto', v)}
                />
                <Campo
                  id="contato-mensagem"
                  name="mensagem"
                  rotulo="Mensagem"
                  multilinha
                  linhas={5}
                  valor={valores.mensagem}
                  erro={erros.mensagem}
                  onChange={(v) => mudarCampo('mensagem', v)}
                />
                <Botao tipo="submit" variante="primario" className={estilos.enviar}>
                  Enviar mensagem
                </Botao>
              </form>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
