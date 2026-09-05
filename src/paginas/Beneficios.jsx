import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Abas, { idAba, idPainel } from '../componentes/ui/Abas.jsx'
import Botao from '../componentes/ui/Botao.jsx'
import { veiculos } from '../dados/veiculos.js'
import estilos from './Beneficios.module.css'

const PREFIXO_ABAS = 'beneficios'

// Mesma função de `TiposVeiculo.jsx`: acrescenta largura e formato à URL da
// Unsplash sem duplicar a query inteira por variante do srcset.
function comLargura(url, largura) {
  const u = new URL(url)
  u.searchParams.set('w', largura)
  u.searchParams.set('fm', 'webp')
  u.searchParams.set('auto', 'format')
  return u.toString()
}

export default function Beneficios() {
  const [searchParams, setSearchParams] = useSearchParams()
  const semMovimento = useReducedMotion()

  // `Abas` espera `{ id, rotulo }`; `veiculos` traz `{ id, nome }` — convertido
  // aqui, sem mudar o formato dos dados (Tarefa 12, passo 2).
  const itensAba = useMemo(() => veiculos.map(({ id, nome }) => ({ id, rotulo: nome })), [])

  // Estado derivado da URL, não duplicado em useState: `?tipo=` já é a fonte
  // de verdade, e ler direto evita os dois ficarem fora de sincronia.
  // Fallback em "carros" quando o parâmetro está ausente ou não existe em
  // `veiculos` (ex.: `?tipo=aviao`) — sem lançar, só ignora o valor inválido.
  const tipoParam = searchParams.get('tipo')
  const ativo = veiculos.some((veiculo) => veiculo.id === tipoParam) ? tipoParam : 'carros'
  const veiculoAtivo = veiculos.find((veiculo) => veiculo.id === ativo)

  function trocar(id) {
    // `replace: true`: o link fica compartilhável (a URL reflete a aba
    // aberta) sem empilhar uma entrada de histórico por clique — "Voltar"
    // depois de trocar de aba tira da página, não aba por aba.
    setSearchParams(
      (atual) => {
        const proximo = new URLSearchParams(atual)
        proximo.set('tipo', id)
        return proximo
      },
      { replace: true }
    )
  }

  const duracao = semMovimento ? 0 : 0.4
  const atraso = semMovimento ? 0 : 0.08

  const variantesPainel = {
    escondido: { opacity: 0 },
    visivel: {
      opacity: 1,
      transition: { duration: duracao, staggerChildren: atraso, delayChildren: atraso },
    },
    saida: { opacity: 0, transition: { duration: duracao } },
  }

  const variantesItem = {
    escondido: { opacity: 0, y: semMovimento ? 0 : 12 },
    visivel: { opacity: 1, y: 0, transition: { duration: duracao, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <div className={`container ${estilos.pagina}`}>
      <h1 className={estilos.titulo}>Benefícios por tipo de veículo</h1>
      <p className={estilos.subtitulo}>
        Cada categoria tem uma cobertura própria. Escolha o tipo de veículo abaixo para ver
        exatamente o que está incluído.
      </p>

      <Abas
        itens={itensAba}
        ativo={ativo}
        aoTrocar={trocar}
        idPrefixo={PREFIXO_ABAS}
        aria-label="Tipos de veículo"
        className={estilos.abas}
      />

      {/* mode="wait" garante um único painel na árvore por vez — evita dois
          role="tabpanel" simultâneos durante a transição, mesmo problema que
          o mode="wait" do App.jsx resolve para o <main> de rota. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ativo}
          role="tabpanel"
          id={idPainel(PREFIXO_ABAS, ativo)}
          aria-labelledby={idAba(PREFIXO_ABAS, ativo)}
          tabIndex={0}
          className={estilos.painel}
          variants={variantesPainel}
          initial="escondido"
          animate="visivel"
          exit="saida"
        >
          <motion.div variants={variantesItem} className={estilos.fotoWrapper}>
            <img
              className={estilos.foto}
              src={comLargura(veiculoAtivo.foto, 900)}
              srcSet={`${comLargura(veiculoAtivo.foto, 500)} 500w, ${comLargura(veiculoAtivo.foto, 900)} 900w, ${comLargura(veiculoAtivo.foto, 1400)} 1400w`}
              sizes="(max-width: 768px) 100vw, 640px"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <motion.div variants={variantesItem} className={estilos.texto}>
            <h2 className={estilos.nome}>{veiculoAtivo.nome}</h2>
            <p className={estilos.chamada}>{veiculoAtivo.chamada}</p>
            <p className={estilos.descricao}>{veiculoAtivo.descricao}</p>
          </motion.div>

          <motion.div variants={variantesItem} className={estilos.coberturas}>
            <h3 className={estilos.subtituloCoberturas}>Coberturas incluídas</h3>
            <ul className={estilos.grade}>
              {veiculoAtivo.coberturas.map((cobertura) => (
                <li key={cobertura} className={estilos.item}>
                  <svg className={estilos.check} viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      d="M4 10.5l4 4 8-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {cobertura}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={variantesItem} className={estilos.cta}>
            <Botao variante="primario" para={`/cotacao?tipo=${ativo}`}>
              Fazer cotação para {veiculoAtivo.nome.toLowerCase()}
            </Botao>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
