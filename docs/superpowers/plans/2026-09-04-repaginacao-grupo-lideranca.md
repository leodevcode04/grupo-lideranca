# Repaginação Grupo Liderança — Plano de Implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development
> (recomendado) ou superpowers:executing-plans para implementar este plano tarefa a
> tarefa. Os passos usam checkbox (`- [ ]`) para acompanhamento.

**Goal:** Construir um site de portfólio em React para o Grupo Liderança Proteção
Veicular, com sete rotas, identidade visual "Confiança Premium" e um wizard de cotação
em quatro etapas.

**Architecture:** SPA em React com rotas reais via React Router. Conteúdo isolado em
módulos de dados, componentes de UI sem conhecimento de domínio, componentes de seção
compondo UI com dados, páginas apenas orquestrando seções. Estilo por CSS Modules sobre
design tokens em custom properties.

**Tech Stack:** React 18, Vite, React Router v6, Framer Motion, CSS Modules, Vitest.

---

## Nota sobre testes

O spec define testes automatizados apenas para `dados/calculo.js` — a única regra de
negócio real do projeto. Essa tarefa segue TDD estrito. As demais são verificadas
visualmente no navegador, com critérios de aceite explícitos em cada uma.

## Nota sobre CSS

O plano fixa **estrutura, props, contratos de dados e comportamento**. As declarações
decorativas de CSS são escritas durante a implementação, guiadas pelos tokens da Tarefa 1
e pela direção visual do spec. Cada tarefa lista os requisitos visuais que precisam ser
atendidos — eles são o critério de aceite, não sugestão.

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/main.jsx` | Monta a árvore React, envolve em `BrowserRouter` |
| `src/App.jsx` | Layout persistente e tabela de rotas |
| `src/estilos/tokens.css` | Custom properties: cor, tipografia, espaçamento, raio, sombra |
| `src/estilos/global.css` | Reset, base do documento, importação de fontes |
| `src/hooks/useRevelar.js` | IntersectionObserver para reveal de scroll |
| `src/hooks/useScrollTopo.js` | Volta ao topo a cada troca de rota |
| `src/componentes/ui/*` | Peças reutilizáveis sem domínio: Botao, Secao, Revelar, Acordeao, Estrelas, Abas |
| `src/componentes/layout/*` | Header, MenuMobile, Footer, WhatsAppFlutuante |
| `src/componentes/home/*` | Seções da home, uma por arquivo |
| `src/componentes/cotacao/*` | Wizard, BarraProgresso e as quatro etapas |
| `src/paginas/*` | Uma página por rota |
| `src/dados/*` | Conteúdo e a função de cálculo |

---

### Task 1: Scaffold do projeto e design tokens ✅

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`
- Create: `src/main.jsx`, `src/App.jsx`
- Create: `src/estilos/tokens.css`, `src/estilos/global.css`

- [ ] **Step 1: Escrever `package.json`**

O scaffold é escrito à mão — `npm create vite` abre prompt interativo numa pasta que já
tem `docs/` e `.git/`, e prompt trava execução automatizada.

```json
{
  "name": "grupo-lideranca",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "framer-motion": "^11.15.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.7",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Escrever `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
    passWithNoTests: true,
  },
})
```

O glob inclui `.jsx` porque `include` **substitui** o padrão do Vitest — sem isso um
teste em arquivo `.jsx` nunca roda e o relatório sai verde. `passWithNoTests` evita que
`npm test` saia com código 1 nas tarefas anteriores à 9, quando ainda não existe teste.

- [ ] **Step 3: Escrever `index.html` na raiz**

O `preconnect` para `fonts.gstatic.com` corta um salto do caminho crítico: como as
fontes são pedidas por `@import` dentro do CSS, o navegador só descobre o domínio depois
de baixar e parsear o bundle.

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0B1A2E" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230B1A2E'/%3E%3Cpath d='M11 8h3v13h7v3h-10z' fill='%23C6A04A'/%3E%3C/svg%3E" />
    <title>Grupo Liderança — Proteção Veicular</title>
    <meta name="description" content="Proteção veicular para carros, motos e caminhões. Cobertura nacional, assistência 24h e indenização de até 100% da tabela FIPE." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Instalar as dependências**

Run: `npm install`
Expected: termina sem erro de peer dependency. Se `npm` não estiver no PATH do shell,
reporte como BLOCKED em vez de tentar contornar.

- [ ] **Step 5: Escrever `src/estilos/tokens.css`**

```css
:root {
  /* Cor */
  --azul-noite: #0B1A2E;
  --azul-noite-rgb: 11, 26, 46;   /* para superfícies translúcidas */
  --azul-profundo: #071320;
  --azul-elevado: #12263F;
  --azul-borda: rgba(234, 240, 247, 0.10);        /* divisores decorativos */
  --azul-borda-forte: rgba(234, 240, 247, 0.38);  /* contorno de campo de formulário — 3.24:1, acima do mínimo de 3:1 */
  --dourado: #C6A04A;
  --dourado-claro: #E0C079;
  --gelo: #EAF0F7;
  --gelo-suave: rgba(234, 240, 247, 0.60);
  --gelo-tenue: rgba(234, 240, 247, 0.50);        /* mínimo para texto normal; abaixo disso reprova AA */

  /* Tipografia */
  --fonte-titulo: 'Fraunces', Georgia, serif;
  --fonte-corpo: 'Manrope', system-ui, sans-serif;

  --t-hero: clamp(2.75rem, 7vw, 5.5rem);
  --t-secao: clamp(2rem, 4.5vw, 3.25rem);
  --t-card: clamp(1.15rem, 2vw, 1.4rem);
  --t-corpo: clamp(1rem, 1.4vw, 1.0625rem);
  --t-mini: 0.8125rem;

  /* Espaçamento */
  --e-1: 0.5rem;
  --e-2: 1rem;
  --e-3: 1.5rem;
  --e-4: 2rem;
  --e-5: 2.5rem;
  --e-6: 4rem;
  --e-7: 6rem;
  --e-secao: clamp(5rem, 12vw, 9rem);

  /* Forma */
  --raio: 4px;
  --raio-card: 10px;
  --largura-max: 1280px;

  /* Elevação */
  --sombra-card: 0 1px 2px rgba(7, 19, 32, 0.40), 0 8px 24px rgba(7, 19, 32, 0.35);
  --sombra-flutuante: 0 12px 32px rgba(7, 19, 32, 0.55);

  /* Camadas */
  --z-grao: 1;
  --z-cabecalho: 100;
  --z-flutuante: 200;
  --z-menu: 300;

  /* Movimento */
  --transicao: 400ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-reduced-motion: reduce) {
  :root { --transicao: 1ms; }
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    animation-delay: 0s !important;
    transition-duration: 1ms !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
}
```

**Regras que valem para as 13 tarefas seguintes:**

- Nenhuma cor, sombra ou `z-index` literal fora deste arquivo. Se faltar um token,
  reporte em vez de inventar um valor solto.
- O bloco `prefers-reduced-motion` acima **não alcança o Framer Motion**, que anima por
  `style` inline. Por isso o `main.jsx` envolve a árvore em `<MotionConfig
  reducedMotion="user">` (Step 7) — é o que faz a preferência valer de verdade.
- `--gelo-tenue` é o piso para texto de tamanho normal. Para algo mais apagado que isso,
  use só em elemento decorativo ou em texto grande.

- [ ] **Step 6: Escrever `src/estilos/global.css`**

Importa as fontes do Google Fonts no topo (`Fraunces` com eixos opticais e `Manrope`),
importa `tokens.css`, aplica reset (`margin: 0`, `box-sizing: border-box`), define
`body` com `--fonte-corpo`, `--gelo` sobre `--azul-noite`, `line-height: 1.65` e
`-webkit-font-smoothing: antialiased`. Títulos usam `--fonte-titulo` com
`line-height: 1.05`. Define `:focus-visible` com contorno de 2px em `--dourado` e
offset de 3px. Adiciona `.container` com `max-width: var(--largura-max)`, margem
automática e padding lateral de `clamp(1.25rem, 5vw, 3rem)`.

Inclui ainda, porque cada um desses evita repetição nas 13 tarefas seguintes:

```css
input, select, textarea, button { font: inherit; color: inherit; }
ul, ol { margin: 0; padding: 0; list-style: none; }
h1, h2, h3, h4, h5, h6 { font-family: var(--fonte-titulo); line-height: 1.05; font-weight: 400; }
```

Sem o primeiro, todo campo do wizard e do formulário de contato renderiza em Arial 13px
no meio de um site em Manrope. Sem o segundo, acordeão, abas, navegação e grades de
coberturas repetem o mesmo reset. `h5` e `h6` entram na regra de título junto com os
demais.

Define também a textura de grão usada pelo hero e pelos cabeçalhos internos, como
utilitário reaproveitável:

```css
/* Aplique em qualquer seção que precise da textura. O elemento vira contexto de
   posicionamento e recorta a própria textura — o consumidor não precisa lembrar disso. */
