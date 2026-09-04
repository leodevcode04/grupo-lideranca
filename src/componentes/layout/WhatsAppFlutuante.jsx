import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { contato } from '../../dados/contato.js'
import estilos from './WhatsAppFlutuante.module.css'

const LIMIAR_ROLAGEM = 400

const href = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(contato.mensagemWhatsApp)}`

export default function WhatsAppFlutuante() {
  const [visivel, setVisivel] = useState(false)
  const semMovimento = useReducedMotion()

  useEffect(() => {
    function aoRolar() {
      setVisivel(window.scrollY > LIMIAR_ROLAGEM)
    }
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <AnimatePresence>
      {visivel && (
        <motion.a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar no WhatsApp"
          className={estilos.botao}
          initial={{ opacity: 0, y: semMovimento ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: semMovimento ? 0 : 16 }}
          transition={{ duration: semMovimento ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.28-1.38a9.9 9.9 0 0 0 4.71 1.2h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2Zm5.8 14.03c-.24.68-1.4 1.33-1.93 1.4-.5.08-1.12.11-1.8-.11a16 16 0 0 1-1.7-.64c-3-1.3-4.94-4.33-5.09-4.53-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37h.57c.19 0 .43-.04.67.52.24.56.83 1.94.9 2.08.07.15.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.16.3.72 1.2 1.56 1.95 1.07.96 1.98 1.26 2.28 1.4.3.15.47.13.65-.07.19-.2.79-.92.99-1.24.2-.31.4-.26.68-.16.28.1 1.78.84 2.08 1 .3.15.5.23.58.36.08.13.08.75-.17 1.44Z"
            />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
