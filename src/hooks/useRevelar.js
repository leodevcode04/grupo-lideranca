import { useEffect, useRef, useState } from 'react'

// Registro de observadores compartilhados por configuração (threshold +
// rootMargin), em vez de um `IntersectionObserver` por chamada de
// `useRevelar` (Tarefa 8, 7.10). A página cria 34 instâncias no mount hoje —
// tipos (5), diferenciais (5), comoFunciona (4), depoimentos (4), blog (4),
// faq (11), cta (1) — cada uma se desconectando após disparar. Não é
// problema de runtime (fica zero em repouso), mas de forma, e as Tarefas 12
// e 13 só aumentariam a contagem.
//
// Como todo chamador hoje usa a mesma margem padrão, a chave resolve para
// uma única entrada — 34 observadores viram 1 — mas o registro continua
// correto se uma tarefa futura passar uma `margem` diferente: cria-se uma
// segunda entrada para aquela configuração, não uma por elemento. Nenhuma
// API muda: `Revelar` e `useRevelar` continuam com a mesma assinatura.
const registros = new Map()

function obterRegistro(chave, threshold, margem) {
  let registro = registros.get(chave)
  if (registro) return registro

  const callbacks = new Map()
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue
        const callback = callbacks.get(entrada.target)
        if (callback) callback()
        observador.unobserve(entrada.target)
        callbacks.delete(entrada.target)
      }
    },
    { threshold, rootMargin: margem }
  )

  registro = { observador, callbacks }
  registros.set(chave, registro)
  return registro
}

export function useRevelar({ margem = '0px 0px -12% 0px' } = {}) {
  const ref = useRef(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisivel(true)
      return
    }

    const threshold = 0
    const chave = `${threshold}|${margem}`
    const { observador, callbacks } = obterRegistro(chave, threshold, margem)

    callbacks.set(el, () => setVisivel(true))
    observador.observe(el)

    return () => {
      callbacks.delete(el)
      observador.unobserve(el)
    }
  }, [margem])

  return { ref, visivel }
}
