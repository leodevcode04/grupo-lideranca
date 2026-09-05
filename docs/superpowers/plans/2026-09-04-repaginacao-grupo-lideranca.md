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

## Nota sobre movimento reduzido

Vale para todas as tarefas que animam algo. Existem **duas** camadas de movimento neste
projeto e elas se desligam de formas diferentes:

- **CSS** (transições, `@keyframes`) — coberto pelo bloco `prefers-reduced-motion` do
  `tokens.css`. Nada a fazer por componente.
- **Framer Motion** — anima por `style` inline via JavaScript. O bloco CSS **não o
  alcança**, e `<MotionConfig reducedMotion="user">` no `main.jsx` desliga apenas
  transformações e layout: **opacidade continua animando na duração cheia**.

Ou seja, todo componente que anima com Framer precisa zerar a duração explicitamente:

```jsx
import { useReducedMotion } from 'framer-motion'

const semMovimento = useReducedMotion()
// ...
transition={{ duration: semMovimento ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
```

Isso atinge a transição de rota (Tarefa 2), o menu mobile (5), o hero (6), os reveals
(3), o carrossel (7), o acordeão (8), o wizard (10–11) e o indicador de abas (12).
Deixar de fazer reprova o critério da Tarefa 14.

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
  --curva: cubic-bezier(0.22, 1, 0.36, 1);
  --transicao: 400ms var(--curva);
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

- Nenhuma cor, sombra, espaçamento ou `z-index` literal fora deste arquivo. Se faltar um
  token, reporte em vez de inventar um valor solto. Isso vale mesmo quando o texto de uma
  tarefa escreve o valor por extenso: "padding de 1rem 2rem" significa
  `var(--e-2) var(--e-4)`.
- Dois CSS Modules diferentes numa mesma classe do mesmo elemento empatam em
  especificidade, e o desempate vira a ordem de injeção do Vite, que segue o grafo de
  imports — não é contrato. Nunca conte com isso: se um módulo de página precisa vencer
  um de layout, aumente a especificidade de propósito.
- Anime `transform` e `opacity`, não propriedades de layout (`right`, `width`, `top`).
  Sublinhado que cresce é `transform: scaleX()` com `transform-origin: left`.
- `--transicao` empacota duração e curva. Quem precisar de outra duração usa
  `--curva` sozinha: `transition: opacity 700ms var(--curva)`.
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

### Task 2: Roteamento, layout persistente e transição entre rotas ✅

**Files:**
- Modify: `src/App.jsx`
- Create: `src/hooks/useScrollTopo.js`
- Create: `src/paginas/Home.jsx`, `QuemSomos.jsx`, `Beneficios.jsx`, `Unidades.jsx`, `Blog.jsx`, `Contato.jsx`, `Cotacao.jsx`, `NaoEncontrada.jsx`

- [ ] **Step 1: Criar `src/hooks/useScrollTopo.js`**

O hook é chamado de dentro do `Transicao`, **não do `App`**. Com `AnimatePresence
mode="wait"` o `App` nunca desmonta, então um efeito lá dispararia assim que a URL muda
— enquanto a página anterior ainda está na tela saindo. O scroll aconteceria no conteúdo
errado: a partir da Tarefa 6, quem estiver lendo o FAQ no fim da home e clicar em
"Benefícios" veria a home disparar até o próprio topo e só então sumir. `Transicao`
monta no instante certo: depois que a antiga saiu, antes de a nova pintar.

`useLayoutEffect` e não `useEffect` — a página nova já tem altura no instante do mount, e
um efeito passivo deixaria o navegador pintar um quadro na posição antiga antes.

```js
import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export function useScrollTopo() {
  const { pathname, hash } = useLocation()
  const tipoNavegacao = useNavigationType()

  useLayoutEffect(() => {
    // Voltar/avançar: deixa o navegador restaurar a posição anterior.
    if (tipoNavegacao === 'POP' && !hash) return

    if (hash) {
      document.querySelector(hash)?.scrollIntoView()
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, tipoNavegacao])
}
```

A guarda de `POP` é o que faz voltar/avançar parar de parecer quebrado — sem ela, voltar
do Blog para uma home lida pela metade joga o usuário no topo. O ramo de `hash` é seguro
para as âncoras que as Tarefas 12 e 13 podem introduzir.

- [ ] **Step 2: Criar as oito páginas como stub**

Cada uma no formato abaixo, trocando nome e texto:

```jsx
export default function Home() {
  return <div className="container" style={{ paddingTop: '10rem' }}><h1>Home</h1></div>
}
```

`NaoEncontrada.jsx` exibe "404 — página não encontrada" e um link para `/`.

- [ ] **Step 3: Criar `src/componentes/layout/Transicao.jsx` + `.module.css`**

O wrapper ganha arquivo próprio porque deixa de ser um shim visual: ele carrega o
posicionamento do scroll, o foco e a regra de movimento reduzido.

```jsx
import { motion, useReducedMotion } from 'framer-motion'
import { useScrollTopo } from '../../hooks/useScrollTopo.js'
import estilos from './Transicao.module.css'

export default function Transicao({ children }) {
  const semMovimento = useReducedMotion()
  useScrollTopo()

  return (
    <motion.main
      id="conteudo"
      tabIndex={-1}
      className={estilos.pagina}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: semMovimento ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}
```

No `.module.css`, `.pagina` recebe `min-height: 100vh` e `outline: none`.

O `min-height` não é decorativo: sob `mode="wait"` existe um quadro entre a saída da
página antiga e a entrada da nova em que o documento fica sem conteúdo. Sem altura
mínima, o `Footer` que a Tarefa 5 coloca fora do `AnimatePresence` sobe até debaixo do
header e desce de novo a cada navegação.

O par `id="conteudo"` + `tabIndex={-1}` resolve outra coisa: hoje, ao trocar de rota, o
foco fica num link que deixou de existir e um leitor de tela não anuncia nada. O
`useScrollTopo` move o foco junto com o scroll — acrescente ao efeito, antes do
`window.scrollTo`:

```js
document.getElementById('conteudo')?.focus({ preventScroll: true })
```

Esse mesmo `id` serve de alvo para o link "Pular para o conteúdo" que a Tarefa 5 precisa
adicionar por causa do header fixo.

- [ ] **Step 4: Escrever `src/App.jsx` com as rotas**

`AnimatePresence mode="wait"` garante um único `<main>` no DOM por vez. Não troque para
`sync` ou `popLayout` sem resolver a duplicação de landmark que isso cria.

```jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Transicao from './componentes/layout/Transicao.jsx'
import Home from './paginas/Home.jsx'
import QuemSomos from './paginas/QuemSomos.jsx'
import Beneficios from './paginas/Beneficios.jsx'
import Unidades from './paginas/Unidades.jsx'
import Blog from './paginas/Blog.jsx'
import Contato from './paginas/Contato.jsx'
import Cotacao from './paginas/Cotacao.jsx'
import NaoEncontrada from './paginas/NaoEncontrada.jsx'

export default function App() {
  const location = useLocation()

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

- [ ] **Step 5: Conferir no navegador**

Run: `npm run dev`, então visite `/`, `/beneficios` e `/rota-inexistente`.
Expected: cada rota renderiza sua página; a inexistente cai no 404. Digitar a URL
direto no navegador funciona (o dev server do Vite já faz o fallback de SPA).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Adiciona roteamento, páginas stub e transição entre rotas"
```

---

### Task 3: Componentes de UI base ✅ (revisada)

**Files:**
- Create: `src/hooks/useRevelar.js`
- Create: `src/componentes/ui/Revelar.jsx` + `.module.css`
- Create: `src/componentes/ui/Botao.jsx` + `.module.css`
- Create: `src/componentes/ui/Secao.jsx` + `.module.css`
- Create: `src/componentes/ui/Estrelas.jsx` + `.module.css`

Estes quatro componentes são o vocabulário em que o resto do site é escrito. `Secao`
embrulha quase toda seção de toda página, `Botao` é todo CTA, `Revelar` anima quase todo
conteúdo, `Estrelas` aparece nos depoimentos. Trate os contratos de props como API
pública: prop mal nomeada ou esquecida aqui vira contorno em onze lugares depois.

Nada em `ui/` conhece o domínio. Sem tipo de veículo, sem telefone, sem texto sobre
proteção veicular — os componentes têm que funcionar num site sem relação nenhuma.

- [ ] **Step 1: Criar `useRevelar.js`**

```js
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
      { threshold: 0, rootMargin: margem }
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [margem])

  return { ref, visivel }
}
```

