import { motion, useReducedMotion } from 'framer-motion'
import { useScrollTopo } from '../../hooks/useScrollTopo.js'
import estilos from './Transicao.module.css'

export default function Transicao({ children }) {
  const semMovimento = useReducedMotion()
  useScrollTopo()

  return (
    <motion.main
      id="conteudo"
      tabIndex={-1}
      className={estilos.pagina}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: semMovimento ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}