.grao {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.grao::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: var(--z-grao);
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='r'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23r)'/%3E%3C/svg%3E");
}
```

Atenção nas tarefas seguintes: `overflow: hidden` recorta o anel de foco
(`outline-offset: 3px`) de qualquer botão encostado na borda de uma seção `.grao`.
Ao posicionar CTAs dentro do hero, deixe respiro suficiente da borda.

- [ ] **Step 7: Escrever `src/main.jsx`**

A ordem dos imports importa: `global.css` vem **primeiro**, antes de `App.jsx`. Módulos
ES avaliam na ordem, então importar `App.jsx` antes faria todo CSS Module alcançável por
ele ser emitido antes do `global.css` — e o global passaria a ganhar dos módulos em
empates de especificidade, quebrando silenciosamente o estilo dos componentes das
tarefas seguintes.

```jsx
import './estilos/global.css'   // primeiro: os CSS Modules precisam vencer os empates
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </React.StrictMode>
)
```

- [ ] **Step 8: `src/App.jsx` provisório**

```jsx
export default function App() {
  return <h1 className="container">Grupo Liderança</h1>
}
```

- [ ] **Step 9: Rodar e conferir**

Run: `npm run dev`
Expected: a página abre em azul-noite, com "Grupo Liderança" em serifada creme. Se a
fonte aparecer como Times ou o fundo branco, as fontes ou o `global.css` não carregaram.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Adiciona scaffold Vite e design tokens"
```

---

### Task 2: Roteamento, layout persistente e transição entre rotas

**Files:**
- Modify: `src/App.jsx`
- Create: `src/hooks/useScrollTopo.js`
- Create: `src/paginas/Home.jsx`, `QuemSomos.jsx`, `Beneficios.jsx`, `Unidades.jsx`, `Blog.jsx`, `Contato.jsx`, `Cotacao.jsx`, `NaoEncontrada.jsx`

- [ ] **Step 1: Criar `src/hooks/useScrollTopo.js`**

```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollTopo() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}
```

- [ ] **Step 2: Criar as oito páginas como stub**

Cada uma no formato abaixo, trocando nome e texto:

```jsx
export default function Home() {
  return <div className="container" style={{ paddingTop: '10rem' }}><h1>Home</h1></div>
}
```

`NaoEncontrada.jsx` exibe "404 — página não encontrada" e um link para `/`.

- [ ] **Step 3: Escrever `src/App.jsx` com as rotas e a transição**

```jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollTopo } from './hooks/useScrollTopo.js'
import Home from './paginas/Home.jsx'
import QuemSomos from './paginas/QuemSomos.jsx'
import Beneficios from './paginas/Beneficios.jsx'
import Unidades from './paginas/Unidades.jsx'
import Blog from './paginas/Blog.jsx'
import Contato from './paginas/Contato.jsx'
import Cotacao from './paginas/Cotacao.jsx'
import NaoEncontrada from './paginas/NaoEncontrada.jsx'

function Transicao({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()
  useScrollTopo()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Transicao><Home /></Transicao>} />
        <Route path="/quem-somos" element={<Transicao><QuemSomos /></Transicao>} />
        <Route path="/beneficios" element={<Transicao><Beneficios /></Transicao>} />
        <Route path="/unidades" element={<Transicao><Unidades /></Transicao>} />
        <Route path="/blog" element={<Transicao><Blog /></Transicao>} />
        <Route path="/contato" element={<Transicao><Contato /></Transicao>} />
        <Route path="/cotacao" element={<Transicao><Cotacao /></Transicao>} />
        <Route path="*" element={<Transicao><NaoEncontrada /></Transicao>} />
      </Routes>
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Conferir no navegador**

Run: `npm run dev`, então visite `/`, `/beneficios` e `/rota-inexistente`.
Expected: cada rota renderiza sua página; a inexistente cai no 404. Digitar a URL
direto no navegador funciona (o dev server do Vite já faz o fallback de SPA).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Adiciona roteamento, páginas stub e transição entre rotas"
```

