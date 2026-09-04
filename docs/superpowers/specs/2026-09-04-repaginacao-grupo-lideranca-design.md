# Repaginação — Grupo Liderança Proteção Veicular

**Data:** 2026-09-04
**Tipo:** Estudo de redesign para portfólio
**Referência:** https://grupoliderancaassociacao.com.br/

---

## 1. Contexto e objetivo

O Grupo Liderança é uma associação de proteção veicular sediada em Tubarão-SC. O site
atual é um WordPress com Elementor: funcional, porém datado — slider genérico, hierarquia
visual fraca, quatro páginas de benefícios quase idênticas e pouca personalidade de marca.

Este projeto é uma **repaginação completa para portfólio**. Não substitui o site em
produção. Isso libera decisões que um projeto comercial não permitiria: liberdade
criativa total na identidade, sem compromisso com SEO herdado, sem CMS e sem
integrações de backend.

**Critério de sucesso:** um site que faz quem abre parar e explorar, que se sustenta
tanto no desktop quanto no celular, e que demonstra domínio de React, de arquitetura
de front-end e de design visual.

## 2. Stack

- **React 18 + Vite** — build rápido, HMR, zero configuração cerimonial
- **React Router v6** — rotas reais por `/`, sem hash
- **Framer Motion** — transições de rota, reveals de scroll e o wizard de cotação
- **CSS artesanal** — design tokens em custom properties + CSS Modules por componente

CSS escrito à mão em vez de Tailwind: numa peça de portfólio com estética sob medida,
o CSS próprio demonstra mais domínio e evita a aparência de template. O custo é escrever
mais linhas; o ganho é controle total sobre a identidade visual.

## 3. Direção visual — "Confiança Premium"

Azul-noite com dourado e tipografia serifada editorial. A referência mental é banco
privado ou seguradora de alto padrão, não startup. Passa solidez — o que é exatamente
o que uma associação que guarda patrimônio precisa comunicar.

### Paleta

| Token | Valor | Uso |
|---|---|---|
| `--azul-noite` | `#0B1A2E` | fundo principal |
| `--azul-profundo` | `#071320` | seções alternadas |
| `--azul-elevado` | `#12263F` | cards e superfícies elevadas |
| `--dourado` | `#C6A04A` | acento, CTAs, filetes |
| `--dourado-claro` | `#E0C079` | hover e realces |
| `--gelo` | `#EAF0F7` | texto principal |
| `--gelo-suave` | `rgba(234,240,247,.60)` | texto secundário |

### Tipografia

- **Títulos:** `Fraunces` — serifada variável com optical sizing. Editorial e
  característica, sem cair no Playfair já batido.
- **Corpo:** `Manrope` — geométrica limpa, boa em tamanhos pequenos.
- Escala fluida com `clamp()` para dispensar breakpoints tipográficos.

### Textura e profundidade

Grão SVG sutil sobre os fundos, halos radiais dourados atrás dos elementos-chave,
filetes de 1px como divisores e fotografia da Unsplash com tratamento duotone
azul/dourado sob gradiente de leitura.

## 4. Rotas

| Rota | Página |
|---|---|
| `/` | Home |
| `/quem-somos` | História, missão, números |
| `/beneficios` | Coberturas com abas por tipo de veículo |
| `/unidades` | Onde estamos |
| `/blog` | Listagem de posts |
| `/contato` | Canais e formulário |
| `/cotacao` | Wizard de cotação |
| `*` | 404 |

Transição entre rotas com fade e leve subida via `AnimatePresence`. Scroll volta ao topo
a cada navegação. O header começa transparente sobre o hero e vira sólido ao rolar.

## 5. Páginas

### Home

Hero com foto tratada e headline serifada → 4 cards de tipo de veículo → 4 diferenciais
(adesão sem burocracia, cobertura nacional, assistência 24h, até 100% da FIPE) → como
funciona em 3 passos → depoimentos → 3 posts recentes → FAQ em acordeão → CTA final com
telefone e WhatsApp → footer.

### Benefícios

Página única com abas animadas — Carros · Motos · Caminhões 3/4 · Caminhões Pesados.
Indicador dourado deslizante, conteúdo trocando em crossfade. Substitui as quatro
páginas repetidas do site original. No mobile as abas viram scroll horizontal.

### Demais páginas

Quem Somos, Unidades e Contato seguem o mesmo sistema visual, com composições próprias
para não parecerem a mesma página com texto trocado.

