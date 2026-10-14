---
name: Priscilla Castão
description: Identidade existente das campanhas de forró e sua extensão ao painel de edição.
colors:
  brand-primary: "#64121f"
  brand-dark: "#4b0d17"
  brand-mid: "#7a1d2a"
  brand-soft: "#ae6664"
  surface-cream: "#f1e2c9"
  surface-paper: "#faf5ec"
  ink-warm: "#342522"
  on-dark: "#faf5ec"
  panel-paper: "#fffdf8"
  panel-line: "#dbcfc0"
  panel-muted: "#6b554c"
  admin-sidebar: "#efe4d5"
  admin-nav-selected: "#e8d4c6"
  editor-paper: "#fffaf3"
  editor-line: "#e6d9c9"
  editor-canvas: "#e9e1d5"
  editor-caption: "#f0e9df"
  editor-muted: "#786252"
  editor-selection: "#fcf0e6"
  admin-scrollbar: "#b9a290"
  access-background: "#f7f3ee"
  progress-track: "#e4d9cf"
  publication-accent: "#a65134"
  publication-accent-hover: "#864129"
  publication-success: "#46604a"
  publication-success-surface: "#e5ede2"
  photo-background: "#e5d7c7"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(2.1rem, 9.5vw, 3.25rem)"
    fontWeight: 780
    lineHeight: 1
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(2rem, 7.8vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  admin-body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "15px"
    lineHeight: 1.55
  admin-title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(26px, 3vw, 36px)"
    fontWeight: 700
    letterSpacing: "-0.03em"
  admin-context-title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "20px"
    lineHeight: 1.4
  admin-toolbar-label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  access-title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(26px, 4vw, 34px)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  publication-title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(23px, 4vw, 30px)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.04em"
  admin-label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 600
rounded:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  pill: "999px"
  admin-field: "7px"
  admin-container: "12px"
  editor-frame: "16px"
  admin-dialog: "14px"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-5: "1.25rem"
  space-6: "1.5rem"
  space-8: "2rem"
  space-10: "2.5rem"
  space-12: "3rem"
  space-16: "4rem"
  space-20: "5rem"
components:
  landing-cta:
    backgroundColor: "{colors.surface-cream}"
    textColor: "{colors.brand-dark}"
    rounded: "{rounded.pill}"
    padding: "0.9rem 1.25rem"
  admin-button-primary:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.surface-paper}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  admin-button-primary-hover:
    backgroundColor: "{colors.brand-dark}"
  admin-button-secondary:
    backgroundColor: "{colors.panel-paper}"
    textColor: "{colors.brand-primary}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  admin-field:
    backgroundColor: "{colors.panel-paper}"
    textColor: "{colors.ink-warm}"
    rounded: "{rounded.admin-field}"
    padding: "12px"
  admin-fields-container:
    backgroundColor: "transparent"
    padding: "0"
  admin-navigation-selected:
    backgroundColor: "{colors.admin-nav-selected}"
    textColor: "{colors.brand-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "48px"
  visual-editor-toolbar:
    backgroundColor: "{colors.editor-paper}"
    rounded: "{rounded.editor-frame}"
    padding: "16px"
  visual-editor-inspector:
    backgroundColor: "{colors.editor-paper}"
    width: "330px"
  visual-editor-selection:
    backgroundColor: "{colors.editor-selection}"
    rounded: "{rounded.admin-container}"
  publication-visit:
    backgroundColor: "{colors.publication-accent}"
    textColor: "{colors.editor-paper}"
    rounded: "9px"
    padding: "11px 16px"
---

# Design System: Priscilla Castão

## Overview

**Creative North Star: "Vinho, creme e papel"**

Nome descritivo dos materiais já presentes, sem introduzir uma nova marca. O vinho dá identidade aos cabeçalhos, fundos escuros e ações; creme e papel oferecem superfícies quentes para leitura. Fotografias e retratos pertencem à landing e convivem com títulos fortes e cantos arredondados.

