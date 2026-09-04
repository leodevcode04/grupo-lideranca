import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Transicao from './componentes/layout/Transicao.jsx'
import Home from './paginas/Home.jsx'
import QuemSomos from './paginas/QuemSomos.jsx'
import Beneficios from './paginas/Beneficios.jsx'
import Unidades from './paginas/Unidades.jsx'
import Blog from './paginas/Blog.jsx'
import Contato from './paginas/Contato.jsx'
import Cotacao from './paginas/Cotacao.jsx'
import NaoEncontrada from './paginas/NaoEncontrada.jsx'

export default function App() {
  const location = useLocation()

  return (
    // mode="wait" é load-bearing: garante exatamente um <main> no DOM por vez.
    // Trocar para "sync" ou "popLayout" coloca dois elementos <main> na página
    // simultaneamente (a página que sai e a que entra), duplicando o landmark.
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
