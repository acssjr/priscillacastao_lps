# Hero pôster editorial — Priscilla Castão

## Objetivo

Redesenhar somente a primeira seção da landing page para reproduzir a hierarquia do conceito visual “pôster central”, sem transformar a interface em uma imagem chapada. Texto, CTA e navegação continuam sendo HTML acessível; apenas o recorte da Priscilla será um asset fotográfico.

O resultado deve comunicar imediatamente três ideias: aula particular de forró, acolhimento para iniciantes e presença autoral da Priscilla. A composição deve parecer editorial e impactante, mas continuar legível, rápida e responsiva.

## Escopo

Incluído:

- Hero da rota principal.
- Integração visual do cabeçalho com o hero no primeiro viewport.
- Nova composição tipográfica responsiva.
- Uso do recorte transparente `public/images/cutouts/priscilla-castao-ensaio-02-cutout.webp`.
- CTA principal existente para WhatsApp.
- Estados de foco, redução de movimento e testes do hero.

Fora de escopo:

- Redesign das seções posteriores.
- Alteração da oferta, preço, contato ou mensagem comercial.
- Implementação da moldura de smartphone do mockup.
- Alterações no menu aberto ou na animação de fechamento.
- Comportamento do cabeçalho após rolagem.

## Direção visual

O hero usa um fundo vinho profundo com gradiente terracota, textura muito sutil e um círculo luminoso atrás da personagem. A tipografia é organizada como pôster:

1. Eyebrow “Aulas particulares de forró em Salvador”.
2. Palavra “FORRÓ” em escala monumental ao fundo.
3. “DO ZERO,” dentro de uma cápsula creme.
4. “NO SEU RITMO.” em duas linhas de apoio.
5. Recorte da Priscilla centralizado e sobreposto à tipografia.
6. Texto de apoio curto e CTA principal na base.

“Aprenda” permanece no título e aparece como uma pequena introdução tipográfica, preservando a copy atual: “Aprenda forró do zero, no seu ritmo.”

O corpo da Priscilla deve permanecer completamente dentro do hero em todos os breakpoints. Cabelos, mãos, braços e pés terão uma margem de segurança interna. A imagem nunca deve ultrapassar o viewport, encostar no cabeçalho ou invadir a seção seguinte.

## Arquitetura de componentes

### `Hero.tsx`

O componente continua recebendo `LandingCampaign` e usando `WhatsAppLink`. A marcação será dividida em quatro camadas:

- `heroBackdrop`: gradientes e círculo decorativo, sem significado semântico.
- `heroHeadline`: um único `h1` com spans para “Aprenda”, “Forró”, destaque e conclusão.
- `heroPortrait`: `next/image` usando o WebP transparente, com `priority` e `sizes` responsivos.
- `heroActions`: texto de apoio, CTA e nota atual.

A ordem do DOM seguirá a leitura natural: eyebrow, título, texto, CTA e imagem. CSS Grid e posicionamento controlado criarão a sobreposição visual sem prejudicar leitores de tela.

### Conteúdo

O schema e a campanha continuam sendo a fonte da copy e do WhatsApp. Não serão introduzidos textos comerciais novos nem informações não verificadas. A imagem do hero passa a apontar para o recorte transparente e mantém uma descrição alternativa factual.

### Estilos

Os estilos permanecem em `landing.module.css`. O hero ganhará classes específicas para cada parte do título e para a camada fotográfica. Elementos decorativos serão feitos com pseudo-elementos e gradientes CSS, evitando novos assets de fundo.

## Comportamento responsivo

### Mobile — até 52rem

- Hero em formato de pôster vertical.
- Headline ocupa a largura disponível, com “FORRÓ” atrás da personagem.
- Priscilla centralizada, com altura limitada pelo espaço real entre headline e CTA.
- CTA com largura total e altura mínima de toque de 52px.
- Se a altura do aparelho for curta, o hero pode ultrapassar `100svh`; o conteúdo não será comprimido nem cortado.

### Tablet — 52rem a 68rem

- Mantém a leitura de pôster, mas amplia a margem lateral.
- Priscilla desloca-se levemente para a direita para liberar o texto de apoio.
- CTA permanece visualmente conectado ao bloco principal.

### Desktop — acima de 68rem

- Composição assimétrica em um único palco, não em duas colunas independentes.
- Headline ocupa a metade esquerda e atravessa visualmente o centro.
- Priscilla fica no centro-direita, ainda sobreposta ao título.
- Texto de apoio e CTA ficam no canto inferior esquerdo, com largura controlada.

## Movimento

O carregamento pode usar uma única sequência curta: eyebrow e headline aparecem primeiro, retrato entra com leve deslocamento vertical e CTA surge por último. A animação deve durar menos de um segundo, usar apenas `opacity` e `transform` e ser removida quando `prefers-reduced-motion: reduce` estiver ativo.

Não haverá parallax contínuo no retrato nesta etapa. O objetivo é preservar nitidez, estabilidade e desempenho no mobile.

## Acessibilidade e desempenho

- Contraste mínimo AA para todos os textos e botões.
- Um único `h1`, com conteúdo compreensível sem CSS.
- Elementos puramente decorativos com `aria-hidden` quando necessário.
- CTA mantém foco visível e área mínima de toque.
- WebP transparente é a imagem entregue ao navegador; PNG permanece apenas como fonte mestre.
- `next/image` recebe dimensões explícitas, `priority` e `sizes` adequados para evitar CLS.
- Nenhum texto importante será rasterizado dentro de imagem.

## Validação

- Atualizar os testes do hero para a nova marcação sem perder a verificação do CTA e do destaque.
- Atualizar o teste de assets para reconhecer o novo WebP e um orçamento compatível com o arquivo otimizado.
- Rodar testes, typecheck e build.
- Fazer uma rodada visual conjunta em 430×932 e desktop largo.
- Corrigir em lote cortes, colisões, contraste e hierarquia encontrados nessa rodada.
- Fazer no máximo uma segunda confirmação visual.

## Critérios de aceite

- A primeira seção reproduz claramente a direção do mockup “pôster central”.
- O texto e o CTA são interface real, selecionável e acessível.
- A identidade e a copy existentes permanecem verdadeiras.
- Nenhuma parte do corpo da Priscilla ultrapassa o container em mobile, tablet ou desktop.
- O hero funciona sem rolagem horizontal e sem mudança brusca de layout.
- Testes, typecheck e build passam.