O painel estende essa identidade com o próprio site como área de edição: a composição pública permanece visível, textos recebem escrita direta e fotos recebem seleção e enquadramento. O inspetor sincronizado complementa o canvas; campos isolados e uma coluna de orientação não constituem a área principal de trabalho. A estrutura e as interações seguem a referência aprovada de Iasmin para as três campanhas, sem Edição avançada. A organização específica está em `.impeccable/surfaces/admin.md`.

**Key Characteristics:**
- Vinho como cor de identidade e ação.
- Creme e papel como superfícies de leitura.
- Plus Jakarta Sans como voz principal.
- Landing expressiva; painel com canvas vivo, inspetor sincronizado e navegação recolhível.

## Colors

A paleta combina vinhos profundos com neutros quentes; o frontmatter mantém os valores canônicos do código.

### Primary
- **Vinho principal:** cabeçalho público, identificação, texto da navegação e ação principal de publicação.
- **Vinho escuro:** fundos profundos, texto sobre creme e hover de ações primárias do painel.
- **Vinho médio:** foco global e detalhes de identidade.
- **Vinho suave:** detalhes e transições visuais da landing.

### Neutral
- **Creme:** seções alternadas, CTAs sobre vinho e fundos de imagens no painel.
- **Papel:** fundo global e texto sobre vinho.
- **Tinta quente:** texto principal sobre fundos claros.
- **Papel do painel:** campos, barra de ações e grupos de edição.
- **Linha do painel:** separadores e contornos de grupos.
- **Texto secundário do painel:** orientação e estado complementar.
- **Neutros do editor:** lateral em `admin-sidebar`, seleção de navegação em `admin-nav-selected`; toolbar e inspetor em `editor-paper`, contornos em `editor-line`, canvas em `editor-canvas` e legenda em `editor-caption`. O campo selecionado usa `editor-selection` com contorno vinho; `editor-muted` orienta os seletores. São valores locais efetivamente usados, não uma substituição da paleta pública.
- **Estados operacionais:** acesso usa `access-background`; barras de progresso usam `progress-track`. A confirmação de publicação usa terracota `publication-accent` e seu hover; o resultado confirmado usa `publication-success` sobre `publication-success-surface`. O enquadramento usa `photo-background` quando a foto não cobre a superfície. Esses papéis não mudam a cor primária da marca.

### Named Rules
**The Identidade Herdada Rule.** Novas áreas do painel reutilizam os vinhos e neutros existentes; uma nova tela não estabelece uma identidade independente.

## Typography

**Display Font:** Plus Jakarta Sans, com fallback sans-serif.
**Body Font:** Plus Jakarta Sans, com fallback sans-serif.

**Character:** títulos pesados e compactos na landing; leitura regular, rótulos semibold e orientação mais discreta no painel. Newsreader é carregada pelo layout, mas não tem aplicação comprovada nas superfícies examinadas; não é prescrita como voz do painel.

### Hierarchy
- **Display:** título principal da landing; o tamanho do frontmatter descreve a base móvel. O código amplia o título em 30rem e 52rem.
- **Headline:** títulos recorrentes das seções da landing, com quebra balanceada quando definida.
- **Body:** texto global; o painel usa a variante `admin-body`.
- **Admin title:** “Edição visual” usa clamp de 26px a 36px; o título do contexto no inspetor usa 20px/1.4. Outras páginas administrativas conservam a escala de 32px e a redução para 28px até 760px.
- **Admin label:** campos usam 14px semibold; toolbar usa 13px, seletores 14px e valores editáveis no inspetor 15px. Orientação usa 13px regular.
- **Access / publication title:** estados animados usam peso 500 e tracking -0.04em, com as escalas próprias do frontmatter; descrições usam 16px/1.6.

### Named Rules
**The Uma Voz Rule.** A extensão administrativa conserva a família principal e reduz a escala para dar prioridade ao conteúdo editável.

## Layout

A landing usa largura de conteúdo de 72rem, espaçamento global em passos de 0.25rem e composições de uma coluna que passam para grades em telas maiores. Os pontos de mudança observados são 30rem, 48rem, 52rem e 68rem; são regras de superfícies específicas, não um sistema universal de dispositivos.

