import Hero from '../componentes/home/Hero.jsx'
import TiposVeiculo from '../componentes/home/TiposVeiculo.jsx'
import Diferenciais from '../componentes/home/Diferenciais.jsx'
import ComoFunciona from '../componentes/home/ComoFunciona.jsx'
import Depoimentos from '../componentes/home/Depoimentos.jsx'
import FAQ from '../componentes/home/FAQ.jsx'
import BlogRecente from '../componentes/home/BlogRecente.jsx'
import CtaFinal from '../componentes/home/CtaFinal.jsx'

// Ordem lida como argumento (Tarefa 8, 7.7): promessa → cobertura → por que
// nós → como funciona → prova (Depoimentos) → objeções (FAQ) → pedido
// (CtaFinal). BlogRecente não avança o argumento — vem depois do pedido,
// como bibliografia, não entre a prova e as objeções.
export default function Home() {
  return (
    <>
      <Hero />
      <TiposVeiculo />
      <Diferenciais />
      <ComoFunciona />
      <Depoimentos />
      <FAQ />
      <BlogRecente />
      <CtaFinal />
    </>
  )
}