**Blog.** Listagem em grid com capa, categoria, data e resumo. Como rota de post
individual está fora de escopo, cada card é um `<article>` sem link de navegação — o
conteúdo do resumo se basta. Isso evita link morto ou rota vazia, que numa peça de
portfólio pesa mais que a ausência da página de detalhe.

## 6. Cotação em etapas — peça de destaque

Rota `/cotacao`, quatro etapas com barra de progresso dourada e slide lateral:

1. **Tipo de veículo** — 4 cards ilustrados; o clique já avança
2. **Dados do veículo** — marca, modelo, ano, valor aproximado
3. **Seus dados** — nome, telefone com máscara, cidade, e-mail
4. **Resumo** — plano sugerido, mensalidade estimada e botão que monta a mensagem
   do WhatsApp

Estado central em `useReducer`. Validação por etapa impede avanço com campo inválido.
O botão voltar preserva o que já foi preenchido.

O cálculo da estimativa fica isolado em `dados/calculo.js` como função pura, sem
dependência de React — é a única lógica do projeto que merece teste automatizado.

**Regra de cálculo.** A mensalidade estimada parte de um percentual do valor do veículo
por tipo (carro, moto, caminhão 3/4, caminhão pesado), somado a uma taxa administrativa
fixa e ajustado por faixa de ano do veículo. Os percentuais são arbitrados para o estudo
e ficam declarados como constantes nomeadas no topo do módulo. A tela de resumo deixa
explícito que o valor é uma estimativa e que a proposta final vem do consultor — nenhum
número é apresentado como preço firme.

## 7. Arquitetura de arquivos

```
src/
  main.jsx
  App.jsx                    rotas + layout persistente
  estilos/
    tokens.css               cores, tipografia, espaçamento, sombras
    global.css               reset e base
  componentes/
    layout/                  Header · MenuMobile · Footer · WhatsAppFlutuante
    ui/                      Botao · Secao · Revelar · Acordeao · Estrelas · Abas
    home/                    Hero · TiposVeiculo · Diferenciais · ComoFunciona
                             Depoimentos · BlogRecente · FAQ · CtaFinal
    cotacao/                 Wizard · BarraProgresso · Etapa1..4
  paginas/                   Home · QuemSomos · Beneficios · Unidades · Blog
                             Contato · Cotacao · NaoEncontrada
  dados/                     veiculos · diferenciais · faq · depoimentos
                             posts · unidades · calculo
  hooks/                     useRevelar · useScrollTopo
```

**Fronteiras.** Componentes de `ui/` não conhecem o domínio — recebem tudo por props e
são reutilizáveis em qualquer página. Componentes de `home/` compõem os de `ui/` com
dados. Páginas apenas orquestram seções. Nenhum componente importa conteúdo
diretamente: tudo vem de `dados/`, o que permite trocar texto sem tocar em componente
e, no futuro, trocar a fonte por um CMS mexendo em um lugar só.

## 8. Conteúdo

O conteúdo entra **aproximado** nesta fase, baseado no que o site atual comunica:
tipos de veículo e coberturas, os quatro diferenciais, perguntas frequentes,
depoimentos, unidades e posts.

Os dados reais — telefones, endereço, CNPJ, textos institucionais definitivos e os
depoimentos na íntegra — ficam para uma passada posterior. Como todo o conteúdo está
isolado em `dados/`, essa troca é edição de arquivo de dados, sem refatoração.

## 9. Responsividade

Mobile-first com breakpoints em 640 / 900 / 1200px. O menu vira drawer full-screen com
os itens entrando escalonados. Grids de 4 colunas passam a 2 e depois a 1. As abas de
benefícios viram scroll horizontal. Tipografia fluida dispensa ajuste por breakpoint.

## 10. Acessibilidade

Contraste mínimo AA sobre o azul-noite. Foco visível em dourado. Navegação por teclado
nas abas e no acordeão seguindo os padrões ARIA. `prefers-reduced-motion` desliga as
animações de reveal e as transições de rota.

## 11. Verificação

Conferência visual no navegador a cada página concluída, em desktop e mobile, mais
testes unitários com Vitest sobre `dados/calculo.js`. Um site de portfólio não
justifica suíte de testes ampla; a lógica de cálculo justifica porque é a única regra
de negócio real do projeto.

## 12. Fora de escopo

Backend, envio real de formulário, CMS, autenticação, área do associado, segunda via de
boleto, integração de pagamento, blog com posts individuais em rota própria e
internacionalização.