---

### Task 3: Componentes de UI base

**Files:**
- Create: `src/hooks/useRevelar.js`
- Create: `src/componentes/ui/Revelar.jsx` + `.module.css`
- Create: `src/componentes/ui/Botao.jsx` + `.module.css`
- Create: `src/componentes/ui/Secao.jsx` + `.module.css`
- Create: `src/componentes/ui/Estrelas.jsx` + `.module.css`

- [ ] **Step 1: Criar `useRevelar.js`**

```jsx
import { useEffect, useRef, useState } from 'react'

export function useRevelar({ margem = '0px 0px -12% 0px' } = {}) {
  const ref = useRef(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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
```

- [ ] **Step 2: Criar `Revelar.jsx`**

Recebe `children`, `atraso` (número em ms, padrão `0`) e `as` (tag, padrão `'div'`).
Usa `useRevelar`, aplica a classe de revelado quando `visivel` e passa o atraso via
`style={{ transitionDelay: `${atraso}ms` }}`. No CSS: estado inicial com
`opacity: 0; transform: translateY(28px)`, estado revelado zerando ambos, transição de
`700ms` com a curva dos tokens.

- [ ] **Step 3: Criar `Botao.jsx`**

Props: `variante` (`'primario' | 'contorno' | 'texto'`, padrão `'primario'`), `para`
(rota interna — renderiza `Link`), `href` (link externo — renderiza `<a>` com
`target="_blank"` e `rel="noreferrer"`), `onClick` (renderiza `<button>`), `tipo`,
`desabilitado`, `children`.

Requisitos visuais: `primario` em `--dourado` com texto `--azul-noite`; `contorno` com
borda de 1px em `--azul-borda` e texto `--gelo`; `texto` sem fundo, com sublinhado
dourado que cresce no hover. Todos com `--raio`, padding de `1rem 2rem`, peso 600 e
transição dos tokens. Estado `:disabled` com opacidade reduzida e cursor bloqueado.

- [ ] **Step 4: Criar `Secao.jsx`**

Props: `id`, `etiqueta` (texto miúdo em versalete dourado acima do título), `titulo`,
`subtitulo`, `fundo` (`'noite' | 'profundo' | 'elevado'`, padrão `'noite'`),
`children`, `centralizado` (booleano).

Renderiza `<section>` com padding vertical `--e-secao`, um `.container` interno, e o
cabeçalho envolto em `Revelar`. A etiqueta leva um filete dourado de 24px antes do
texto.

- [ ] **Step 5: Criar `Estrelas.jsx`**

Props: `nota` (1 a 5). Renderiza cinco SVGs de estrela, preenchidas em `--dourado` até
`nota` e em `--gelo-tenue` no restante. Inclui
`aria-label={`${nota} de 5 estrelas`}` e `role="img"`.

- [ ] **Step 6: Conferir**

Renderize os quatro componentes temporariamente na Home e confira no navegador que os
botões respondem ao hover, o `Revelar` anima ao rolar e as estrelas mostram a nota
certa. Depois desfaça essa renderização temporária.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Adiciona componentes de UI base e hook de reveal"
```

---

### Task 4: Módulos de dados

**Files:**
- Create: `src/dados/veiculos.js`, `diferenciais.js`, `faq.js`, `depoimentos.js`, `posts.js`, `unidades.js`, `contato.js`

Conteúdo aproximado nesta fase — os dados reais entram numa passada posterior.

- [ ] **Step 1: `src/dados/veiculos.js`**

```js
export const veiculos = [
  {
    id: 'carros',
    nome: 'Carros',
    chamada: 'Proteção completa para o seu automóvel.',
    foto: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
    coberturas: [
      'Roubo e furto', 'Colisão e perda total', 'Incêndio', 'Fenômenos naturais',
      'Carro reserva', 'Rastreador', 'Assistência 24h', 'Vidros e retrovisores',
    ],
  },
  {
    id: 'motos',
    nome: 'Motos',
    chamada: 'Sua moto protegida em qualquer estrada.',
    foto: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80',
    coberturas: [
      'Roubo e furto', 'Colisão e perda total', 'Incêndio', 'Fenômenos naturais',
      'Rastreador', 'Assistência 24h', 'Guincho especializado',
    ],
  },
  {
    id: 'caminhoes-34',
    nome: 'Caminhões 3/4',
    chamada: 'Cobertura sob medida para o transporte leve.',
    foto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80',
    coberturas: [
      'Roubo e furto', 'Colisão e perda total', 'Incêndio', 'Rastreador',
      'Assistência 24h', 'Guincho pesado',
    ],
  },
  {
    id: 'caminhoes-pesados',
    nome: 'Caminhões Pesados',
    chamada: 'Seu patrimônio de trabalho sob guarda.',
    foto: 'https://images.unsplash.com/photo-1586191582151-f73872dfd183?w=1200&q=80',
    coberturas: [
      'Roubo e furto', 'Colisão e perda total', 'Incêndio', 'Rastreador',
      'Assistência 24h', 'Guincho pesado', 'Cobertura de carreta',
    ],
  },
]
```

- [ ] **Step 2: Demais módulos, nos formatos abaixo**

```js
// diferenciais.js — quatro itens
export const diferenciais = [
  { id: 'adesao', titulo: 'Adesão sem burocracia',
    texto: 'Sem análise de perfil e sem letras miúdas. Vistoria simples e proteção ativa no mesmo dia.' },
  { id: 'nacional', titulo: 'Cobertura nacional',
    texto: 'Rede de atendimento em todo o território brasileiro, com o melhor custo-benefício do segmento.' },
  { id: 'assistencia', titulo: 'Assistência 24 horas',
    texto: 'Guincho, chaveiro, pane seca e socorro elétrico a qualquer hora, todos os dias do ano.' },
  { id: 'fipe', titulo: 'Até 100% da FIPE',
    texto: 'Em caso de perda total, a indenização chega a 100% do valor de tabela do seu veículo.' },
]

