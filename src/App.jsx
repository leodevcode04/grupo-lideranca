import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollTopo } from './hooks/useScrollTopo.js'
import Home from './paginas/Home.jsx'
import QuemSomos from './paginas/QuemSomos.jsx'
import Beneficios from './paginas/Beneficios.jsx'
import Unidades from './paginas/Unidades.jsx'
import Blog from './paginas/Blog.jsx'
import Contato from './paginas/Contato.jsx'
import Cotacao from './paginas/Cotacao.jsx'
import NaoEncontrada from './paginas/NaoEncontrada.jsx'

function Transicao({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()
  useScrollTopo()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Transicao><Home /></Transicao>} />
        <Route path="/quem-somos" element={<Transicao><QuemSomos /></Transicao>} />
        <Route path="/beneficios" element={<Transicao><Beneficios /></Transicao>} />
        <Route path="/unidades" element={<Transicao><Unidades /></Transicao>} />
        <Route path="/blog" element={<Transicao><Blog /></Transicao>} />
        <Route path="/contato" element={<Transicao><Contato /></Transicao>} />
        <Route path="/cotacao" element={<Transicao><Cotacao /></Transicao>} />
        <Route path="*" element={<Transicao><NaoEncontrada /></Transicao>} />
      </Routes>
    </AnimatePresence>
  )
}
