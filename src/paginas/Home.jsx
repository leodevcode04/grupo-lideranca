import Hero from '../componentes/home/Hero.jsx'
import TiposVeiculo from '../componentes/home/TiposVeiculo.jsx'
import Diferenciais from '../componentes/home/Diferenciais.jsx'
import ComoFunciona from '../componentes/home/ComoFunciona.jsx'
import Depoimentos from '../componentes/home/Depoimentos.jsx'
import BlogRecente from '../componentes/home/BlogRecente.jsx'
import FAQ from '../componentes/home/FAQ.jsx'
import CtaFinal from '../componentes/home/CtaFinal.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <TiposVeiculo />
      <Diferenciais />
      <ComoFunciona />
      <Depoimentos />
      <BlogRecente />
      <FAQ />
      <CtaFinal />
    </>
  )
}
