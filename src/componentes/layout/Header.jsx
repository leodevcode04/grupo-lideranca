import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Botao from '../ui/Botao.jsx'
import MenuMobile from './MenuMobile.jsx'
import estilos from './Header.module.css'

// Fonte única de navegação institucional: o Footer (Tarefa 5) reimporta este
// array em vez de duplicá-lo.
export const navegacao = [
  { rotulo: 'Quem somos', para: '/quem-somos' },
  { rotulo: 'Benefícios', para: '/beneficios' },
  { rotulo: 'Unidades', para: '/unidades' },
  { rotulo: 'Blog', para: '/blog' },
  { rotulo: 'Contato', para: '/contato' },
]

const LIMIAR_ROLAGEM = 60

export default function Header() {
  const [rolado, setRolado] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const botaoHamburguerRef = useRef(null)

  useEffect(() => {
    function aoRolar() {
      setRolado(window.scrollY > LIMIAR_ROLAGEM)
    }
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  function fecharMenu() {
    setMenuAberto(false)
    botaoHamburguerRef.current?.focus()
  }

  return (
    <>
      <a href="#conteudo" className={estilos.pularConteudo}>
        Pular para o conteúdo
      </a>
      <header className={`${estilos.cabecalho} ${rolado ? estilos.rolado : ''}`}>
        <div className={`container ${estilos.linha}`}>
          <NavLink to="/" className={estilos.logo}>
            <span className={estilos.logoDourado}>LIDERANÇA</span>
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
            aria-label="Abrir menu"
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
