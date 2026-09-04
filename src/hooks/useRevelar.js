import { useEffect, useRef, useState } from 'react'

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

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          observador.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: margem }
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [margem])

  return { ref, visivel }
}