// faq.js — dez itens
export const faq = [{ id: 'o-que-e', pergunta: '...', resposta: '...' }]

// depoimentos.js — três itens
export const depoimentos = [{ id: 1, nome: '...', cidade: '...', nota: 5, texto: '...' }]

// posts.js — quatro itens
export const posts = [{ id: 1, titulo: '...', resumo: '...', categoria: '...', data: '2025-11-20', capa: 'https://images.unsplash.com/...' }]

// unidades.js — seis itens
export const unidades = [{ id: 1, cidade: 'Tubarão', uf: 'SC', endereco: '...', telefone: '...', matriz: true }]

// contato.js
export const contato = {
  telefone: '0800 150 5050',
  whatsapp: '5548991452750',
  email: 'contato@liderancaassociacao.com.br',
  endereco: 'R. Hermes Esmeraldino, 90 — São João Margem Esquerda, Tubarão — SC',
  instagram: 'https://www.instagram.com/lideranca.associacao',
  facebook: 'https://www.facebook.com/lidernacaassociacaomatriz/',
}
```

**O conteúdo é escrito nesta tarefa, não deixado em branco.** Os `'...'` acima marcam o
formato; cada módulo sai desta tarefa preenchido e plausível, em português do Brasil,
no tom sóbrio da direção visual. Especificamente:

- **`faq.js`** — as dez perguntas do site atual: o que é proteção veicular; como difere
  de seguro; quais benefícios são oferecidos; prazo de indenização; carro reserva e
  quando dá direito; cobertura de eventos climáticos; se existe fidelidade;
  se há rastreamento; como solicitar assistência; como acionar indenização por roubo ou
  furto. Respostas de dois a quatro períodos, sem promessa de valor ou prazo específico.
- **`depoimentos.js`** — três depoimentos de nota 5, no espírito dos que o site publica
  (elogio ao atendimento, ao guincho e à agilidade), com nome e cidade do Sul do país.
- **`posts.js`** — quatro posts com título, resumo de duas linhas, categoria
  (`Institucional`, `Eventos` ou `Dicas`), data ISO de 2025 e capa da Unsplash.
- **`unidades.js`** — seis unidades em cidades de Santa Catarina e Rio Grande do Sul,
  com Tubarão marcada como `matriz: true`.

Nenhum desses valores precisa ser verdadeiro — a passada de dados reais vem depois.
O que não pode é o módulo sair desta tarefa vazio ou com texto de preenchimento
genérico tipo "lorem ipsum".

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Adiciona módulos de conteúdo"
```

---

### Task 5: Header, MenuMobile, Footer e WhatsApp flutuante

**Files:**
- Create: `src/componentes/layout/Header.jsx` + `.module.css`
- Create: `src/componentes/layout/MenuMobile.jsx` + `.module.css`
- Create: `src/componentes/layout/Footer.jsx` + `.module.css`
- Create: `src/componentes/layout/WhatsAppFlutuante.jsx` + `.module.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Definir a lista de navegação no Header**

```js
const navegacao = [
  { rotulo: 'Quem somos', para: '/quem-somos' },
  { rotulo: 'Benefícios', para: '/beneficios' },
  { rotulo: 'Unidades', para: '/unidades' },
  { rotulo: 'Blog', para: '/blog' },
  { rotulo: 'Contato', para: '/contato' },
]
```

- [ ] **Step 2: Implementar o `Header`**

Requisitos: `position: fixed` no topo. Começa transparente; ao passar de `60px` de
scroll ganha fundo `rgba(11,26,46,.88)`, `backdrop-filter: blur(16px)`, borda inferior
em `--azul-borda` e reduz o padding vertical. Estado por listener de `scroll` com
`{ passive: true }`, removido no cleanup.

Logotipo em `--fonte-titulo`, com "LIDERANÇA" em `--dourado`. Links usando `NavLink`,
com o item ativo em `--dourado` e filete dourado embaixo. Botão `Fazer cotação`
(`Botao` variante `primario`, `para="/cotacao"`) à direita. Abaixo de 900px os links e
o botão somem e aparece o botão hambúrguer.

- [ ] **Step 3: Implementar o `MenuMobile`**

Props: `aberto`, `aoFechar`, `navegacao`. Drawer full-screen em `--azul-profundo`,
entrando com `AnimatePresence`. Os itens entram escalonados (`delay` de `60ms` por
índice). Fecha ao clicar num item, no X ou ao apertar `Escape`. Enquanto aberto,
`document.body.style.overflow = 'hidden'`, restaurado no cleanup. Traz o CTA de cotação
no rodapé do drawer.

- [ ] **Step 4: Implementar o `Footer`**

Quatro colunas que viram uma no mobile: identidade com uma linha institucional; navegação
institucional; contato (telefone, e-mail, endereço vindos de `dados/contato.js`); redes
sociais. Barra inferior com o aviso de que se trata de um estudo de redesign sem vínculo
com a empresa, e o ano corrente.

- [ ] **Step 5: Implementar o `WhatsAppFlutuante`**

Botão circular fixo no canto inferior direito, acima do conteúdo, com ícone SVG do
WhatsApp e `aria-label="Falar no WhatsApp"`. `href` montado a partir de
`contato.whatsapp` com mensagem pré-preenchida. Aparece só depois de `400px` de scroll,
com fade e leve subida.

- [ ] **Step 6: Montar no `App.jsx`**

`Header` e `WhatsAppFlutuante` antes do `AnimatePresence`; `Footer` depois. Ambos ficam
fora da transição para não repintarem a cada rota.

- [ ] **Step 7: Conferir**

Navegue entre as rotas: o header deve mudar ao rolar, o item ativo acender, e o menu
mobile abrir e fechar em viewport de 375px. Confira que `Escape` fecha o drawer e que a
página não rola por trás dele.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Adiciona header, menu mobile, footer e botão de WhatsApp"
```

