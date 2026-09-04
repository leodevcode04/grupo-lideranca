// Ícone por `id` de rede social, com fallback para um canal desconhecido —
// ver dados/contato.js: a lista existe para que adicionar um canal seja
// edição de dado, não de componente. Peça sem domínio: usada pelo Footer
// (Tarefa 5) e pela página de Contato (Tarefa 13).
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

export default function IconeRede({ id }) {
  return ICONES_REDE[id] ?? null
}