**`threshold: 0` é obrigatório, não preferência.** Com `threshold: 0.15` e a margem
negativa de 12%, a raiz efetiva tem `0.88 × altura da viewport`, então a razão máxima de
interseção que um elemento de altura `T` alcança é `0.88H / T`. Para cruzar 0.15 é
preciso `T ≤ 5.87H` — qualquer bloco mais alto que ~5.9 viewports **nunca dispara e fica
em `opacity: 0` para sempre**. Numa viewport de 640px isso dá ~3760px: o acordeão de dez
perguntas da Tarefa 8 e a linha do tempo da Tarefa 13 passam disso. Falha só em tela
curta e parece sumiço de dados, não bug de animação. A margem negativa sozinha já
entrega o atraso desejado; o threshold era redundante e é a metade que quebra.

A guarda de `IntersectionObserver` indefinido evita o outro modo de falha permanente:
conteúdo que nunca aparece em ambiente sem suporte.

- [ ] **Step 2: Criar `Revelar.jsx`**

Props: `children`, `atraso` (ms, padrão `0`), `as` (tag, padrão `'div'`), `margem`
(repassada ao hook) e `className`.

**Destructure `className` e `style` das props em vez de deixá-los cair no `...resto`.**
Espalhar `{...resto}` depois de `className={...}` faz o `className` do chamador apagar as
classes de reveal — e o `Secao` passa `className`, então todo cabeçalho de seção ficaria
invisível. Componha as três classes numa string só. O `style` do chamador entra mesclado
com o `transitionDelay`, não substituído por ele.

CSS: estado inicial `opacity: 0; transform: translateY(28px)`, estado revelado zerando
ambos, `transition: opacity 700ms var(--curva), transform 700ms var(--curva)`.

Não é preciso `useReducedMotion` aqui: a animação é CSS, então o bloco
`prefers-reduced-motion` do `tokens.css` já a alcança — inclusive o
`transition-delay: 0s !important`, que neutraliza o `transitionDelay` inline.

- [ ] **Step 3: Criar `Botao.jsx`**

Props: `variante` (`'primario' | 'contorno' | 'texto'`, padrão `'primario'`), `para`
(rota interna → `Link`), `href` (link externo → `<a>`), `tipo`, `desabilitado`,
`className`, `children`, mais `...resto`.

**O elemento é escolhido só por `para` → `href` → `<button>`.** `onClick` **não**
participa dessa escolha: é repassado ao elemento que for renderizado, qualquer que seja.
Tratar `onClick` como seletor de modo faz `<Botao para="/cotacao" onClick={aoFechar}>`
navegar sem nunca chamar o `onClick` — que é exatamente o que o drawer da Tarefa 5
precisa (fechar ao clicar no item). Deixe `onClick` cair no `...resto` e espalhe nos três
ramos.

`className` também precisa ser destructurado e composto, pelo mesmo motivo do `Revelar`.
Espalhar `...resto` depois de `className` faria `<Botao className={estilos.blocoMobile}>`
perder `.botao` e toda a aparência.

`target="_blank"` só quando o `href` for de fato externo — teste com
`/^https?:/i.test(href)`. Sem isso, `tel:` e `mailto:` (Tarefa 8 no CTA final, Tarefa 13
no Contato) abrem e abandonam uma aba em branco.

`desabilitado` vale **apenas** no modo `<button>`, como `disabled` nativo. Não invente
link desabilitado: nenhuma tarefa do plano precisa disso, e um `<span>` focável que não
faz nada é um beco sem saída para quem navega por teclado.

Requisitos visuais: `primario` com fundo `--dourado` e texto `--azul-noite`; `contorno`
com borda de 1px em `--azul-borda` e texto `--gelo`; `texto` sem fundo, com sublinhado
dourado que cresce no hover. Todos com `--raio`, `padding: var(--e-2) var(--e-4)`, peso
600 e `transition: var(--transicao)`. O `padding-inline: 0` da variante `texto` precisa
vir **depois** do padding base na ordem do arquivo.

No `:disabled`, use opacidade reduzida e `cursor: not-allowed` — **sem**
`pointer-events: none`, que suprime a resolução do cursor e portanto anula o próprio
`not-allowed`, além de tornar morta qualquer regra de `:hover` do estado desabilitado.

Em desenvolvimento, avise quando a variante não existir — com dezenas de chamadas,
`variante="outline"` renderizaria como primário sem sinal nenhum. Um `console.warn`
guardado por `import.meta.env.DEV` some do bundle de produção.

- [ ] **Step 4: Criar `Secao.jsx`**

Props: `id`, `etiqueta`, `titulo`, `subtitulo`, `fundo` (`'noite' | 'profundo' |
'elevado'`, padrão `'noite'`), `centralizado`, `className`, `children`, mais `...resto`
espalhado no `<section>`.

`className` e `...resto` não são luxo: são o único ponto de extensão de um componente que
embrulha quase toda seção do site. Sem eles, o FAQ da Tarefa 8 (que precisa de coluna de
860px) e a textura `.grao` do `global.css` não têm como ser aplicados, e o chamador acaba
enfiando uma `div` extra dentro de `children`, furando o layout do `.container`.

`<section>` só vira landmark com nome acessível. Como o componente já tem `id` e
`titulo`, ligue `aria-labelledby` ao `<h2>` (id derivado do `id` da seção) — sai de graça
e deixa as sete páginas navegáveis por landmark.

Renderiza `<section>` com padding vertical `--e-secao` e um `.container` interno. Só o
cabeçalho vai dentro de `Revelar`; **os `children` não**. As Tarefas 6–8 precisam de
`atraso` por card (a Tarefa 7 usa `índice * 90`), e revelar os filhos em bloco obrigaria
todas elas a optar por fora. A etiqueta leva um filete dourado de `var(--e-3)` antes do
texto.

- [ ] **Step 5: Criar `Estrelas.jsx`**

Props: `nota` (padrão `5`). Cinco SVGs, preenchidos em `--dourado` até `nota` e em
`--gelo-tenue` no restante. `role="img"` no invólucro com um `aria-label` no formato
"N de 5 estrelas", e `aria-hidden` em cada SVG.

Normalize a entrada com `Math.max(0, Math.min(5, Math.round(nota)))` — é API pública e vai
receber dados de avaliação. Sem isso, `nota={undefined}` anuncia "undefined de 5
estrelas" e `nota={4.6}` pinta cinco.

- [ ] **Step 6: Conferir**

Renderize os componentes temporariamente na Home e confira no navegador: hover nas três
variantes, foco visível em todas, o `Revelar` animando ao rolar, as estrelas com a nota
certa. Confira também os dois modos que falham em silêncio: um `Revelar` em volta de um
bloco de ~4000px numa viewport de 640px (tem que aparecer), e um `Botao` com `para`,
`onClick` e `className` juntos (tem que navegar, chamar o handler e manter a aparência).
Depois desfaça a renderização temporária e confirme com `git diff` que a `Home.jsx`
voltou ao stub.

### Task 4: Módulos de dados ✅ (revisada)

**Files:**
- Create: `src/dados/veiculos.js`, `diferenciais.js`, `faq.js`, `depoimentos.js`, `posts.js`, `unidades.js`, `contato.js`, `numeros.js`

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

- [ ] **Step 3: Correções de contrato apontadas na revisão**

Sete ajustes que evitam que componentes contornem o que falta aqui. Cada um foi
rastreado até a tarefa que consome o campo.

**3.1 — `posts.js` em ordem decrescente de data.** O array estava do mais antigo para o
mais novo, e a Tarefa 8 pega "os três primeiros": a home mostraria os três posts mais
velhos e esconderia o mais recente. Inverta e deixe explícito no topo do arquivo:

```js
// Ordem é load-bearing: BlogRecente (Tarefa 8) fatia os três primeiros.
// Mantenha do mais recente para o mais antigo ao adicionar posts.
```

**3.2 — Comentário sobre fuso na renderização das datas.** `new Date('2025-11-20')` é
interpretado como meia-noite UTC; formatado em America/Sao_Paulo (UTC−3) imprime
**19/11/2025**. Todas as datas sairiam um dia antes. Anote acima do array, porque o campo
é que induz o erro:

```js
// Datas ISO. Ao formatar, passe timeZone: 'UTC' —
// toLocaleDateString('pt-BR', { timeZone: 'UTC' }) — senão sai um dia antes.
```

**3.3 — Telefones ganham o par legível/discável.** A Tarefa 8 precisa do `0800` como
`<a href="tel:">` e a Tarefa 13 dos telefones das unidades clicáveis. Derivar o href com
`replace(/\D/g,'')` e prefixo `+55` funciona para fixo (`+554836215050`) e **quebra** no
0800 (`+5508001505050` não é discável). Regras diferentes a partir de strings de formato
idêntico é armadilha; guarde as duas formas, como o `whatsapp` já faz:

```js
// contato.js
telefone: '0800 150 5050',
telefoneHref: 'tel:08001505050',

// unidades.js, por unidade
telefone: '(48) 3621-5050',
telefoneHref: 'tel:+554836215050',
```

**3.4 — `redes` vira lista.** Com `instagram` e `facebook` como chaves soltas, o Footer
(Tarefa 5) e a página de Contato (Tarefa 13) hardcodam rótulo e ícone de cada uma —
acrescentar um canal depois exigiria editar dois componentes, justamente o que a
"Pendência declarada" promete que não acontece.

```js
redes: [
  { id: 'instagram', rotulo: 'Instagram', url: 'https://www.instagram.com/lideranca.associacao' },
  { id: 'facebook', rotulo: 'Facebook', url: 'https://www.facebook.com/lidernacaassociacaomatriz/' },
],
```

Os componentes ainda mapeiam ícone por `id`, mas com fallback: canal desconhecido
aparece sem ícone em vez de quebrar.

**3.5 — Documentar o acoplamento dos ids de veículo.** Os quatro ids são chave do
`PERCENTUAL_POR_TIPO` (Tarefa 9), viram `?tipo=` na URL (Tarefas 6 e 12) e alimentam o
`find` do resumo (Tarefa 11). Renomear `caminhoes-34` derruba o wizard com "Tipo de
veículo desconhecido" e apodrece todo link compartilhado. Cabeçalho no arquivo:

```js
// Os `id` abaixo são load-bearing, não rótulos internos:
//   - são as chaves de PERCENTUAL_POR_TIPO em dados/calculo.js
//   - viajam na URL como ?tipo= em /beneficios e /cotacao
// Renomear um quebra o cálculo da cotação e invalida links já compartilhados.
// Adicionar um veículo exige adicionar o percentual correspondente em calculo.js.
```

**3.6 — `descricao` por veículo.** A `chamada` tem seis palavras, dimensionada para o
card da Tarefa 6. A aba da Tarefa 12 usa a mesma linha como todo o texto corrido da
página de Benefícios daquele veículo — o resultado seria um painel visivelmente vazio, ou
um parágrafo escrito direto no `Beneficios.jsx`, que é exatamente o que esta camada
existe para evitar. Acrescente `descricao` (dois ou três períodos, mesmo tom sóbrio) em
cada um dos quatro veículos. `chamada` continua nos cards.

**3.7 — `numeros.js`: os números institucionais saem dos componentes.** A Tarefa 6 fixa a
faixa do hero como "9 anos, +12 unidades, 100% FIPE, 24h" e a Tarefa 13 reaproveita a
mesma faixa. Dois problemas: o número está escrito no componente, e "+12 unidades"
contradiz as seis de `unidades.js`. Crie o módulo e faça as duas tarefas lerem dele:

```js
export const numeros = [
  { id: 'anos', valor: '9', rotulo: 'anos de história' },
  { id: 'unidades', valor: '6', rotulo: 'unidades no Sul' },
  { id: 'fipe', valor: '100%', rotulo: 'da tabela FIPE' },
  { id: 'assistencia', valor: '24h', rotulo: 'de assistência' },
]
```

Mantenha o valor de unidades coerente com `unidades.js`.

**3.8 — Campos menores.** Em `contato.js`, acrescente `mensagemWhatsApp` (o texto
pré-preenchido que a Tarefa 5 usaria hardcoded) e um `cnpj: ''` vazio como vaga
declarada para a passada de dados reais. Em `unidades.js`, um comentário na unidade de
Tubarão apontando que o endereço também aparece em `contato.endereco` e que os dois
precisam ser atualizados juntos.

**3.9 — Trocar a capa fora de contexto.** O post sobre feira do setor automotivo está
ilustrado com uma foto de casa iluminada à noite. Escolha uma capa da Unsplash
compatível com o assunto e confirme que responde 200.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Adiciona módulos de conteúdo"
```

---

### Task 5: Header, MenuMobile, Footer e WhatsApp flutuante ✅ (revisada)

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

- [ ] **Step 8: Correções apontadas na revisão**

**8.1 — A folga do header fixo estava errada em número e em mecanismo.**

O token valia `6rem` (96px), mas o header mede **116px** no desktop e **109px** no mobile
no estado não rolado. A faixa sobreposta não é só visual: o `<header>` é `position: fixed`
e continua interceptando cliques mesmo transparente, então o topo de toda página fica
morto ao toque. Nos stubs isso passa despercebido só porque o `<h1>` começa logo abaixo.

Pior que o número é o mecanismo. `padding-top` no `.pagina` (o wrapper de página) briga
com o hero da Tarefa 6 em duas frentes:

- o `background-image` do hero passaria a começar **abaixo** do header, deixando uma
  faixa chapada de `--azul-noite` no topo em vez da foto correndo sob o vidro — o
  oposto do que a direção visual pede;
- `min-height: 100svh` no hero dentro de um wrapper com 96px de padding dá
  `96px + 100svh` de altura, ou seja, barra de rolagem vertical garantida na home. O
  critério de aceite da Tarefa 6 é justamente "o hero preenche a tela sem barra de
  rolagem horizontal" — e a vertical apareceria de graça.

Correção, nesta ordem:

1. Torne o token derivado, para não desincronizar quando o padding do header mudar:

```css
/* Altura do header no estado não rolado (o maior dos dois).
   Derivado do padding de .linha + a altura do CTA, para não desincronizar
   quando um dos dois mudar. Conferir se .linha ou o Botao mudarem de padding. */
--altura-cabecalho: calc(var(--e-4) * 2 + 3.25rem);
```

2. **Remova o `padding-top` do `.pagina`** em `Transicao.module.css`. A folga passa a ser
   responsabilidade da primeira seção de cada página, que é quem sabe se quer sangrar sob
   o header ou não.

3. Em `Secao.module.css`, dê a folga só à primeira seção da página:

```css
.secao:first-child {
  padding-top: calc(var(--e-secao) + var(--altura-cabecalho));
}
```

Isso cobre de uma vez as páginas das Tarefas 12 e 13, que começam com `Secao` ou
`Cabecalho`. O hero da Tarefa 6 resolve por conta própria (ver 8.2).

4. Acrescente `scroll-margin-top: var(--altura-cabecalho)` ao `.pagina` no
   `Transicao.module.css`. Sem isso o salto do skip link estaciona o `<main>` em y=0,
   atrás do header — o link funciona e parece não funcionar.

   Escreva na classe, **não** em `#conteudo`: nesta configuração o CSS Modules hasheia
   seletor de id igual ao de classe, então `#conteudo` compila para `#_conteudo_xxxxx` e
   nunca casa com o `id` real posto pelo JSX. A regra existiria e não valeria nada. Vale
   para qualquer id daqui em diante — dentro de módulo, estilize por classe.

**8.2 — Regra para as Tarefas 6, 12 e 13.** Seção que sangra sob o header (hero com foto)
usa `min-height: 100svh` com `padding-top: var(--altura-cabecalho)` e `box-sizing:
border-box` — que já é global. Assim a foto e os gradientes ocupam a tela inteira,
inclusive sob o header translúcido, e a altura continua sendo exatamente uma tela.
Seção comum herda a folga do `.secao:first-child` acima e não faz nada.

Padronize em `svh`, não `vh`: `.pagina` usa `min-height: 100vh` e o hero usaria `100svh`,
e misturar os dois faz o piso da página e o do hero divergirem quando a barra de
endereço do mobile recolhe.

**8.3 — `navegacao` sai do `Header.jsx` para `src/dados/navegacao.js`.** O `Footer`
importa o array do `Header`, o que contradiz a tabela de arquitetura e a própria decisão
3.4 (que moveu `redes` para lista justamente para rótulo ser dado, não componente).

O custo concreto não é estético: `@vitejs/plugin-react` só preserva estado no Fast
Refresh de módulos cujos exports são todos componentes. Com o `Header.jsx` exportando
componente **e** array, toda edição nele recarrega o módulo inteiro em vez de trocar a
quente — perdendo o estado de scroll e o drawer aberto, em nove tarefas de iteração no
navegador.

**8.4 — `IconeRede` sai do `Footer.jsx` para `src/componentes/ui/IconeRede.jsx`.** A
Tarefa 13 renderiza `contato.redes` na página de Contato. Deixando onde está, ela vai ou
duplicar os SVGs ou importar do `Footer.jsx`, repetindo 8.3 uma camada abaixo. É peça sem
domínio; é de `ui/` que se trata.

