import { motion, useReducedMotion } from 'framer-motion'
import Botao from '../ui/Botao.jsx'
import { numeros } from '../../dados/numeros.js'
import estilos from './Hero.module.css'

const FOTO_HERO =
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1920&q=80'

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
    <section className={`${estilos.hero} grao`}>
      <div
        className={estilos.foto}
        style={{ backgroundImage: `url(${FOTO_HERO})` }}
        aria-hidden="true"
      />
      <div className={estilos.leituraHorizontal} aria-hidden="true" />
      <div className={estilos.leituraVertical} aria-hidden="true" />

      {/* O wrapper externo só existe para herdar o gutter padrão de `.container`
          (mesmo recuo do header/nav); precisa de `width: 100%` (estilos.wrapper)
          porque, sem isso, o `margin-inline: auto` de `.container` centraliza a
          caixa inteira dentro do item flex único de `.hero` — a caixa encolhe
          para o tamanho do conteúdo (max-width 720px) e sobra espaço livre nas
          duas margens, jogando o texto para o centro em vez de alinhado à
          esquerda. */}
      <div className={`container ${estilos.wrapper}`}>
        <div className={estilos.conteudo}>
          <motion.p className={estilos.etiqueta} {...entrada(0)}>
            <span className={estilos.filete} aria-hidden="true" />
            Proteção veicular · desde 2016
          </motion.p>

          <motion.h1 className={estilos.titulo} {...entrada(1)}>
            Proteção veicular com <em className={estilos.destaque}>confiança</em>
          </motion.h1>

          <motion.p className={estilos.paragrafo} {...entrada(2)}>
            Associação com atuação no Sul de Santa Catarina, ressarcimento pela
            tabela FIPE e assistência 24 horas para o seu veículo.
          </motion.p>

          <motion.div className={estilos.botoes} {...entrada(3)}>
            <Botao para="/cotacao" variante="primario">
              Fazer cotação
            </Botao>
            <Botao para="/beneficios" variante="contorno">
              Ver coberturas
            </Botao>
          </motion.div>

          <motion.dl className={estilos.faixa} {...entrada(4)}>
            {numeros.map((numero) => (
              <div key={numero.id} className={estilos.item}>
                <dt className={estilos.valor}>{numero.valor}</dt>
                <dd className={estilos.rotulo}>{numero.rotulo}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  )
}
