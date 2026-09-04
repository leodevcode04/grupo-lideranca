import { Link } from 'react-router-dom'
import { contato } from '../../dados/contato.js'
import { navegacao } from './Header.jsx'
import estilos from './Footer.module.css'

// Ícone por `id` de rede social, com fallback para um canal desconhecido —
// ver dados/contato.js: a lista existe para que adicionar um canal seja
// edição de dado, não de componente.
const ICONES_REDE = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14 8.5h2.5V5H14c-2.2 0-4 1.8-4 4v2H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9c0-.6.4-1 1-1z"
        fill="currentColor"
      />
    </svg>
  ),
}

function IconeRede({ id }) {
  return ICONES_REDE[id] ?? null
}

export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className={estilos.rodape}>
      <div className={`container ${estilos.grade}`}>
        <div className={estilos.coluna}>
          <p className={estilos.logo}>
            <span className={estilos.logoDourado}>LIDERANÇA</span>
          </p>
          <p className={estilos.institucional}>
            Associação de proteção veicular com cobertura nacional, assistência 24
            horas e indenização de até 100% da tabela FIPE.
          </p>
        </div>

        <nav className={estilos.coluna} aria-label="Navegação institucional">
          <p className={estilos.tituloColuna}>Institucional</p>
          <ul className={estilos.lista}>
            {navegacao.map((item) => (
              <li key={item.para}>
                <Link to={item.para} className={estilos.link}>
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={estilos.coluna}>
          <p className={estilos.tituloColuna}>Contato</p>
          <ul className={estilos.lista}>
            <li>
              <a href={contato.telefoneHref} className={estilos.link}>
                {contato.telefone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contato.email}`} className={estilos.link}>
                {contato.email}
              </a>
            </li>
            <li className={estilos.endereco}>{contato.endereco}</li>
          </ul>
        </div>

        <div className={estilos.coluna}>
          <p className={estilos.tituloColuna}>Redes sociais</p>
          <ul className={estilos.listaRedes}>
            {contato.redes.map((rede) => (
              <li key={rede.id}>
                <a
                  href={rede.url}
                  className={estilos.iconeRede}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={rede.rotulo}
                >
                  <IconeRede id={rede.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={estilos.barraInferior}>
        <div className={`container ${estilos.barraInferiorConteudo}`}>
          <p className={estilos.aviso}>
            Estudo de redesign de portfólio, sem vínculo com o Grupo Liderança.
          </p>
          <p className={estilos.aviso}>&copy; {ano}</p>
        </div>
      </div>
    </footer>
  )
}
