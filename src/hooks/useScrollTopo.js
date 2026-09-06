import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Posições salvas por `location.key`, não por `pathname`: duas entradas do
// histórico podem apontar para a mesma rota (ex.: `/blog` visitado duas
// vezes) com rolagens diferentes, e só `key` distingue uma da outra.
const posicoesSalvas = new Map()

// Auditoria da Tarefa 14 (Step 4): a restauração nativa do navegador
// (`history.scrollRestoration = 'auto'`, o padrão) dispara no instante do
// `popstate` — antes de o React sequer começar a re-renderizar a rota de
// destino, e muito antes de a transição de saída da página atual (Framer,
// ~400ms via `Transicao.jsx`) terminar e a nova página ficar montada com
// altura real. Como `AnimatePresence mode="wait"` mantém só a página que
// está saindo no DOM durante esse intervalo, o navegador tenta restaurar a
// posição contra o conteúdo errado (ou contra um `<main>` ainda vazio) e
// descarta a tentativa em silêncio. Isto não foi testado num navegador real
// neste ambiente (ver nota do relatório da Tarefa 14) — é inferência de
// código, não observação — mas o mecanismo acima é suficiente para não
// confiar na restauração nativa aqui: por isso a rolagem é salva e
// restaurada manualmente, e `history.scrollRestoration` é forçado para
// `'manual'` para o navegador não competir com essa restauração.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

export function useScrollTopo() {
  const { pathname, hash, key } = useLocation()
  const tipoNavegacao = useNavigationType()
  const chaveAnterior = useRef(key)

  // Salva a posição da rota que está saindo, não da que está entrando —
  // roda no cleanup do efeito anterior (ou seja, antes do corpo do efeito
  // da rota nova), pegando `window.scrollY` no último instante em que a
  // rota antiga ainda está na tela.
  useEffect(() => {
    return () => {
      posicoesSalvas.set(chaveAnterior.current, window.scrollY)
    }
  }, [key])

  useLayoutEffect(() => {
    chaveAnterior.current = key
    document.getElementById('conteudo')?.focus({ preventScroll: true })

    if (tipoNavegacao === 'POP' && !hash) {
      const posicao = posicoesSalvas.get(key) ?? 0
      // `requestAnimationFrame`: espera a pintura do conteúdo desta rota
      // (montado no mesmo commit deste `useLayoutEffect`, mas ainda sem
      // altura de layout garantida até o navegador pintar o frame) antes de
      // rolar — rolar antes disso pode clampar contra uma altura de
      // documento menor do que a real.
      requestAnimationFrame(() => {
        window.scrollTo({ top: posicao, behavior: 'instant' })
      })
      return
    }

    if (hash) {
      document.querySelector(hash)?.scrollIntoView()
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, tipoNavegacao, key])
}