---

### Task 6: Home — Hero e tipos de veículo

**Files:**
- Create: `src/componentes/home/Hero.jsx` + `.module.css`
- Create: `src/componentes/home/TiposVeiculo.jsx` + `.module.css`
- Modify: `src/paginas/Home.jsx`

- [ ] **Step 1: Implementar o `Hero`**

Ocupa `min-height: 100svh`. Camadas, de trás para frente: foto da Unsplash em
`background-image` com `filter: saturate(.5)`; um gradiente de leitura
(`linear-gradient` do `--azul-noite` sólido à esquerda para transparente à direita, mais
um de baixo para cima); e o grão SVG em `opacity: .04`.

Conteúdo alinhado à esquerda, largura máxima de 720px: etiqueta com filete
("Proteção veicular · desde 2016"), `h1` em `--t-hero` com uma palavra em itálico
dourado, parágrafo de apoio em `--gelo-suave`, e dois botões (`Fazer cotação` primário
para `/cotacao`, `Ver coberturas` contorno para `/beneficios`).

Na base, uma faixa com quatro números separados por filetes verticais: 9 anos, +12
unidades, 100% FIPE, 24h. A faixa tem borda superior em `--azul-borda`.

Entrada escalonada com Framer Motion: etiqueta, título, parágrafo, botões e faixa, com
`delay` crescente de `80ms`.

- [ ] **Step 2: Implementar o `TiposVeiculo`**

Envolve em `Secao` com etiqueta "Coberturas", título "Proteção para cada tipo de
veículo". Grid de 4 colunas → 2 em 900px → 1 em 640px, alimentado por `veiculos`.

Cada card: foto de fundo em escala de cinza que ganha cor e `scale(1.06)` no hover;
sobreposição escura que clareia no hover; nome em `--fonte-titulo`; chamada; e uma seta
dourada que desliza para a direita. Card inteiro é um `Link` para
`/beneficios?tipo={id}`. Altura mínima de 340px.

- [ ] **Step 3: Montar na Home**

```jsx
import Hero from '../componentes/home/Hero.jsx'
import TiposVeiculo from '../componentes/home/TiposVeiculo.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <TiposVeiculo />
    </>
  )
}
```

- [ ] **Step 4: Conferir**

Expected: o hero preenche a tela sem barra de rolagem horizontal; o texto continua
legível sobre a foto; os cards reagem ao hover; em 375px tudo empilha sem estourar.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Adiciona hero e seção de tipos de veículo"
```

---

### Task 7: Home — Diferenciais, Como funciona e Depoimentos

**Files:**
- Create: `src/componentes/home/Diferenciais.jsx` + `.module.css`
- Create: `src/componentes/home/ComoFunciona.jsx` + `.module.css`
- Create: `src/componentes/home/Depoimentos.jsx` + `.module.css`
- Modify: `src/paginas/Home.jsx`

- [ ] **Step 1: `Diferenciais`**

`Secao` com fundo `profundo`, etiqueta "Por que o Grupo Liderança". Grid de 4 → 2 → 1
sobre `dados/diferenciais.js`. Cada item traz um numeral grande em `--fonte-titulo` na
cor `--dourado` com `opacity: .25` (01 a 04), título e texto. Divisores de 1px entre as
colunas em `--azul-borda`. Cada item envolto em `Revelar` com `atraso` de `índice * 90`.

- [ ] **Step 2: `ComoFunciona`**

Três passos: "Faça sua cotação", "Vistoria simples", "Proteção ativa". Dispostos na
horizontal com uma linha dourada tracejada ligando os círculos numerados; no mobile a
linha vira vertical. Encerra com um `Botao` primário para `/cotacao`.

- [ ] **Step 3: `Depoimentos`**

`Secao` com fundo `elevado`. Carrossel de um depoimento por vez: aspas decorativas
grandes em `--dourado` com baixa opacidade, `Estrelas` com a nota, texto em
`--fonte-titulo` num corpo maior, e nome com cidade abaixo. Navegação por bolinhas e
por setas, com troca em crossfade via `AnimatePresence`. Avanço automático a cada 7s,
pausado no hover e desligado sob `prefers-reduced-motion`.

- [ ] **Step 4: Adicionar as três seções à Home, na ordem**

- [ ] **Step 5: Conferir**

Expected: os reveals disparam ao rolar; o carrossel troca sozinho e responde aos
controles; nada estoura em 375px.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Adiciona diferenciais, como funciona e depoimentos"
```

---

### Task 8: Home — Blog recente, FAQ e CTA final

**Files:**
- Create: `src/componentes/ui/Acordeao.jsx` + `.module.css`
- Create: `src/componentes/home/BlogRecente.jsx` + `.module.css`
- Create: `src/componentes/home/FAQ.jsx` + `.module.css`
- Create: `src/componentes/home/CtaFinal.jsx` + `.module.css`
- Modify: `src/paginas/Home.jsx`

- [ ] **Step 1: `Acordeao` (componente de UI)**

Props: `itens` (array de `{ id, pergunta, resposta }`), `abertoInicial` (id ou `null`).
Um item aberto por vez. Cada cabeçalho é um `<button>` com `aria-expanded` e
`aria-controls`; o painel tem `role="region"` e `aria-labelledby`. Abre e fecha animando
a altura com Framer Motion (`height: 'auto'` ↔ `0`). O sinal de `+` gira 45° ao abrir.
Divisores de 1px em `--azul-borda` entre os itens.

- [ ] **Step 2: `BlogRecente`**

`Secao` com etiqueta "Conteúdo". Mostra os três primeiros de `dados/posts.js` num grid
de 3 → 1. Cada card é um `<article>` **sem link** (rota de post está fora de escopo):
capa com proporção 16/10, categoria em versalete dourado, data formatada em pt-BR,
título em `--fonte-titulo` e resumo. Botão de contorno "Ver todos" apontando para
`/blog`.

