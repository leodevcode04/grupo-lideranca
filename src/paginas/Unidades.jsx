import { useId, useMemo, useState } from 'react'
import Cabecalho from '../componentes/ui/Cabecalho.jsx'
import Revelar from '../componentes/ui/Revelar.jsx'
import { unidades } from '../dados/unidades.js'
import { FOTO_UNIDADES } from '../dados/cabecalhos.js'
import estilos from './Unidades.module.css'

// Comparação sem acento e sem caixa: "tubarao" deve encontrar "Tubarão", e
// "sc" deve encontrar unidades com uf "SC". `normalize('NFD')` separa os
// acentos dos caracteres-base como marcas combinantes independentes, que o
// `replace` abaixo então descarta.
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export default function Unidades() {
  const [busca, setBusca] = useState('')
  const idStatus = useId()

  const resultado = useMemo(() => {
    const termo = normalizar(busca.trim())
    if (!termo) return unidades
    return unidades.filter(
      (unidade) =>
        normalizar(unidade.cidade).includes(termo) || normalizar(unidade.uf).includes(termo)
    )
  }, [busca])

  return (
    <>
      <Cabecalho
        etiqueta="Unidades"
        titulo="Encontre a unidade mais perto de você"
        texto="Busque por cidade ou estado para ver endereço, telefone e a unidade matriz."
        foto={FOTO_UNIDADES}
      />

      <div className={`container ${estilos.pagina}`}>
        <div className={estilos.busca}>
          <label htmlFor="busca-unidades" className={estilos.rotuloBusca}>
            Buscar por cidade ou UF
          </label>
          <input
            id="busca-unidades"
            type="search"
            className={estilos.input}
            placeholder="Ex.: Tubarão, Criciúma, SC…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-describedby={idStatus}
          />
        </div>

        {/* Live-filtering muda os resultados a cada tecla, sob o mesmo campo
            que o usuário está olhando — visualmente óbvio, mas silencioso
            para quem usa leitor de tela. `aria-live="polite"` anuncia a
            contagem depois de cada mudança, sem interromper a digitação
            (region atualizada, não focada). */}
        <p id={idStatus} className={estilos.status} aria-live="polite">
          {resultado.length === 0
            ? 'Nenhuma unidade encontrada.'
            : `${resultado.length} unidade${resultado.length === 1 ? '' : 's'} encontrada${resultado.length === 1 ? '' : 's'}.`}
        </p>

        {resultado.length === 0 ? (
          <div className={estilos.vazio}>
            <p>
              Não encontramos nenhuma unidade para “{busca}”. Tente buscar pelo nome da cidade ou
              pela sigla do estado (SC, RS).
            </p>
          </div>
        ) : (
          <div className={estilos.grade}>
            {resultado.map((unidade, indice) => (
              <Revelar
                key={unidade.id}
                as="article"
                atraso={indice * 90}
                className={estilos.card}
              >
                {unidade.matriz && <span className={estilos.selo}>Matriz</span>}
                <h2 className={estilos.cidade}>
                  {unidade.cidade} <span className={estilos.uf}>— {unidade.uf}</span>
                </h2>
                <p className={estilos.endereco}>{unidade.endereco}</p>
                <a href={unidade.telefoneHref} className={estilos.telefone}>
                  {unidade.telefone}
                </a>
              </Revelar>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