**8.5 — `fecharMenu` precisa de `useCallback`.** Ele é recriado a cada render do `Header`
e está no array de dependências do efeito do `MenuMobile`. A cada re-execução o efeito
chama `botaoFecharRef.current?.focus()` incondicionalmente: quem tiver navegado por
teclado até "Unidades" é puxado de volta ao X. Em produção é quase inalcançável (com o
scroll travado, `rolado` congela), mas o `StrictMode` já dispara isso em
desenvolvimento, e qualquer re-render futuro do `Header` com o drawer aberto o torna
real.

```jsx
const fecharMenu = useCallback(() => {
  setMenuAberto(false)
  botaoHamburguerRef.current?.focus()
}, [])
```

A ref é estável, então `[]` é honesto.

Aproveite e comente, no efeito do `MenuMobile`, que a ordem limpeza-antes-de-setup é o
que mantém o valor salvo de `overflow` correto sob o `StrictMode`. É load-bearing e
invisível.

**8.6 — A janela dos ~300ms da animação de saída do drawer.** `fecharMenu` devolve o foco
ao hambúrguer enquanto o `AnimatePresence` ainda anima o drawer para fora. Nessa janela o
drawer continua `position: fixed; inset: 0` e opaco ao hit-test, então o primeiro clique
depois do Escape é engolido; um Tab cai dentro do drawer que está saindo e, ~200ms
depois, o foco despenca no `<body>`; e o `aria-modal="true"` ainda presente manda a
tecnologia assistiva ignorar justamente o botão onde o foco está.

```jsx
aria-modal={aberto ? 'true' : undefined}
exit={{ opacity: 0, pointerEvents: 'none' }}
```

O `aria-modal` condicional é o de maior retorno. Para fechar também o caso do Tab, marque
o painel como `inert` quando `!aberto`.

**8.7 — Fechar o drawer ao cruzar o breakpoint e ao trocar de rota.** Passando de 900px
com ele aberto, o hambúrguer some (`display: none`) e o `focus()` vira no-op, deixando o
foco no `<body>`. Um efeito que fecha o drawer nesses dois eventos resolve isso e também
o "voltar do navegador deixa o drawer aberto".

**8.8 — Ajustes menores.**

- `Footer.module.css`: `.iconeRede` usa `2.5rem` literal onde existe `var(--e-5)`.
- `WhatsAppFlutuante.jsx`: renomear `href` de escopo de módulo para `HREF_WHATSAPP`,
  acompanhando o `LIMIAR_ROLAGEM` logo acima.
- `Header.jsx`: `aria-label` do hambúrguer é fixo em "Abrir menu" enquanto o
  `aria-expanded` alterna — anuncia "Abrir menu, expandido". Torne-o
  `menuAberto ? 'Fechar menu' : 'Abrir menu'`.
- `Header.module.css`: `.cabecalho` lista `padding` no `transition` mas não tem padding —
  o padding animado está no `.linha`. Declaração morta.
- Sublinhados animados (`.link::after` no Header, `.texto::after` no `Botao`) animam
  `right`, uma propriedade de layout, a cada quadro. Troque por
  `transform: scaleX()` com `transform-origin: left` **agora**, antes de o padrão ser
  copiado para as abas da Tarefa 12 e para os cards das Tarefas 6–8.

**8.9 — Não "otimize" os listeners de scroll.** `Header` e `WhatsAppFlutuante` têm cada um
o seu, e ambos fazem `setState` de um **booleano**: o React descarta o update quando o
valor não muda, então só há re-render na travessia do limiar, não a cada quadro. Está
correto como está. Registrado aqui para que a varredura da Tarefa 14 não invente uma
refatoração.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Adiciona header, menu mobile, footer e botão de WhatsApp"
```

---

### Task 6: Home — Hero e tipos de veículo ✅ (revisada)

**Files:**
- Create: `src/componentes/home/Hero.jsx` + `.module.css`
- Create: `src/componentes/home/TiposVeiculo.jsx` + `.module.css`
- Modify: `src/paginas/Home.jsx`

- [ ] **Step 1: Implementar o `Hero`**

Ocupa `min-height: 100svh` **com `padding-top: var(--altura-cabecalho)`** — ver Tarefa 5,
passo 8.2. O `.pagina` não dá mais folga nenhuma, justamente para a foto e os gradientes
do hero correrem por baixo do header translúcido em vez de começarem abaixo dele. Como o
`box-sizing: border-box` é global, a folga entra dentro da tela e a altura continua sendo
exatamente uma. Camadas, de trás para frente: foto da Unsplash em
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

- [ ] **Step 5: Correções apontadas na revisão**

O hero está correto e é a tela mais importante do projeto. Está a poucas mudanças de
ficar bom — nenhuma delas mexe em camadas, Framer, fluxo de dados ou nos contratos de
`Secao`/`Revelar`/`Botao`, que estão certos.

**5.1 — A faixa de números não está na base.** O passo 1 pede "na base"; ela é o último
item de uma coluna flex de 501px que o `align-items: center` estaciona no meio. Medido em
1440×900: 142px de espaço morto acima e 142px abaixo. A tela vira um bloco centralizado
boiando no azul.

Faça `.hero` uma coluna de altura cheia com o conteúdo no terço óptico e a faixa empurrada
para baixo (`margin-top: auto` na faixa), mais `padding-bottom: var(--e-5)`. Sozinha, essa
mudança faz mais pela leitura "banco privado, não SaaS" do que qualquer outra da lista.

**5.2 — `padding-bottom: 0` solda a faixa na seção seguinte.** Quando o conteúdo passa de
`100svh` o hero cresce e a borda inferior da faixa encosta exatamente na borda do hero
(medido em 800×380 e 320×568). As descidas de "anos de história" tocam o limite do
`TiposVeiculo`. É também o caso que recorta a animação de entrada: os filhos partem de
`translateY(20px)`, então nos primeiros quadros a faixa fica fora da caixa e o
`overflow: hidden` do `.grao` a corta. O `padding-bottom` de 6.1 resolve os dois.

**5.3 — Os divisores da faixa quebram quando ela envolve.** Em 375px a faixa vira 2×2 e o
item 2 mantém o `border-inline-end`: sobra um filete de 1px pendurado no vazio.
`:last-child` não enxerga quebra de flex. Use grade de 2 colunas removendo a borda no
`:nth-child(2n)`, ou reduza para dois números abaixo de 640px — a faixa envolvida ocupa
168px, 21% de uma tela de 812px, para quatro estatísticas.

**5.4 — Contradição factual na tela mais importante.** A etiqueta diz "desde 2016" e a
faixa, 300px abaixo, diz "9 anos de história". Em 2026 são 10. O plano escreveu os dois
valores, então o erro é meu, mas ele embarca no hero.

Resolva tirando o ano da etiqueta e pondo algo concreto e verificável no lugar — isso
também corrige a repetição de copy apontada em 5.5:

```
Associação de proteção veicular · Sul de Santa Catarina
```

**5.5 — A composição e a copy ainda leem como "SaaS escuro genérico".** Três ajustes,
todos em `Hero.module.css` e na string do `h1`:

*Hierarquia no espaço em branco.* Hoje há um gap uniforme de 24px entre cinco elementos de
peso completamente diferente: a etiqueta de 21px fica tão longe do `h1` de 88px quanto os
botões ficam da faixa. Espaço em branco é o instrumento principal de um hero de banco.
Aproxime a etiqueta do título (~12px), dê mais ar aos botões (~40px) e ancore a faixa na
base. O ar migra para dentro da composição.

*A foto é paga e não é usada.* `saturate(.5)` sob um gradiente horizontal que vai de 0.95
a **0.75** e um vertical que só chega a 0.50 significa que a imagem nunca tem região
clara. 466 KB compram textura. O gradiente de leitura da esquerda para a direita existe
justamente para a metade direita carregar assunto fotográfico — e ela está 75% opaca.
Abra a parada direita (0.75 → ~0.35; o `h1` tem 14.8:1 de folga e vive nos 720px da
esquerda) e escolha um enquadramento com o assunto à direita. Ou abandone a foto e assuma
um campo chapado com o grão. A posição intermediária atual é o que lê como genérico.

*A copy inverte valor e ornamento.* "Proteção veicular · desde 2016" e "Proteção veicular
com confiança" repetem as mesmas duas palavras em 100px de altura, e a palavra em itálico
dourado é `confiança` — que é o nome da nossa direção visual interna, não uma afirmação
que um associado possa conferir. A única linha que diz algo específico e verdadeiro
(FIPE, Sul de Santa Catarina) é o tipo menor e mais apagado da tela. Um hero de banco faz
**uma** promessa concreta no maior corpo de texto. Leve FIPE ou a região para o `h1` e
deixe o itálico dourado cair na palavra que importa.

**5.6 — `.sobreposicao` transiciona `background`.** É propriedade de pintura: interpolar
entre dois `linear-gradient` repinta a área inteira do card a cada quadro, vezes quatro no
hover-out. Faça cross-fade de duas camadas empilhadas por `opacity`, ou ponha o gradiente
de hover num `::after` indo de `opacity: 0` a `1`. Corrija **agora**: as Tarefas 7, 8 e 12
copiam esse padrão. (O `filter, transform` do `.foto` está certo — ambos promovem.)

**5.7 — Trocar `background-image` por `<img>`.** As cinco fotos são background de CSS:
hero de **466 KB** em `w=1920&q=80` servido idêntico para um celular de 375px, mais quatro
capas de card (100/111/159/247 KB) baixadas ansiosamente no load apesar de estarem abaixo
da dobra. **~1,08 MB antes do primeiro scroll.** Background de CSS não tem `loading="lazy"`,
`srcset`, `sizes` nem `decoding`.

Um `<img>` com `object-fit: cover` dentro da caixa `.foto` que já existe custa umas dez
linhas aqui e entrega à Tarefa 14 tudo de que ela precisa. Depois da Tarefa 13 vira
mudança em seis arquivos. Acrescente também `&fm=webp&auto=format` às URLs e uma variante
mais estreita do hero para telas pequenas.

**5.8 — Guardar o hover atrás de `@media (hover: hover)`.** No toque o `:hover` gruda: o
usuário toca um card, vai para `/beneficios`, volta e encontra aquele card ainda
colorido, escalado e com a seta deslocada. Envolva o bloco `.cartao:hover` mantendo a
metade `:focus-visible` fora da media query.

**5.9 — Extrações que valem agora.**

- **`FaixaNumeros` para `src/componentes/ui/`.** A Tarefa 13 (QuemSomos) reusa a faixa
  literalmente, ela tem lógica interna real (o agrupamento `dl`/`dt`/`dd`, os divisores, o
  comportamento de quebra) e os problemas 5.1 a 5.3 estão todos dentro dela — corrigir uma
  vez é melhor que duas. Recebe `itens` e nenhum conhecimento de domínio.
- **`Etiqueta` para `ui/`.** `.etiqueta` + `.filete` estão byte a byte iguais no
  `Hero.module.css` e no `Secao.module.css`. A Tarefa 12 e a 13 fariam a terceira e a
  quarta cópia.

**Não extraia** um card compartilhado: Diferenciais (numeral grande, sem foto),
BlogRecente (`<article>`, **sem link**, capa 16/10, data formatada) e TiposVeiculo (card
inteiro é link, foto sangrada) só compartilham "grade + `Revelar` com atraso por índice".
Abstrair três cards tendo construído um produz um saco de props com flags `temFoto` e
`comoLink`. Construa os das Tarefas 7 e 8 separados e extraia depois, se o terceiro rimar
de verdade.

**Não extraia** um helper de stagger, mas **padronize o número**: 80ms para stagger de
Framer no load, 90ms para reveal de scroll. São mecanismos com semântica de disparo
diferente; um helper compartilhado brigaria com isso.

**5.10 — Ajustes menores.**

- `--z-grao` é load-bearing para o hero: o grão cai entre gradientes e conteúdo só porque
  vale 1 e o `::after` é o último no DOM. Subir esse token para 3 numa tarefa futura faria
  o grão pintar por cima do `h1` e dos CTAs, em silêncio, num arquivo que ninguém abriu.
  Escreva `z-index: calc(var(--z-grao) + 1)` no `.wrapper` ou deixe a nota no `tokens.css`.
- `.cartao` tem `min-height: 340px` mas não `height: 100%`. Hoje todos medem 340, mas a
  grade estica o wrapper do `Revelar` e o `Link` não acompanha: o primeiro card cuja
  `chamada` quebrar em três linhas deixa os outros com um vão morto sob a foto.
- `repeat(4, 1fr)` → `repeat(4, minmax(0, 1fr))`.
- `FOTO_HERO` está hardcoded no `Hero.jsx` enquanto toda outra imagem do projeto vive em
  `src/dados/`. É a única foto que não se acha abrindo `src/dados/`.
- Comente no `.hero` que ele é a variante "sangra sob o header" do passo 8.2 da Tarefa 5, e
  que o outro caso é tratado pelo `.secao:first-child` — poupa às Tarefas 12 e 13 uma
  leitura do plano.
- A proteção do anel de foco contra o `overflow: hidden` do `.grao` hoje é acidental: vem
  do gutter do `.container`, não de algo que o hero declare. Uma linha de comentário no
  `.wrapper` evita que alguém "simplifique" essa classe embora.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Adiciona hero e seção de tipos de veículo"
```