- [ ] **Step 3: `FAQ`**

`Secao` com fundo `profundo`, título "Dúvidas frequentes". Renderiza `Acordeao` com
`dados/faq.js` num contêiner de largura máxima 860px.

- [ ] **Step 4: `CtaFinal`**

Faixa de destaque com halo radial dourado ao fundo. Título em `--t-secao`, telefone
`0800 150 5050` em tamanho grande como `<a href="tel:...">`, e dois botões:
`Fazer cotação` (primário) e `Falar no WhatsApp` (contorno, link externo montado a
partir de `dados/contato.js`).

- [ ] **Step 5: Completar a Home com as três seções**

Ordem final: Hero · TiposVeiculo · Diferenciais · ComoFunciona · Depoimentos ·
BlogRecente · FAQ · CtaFinal.

- [ ] **Step 6: Conferir**

Expected: o acordeão abre um item por vez com animação suave, navegável por teclado
(Tab e Enter); a home inteira rola sem quebra de layout em 375px, 768px e 1440px.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Adiciona blog recente, FAQ e CTA final; completa a home"
```

---

### Task 9: Cálculo da cotação (TDD)

**Files:**
- Create: `src/dados/calculo.js`
- Create: `src/dados/calculo.test.js`

O Vitest já foi configurado na Tarefa 1 (`vite.config.js` traz a chave `test` e o
`package.json` traz o script `test`). Confirme antes de começar; se estiver faltando,
adicione conforme a Tarefa 1 e reporte a divergência.

- [ ] **Step 1: Escrever o teste que falha**

```js
import { describe, it, expect } from 'vitest'
import { calcularMensalidade, TAXA_ADMIN, PERCENTUAL_POR_TIPO } from './calculo.js'

describe('calcularMensalidade', () => {
  it('soma percentual do tipo com a taxa administrativa', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2020 })
    // 60000 * 0.0135 = 810; sem ajuste de ano; + 79 = 889
    expect(r.base).toBe(810)
    expect(r.ajuste).toBe(0)
    expect(r.taxaAdmin).toBe(TAXA_ADMIN)
    expect(r.mensalidade).toBe(889)
  })

  it('encarece veículos com mais de dez anos', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2010 })
    // 810 * 1.12 = 907.2 -> 907; + 79 = 986
    expect(r.ajuste).toBeCloseTo(0.12)
    expect(r.mensalidade).toBe(986)
  })

  it('barateia veículos com até três anos', () => {
    const r = calcularMensalidade({ tipo: 'carros', valor: 60000, ano: 2025 })
    // 810 * 0.92 = 745.2 -> 745; + 79 = 824
    expect(r.ajuste).toBeCloseTo(-0.08)
    expect(r.mensalidade).toBe(824)
  })

  it('usa percentual próprio de cada tipo de veículo', () => {
    const moto = calcularMensalidade({ tipo: 'motos', valor: 20000, ano: 2020 })
    expect(moto.base).toBe(20000 * PERCENTUAL_POR_TIPO.motos)
  })

  it('rejeita tipo desconhecido', () => {
    expect(() => calcularMensalidade({ tipo: 'aviao', valor: 60000, ano: 2020 }))
      .toThrow('Tipo de veículo desconhecido: aviao')
  })

  it('rejeita valor não positivo', () => {
    expect(() => calcularMensalidade({ tipo: 'carros', valor: 0, ano: 2020 }))
      .toThrow('Valor do veículo deve ser maior que zero')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL — `calculo.js` não existe.

- [ ] **Step 3: Implementar `src/dados/calculo.js`**

```js
export const TAXA_ADMIN = 79

export const PERCENTUAL_POR_TIPO = {
  carros: 0.0135,
  motos: 0.019,
  'caminhoes-34': 0.011,
  'caminhoes-pesados': 0.009,
}

const ANO_ATUAL = 2026
const AJUSTE_VEICULO_ANTIGO = 0.12
const AJUSTE_VEICULO_NOVO = -0.08

export function calcularMensalidade({ tipo, valor, ano }) {
  const percentual = PERCENTUAL_POR_TIPO[tipo]
  if (percentual === undefined) {
    throw new Error(`Tipo de veículo desconhecido: ${tipo}`)
  }
  if (!(valor > 0)) {
    throw new Error('Valor do veículo deve ser maior que zero')
  }

  const idade = ANO_ATUAL - Number(ano)
  const ajuste =
    idade > 10 ? AJUSTE_VEICULO_ANTIGO : idade <= 3 ? AJUSTE_VEICULO_NOVO : 0

  const base = valor * percentual
  const mensalidade = Math.round(base * (1 + ajuste)) + TAXA_ADMIN

  return { base, ajuste, taxaAdmin: TAXA_ADMIN, mensalidade }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS — 6 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Adiciona cálculo da estimativa de mensalidade com testes"
```

---

### Task 10: Wizard de cotação — estado, progresso e etapas 1 e 2

**Files:**
- Create: `src/componentes/cotacao/Wizard.jsx` + `.module.css`
- Create: `src/componentes/cotacao/BarraProgresso.jsx` + `.module.css`
- Create: `src/componentes/cotacao/EtapaVeiculo.jsx`, `EtapaDados.jsx` + `.module.css`
- Modify: `src/paginas/Cotacao.jsx`

- [ ] **Step 1: Definir o estado no `Wizard`**

```jsx
const ETAPAS = ['Veículo', 'Dados do veículo', 'Seus dados', 'Resumo']

const estadoInicial = {
  etapa: 0,
  tipo: null,
  marca: '', modelo: '', ano: '', valor: '',
  nome: '', telefone: '', cidade: '', email: '',
  erros: {},
}

function redutor(estado, acao) {
  switch (acao.tipo) {
    case 'campo':
      return {
        ...estado,
        [acao.campo]: acao.valor,
        erros: { ...estado.erros, [acao.campo]: undefined },
      }
    case 'avancar':
      return { ...estado, etapa: Math.min(estado.etapa + 1, ETAPAS.length - 1), erros: {} }
    case 'voltar':
      return { ...estado, etapa: Math.max(estado.etapa - 1, 0), erros: {} }
    case 'erros':
      return { ...estado, erros: acao.erros }
    case 'reiniciar':
      return estadoInicial
    default:
      return estado
  }
}
```

O `Wizard` só avança depois de validar a etapa corrente; se houver erro, despacha
`{ tipo: 'erros', erros }` e não muda de etapa.

- [ ] **Step 2: Escrever as validações**

```js
function validarEtapa(estado) {
  const erros = {}
  if (estado.etapa === 1) {
    if (!estado.marca.trim()) erros.marca = 'Informe a marca'
    if (!estado.modelo.trim()) erros.modelo = 'Informe o modelo'
    if (!/^\d{4}$/.test(estado.ano)) erros.ano = 'Ano com 4 dígitos'
    else if (Number(estado.ano) < 1980 || Number(estado.ano) > 2026) erros.ano = 'Ano fora do intervalo'
    if (!(Number(estado.valor) > 0)) erros.valor = 'Informe o valor do veículo'
  }
  if (estado.etapa === 2) {
    if (estado.nome.trim().length < 3) erros.nome = 'Informe seu nome completo'
    if (estado.telefone.replace(/\D/g, '').length < 10) erros.telefone = 'Telefone incompleto'
    if (!estado.cidade.trim()) erros.cidade = 'Informe sua cidade'
    if (estado.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(estado.email)) erros.email = 'E-mail inválido'
  }
  return erros
}
```

O e-mail é opcional; se preenchido, precisa ser válido.

- [ ] **Step 3: `BarraProgresso`**

Props: `etapas` (array de rótulos), `atual` (índice). Trilho de 2px em `--azul-borda`
com preenchimento dourado animado por `width` proporcional a `atual / (etapas-1)`.
Acima do trilho, os rótulos: o atual em `--gelo`, os concluídos em `--dourado`, os
futuros em `--gelo-tenue`. No mobile mostra só "Etapa N de 4" e o trilho.

- [ ] **Step 4: `EtapaVeiculo`**

Quatro cards a partir de `dados/veiculos.js`, com foto, nome e chamada. Clicar despacha
`{ tipo: 'campo', campo: 'tipo', valor: id }` e, em seguida, `{ tipo: 'avancar' }` —
o clique já avança. O card do tipo selecionado fica com borda dourada.

- [ ] **Step 5: `EtapaDados`**

Campos marca, modelo, ano e valor. `valor` usa máscara de moeda em pt-BR na exibição e
guarda o número puro no estado. Cada campo mostra `erros[campo]` abaixo, em vermelho
suave, com `aria-invalid` e `aria-describedby`. Estilo dos inputs: fundo
`--azul-elevado`, borda de 1px em `--azul-borda`, borda dourada no foco.

- [ ] **Step 6: Montar o `Wizard` e a página**

O `Wizard` renderiza `BarraProgresso`, a etapa corrente dentro de `AnimatePresence`
(entrando por `x: 40` e saindo por `x: -40`), e os botões Voltar e Continuar. `Voltar`
some na etapa 0. A página `/cotacao` monta o `Wizard` centralizado, com respiro para o
header fixo.

- [ ] **Step 7: Conferir**

Expected: escolher um veículo avança sozinho; deixar campos vazios e clicar em
Continuar mostra os erros sem trocar de etapa; voltar preserva o preenchido.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Adiciona wizard de cotação com as duas primeiras etapas"
```

---

### Task 11: Wizard — etapas 3 e 4

**Files:**
- Create: `src/componentes/cotacao/EtapaContato.jsx`, `EtapaResumo.jsx` + `.module.css`
- Modify: `src/componentes/cotacao/Wizard.jsx`

- [ ] **Step 1: `EtapaContato`**

Campos nome, telefone, cidade e e-mail (opcional, rotulado como tal). O telefone aplica
máscara conforme o usuário digita:

```js
function mascararTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 10) return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
    [a && `(${a}`, a.length === 2 ? ') ' : '', b, c && `-${c}`].filter(Boolean).join(''))
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}
```

- [ ] **Step 2: `EtapaResumo`**

Chama `calcularMensalidade({ tipo, valor, ano })` e exibe:

- nome do plano sugerido, derivado do tipo (`veiculos.find(v => v.id === tipo).nome`)
- a mensalidade estimada em destaque, formatada com
  `new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- a lista de coberturas do tipo escolhido, vinda de `veiculos`
