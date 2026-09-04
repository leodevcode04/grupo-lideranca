import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export function useScrollTopo() {
  const { pathname, hash } = useLocation()
  const tipoNavegacao = useNavigationType()

  useLayoutEffect(() => {
    document.getElementById('conteudo')?.focus({ preventScroll: true })

    // Voltar/avançar: deixa o navegador restaurar a posição anterior.
    if (tipoNavegacao === 'POP' && !hash) return

    if (hash) {
      document.querySelector(hash)?.scrollIntoView()
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, tipoNavegacao])
}