---

### Task 7: Home — Diferenciais, Como funciona e Depoimentos ✅ (revisada)

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

- [x] **Step 6: Correções apontadas na revisão**

A engenharia está boa — o timer está certo, o CSS é pensado, os comentários explicam
motivo e não sintaxe. O que escapou foram três problemas de acessibilidade no carrossel,
uma quebra no sumário de títulos herdada do plano, um conector que não conecta, e um
problema estrutural de design: depois do hero, os 2.200px seguintes são quatro cabeçalhos
idênticos sobre três grades idênticas com respiro constante. Restrição sem variação não é
restrição, é template.

**6.1 — O carrossel sai; os três depoimentos ficam visíveis.** Decisão tomada com o
usuário. Com avanço automático de 7s, quem passa os olhos vê **um** depoimento e não
percebe que há outros — três bolinhas de 8px no rodapé de uma coluna centralizada não
comunicam isso. Depoimento é conteúdo de força cumulativa: três vozes de três cidades é o
argumento, uma é anedota.

Substitua por uma grade de três a partir de 900px, empilhando abaixo disso. Reaproveite o
tratamento de divisores do `Diferenciais` (filete de 1px em `--azul-borda` entre colunas,
sem moldura de card) para a seção ficar quieta. Mantenha `Estrelas` e o Fraunces itálico.

Isso apaga toda a camada de estado do `Depoimentos.jsx` e com ela, de uma vez: o anúncio
de `aria-live` a cada 7s (que interrompia a leitura do usuário — o padrão APG manda
`off` durante rotação automática), os alvos de 8×8px das bolinhas (o mínimo AA do WCAG
2.5.8 é 24×24, e `transform: scale()` não aumenta área de clique), o pulo de layout de
26px a cada avanço, o `aria-label` num `<div>` sem role (que a tecnologia assistiva
descarta), a transição de `background` nas bolinhas e os `:hover` sem guarda de
`@media (hover: hover)`.

O `“` gigante vai como marca d'água atrás da coluna do meio, onde tem composição para
sustentá-lo — hoje ele paira 90px acima do texto que deveria abrir, ancorado numa caixa
cuja largura ninguém controla de propósito (o `max-width: 760px` do `.carrossel` é letra
morta: a largura real é 620px, herdada do `.texto`).

Framer continua demonstrado no acordeão (Tarefa 8), nas abas (12) e no wizard (10–11).

**6.2 — `Diferenciais` precisa de `titulo`.** Passar só `etiqueta` faz o `Secao` não
emitir `<h2>`, então os quatro `<h3>` da seção se penduram no `<h2>` da seção anterior: um
leitor de tela navegando por títulos lê "Adesão sem burocracia" como um quinto tipo de
veículo. A seção também fica sem nome acessível (`aria-labelledby` resolve para
`undefined`). Visualmente é a única cujo cabeçalho é uma etiqueta solta sobre uma grade, o
que lê como inacabado.

O plano não pediu título — o defeito é meu. Dê um título de verdade à seção.

E torne isso difícil de repetir: no `Secao`, avise em desenvolvimento quando vier
`etiqueta` sem `titulo`. A Tarefa 8 tem um `CtaFinal` que plausivelmente cai no mesmo
caso.

**6.3 — O conector do `ComoFunciona` não conecta.** `.trilha` tem `gap: var(--e-4)` (32px)
e o conector é `flex: 1` **dentro** do `.passo`, então ele só alcança a borda direita da
própria coluna. Medido em 1440: o conector 1 termina em x=494 e o círculo 2 começa em
x=526. Em 760px o vão de 32px come 22% de um traço de 143px. No desktop a leitura é de
três tracinhos saindo dos círculos, não de uma linha ligando-os — parece bug de
renderização, não diagrama.

