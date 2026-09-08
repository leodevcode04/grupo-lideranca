import { Link } from 'react-router-dom'
import { contato } from '../../dados/contato.js'
import { navegacao } from '../../dados/navegacao.js'
import IconeRede from '../ui/IconeRede.jsx'
import Logo from '../ui/Logo.jsx'
import estilos from './Footer.module.css'

export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className={estilos.rodape}>
      <div className={`container ${estilos.grade}`}>
        <div className={estilos.coluna}>
          <Logo className={estilos.marca} />
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
