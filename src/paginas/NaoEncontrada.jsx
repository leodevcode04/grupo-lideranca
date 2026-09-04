import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <div className="container" style={{ paddingTop: '10rem' }}>
      <h1>404 — página não encontrada</h1>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  )
}