Pior: o comentário no CSS afirma que o conector "encosta exatamente no círculo seguinte",
o que só é verdade no ramo mobile, onde o `gap` é 0. Comentário confiantemente errado é
pior que comentário nenhum. Corrija os dois.

Suba também o breakpoint da virada de 700px para ~820px: em 701px sobram três colunas de
~180px com círculo de 48px, que é a largura mais feia da página.

**6.4 — Contradição factual entre seções vizinhas.** `diferenciais.js` promete "vistoria
simples e proteção ativa **no mesmo dia**"; o passo 2 do `comoFunciona.js`, 600px abaixo,
diz "**agende** a vistoria do veículo na unidade mais próxima". Não dá para agendar visita
a uma unidade e estar coberto no mesmo dia. Mesma categoria do "desde 2016 / 9 anos" do
hero. Escolha uma das duas afirmações.

**6.5 — Copy.** Três correções:

- `diferenciais.js` traz "o melhor custo-benefício do segmento" — superlativo não
  verificável, exatamente o registro que a correção 5.5 rejeitou no hero. Troque por algo
  que um associado consiga conferir.
- Os três depoimentos têm comprimento quase idêntico e percorrem o mesmo arco (incidente
  → resposta rápida → recomendo), todos terminando em recomendação. Lidos em sequência
  soam gerados — o que num portfólio é pior que dois depoimentos que não rimam. Varie
  comprimento, arco e final. E um deles é de Porto Alegre, RS, fora do "Sul de Santa
  Catarina" que a etiqueta do hero agora afirma: troque a cidade ou ajuste a afirmação.
