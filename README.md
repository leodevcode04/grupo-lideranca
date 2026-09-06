# Grupo Liderança — Estudo de redesign (portfólio)

> **Este projeto não tem vínculo com o Grupo Liderança Proteção Veicular nem com
> qualquer empresa real.** É um estudo de redesign de portfólio: um site fictício,
> construído para demonstrar arquitetura de front-end, sistema visual e um fluxo de
> cotação em várias etapas. Nomes, telefones, endereços, CNPJ, depoimentos e textos
> institucionais são placeholders — **nenhum dado de contato aqui é real**.

## Stack

- **React 18** + **Vite 6** — SPA sem framework de servidor.
- **React Router v6** — rotas reais (`BrowserRouter`), sete telas.
- **Framer Motion** — transição de rota, menu mobile, entrada do hero, reveals de
  scroll, acordeão, wizard de cotação e indicador de abas.
- **CSS Modules** sobre um conjunto de *design tokens* em custom properties
  (`src/estilos/tokens.css`) — sem biblioteca de UI.
- **Vitest** — testes automatizados da única regra de negócio real do projeto: o
  cálculo da cotação (`src/dados/calculo.js`).

## Como rodar

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run build      # build de produção em dist/
npm run preview    # serve o build de produção localmente
npm test           # roda a suíte de testes (Vitest)
```

## Estrutura de pastas

```
src/
  componentes/
    ui/          # peças de interface sem conhecimento de domínio
                 # (Botao, Campo, Secao, Abas, Acordeao, Revelar, ...)
    layout/      # chrome persistente (Header, Footer, MenuMobile,
                 # WhatsAppFlutuante, Transicao)
    home/        # seções específicas da home (Hero, Diferenciais, FAQ, ...)
    cotacao/     # o wizard de 4 etapas e seu estado
  paginas/       # uma por rota — só orquestram seções, sem lógica própria
  dados/         # conteúdo e regras de negócio, isolados dos componentes
  hooks/         # useRevelar (scroll reveal), useScrollTopo (rolagem entre rotas)
  estilos/       # tokens.css (paleta, tipografia, espaçamento) e global.css
  utils/         # helpers de imagem (variantes responsivas de URL)
public/
  _redirects     # fallback de SPA para Netlify/Cloudflare Pages (ver abaixo)
```

**Regra de composição:** componentes de `ui/` não sabem nada sobre o negócio;
componentes de seção (`home/`, `cotacao/`) combinam UI com dados de `dados/`;
páginas em `paginas/` só arrumam seções na ordem certa. Trocar conteúdo é sempre
uma edição em `src/dados/`, nunca nos componentes.

## Rotas

`/`, `/quem-somos`, `/beneficios`, `/unidades`, `/blog`, `/contato`, `/cotacao` — e
qualquer outro caminho cai na página 404 (`NaoEncontrada`), renderizada
client-side pelo React Router.

## Decisões de design

**Identidade "Confiança Premium".** Paleta escura — azul-noite profundo
(`--azul-noite`, `--azul-elevado`, `--azul-profundo`) com dourado (`--dourado`) como
cor de destaque e cinza-gelo translúcido (`--gelo`, `--gelo-suave`, `--gelo-tenue`)
para texto. A intenção é transmitir solidez financeira sem parecer corporativo frio:
o dourado marca ação e conquista (CTAs, números, ícones de confirmação), nunca
decoração gratuita.

**Tipografia em duas vozes.** `Fraunces` (serifada) para títulos — dá peso
editorial aos números e headlines — e `Manrope` (sem serifa) para todo o corpo de
texto e UI, por legibilidade em telas pequenas. As escalas de título usam
`clamp()` (`--t-hero`, `--t-secao`, ...) para escalar com o viewport sem *media
query* por tamanho de fonte.

**O wizard de cotação.** Fluxo de 4 etapas (veículo → dados do veículo → contato →
resumo) com uma única fonte de verdade de estado (`useReducer` em
`estadoWizard.js`), validação por etapa, foco gerenciado (título da etapa nova
recebe foco ao avançar/voltar, primeiro campo inválido recebe foco numa falha de
validação) e uma região viva única para anúncios de erro — para não duplicar
leitura em leitores de tela. O cálculo da estimativa (`dados/calculo.js`) é a única
lógica de negócio do projeto e a única coberta por testes automatizados.

**Movimento com duas camadas.** Transições CSS (`transition`, `@keyframes`) são
desligadas globalmente por um bloco `prefers-reduced-motion` em `tokens.css`.
Animações do Framer Motion não são alcançadas por esse bloco — cada componente que
anima via Framer zera a própria `duration` (e qualquer `delay`/*stagger*) com
`useReducedMotion()` quando o usuário prefere menos movimento.

**Conteúdo aproximado.** Textos institucionais, depoimentos, posts do blog,
unidades e dados de contato são placeholders plausíveis, não informação real. A
carga de dados reais é uma passada futura que edita **apenas `src/dados/`** — nenhum
componente precisa mudar para isso.

## Fallback de SPA para produção

Em desenvolvimento (`npm run dev`) e no `npm run preview`, o próprio servidor
resolve qualquer rota profunda (`/beneficios`, por exemplo) servindo o
`index.html` e deixando o React Router assumir no cliente. Um host estático de
produção não faz isso sozinho: sem uma regra de reescrita, `/beneficios` digitado
direto na barra de endereço bate no 404 do próprio host, e a página 404 do site
(`NaoEncontrada`, que só existe no cliente) nunca chega a aparecer.

Este projeto inclui `public/_redirects`, que cobre **Netlify** e **Cloudflare
Pages**:

```
/*    /index.html   200
```

Outros hosts precisam do equivalente:

- **Vercel** — um `vercel.json` na raiz com `rewrites`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **Nginx** — `try_files $uri /index.html;` no bloco `location /` do site.
- **Apache** — um `.htaccess` com `mod_rewrite` reescrevendo tudo para
  `/index.html`.

## Acessibilidade e desempenho

- Alvo de toque mínimo de 44×44px em todo controle interativo (alguns, como os
  telefones de `/unidades` e os ícones de rede social, estendem a área clicável
  com um `::after` para não inchar o visual).
- Foco visível em todo elemento interativo (anel dourado de 2px), ordem de
  tabulação lógica, e o menu mobile prende o foco enquanto aberto.
- Pares de cor conferidos contra o padrão AA do WCAG sobre os fundos escuros do
  site.
- Imagem do hero servida com `srcset` (variante estreita para mobile) e sem
  bloquear a renderização das demais.