- um resumo dos dados informados
- o aviso, em texto secundário: "Valor estimado para fins de simulação. A proposta
  definitiva é elaborada por um consultor após a vistoria."

Botão principal "Enviar no WhatsApp" abre `https://wa.me/{contato.whatsapp}?text=...`
com a mensagem montada por `encodeURIComponent`, contendo nome, cidade, veículo, ano,
valor e a estimativa. Botão secundário "Refazer" despacha `{ tipo: 'reiniciar' }`.

Se `estado.tipo` for `null` (usuário entrou direto na etapa), mostra um aviso e um botão
que volta à etapa 0 — nunca chama o cálculo com dados incompletos.

- [ ] **Step 3: Ligar as etapas no `Wizard`**

Na última etapa, o botão Continuar dá lugar às ações do resumo.

- [ ] **Step 4: Conferir o fluxo inteiro**

Expected: percorrer as quatro etapas produz uma estimativa coerente com o cálculo, e o
link do WhatsApp abre com a mensagem preenchida. Recarregar em `/cotacao` começa do zero
sem erro no console.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Conclui o wizard de cotação com contato e resumo"
```

---

### Task 12: Página de Benefícios com abas

**Files:**
- Create: `src/componentes/ui/Abas.jsx` + `.module.css`
- Modify: `src/paginas/Beneficios.jsx`

- [ ] **Step 1: `Abas` (componente de UI)**

Props: `itens` (array de `{ id, rotulo }`), `ativo` (id), `aoTrocar` (função).
Segue o padrão ARIA de abas: contêiner `role="tablist"`, cada botão com `role="tab"`,
`aria-selected` e `tabIndex` de `0` só no ativo. Setas esquerda e direita movem o foco e
a seleção. O indicador dourado desliza usando `layoutId` do Framer Motion. Abaixo de
640px o `tablist` ganha `overflow-x: auto` com `scroll-snap`.

- [ ] **Step 2: Montar `Beneficios.jsx`**

`Abas` espera itens no formato `{ id, rotulo }`, mas `veiculos` traz `{ id, nome }` —
converta na página, não mude o formato dos dados:

```jsx
const itensAba = veiculos.map(({ id, nome }) => ({ id, rotulo: nome }))
```

Estado da aba inicializado a partir de `?tipo=` na URL (via `useSearchParams`), com
fallback em `carros` quando o parâmetro estiver ausente ou não existir em `veiculos`.
Trocar de aba atualiza o parâmetro com `{ replace: true }` — o link fica compartilhável
sem poluir o histórico.

Abaixo das abas, o conteúdo do veículo ativo, trocando em crossfade por
`AnimatePresence` com `key={ativo}`: foto grande tratada, chamada, e a grade de
coberturas com um ícone de conferido dourado por item. Fecha com um CTA para
`/cotacao?tipo={ativo}`.

- [ ] **Step 3: Conferir**

Expected: `/beneficios?tipo=motos` abre já na aba de motos; trocar de aba muda a URL e
o conteúdo com transição; as setas do teclado navegam entre as abas; em 375px a régua de
abas rola na horizontal.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Adiciona página de benefícios com abas por tipo de veículo"
```