O painel usa lateral fixa de 248px, recolhível para uma trilha de ícones de 80px; a área de trabalho acompanha esse afastamento. Sem preferência salva, entre 768px e 1199px a trilha inicia recolhida. A barra superior aderente reúne caminho da área, estado do rascunho, Ver prévia e Publicar. A edição visual usa padding de 24px; abaixo de 768px, 16px 12px. Título e Salvar rascunho antecedem a toolbar do canvas, com Página em edição, Visualização, Zoom, Testar navegação/Voltar à edição, Mostrar campos/Ocultar campos e Desfazer/Refazer.

No desktop, canvas flexível e inspetor de 330px formam uma superfície única, com altura mínima de 540px e moldura de 16px. A partir de 1500px, o inspetor tem 370px. O canvas contém o site real em iframe de 1280px ou 390px, centralizado e escalado em Ajustar à tela; 100% permite rolagem. Os controles seguem a seleção e a seção da página. A toolbar alinha três seletores em um grid e separa as ações em uma segunda linha; em celulares, Página em edição ocupa a largura inteira. Formulários de acesso usam controles com 46px de altura, rótulos alinhados no topo, textos de ajuda sem esticar os inputs e uma coluna abaixo de 768px.

De 768px a 1199px, canvas e inspetor empilham; a área de site usa 58vh, mínimo de 400px, e o inspetor tem máximo de 620px. A regra de empilhamento até 900px também cobre celulares. Abaixo de 768px, a navegação vira drawer de 248px com scrim, o iframe inicia em Celular, e selecionar um campo coloca somente os controles selecionados em uma superfície inferior fixa: 12px das bordas, máximo de 45vh. Contexto e grupos gerais ficam ocultos nessa seleção; limpar a seleção devolve o inspetor completo. A regra inferior até 800px é anulada pelo empilhamento estático em tablets. Detalhes operacionais permanecem no documento da superfície.

## Elevation & Depth

A landing combina gradientes, transparências, contornos e sombras difusas em retratos, CTAs e elementos interativos. Canvas, toolbar e inspetor usam separação tonal e contornos; grupos de campos ficam transparentes e sem sombra. O inspetor selecionado no celular usa sombra ambiente superior. Diálogos usam sombra ambiente e escurecimento do fundo. Nenhuma sombra deslocada rígida é estabelecida como regra.

### Shadow Vocabulary
- **Diálogo administrativo** (`0 20px 80px rgb(52 37 34 / 25%)`): janela sobre a área de trabalho.
- **Seleção móvel** (`0 -10px 35px #34252226`): destaca os controles inferiores sobre o site.
- **CTA da landing:** sombra difusa com realce interno; valores e estados completos estão no sidecar.

## Shapes

Cantos suaves usam a escala global; CTAs públicos têm silhueta de cápsula. O painel usa botões de 8px e campos de 7px. A moldura do editor, os controles inferiores e o enquadramento de foto usam 16px; a seleção no inspetor usa 12px. Grupos gerais ficam sem contêiner arredondado próprio. Diálogos administrativos têm 14px. Bordas finas distinguem controles e grupos sem criar uma grade decorativa em toda a tela.

## Components

### Buttons

Na landing, CTAs largos em creme sobre vinho usam peso 800, altura mínima de 3.5rem e cápsula; hover eleva 2px e active comprime suavemente. No painel, botões têm altura mínima de 44px, peso 600 e padding registrado no frontmatter. A publicação usa vinho; ações secundárias usam papel com contorno. Hover primário escurece, secundário fica creme; disabled reduz opacidade para 0.48. Foco visível herda o contorno global de 3px com afastamento de 3px.

### Cards / Containers

A landing tem contêineres translúcidos e cartões com profundidade. O editor reúne toolbar, canvas e inspetor numa moldura clara com borda de 1px. Grupos de edição ficam transparentes, sem padding externo; summaries usam 18px 16px, conteúdo usa 0 16px 22px, e separadores delineiam as seções. A seleção tem contorno vinho e fundo quente próprio. Não transportar a composição de retratos ou brilhos da landing para campos do painel.

### Inputs / Fields

