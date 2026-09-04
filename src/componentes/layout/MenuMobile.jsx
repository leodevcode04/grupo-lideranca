import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Botao from '../ui/Botao.jsx'
import estilos from './MenuMobile.module.css'

const SELETOR_FOCAVEL =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function MenuMobile({ aberto, aoFechar, navegacao }) {
  const semMovimento = useReducedMotion()
  const painelRef = useRef(null)
  const botaoFecharRef = useRef(null)

  // Enquanto aberto: trava o scroll da página atrás do drawer, move o foco
  // para dentro dele e restaura tudo no cleanup — inclusive quando o
  // componente fecha por qualquer via (item, X ou Escape), já que todas
  // passam por `aoFechar` e mudam `aberto` para false.
  useEffect(() => {
    if (!aberto) return

    const overflowOriginal = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    botaoFecharRef.current?.focus()

    function aoTeclar(evento) {
      if (evento.key === 'Escape') {
        evento.preventDefault()
        aoFechar()
        return
      }

      if (evento.key !== 'Tab') return

      const painel = painelRef.current
      if (!painel) return

      const focaveis = Array.from(painel.querySelectorAll(SELETOR_FOCAVEL)).filter(
        (el) => el.offsetParent !== null
      )
      if (focaveis.length === 0) return

      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primeiro.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.body.style.overflow = overflowOriginal
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto, aoFechar])

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          id="menu-mobile"
          ref={painelRef}
          className={estilos.drawer}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: semMovimento ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={estilos.topo}>
            <span className={estilos.logo}>
              <span className={estilos.logoDourado}>LIDERANÇA</span>
            </span>
            <button
              ref={botaoFecharRef}
              type="button"
              className={estilos.fechar}
              aria-label="Fechar menu"
              onClick={aoFechar}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <ul className={estilos.lista}>
            {navegacao.map((item, indice) => (
              <motion.li
                key={item.para}
                initial={{ opacity: 0, y: semMovimento ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: semMovimento ? 0 : 0.4,
                  delay: semMovimento ? 0 : indice * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <NavLink
                  to={item.para}
                  className={({ isActive }) =>
                    isActive ? `${estilos.link} ${estilos.linkAtivo}` : estilos.link
                  }
                  onClick={aoFechar}
                >
                  {item.rotulo}
                </NavLink>
              </motion.li>
            ))}
          </ul>

          <div className={estilos.rodape}>
            <Botao para="/cotacao" variante="primario" className={estilos.cta} onClick={aoFechar}>
              Fazer cotação
            </Botao>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
