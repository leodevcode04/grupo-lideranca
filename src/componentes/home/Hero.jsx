import { motion, useReducedMotion } from 'framer-motion'
import Botao from '../ui/Botao.jsx'
import Etiqueta from '../ui/Etiqueta.jsx'
import FaixaNumeros from '../ui/FaixaNumeros.jsx'
import { numeros } from '../../dados/numeros.js'
import { FOTO_HERO } from '../../dados/hero.js'
import estilos from './Hero.module.css'

// Adiciona largura e formato à URL da Unsplash sem duplicar a query inteira
// por variante — usado para montar o srcset abaixo. A foto do hero é a
// única acima da dobra: fica eager (é o LCP), mas ganha uma variante mais
// estreita para não custar 466 KB de imagem 1920px a um celular de 375.
function comLargura(url, largura) {
  const u = new URL(url)
  u.searchParams.set('w', largura)
  u.searchParams.set('fm', 'webp')
  u.searchParams.set('auto', 'format')
  return u.toString()
}

export default function Hero() {
  const semMovimento = useReducedMotion()

  function entrada(indice) {
    return {
      initial: { opacity: 0, y: semMovimento ? 0 : 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: semMovimento ? 0 : 0.6,
        delay: semMovimento ? 0 : indice * 0.08,
        ease: [0.22, 1, 0.36, 1],
      },
    }
  }

  return (
    // Sangra sob o header translúcido (Tarefa 5, passo 8.2): min-height em
    // svh + padding-top de --altura-cabecalho, em vez do padding-top que o
    // .secao:first-child dá às seções comuns. É a variante "hero com foto".
    <section className={`${estilos.hero} grao`}>
      <img
        className={estilos.foto}
        src={comLargura(FOTO_HERO, 1920)}
        srcSet={`${comLargura(FOTO_HERO, 900)} 900w, ${comLargura(FOTO_HERO, 1920)} 1920w`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        decoding="async"
      />
      <div className={estilos.leituraHorizontal} aria-hidden="true" />
      <div className={estilos.leituraVertical} aria-hidden="true" />

      {/* O wrapper externo só existe para herdar o gutter padrão de `.container`
          (mesmo recuo do header/nav); precisa de `width: 100%` (estilos.wrapper)
          porque, sem isso, o `margin-inline: auto` de `.container` centraliza a
          caixa inteira dentro do item flex único de `.hero` — a caixa encolhe
          para o tamanho do conteúdo (max-width 720px) e sobra espaço livre nas
          duas margens, jogando o texto para o centro em vez de alinhado à
          esquerda. O gutter também é o que protege o anel de foco dos botões
          do `overflow: hidden` de `.grao` — não remova sem repor o respiro. */}
      <div className={`container ${estilos.wrapper}`}>
        <div className={estilos.conteudo}>
          <motion.div className={estilos.etiquetaWrapper} {...entrada(0)}>
            <Etiqueta>Associação de proteção veicular · Sul de Santa Catarina</Etiqueta>
          </motion.div>

          <motion.h1 className={estilos.titulo} {...entrada(1)}>
            Indenização de até <em className={estilos.destaque}>100% da FIPE</em>
          </motion.h1>

          <motion.p className={estilos.paragrafo} {...entrada(2)}>
            Assistência 24 horas, vistoria simples e adesão sem burocracia —
            proteção ativa no mesmo dia.
          </motion.p>

          <motion.div className={estilos.botoes} {...entrada(3)}>
            <Botao para="/cotacao" variante="primario">
              Fazer cotação
            </Botao>
            <Botao para="/beneficios" variante="contorno">
              Ver coberturas
            </Botao>
          </motion.div>

          <motion.div className={estilos.faixaWrapper} {...entrada(4)}>
            <FaixaNumeros itens={numeros} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
