import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Botao from '../ui/Botao.jsx'
import Logo from '../ui/Logo.jsx'
import MenuMobile from './MenuMobile.jsx'
import { navegacao } from '../../dados/navegacao.js'
import estilos from './Header.module.css'

const LIMIAR_ROLAGEM = 60

export default function Header() {
  const [rolado, setRolado] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const botaoHamburguerRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    function aoRolar() {
      setRolado(window.scrollY > LIMIAR_ROLAGEM)
    }
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  // Fecha o drawer ao trocar de rota (inclusive "voltar" do navegador) e ao
  // cruzar o breakpoint de 900px com ele aberto — acima desse valor o
  // hambúrguer some (display: none) e devolver o foco a ele vira no-op,
  // deixando o foco perdido no <body>.
  useEffect(() => {
    setMenuAberto(false)
  }, [pathname])

  useEffect(() => {
    const consulta = window.matchMedia('(min-width: 901px)')
    function aoCruzarBreakpoint(evento) {
      if (evento.matches) setMenuAberto(false)
    }
    consulta.addEventListener('change', aoCruzarBreakpoint)
    return () => consulta.removeEventListener('change', aoCruzarBreakpoint)
  }, [])

  // A ref é estável, então `[]` é honesto: recriar esta função a cada render
  // do Header a re-executaria o efeito do MenuMobile (que a tem como
  // dependência) e puxaria o foco de volta ao X incondicionalmente.
  const fecharMenu = useCallback(() => {
    setMenuAberto(false)
    botaoHamburguerRef.current?.focus()
  }, [])

  return (
    <>
      <a href="#conteudo" className={estilos.pularConteudo}>
        Pular para o conteúdo
      </a>
      <header className={`${estilos.cabecalho} ${rolado ? estilos.rolado : ''}`}>
        <div className={`container ${estilos.linha}`}>
          <NavLink to="/" className={estilos.logo} aria-label="Grupo Liderança — página inicial">
            <Logo alt="" className={estilos.marca} />
          </NavLink>

          <nav className={estilos.nav} aria-label="Navegação principal">
            <ul className={estilos.listaNav}>
              {navegacao.map((item) => (
                <li key={item.para}>
                  <NavLink
                    to={item.para}
                    className={({ isActive }) =>
                      isActive ? `${estilos.link} ${estilos.linkAtivo}` : estilos.link
                    }
                  >
                    {item.rotulo}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Botao para="/cotacao" variante="primario" className={estilos.cta}>
            Fazer cotação
          </Botao>

          <button
            ref={botaoHamburguerRef}
            type="button"
            className={estilos.hamburguer}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            onClick={() => setMenuAberto(true)}
          >
            <span aria-hidden="true" className={estilos.hamburguerLinha} />
            <span aria-hidden="true" className={estilos.hamburguerLinha} />
            <span aria-hidden="true" className={estilos.hamburguerLinha} />
          </button>
        </div>
      </header>

      <MenuMobile aberto={menuAberto} aoFechar={fecharMenu} navegacao={navegacao} />
    </>
  )
}