---

### Task 13: Páginas Quem Somos, Unidades, Blog, Contato e 404

**Files:**
- Modify: `src/paginas/QuemSomos.jsx`, `Unidades.jsx`, `Blog.jsx`, `Contato.jsx`, `NaoEncontrada.jsx`
- Create: `src/componentes/ui/Cabecalho.jsx` + `.module.css`

- [ ] **Step 1: `Cabecalho` (componente de UI)**

Cabeçalho interno das páginas: props `etiqueta`, `titulo`, `texto` e `foto` opcional.
Altura de cerca de 55vh, com o mesmo tratamento de foto e gradiente do hero, porém mais
contido. Usado por todas as páginas internas, o que dá unidade sem repetir código.

- [ ] **Step 2: `QuemSomos`**

`Cabecalho` + texto institucional em duas colunas assimétricas (7/5) + faixa de números
(reaproveitando o estilo do hero) + linha do tempo vertical com quatro marcos, cada um
revelando ao rolar + CTA final.

- [ ] **Step 3: `Unidades`**

`Cabecalho` + campo de busca que filtra por cidade ou UF (`useState` com `filter` sobre
`dados/unidades.js`, comparação sem acento e sem caixa) + grid de cards de unidade
(cidade/UF, endereço, telefone clicável, selo "Matriz" quando `matriz: true`) + estado
vazio com mensagem quando a busca não retorna nada.

- [ ] **Step 4: `Blog`**

`Cabecalho` + grid com todos os `posts`, mesmo card do `BlogRecente` (extraia o card
para `src/componentes/ui/CardPost.jsx` e use nos dois lugares — evita duplicar) + filtro
por categoria em pílulas, incluindo "Todas".

- [ ] **Step 5: `Contato`**

`Cabecalho` + duas colunas: à esquerda os canais (telefone, WhatsApp, e-mail, endereço,
redes) e à direita um formulário (nome, e-mail, telefone, assunto, mensagem) que valida
no `submit` e, em vez de enviar, mostra um cartão de confirmação explicando que é uma
demonstração sem backend. Nada de `alert`.

- [ ] **Step 6: `NaoEncontrada`**

"404" em `--t-hero` dourado com baixa opacidade ao fundo, mensagem curta e dois botões:
voltar ao início e fazer cotação. Centralizado em `min-height: 70vh`.

- [ ] **Step 7: Conferir**

Expected: as cinco páginas carregam com o mesmo sistema visual; a busca de unidades
filtra ao vivo; o filtro de categoria do blog funciona; o formulário de contato acusa
campos vazios e confirma o envio simulado.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Adiciona páginas institucionais, unidades, blog, contato e 404"
```

---

### Task 14: Revisão de responsividade, acessibilidade e desempenho

**Files:**
- Modify: arquivos de estilo conforme os ajustes encontrados
- Create: `README.md`

- [ ] **Step 1: Varredura de responsividade**

Percorra as sete rotas em 375px, 768px, 1024px e 1440px. Em cada largura confira que não
há rolagem horizontal (`document.documentElement.scrollWidth === window.innerWidth`),
que nenhum texto passa de ~75 caracteres por linha e que nenhum alvo de toque tem menos
de 44×44px.

- [ ] **Step 2: Varredura de acessibilidade**

Navegue o site inteiro só com Tab: o foco precisa ficar visível e a ordem, lógica. O
drawer mobile precisa prender o foco enquanto aberto. Confira que toda imagem decorativa
tem `alt=""`, que os botões só de ícone têm `aria-label`, e que os pares de cor passam em
AA (o `--gelo-suave` sobre `--azul-noite` é o par mais apertado — se reprovar, suba a
opacidade para `.68`).

- [ ] **Step 3: Conferir `prefers-reduced-motion`**

Ative a preferência no navegador e confira que os reveals aparecem sem deslocamento, o
carrossel para de avançar sozinho e as transições de rota ficam instantâneas.

- [ ] **Step 4: Verificar o build**

Run: `npm run build && npm run preview`
Expected: build sem erro nem aviso de chunk acima de 500kB. Navegue no preview e confira
que a transição entre rotas continua fluida.

- [ ] **Step 5: Escrever o `README.md`**

Descreva o projeto como estudo de redesign sem vínculo com a empresa, a stack, como
rodar (`npm install`, `npm run dev`, `npm test`), a estrutura de pastas e as decisões de
design (paleta, tipografia, wizard). Registre que o conteúdo é aproximado e que os dados
reais entram numa passada posterior.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Ajusta responsividade e acessibilidade; adiciona README"
```

---

## Pendência declarada

Os dados reais — telefones, endereço, CNPJ, textos institucionais e depoimentos na
íntegra — entram depois desta implementação, editando apenas `src/dados/`. Nenhum
componente precisa mudar para isso.