- O `<h2>` do `Depoimentos` é o único da página que nomeia o próprio tipo de componente em
  vez de dizer alguma coisa ("Proteção para cada tipo de veículo", "Do orçamento à
  proteção ativa", … "Depoimentos"). Escreva uma frase.

**6.6 — Ritmo visual: variação de respiro e sequência de fundos.** Decisão tomada com o
usuário; corrigir agora, com quatro seções, e não na Tarefa 14 com oito.

*Respiro.* Hoje toda seção usa `padding-block: var(--e-secao)` e um vão de `--e-6` entre
cabeçalho e conteúdo, então o argumento de "por que nos escolher" e a mecânica de "como
contratar" recebem exatamente o mesmo ar. Acrescente ao `Secao` uma prop `ar`
(`'compacto' | 'padrao' | 'amplo'`, padrão `'padrao'`) que escala o padding vertical e o
vão do cabeçalho. Use `amplo` nas seções de argumento (Diferenciais, Depoimentos) e
`compacto` nas utilitárias (TiposVeiculo, BlogRecente).

*Medida.* O `Secao` já aceita `className`; use-o para variar a largura da coluna de
conteúdo por seção em vez de deixar todas em 640px.

*Fundos.* A sequência atual (`noite → noite → profundo → noite → elevado`) não codifica
nada, e a emenda entre o hero e o `TiposVeiculo` é invisível: mesma cor, separadas só por
padding. Regra para as oito seções:

| Seção | `fundo` |
|---|---|
| Hero | `noite` (com foto) |
| TiposVeiculo | `profundo` |
| Diferenciais | `noite` |
| ComoFunciona | `profundo` |
| Depoimentos | `elevado` |
| BlogRecente | `noite` |
| FAQ | `profundo` |
| CtaFinal | `noite` com halo dourado |

Alterna de forma limpa, quebra a emenda invisível sob o hero e reserva o `elevado` para um
único momento — a prova social —, dando a ele significado em vez de ser mais uma listra.

**6.7 — Escalonar os três passos do `ComoFunciona`.** É a seção mais diagramática da
página e hoje aparece pronta de uma vez, enquanto a de cima se conta em quatro tempos.
Envolva cada passo em `Revelar` com `atraso={índice * 90}`: o conector passa a ler como
caminho sendo desenhado. Barato e de retorno alto.

**6.8 — Os numerais fantasma: assuma ou remova.** `.numeral` computa 52px em Fraunces com
`opacity: .25` — exatamente o mesmo corpo e família do `<h2>` da seção, 30px ao lado.
Grande demais para rótulo, pequeno demais para arquitetura. Ou leve para a escala
`--t-hero` e deixe viver atrás do título como textura, ou remova e deixe os filetes entre
colunas fazerem o trabalho — eles já são o recurso mais confiante daquela seção.

**6.9 — Ajustes menores.**

- O comentário do `comoFunciona.js` afirma que o layout "assume exatamente estes três
  itens". Não assume: `.trilha` é flex com `.passo { flex: 1 }` e o conector é guardado
  por `indice < passos.length - 1`. Um quarto passo funciona, só fica estreito. Documentar
  restrição que não existe faz a Tarefa 13 duplicar o arquivo em vez de reusar o padrão.
- `gap: 0.125rem` literal no `Depoimentos.module.css`.
- Setas e glifos (`←`, `→`, `❚❚`, `“`) são texto cru e caem na cadeia de fallback da fonte;
  `❚❚` é caractere de desenho de caixa, não ícone de pausa, com risco real de tofu. O que
  sobreviver à reescrita vira SVG inline, como o `Estrelas` já faz.
- Deixe comentado o que qualquer `min-height` mágico está protegendo, para a Tarefa 14
  saber se pode mexer.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Adiciona diferenciais, como funciona e depoimentos"
```

---

### Task 8: Home — Blog recente, FAQ e CTA final ✅ (revisada)

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

- [ ] **Step 7: Correções apontadas na revisão**

A home inteira existe. O veredito da revisão: bate o "SaaS escuro genérico", mas ainda é
um template bem executado, não uma composição. As correções abaixo fecham a página e
limpam três coisas em `ui/` que as Tarefas 10 a 13 herdariam.

**7.1 — Painéis fechados do acordeão continuam na árvore de acessibilidade.** Medidos os
dez em repouso: `height: 0`, `overflow: hidden`, `visibility: visible`, sem `aria-hidden`,
sem `hidden`, sem `inert`. Altura zero com `overflow: hidden` **não** poda a subárvore da
acessibilidade: quem usa leitor de tela ouve as dez respostas enquanto todos os botões
informam `aria-expanded="false"`.

Aplique `visibility: hidden` (ou `inert`) quando a animação de fechamento assentar — a
máquina de `assentado` já existe para pendurar isso.

E corrija o comentário das linhas 20–23, que diagnostica errado: ele diz que o passo de
`overflow: visible` "salva o anel de foco de um link dentro da resposta". O risco real de
um link futuro é ele ser **tabulável com o painel fechado**, e `overflow: visible` não faz
nada quanto a isso. Mesma categoria do comentário confiantemente errado do conector (6.3).

**7.2 — `Revelar` sai de dentro do `Acordeao`.** Uma primitiva de `ui/`, que o plano
define como "sem domínio", não decide a própria coreografia de scroll. O custo concreto:
os painéis das abas da Tarefa 12 montam na troca de aba, então um acordeão dentro de um
painel refaz a animação de entrada toda vez que se volta àquela aba.

Mova o reveal para o `FAQ.jsx`, envolvendo o acordeão inteiro num único `Revelar` com
`margem` generosa. Isso também resolve o escalonamento de 810ms no décimo item: numa tela
alta os dez entram na região do observador ao mesmo tempo, e o último aparecendo 810ms
depois do primeiro lê como travamento, não como cadência.

**7.3 — `Acordeao` está moldado no FAQ, não genérico.** Três mudanças para ele valer o
lugar em `ui/`:

- Renomeie os campos de `pergunta`/`resposta` para `titulo`/`conteudo`. O código não tem
  conhecimento de domínio; a API tem.
- Aceite **nó**, não só string. Hoje o `conteudo` é renderizado dentro de um `<p>`, então o
  componente não comporta uma lista nem um link — que é exatamente onde ele ganharia o
  lugar dele nas Tarefas 12 e 13.
- Avise em desenvolvimento quando `itens` vier inválido, como `Botao` e `Secao` já fazem.
  Hoje o `.map` simplesmente estoura.

Mantenha "um aberto por vez" fixo, **sem** virar prop: com um único chamador, uma prop
`multiplo` é generalidade especulativa. Acrescente quando a Tarefa 12 ou 13 precisar.

Documente `tituloComo` e `className`, que foram acréscimos bons mas não estão no contrato
escrito.

**7.4 — O FAQ tem dois alinhamentos brigando.** Medido em 1440: a borda esquerda do `<h2>`
fica em x=121 (o gutter do container) e a do acordeão em x=283, porque o
`FAQ.module.css` centraliza uma caixa de 860px dentro do container de 1280px enquanto o
cabeçalho continua colado à esquerda. 162px de deslocamento entre um título e aquilo que
ele intitula lê como erro. Passe `centralizado` ao `Secao` ou tire o `margin-inline: auto`.

**7.5 — O `sizes` do `BlogRecente` não bate com o próprio breakpoint.** O JSX declara
`(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw`, mas o CSS colapsa para uma
coluna em **768px**. Entre 641px e 768px o card é de largura cheia enquanto o `sizes` diz
50vw — subdimensionamento de 2×, ou seja, capa visivelmente mole na maioria dos tablets e
celulares grandes em retrato. Verificado em 700px: card renderiza 630px contra 350px
declarados. Alinhe os dois números.

**7.6 — `Secao` precisa de um encaixe de decoração.** O `CtaFinal` alcança as entranhas do
`Secao` com `.halo :global(.container)` para erguer o cabeçalho acima da própria
decoração. O comentário é honesto quanto ao motivo, mas o padrão vaza: as Tarefas 12 e 13
vão copiá-lo.

Dê ao `Secao` um encaixe declarado — uma prop `decoracao` renderizada atrás de um container
sempre elevado — para o padrão existir uma vez em vez de ser redescoberto três.

Aproveite e avise em desenvolvimento quando `centralizado` e `--secao-medida` vierem
juntos: o `.centralizado` sobrescreve a medida em silêncio, e o `CtaFinal` já carrega uma
declaração morta por causa disso.

**7.7 — Reescrever o `BlogRecente` e movê-lo para depois do FAQ.** Dois problemas se
resolvem na mesma mudança.

*O arco quebra ali.* Lida como um documento, a página é: promessa → o que cobre → por que
nós → como funciona → prova → **blog** → objeções → pedido. Seis das oito seções avançam um
argumento. O blog não diz nada sobre o produto, termina em beco sem saída por projeto, e
está exatamente entre o pico emocional (os três depoimentos) e o tratamento de objeções
que deveria apertar rumo ao fechamento. A sequência é prova → objeções → pedido; "eis alguns
artigos" vem depois dela.

*É a quinta grade de fotos seguida.* E as três capas são as **únicas** imagens sem filtro
da página (hero em `saturate(0.5)`, capas de veículo em `grayscale(1)`, blog em `none`),
então a seção que menos avança o argumento é a banda mais barulhenta — com um esportivo
vermelho ilustrando um post sobre feira regional.

Reescreva como lista tipográfica de três colunas: categoria em versalete dourado, data,
título em Fraunces, resumo, filetes de 1px entre as colunas. **Sem capas.** Custa menos
código do que existe hoje, tira a quinta grade de fotos, elimina o problema da foto de
banco de imagem, torna o "não clicável" completamente natural (ninguém espera clicar numa
bibliografia) e acrescenta a variedade compositiva que falta.

Nova ordem: Hero · TiposVeiculo · Diferenciais · ComoFunciona · Depoimentos · FAQ ·
BlogRecente · CtaFinal. Fundos correspondentes:

| Seção | `fundo` |
|---|---|
| Hero | `noite` |
| TiposVeiculo | `profundo` |
| Diferenciais | `noite` |
| ComoFunciona | `profundo` |
| Depoimentos | `elevado` |
| FAQ | `profundo` |
| BlogRecente | `noite` |
| CtaFinal | `profundo` (o mais escuro fecha a página) |

**7.8 — O `CtaFinal` tem peso, mas não tem finalidade.** Três ajustes:

*O halo não lê como luz.* `rgba(198,160,74,0.32)` com parada `transparent` em 60% num
`circle at 50% 35%` de uma caixa com inset −20% dá um raio de ~767px — quase a seção
inteira. Composto sobre o azul a 32%, vira uma névoa oliva-amarronzada, mais visível em
375px onde toma a banda toda: lê como sujeira, não como brilho. Halo quer **raio menor,
croma maior e alfa menor** — tente `--dourado-claro` a ~0.18 com a parada transparente
perto de 40%, para ler como fonte de luz.

*Nada nele diz "último".* Estruturalmente é o mesmo `Secao` das outras sete. Uma banda de
fechamento ganha finalidade por mudança de **espécie** — um filete, uma assinatura, uma
mudança de textura — não por um número maior.

*A hierarquia briga consigo.* O telefone tem 88px e domina; o botão primário tem 15px e é o
**quarto** "Fazer cotação" da página (header fixo, hero, ComoFunciona, aqui). Visualmente a
página pede que se ligue; a hierarquia de botões pede um formulário já oferecido três
vezes. Escolha um. O movimento de banco privado: rotular o número ("Central de
atendimento"), pô-lo em 40–48px e não 88 (um número dourado de 88px sem rótulo lê outdoor
de call center), e rebaixar "Fazer cotação" para contorno. Aí o fim oferece algo que a
página ainda não ofereceu três vezes.

Guarde a rima que ninguém escreveu: o telefone resolvia em exatamente `--t-hero`, o mesmo
corpo do `<h1>`. Se reduzir, **crie um token próprio** em vez de consumir `--t-hero`, que
acopla dois componentes sem relação por um token com nome de outro.

**7.9 — Quebrar uma das grades em layout assimétrico.** A correção 6.6 variou o *respiro* e
isso funcionou, mas o diagnóstico era "cabeçalhos idênticos sobre grades idênticas" — e as
grades continuam idênticas. Todas as oito seções também são **entradas** do mesmo jeito:
etiqueta, `<h2>` de 52px, subtítulo opcional, tudo colado à esquerda no gutter. Oito vezes.

Refaça o `Diferenciais` com o cabeçalho preso numa coluna à esquerda e os quatro itens
empilhados numa coluna à direita (algo como 5/7), colapsando para uma coluna no mobile.
Isso quebra a monotonia de entrada e diferencia o `Diferenciais` do `Depoimentos`, que
hoje são quase o mesmo objeto a 1.600px de distância.

**7.10 — Colapsar os 34 IntersectionObservers em um.** A página cria **34** observadores no
mount (tipos 5, diferenciais 5, comoFunciona 4, depoimentos 4, blog 4, faq 11, cta 1). Cada
um se desconecta após disparar, então em repouso é zero — não é problema de runtime, é de
forma, e vai piorar com as Tarefas 12 e 13.

Um único observador de escopo de módulo dentro do `useRevelar`, com um `Map` de elemento →
setter, colapsa os 34 em 1 **sem mudar a API do `Revelar`** e sem tocar em nenhum chamador.
Fazer agora custa um arquivo; fazer na Tarefa 14 obriga a reverificar o reveal de oito
seções em mais três rotas.

**7.11 — Ajustes menores.**

- `CtaFinal.module.css` escreve `rgba(198, 160, 74, 0.32)` — o `--dourado` soletrado em
  componentes RGB. O projeto já tem o mecanismo: crie `--dourado-rgb` no `tokens.css`, como
  já existe `--azul-noite-rgb`.
- O link do telefone não tem contexto acessível: um leitor de tela anuncia só "link, 0800
  150 5050". O rótulo pedido em 7.8 resolve os dois problemas de uma vez.
- Dez `role="region"` criam dez landmarks. O padrão APG recomenda `role="region"` em painel
  de acordeão só quando são poucos; dez passa disso.
- `abertoInicial` é semente de `useState`, portanto só vale na montagem, e isso não está
  documentado. A Tarefa 13, se for abrir um item por link, vai precisar de `key` ou de modo
  controlado.
- "Ver todos" está `align-self: center` numa banda inteiramente alinhada à esquerda.
- `Botao.module.css` usa `transition: var(--transicao)` sem propriedade, o que resolve para
  `transition-property: all` em **todo** CTA do site. Declare as propriedades.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Adiciona blog recente, FAQ e CTA final; completa a home"
```

---

### Task 9: Cálculo da cotação (TDD) ✅

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

**O ano corrente é injetável, não constante.** Um `ANO_ATUAL = 2026` fixo derivaria em
silêncio: em 2027 todo veículo seria calculado um ano mais novo do que é, e nenhum teste
quebraria. Por isso `anoAtual` é parâmetro com padrão `new Date().getFullYear()`, e os
seis testes acima fixam `anoAtual: 2026` explicitamente — suíte que começa a falhar no
dia 1º de janeiro é pior que o bug que ela deveria pegar.

Dois testes a mais fecham as brechas: um confirmando que o padrão pega o ano real, e um
para o guarda de `ano` inválido. `Number(undefined)` é `NaN` e `Number('')` é `0`; nenhum
dos dois estoura sozinho, e ambos produziriam um ajuste de idade silenciosamente errado —
exatamente o tipo de falha que este módulo existe para impedir. A faixa de 1980 a 2026 
**não** é revalidada aqui: é validação de apresentação, com mensagem para o usuário, e 
pertence ao formulário da Tarefa 11.

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

const AJUSTE_VEICULO_ANTIGO = 0.12
const AJUSTE_VEICULO_NOVO = -0.08

export function calcularMensalidade({ tipo, valor, ano, anoAtual = new Date().getFullYear() }) {
  const percentual = PERCENTUAL_POR_TIPO[tipo]
  if (percentual === undefined) {
    throw new Error(`Tipo de veículo desconhecido: ${tipo}`)
  }
  if (!(valor > 0)) {
    throw new Error('Valor do veículo deve ser maior que zero')
  }

  const anoNum = Number(ano)
  if (!Number.isFinite(anoNum)) {
    throw new Error('Ano do veículo inválido')
  }

  const idade = anoAtual - anoNum
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

- [ ] **Step 5: Correções apontadas na revisão**

Este é o único lugar do projeto onde um número errado passa em silêncio. Dois guardas
falham exatamente nos casos que deveriam cobrir.

**5.1 — `Number.isFinite` não pega string vazia.** A justificativa do guarda cita
`Number('')` valendo `0`, mas `0` é finito e passa. E `''` não é hipotético: é o valor
inicial de `ano` no `estadoInicial` da Tarefa 10. Qualquer caminho que chegue ao
`EtapaResumo` sem a etapa 2 preenchida — link direto, `reiniciar` seguido de salto, um
futuro botão de editar — produz `idade = 2026`, cai na faixa de mais de dez anos e cobra
a **sobretaxa de veículo antigo** sobre um veículo cujo ano nunca foi digitado. Erro
plausível é pior que erro barulhento.

Valide a forma antes de coagir. Cubra nos testes `''`, `null`, `'  '` e `[]` — hoje os
quatro coagem para `0` ou `NaN` de maneiras diferentes.

**5.2 — Chaves herdadas de `Object.prototype` passam pelo guarda de tipo.**
`PERCENTUAL_POR_TIPO['toString']` devolve a função herdada, então `percentual === undefined`
é falso e o resultado sai `NaN` — que o `Intl.NumberFormat` renderiza como "R$ NaN". Vale
para `constructor`, `valueOf` e `hasOwnProperty`. É alcançável: os ids viajam na URL como
`?tipo=`, portanto `tipo` é entrada controlada pelo usuário. Use
`Object.hasOwn(PERCENTUAL_POR_TIPO, tipo)`.

**5.3 — As bordas das faixas de idade não são testadas, e os dois off-by-one clássicos
sobrevivem à suíte.** Trocar `idade > 10` por `>= 10`, ou `idade <= 3` por `< 3`, deixa os
oito testes verdes. Acrescente, com `anoAtual: 2026`:

| `ano` | idade | `ajuste` esperado |
|---|---|---|
| 2016 | 10 | `0` (dez não é "mais de dez") |
| 2015 | 11 | `0.12` |
| 2023 | 3 | `-0.08` |
| 2022 | 4 | `0` |

Use `toBe` no `ajuste`, não `toBeCloseTo` — os valores são as constantes literais, e
`toBeCloseTo(0.12)` aceitaria `0.1201`.

**5.4 — `valor` não recebeu o mesmo tratamento defensivo que `ano`.** `!(valor > 0)`
rejeita `'R$ 60.000'`, mas deixa passar o que o JS coage: `'60.000'` vira base `0.81` e
mensalidade de R$ 80; `true` vira R$ 79; `[60000]` funciona por acidente. `'60.000'` é
exatamente a string que uma máscara de moeda incompleta emite. Coaja explicitamente e
rejeite o que não for finito e positivo.

**5.5 — Devolver também a base ajustada.** Hoje `base + taxaAdmin ≠ mensalidade` sempre
que houver ajuste (810 + 79 = 889, mas o total de veículo antigo é 986). A Tarefa 11
mostra só o total, então nada quebra — mas se alguém acrescentar um detalhamento "base +
taxa administrativa", ele visivelmente não fecha. Devolva `baseAjustada` já arredondada,
para o detalhamento fechar por construção.

**5.6 — Comentar o arredondamento.** `Math.round` sobre float perde o `.5` exato em alguns
casos (`11500 * 0.011` dá `126.49999999999999`, que arredonda para 126 e não 127). Sempre
R$ 1 de diferença, sempre para baixo, e o valor é declaradamente estimativa — não mude o
código. Comente que é deliberado, para ninguém "consertar" isso depois numa resposta
diferente.

**5.7 — O percentual de carros está fora da realidade do setor.** 1,35% ao mês são 16,2%
do valor do veículo por ano: um carro de R$ 60 mil sai a R$ 889/mês, entre o dobro e o
triplo do que uma associação de proteção veicular cobra no Brasil — e sair mais barato que
seguradora é justamente o argumento do setor. Motos e caminhões estão plausíveis. Baixe
`carros` para cerca de `0.006`, o que põe o mesmo carro perto de R$ 440/mês. Ajuste os
testes que dependem do valor.

**5.8 — A Tarefa 10 reintroduz o bug do ano fixo.** A validação dela rejeita ano maior que
`2026` literal, então em 2027 um veículo legítimo é recusado. Como o `calculo.js` agora é
quem sabe o que é "ano corrente", a Tarefa 10 deve usar `new Date().getFullYear()` nesse
limite.

- [ ] **Step 6: Commit**

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

Ative a preferência no navegador e percorra o site. O bloco CSS do `tokens.css` cobre só
a camada CSS; cada animação de Framer precisa do `useReducedMotion` (ver "Nota sobre
movimento reduzido" no topo). Confira **um por um**: transição de rota, entrada
escalonada do menu mobile, entrada do hero, reveals de scroll, avanço automático do
carrossel, abertura do acordeão, slide entre etapas do wizard e o indicador deslizante
das abas. Qualquer um que ainda anime é um `useReducedMotion` esquecido.

- [ ] **Step 4: Verificar a restauração de scroll no voltar/avançar**

Pendência herdada da Tarefa 2, que não era testável lá: as páginas eram stubs de uma
tela só. O `useScrollTopo` tem uma guarda de `POP` que sai sem fazer nada, delegando à
restauração nativa do navegador (`history.scrollRestoration = 'auto'`).

Em SPA isso é frágil: o navegador tenta restaurar a posição antes de o React ter pintado
conteúdo com altura suficiente, e a restauração é descartada em silêncio. O
`min-height: 100vh` do `.pagina` garante só uma tela.

Num navegador comum (não automatizado), role a home até o FAQ, navegue para
`/beneficios` e aperte Voltar. Se a posição não for restaurada, implemente a restauração
manual: guarde `window.scrollY` por `location.key` num `Map` antes de sair e restaure no
`POP` dentro do `useLayoutEffect`, com um `requestAnimationFrame` para esperar a pintura.

- [ ] **Step 5: Configurar o fallback de SPA para produção**

O `npm run dev` resolve rotas profundas sozinho, mas um host estático não: `/beneficios`
digitado direto retornaria o 404 do próprio host, e o `NaoEncontrada` — que só pega
navegação client-side — nunca apareceria.

Crie `public/_redirects` com a regra de reescrita:

```
/*    /index.html   200
```

Isso cobre Netlify e Cloudflare Pages. Registre no README que outros hosts precisam da
regra equivalente (`vercel.json` com `rewrites`, ou `try_files` no Nginx).

- [ ] **Step 6: Verificar o build**

Run: `npm run build && npm run preview`
Expected: build sem erro nem aviso de chunk acima de 500kB. Navegue no preview e confira
que a transição entre rotas continua fluida.

- [ ] **Step 7: Escrever o `README.md`**

Descreva o projeto como estudo de redesign sem vínculo com a empresa, a stack, como
rodar (`npm install`, `npm run dev`, `npm test`), a estrutura de pastas e as decisões de
design (paleta, tipografia, wizard). Registre que o conteúdo é aproximado e que os dados
reais entram numa passada posterior.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Ajusta responsividade e acessibilidade; adiciona README"
```

---

## Pendência declarada

Os dados reais — telefones, endereço, CNPJ, textos institucionais e depoimentos na
íntegra — entram depois desta implementação, editando apenas `src/dados/`. Nenhum
componente precisa mudar para isso.