Campos nativos têm largura total, altura mínima de 46px, borda `#bba99a`, fundo papel e caret vinho. Rótulos ficam acima com gap de 8px. Textareas permitem redimensionamento vertical; checkboxes e ranges usam accent vinho. A seleção na página abre o campo correspondente no inspetor; ambos atualizam o mesmo rascunho. Restaurar acompanha o rótulo e os grupos expõem controles adicionais por seção. Não existe estilo específico de erro por campo nas folhas examinadas; mensagens globais têm texto, fundo e semântica de alerta/status.

### Navigation

A landing usa cabeçalho vinho fixo, logo e navegação horizontal a partir de 52rem; abaixo, menu de papel com monograma e links. O painel usa lateral com ícones SVG de 22px, links de 48px e seleção creme rosado com texto vinho e `aria-current="page"`. Recolher troca logo completo por monograma, preserva nomes acessíveis e salva a preferência. GSAP anima fundo, deslocamento da área de trabalho e visibilidade de marca/rótulos por 260ms com curva 0.23,1,0.32,1; movimento reduzido e acionamento por teclado usam mudança imediata. O drawer móvel tem botão de fechamento e scrim. A campanha é escolhida na toolbar visual, acima do site.

### Dialogs

O painel usa `dialog` nativo com título associado, fechamento por Escape ou clique externo, fundo bloqueado e cabeçalho aderente. Prévia, biblioteca e revisão de publicação usam esse padrão. Fechamento usa SVG, não um caractere tipográfico.

### Access & Publication

Acesso ocupa a tela com monograma circular, texto de status focalizado e etapas Verificar acesso/Abrir painel. A barra é indeterminada: não representa porcentagem de conclusão; após 12 segundos aparece orientação de espera. Publicação apresenta revisão por campanha, estado em andamento e confirmação somente após resposta do servidor, distinguindo armazenamento local de site oficial. O resultado oferece link para visitar a página. As barras animam em 1800ms; movimento reduzido troca a animação por trilha estática. O símbolo de confirmação anima por 240ms.

### Photo Framing

Fotos mantêm o material existente. O enquadramento usa prévia com proporção do recorte real, grade de terços, ponto de foco circular e legenda de arraste. Arrastar/toque, setas de teclado em passos de 2%, presets e ranges horizontal/vertical atualizam o recorte visível no site; a descrição alternativa acompanha a imagem no inspetor. Presets usam cápsulas de 20px e estado selecionado vinho.

## Do's and Don'ts

### Do:
- **Do** reutilizar os tokens de vinho, creme, papel e tinta quente.
- **Do** preservar a família principal e distinguir títulos, rótulos e orientação pelo tamanho e peso.
- **Do** manter foco visível e preferências de movimento reduzido nos controles documentados.
- **Do** manter o site como área principal, os controles sincronizados e a adaptação de navegação e inspetor conforme os breakpoints da superfície.

### Don't:
- **Don't** substituir a identidade da landing para acomodar o painel.
- **Don't** promover detalhes decorativos isolados a tokens globais.
- **Don't** tratar Newsreader carregada como evidência de aplicação no painel.
- **Don't** copiar eyebrows existentes para novas superfícies: aparecem na landing, mas não são canonizados como padrão reutilizável.
- **Don't** substituir o canvas por uma área principal de formulários ou acrescentar Edição avançada às três campanhas.

Evidência: identidade em `app/globals.css`, `app/layout.tsx` e `components/landing/landing.module.css`; cascata efetiva em `components/cms/admin-panel.module.css` e `visual-editor.module.css`; comportamento em `admin-panel.tsx`, `admin-sidebar.tsx`, `visual-editor.tsx`, `section-editor.tsx`, `access-loading.tsx`, `publication-dialog.tsx`, `photo-framing.tsx` e seus estilos, além de `modal.tsx`. Capturas de revisão existentes: `.impeccable/review/desktop.png`, `mobile.png` e `user-1041.png`. Drift não canonizado: neutros e feedback próprios da área de usuários não são uma nova paleta global. Eyebrows existentes, inclusive o estilo residual no acesso, e ocultação global da scrollbar pública não são padrões a herdar. Regras antigas de lateral de 260px, coluna de orientação e grupos em cartões persistem no CSS, mas são anuladas ou não montadas na edição visual e não definem a experiência atual. Nenhum desses pontos foi reparado nesta documentação; nenhum raster foi criado.
