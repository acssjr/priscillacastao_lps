# Catálogo web

## Destino e conteúdo

`/catalogo` apresenta o conteúdo do catálogo de aulas v15 como HTML responsivo. O botão “Conheça as aulas” em `/links` leva à página na mesma aba, com pré-busca dessa rota. O PDF original continua disponível para download no final do catálogo; não é carregado como parte da leitura.

Conteúdo: funcionamento das aulas; individual (R$ 120,00 por 1h e pacote de 4 aulas por R$ 440,00); dupla (R$ 215,00 por 1h); grupo de quatro pessoas (R$ 420,00 por 1h); três cursos de R$ 150 cada; combo promocional de R$ 397 com R$ 53 de desconto. Descrições, condições e valores vêm do material aprovado. Detalhes complementares ficam em elementos `details` nativos. Cada contato de WhatsApp inclui a opção selecionada, sem enviar a mensagem automaticamente.

O PDF permanece inalterado em `public/materiais/catalogo-de-aulas-priscilla-castao.pdf`, com 3.742.950 bytes e SHA-256 `7b1ac12bfd67b512b956fb2734a67083200ca60f4dc63921f924bc235ac58513`. A imagem da capa foi extraída da primeira página e comprimida em WebP de 42.750 bytes. É a única foto da página, servida responsivamente por Next Image. Textos não foram rasterizados; podem ser selecionados e ampliados.

## Identidade e composição

Extensão do sistema existente, sem nova identidade: vinho `#64121f`, papel `#faf5ec`, creme `#f1e2c9`; Saans regular e bold já adotada em `/links`. Coluna de leitura no celular; capa e apresentação lado a lado a partir de 800px. Formatos têm descrição, detalhes e investimento claramente associados. Bordas de seção, hierarquia tipográfica e espaços organizam o conteúdo sem reproduzir as quebras de página do PDF.

`PRODUCT.md`, `DESIGN.md` e `.impeccable/design.json` foram preservados. As diferenças de escala tipográfica Saans em relação ao documento global foram registradas como extensão local, sem promover avisos do detector a novas regras globais. Revisão independente de acabamento: aprovada, sem bloqueios. A documentação foi concluída diretamente após indisponibilidade do agente documentador.

## Feedback de navegação

`FeedbackLink` mantém links reais e comportamento de Ctrl/Cmd/clique modificado. No clique normal, exibe status vinho com texto específico, indicador creme e `aria-busy`. Aviso fica em portal no body para não ser recortado pelos cartões de vidro. Navegação externa e download encerram o status após 1,8s, ao voltar ao foco ou via `pageshow`; desmontagem limpa o temporizador. O carregamento não introduz atraso artificial.

Destaque azul de toque removido dos links e botões. Estado pressionado usa cores da marca; foco visível por teclado foi mantido. Indicador respeita movimento reduzido. Sem JavaScript, navegação, detalhes, contato e download continuam disponíveis.

## Validação

- Lint, TypeScript, 85 testes em 20 arquivos e build aprovados.
- Viewports de 320, 390, 560, 768 e 1440px: sem rolagem horizontal, Axe sem violações.
- Texto a 200% e página sem JavaScript conferidos.
- Rota retardada artificialmente: status de abertura visível e link marcado como ocupado.
- Navegação `/links` → `/catalogo`, abertura de detalhes, mensagens contextuais e download do PDF conferidos no navegador.
- Conferência automática de 29 trechos de descrição, texto e preço contra o PDF: todos encontrados na fonte.
- Não foi medida uma nova velocidade de carregamento em produção; tamanho da imagem não equivale ao peso total da página.

## Revisão visual e de CTA — 16/10/2026

Foto retirada da página; monograma P translúcido ocupa o fundo da abertura sem criar um bloco vazio. Seções agora alternam papel, vinho (método), papel (aulas), creme (cursos) e vinho (encerramento), com conteúdo em contêiner comum e faixas de largura total. Espaçamento mobile unificado em 2,5rem por seção, gap de fechamento 1rem, sem soma de grandes margens vazias. CTAs têm largura intrínseca e mínimo de 48px de altura.

Schwartz: visitante do catálogo é predominantemente consciente da oferta (nível 2; quem já escolheu o formato aproxima-se do nível 1). Sofisticação 2 é hipótese de trabalho para a microcopy, não conclusão de pesquisa competitiva. Estratégia: oferta direta e próximo passo explícito sem urgência inventada. CTAs: “Quero marcar minha aula”, “Quero uma aula em dupla”, “Quero uma aula em grupo” e “Quero fazer os três cursos”. Links continuam abrindo uma conversa, sem prometer agendamento confirmado.

Pacote individual: quatro aulas avulsas de R$120 custariam R$480. Pacote R$440: economia de R$40 e R$110 por aula. Acrescentada a explicação ao investimento sem mudar os preços; desconto de R$53 do combo preservado. PDF original não alterado.

### Oportunidades de animação selecionadas

| Local | Antes | Propósito | Frequência | Movimento |
| --- | --- | --- | --- | --- |
| Cabeçalhos das seções | Aparecimento sem orientação | Evitar mudança abrupta ao entrar na seção | Leitura ocasional | WAAPI opacity .65→1 e translateX(-16px)→0,450ms, curva compartilhada --ease-out, observador .2, uma vez. Movimento reduzido: fade150ms sem deslocamento. |
| Detalhes nativos | Conteúdo abre instantaneamente | Indicação de estado | Ocasional | WAAPI opacity0→1 e translateY(-4px)→0,200ms na abertura; fechamento nativo. Movimento reduzido:fade150ms. Aberturas rápidas cancelam a animação anterior. |
| Pressão do CTA | Cor apenas | Feedback | Eventual | scale(.98),160ms --ease-out, sem deslocamento em movimento reduzido. |

Rejeitados: números de preços animados (atrapalham leitura funcional); monograma com movimento contínuo (sem propósito); repetir animação ao subir/descer (distração). A maior oportunidade é orientar a chegada dos títulos. A skill find-animation-opportunities foi usada para diagnóstico; a implementação segue animate, sem nova biblioteca e sem ocultar conteúdo antes do JavaScript.

Verificação: foto ausente; botões menores que o contêiner, altura≥48px; Axe sem violações em320/430/768/1440; movimento reduzido, detalhes e ausência de overflow conferidos. Lint, tipos e build aprovados. Evidência .impeccable/review/catalog-refined-{430,1440}.png. Sistema global preservado; refinamento local de Saans/vinho/creme existente.

Revisão independente de acabamento: aprovada sem bloqueadores. Os85 testes em20 arquivos também passaram nesta revisão.

## Fotografia ambiente e atalhos — 16/10/2026

Atalho “Aulas e valores” renomeado para “Descrições e valores”. Os três atalhos da abertura agora têm fundo creme, raio de10px, sombra discreta e área mínima de56px; o atalho de descrições/valores usa vinho e texto papel para indicar sua importância. Ancoragem e foco visível preservados.

Foto fornecida pelo usuário em recorte de captura263×254 foi restaurada com imagegen, removendo elementos do navegador e produzindo uma derivação de melhor definição, sem alegar recuperação do arquivo original. Arquivo otimizado em public/images/priscilla-catalogo-retrato.webp. A foto e o P aparecem à direita como ambientação da abertura; foto decorativa com alt vazio/aria-hidden, responsiva por Next Image, filtro CSS sepia(.25), saturate(.55), contrast(.92), luminosidade sobre vinho e opacidade reduzida. Degradê papel sob a área de leitura e sombra papel no título e parágrafos mantêm contraste. Sem voltar ao antigo bloco fotográfico separado.

Validado em320/430/768/1440px: imagem decodificada, nenhuma rolagem horizontal, Axe sem violações, atalho leva a#formatos e rótulo correto. Lint (sem erros), tipos e build aprovados. Não houve alteração no PDF, nos valores ou no fluxo de contato. Capturas em .impeccable/review/catalog-photo-430.png e catalog-photo-1440.png.

## Valores e posição dos preços — 16/10/2026

Atualização expressa do usuário no catálogo web: três cursos individuais de R$149,90 cada; preço imediatamente abaixo do nome e antes da descrição, alinhado à esquerda em todos os breakpoints. Pacote de quatro aulas individuais agora R$439,90. Economia recalculada em relação a quatro avulsas de R$120: R$40,10. Retirada a equivalência anterior de R$110 por aula para evitar divergência de arredondamento. Combo mantido em R$397, com economia corrigida para R$52,70 sobre três cursos de R$149,90. PDF original não alterado nesta revisão.

Verificação em320/430/768/1440px confirmou os três preços abaixo e alinhados aos títulos, novo valor do pacote e ausência de rolagem horizontal. Typecheck e build aprovados.

Revisão posterior: retirado o P da abertura para não misturar com a foto. Os três atalhos voltaram à lista simples com divisórias, sem fundos de botão, sombra ou destaque preenchido. Rótulo Descrições e valores e fotografia tratada preservados. Conferido em430/768/1440px, sem overflow; tipos e build aprovados.

## Transição entre links e catálogo — 16/10/2026

CatalogTransition fica no layout compartilhado, preservado entre /links e /catalogo. Clique normal é capturado antes do Link: saída do main em280ms com translateX(-20px), scale(.99) e opacity1→.65; painéis vinho fecham em320ms; router.push após360ms, sem recarregar o documento. P estático e linha de preparação reutilizam o vocabulário da transição existente. A transição antiga de campanhas não foi modificada.

Após a rota de destino montar, cobertura aguarda document.fonts.ready e decodificação da imagem, com limite de4s para recursos. Título, descrição, atalhos e foto ficam preparados sob a cobertura. Ela abre em320ms; conteúdo entra com translateX(22px)→0 e fade,500ms, atrasos80ms +60ms por elemento. Opacidade final da foto preserva seu tratamento CSS, evitando salto para opacidade total. Não há clone/snapshot da página. O root persiste, apenas o destino monta pela navegação do Next.

Na volta pelo link do catálogo, Entrance detecta a transição e não repete o loader inicial. Observador das seções do catálogo começa após a chegada, sem consumir a animação sob a cobertura. Movimento reduzido usa fades curtos sem deslocamento. Teclado/ctrl/cmd/shift e links externos mantêm navegação nativa sem espera decorativa. Histórico cancela uma passagem em andamento. Timers e animações são limpos; uma segurança de15s destrava o conteúdo caso o destino não chegue. Navegação utiliza href original, inclusive hash, e prefetch.

Validação: seis testes e2e em mobile/desktop aprovados, incluindo documento preservado (marcador JS continua presente), somente um main, ausência de loader duplicado na volta, rota retardada mantendo a cobertura por mais de1,7s e teclado sem bloqueio. Checagem adicional com movimento reduzido passou, sem erros de página. Tipos e build aprovados. Captura real do estado coberto em .impeccable/review/catalog-transition-covered.png e chegada em catalog-transition-arrival.png.

## PDF v16 sincronizado — 16/10/2026

PDF de download atualizado com cinco substituições pontuais: pacote R$439,90; três cursos a R$149,90; economia do combo R$52,70. Demais preços mantidos. Sete páginas de640×800pt, mesmos textos, links e diagramação. Fonte v15 preservada; cópia v16 em outputs/pdf na pasta principal do projeto e arquivo público substituído na URL estável.

SHA-256 novo: 7a1cd71598550812fd1bb4c608a511db04cb6da94e7d34740a14ba6c8bbdafb8. Tamanho3.898.210bytes; indicação de download ajustada para3,9MB. Script scripts/update-catalog-pdf.py permite reproduzir a edição sobre o v15, usando as fontes existentes. Verificação textual: três ocorrências de149,90, pacote439,90 e desconto52,70; preços antigos ausentes. Cinco páginas sem alterações renderizaram com pixels idênticos; links preservados nas sete. Páginas3e6 renderizadas e conferidas visualmente, sem cortes ou sobreposição.

## Capa PDF v17 — 16/10/2026

A pedido do usuário, capa vermelha trocada pela foto public/images/priscilla-catalogo-retrato.webp usada no catálogo web, em suas cores naturais, sem o filtro vinho aplicado por CSS na página. Fundo substituído sem recriar o texto ou o logo vetorial. Painel vinho com transparência de28%, contorno creme translúcido e sombra discreta ocupa a área de leitura; véu graduado no topo mantém a assinatura legível. Rosto preservado acima do painel. Fonte v16 preservada e novo arquivo v17 na pasta outputs/pdf do projeto principal.

Sete páginas, textos e links iguais ao v16; páginas2–7 renderizam com pixels idênticos. Capa renderizada e conferida visualmente. PDF público substituído na mesma URL, tamanho1.889.952bytes; indicação do download atualizada para1,9MB. SHA256: 12e92d3744d07d04d53c14fd83e68f0c852962d65e59b175234849bed58eef94. Script scripts/update-catalog-cover.py reproduz a composição sem alterar as demais páginas.

## Capa PDF v18 — vidro fosco creme

Revisão solicitada pelo usuário: zoomout na fotografia, ambiente mais creme e esmaecido, painel com blur de liquid glass em vez de simples camada translúcida. Material de fundo gerado por edição da mesma fotografia, com rosto acima do painel. Arquivo de produção em assets/catalogo/capa-creme-glass.webp; enquadramento e vidro compõem apenas o fundo da capa. Fonte de7páginas baseada no v16 com preços já atualizados; textos, posições tipográficas e assinatura vetorial preservados e recoloridos em vinho para contraste no vidro claro. Script update-catalog-cover.py --frosted reproduz a montagem.

Saída v18 em outputs/pdf do projeto principal e cópia pública substituída. Textos e links iguais ao v17; páginas2–7 pixel-idênticas; capa renderizada e conferida. Valores439,90/149,90/52,70 validados. Tamanho aproximado2,1MB, indicado no download. HashSHA256: 2D73AC2DDDD72D064B5C85415C2C51236E47028B1070598DB8BA82543FBD9103.

PDF v19: assinatura Priscilla Castão dentro do painel de vidro fosco, título Catálogo de aulas reduzido de 90 para 48 pt e vidro em bordô. Foto afastada preservada; páginas 2-7 verificadas idênticas à v18. Download atualizado (2,3 MB).
## Atualização de modalidades e cor principal — 20/10/2026

Refinamento posterior: removida a oferta de download do PDF no rodapé do catálogo. O arquivo continua preservado. A foto de /links passa a usar o mesmo retrato do catálogo, sem filtro cromático; apenas um degradê preto transparente na parte inferior protege a leitura da assinatura. O card WhatsApp adota o terracota dos demais cards, incluindo a marca-d'água creme, sem verde.

O catálogo web usa marrom terracota `#864129`, derivado do acento existente `#a65134`, como cor principal local. Mantém as superfícies creme e papel. As modalidades aparecem em texto corrido: forró universitário, roots e dança híbrida. Apenas dança híbrida tem sublinhado e asterisco; abre uma explicação em popover nativo, sem deslocar seções nem alterar a altura da página. Pode ser fechado por Escape, clique fora ou Entendi. As descrições dos formatos e os metadados incluem a modalidade híbrida. Valores preservados. Conferidos 320, 430, 768 e 1440 px sem transbordamento e sem violações WCAG A/AA no Axe. A página /links, sua abertura e a transição para o catálogo adotam a paleta marrom terracota; o card WhatsApp mantém o verde.
## Paleta universal terrosa e cards de preço — 20/10/2026

Direção aprovada: o site passa de vinho/bordô para marrom terracota. Tokens globais: primary #864129, dark #45291c, mid #995232, soft #bb8462; creme #f1e2c9 e papel #faf5ec preservados. Campanhas, seletor de versões, apresentação comercial, painel, transições, theme-color, manifest e favicons acompanham a direção. As cores de fotografias e estados semânticos de erro/sucesso são preservadas.

Os cards de investimento e combo usam contorno claro, reflexo em terracota e backdrop-filter blur(20px) saturate(120%), com fallback de fundos legíveis. Não há filtros SVG nem bibliotecas novas. Botões do catálogo têm cápsula, largura intrínseca, fonte 15px/1.35 e alvo mínimo de 48px; hover com preenchimento por transform, restrito a mouse. Border beam reaproveita a implementação existente, apenas no CTA individual, começa ao entrar na tela e completa dois ciclos de 4s. Movimento reduzido mantém a borda estática.

### Avaliação find-animation-opportunities; implementação animate

| Local | Hoje / objetivo | Frequência | Receita aprovada e gates |
| --- | --- | --- | --- |
| app/catalogo/page.tsx, cards de investimento | Entrada antes simultânea; orientar descoberta da oferta | Primeira leitura | Prevenir mudança brusca: translateX(16px) e opacity .65 para posição final/1, 450ms com --ease-out cubic-bezier(.23,1,.32,1), uma vez por card. Marketing; preços não contam nem pulsam. Reduce: fade150ms. |
| app/catalogo/page.module.css, .action | CTA retangular sem preenchimento | Várias interações | Feedback: camada scaleX(0) para 1 em200ms --ease-out, apenas hover:hover/pointer:fine; pressão scale(.98)160ms. Texto fica parado. Reduce: preenchimento por opacity150ms. |
| app/catalogo/CatalogMotion.tsx, popover e entrada | Abertura ocasional da explicação | Ocasional | Estado legível: opacity0 para1 em150ms --ease-out; sem deslocar layout. Abertura por teclado instantânea. Chegada direta com translateX(-12px)/opacity.7 para0/1 em450ms, intervalo40ms; chegada a partir de links continua pertencendo à transição existente, sem duplicar. |

Rejeitados: animação dos números de preço (gate função: são dados para ler); parallax na foto (gate propósito: sem utilidade nesta leitura); brilho contínuo em todos os botões (gates frequência e função). O maior ganho é a chegada pontual de cada card, com interação disponível durante todo o movimento. A etapa de levantamento é somente diagnóstico; as mudanças foram realizadas pela etapa de implementação animate.

### Refinamento do preenchimento, beam e superfícies
O preenchimento agora desliza em uma camada interna recortada pela cápsula (overflow hidden e raio herdado), sem scaleX que deformava as pontas e expunha um retângulo. Duração ajustada de 200 para 280ms. Beam com máscara de 2,5px, segmento creme/dourado mais contrastante e brilho estático reduzido; permanece em movimento enquanto o CTA estiver visível, pausando fora da tela. Movimento reduzido mantém a borda estática. Cards e rodapé compartilham o gradiente terracota #864129 → #79432f, com reflexo e transparência apenas nos cards. Conferidos 320/430/768/1440px e hover no viewport do comentário (520×608), Axe sem violações no catálogo e teste de regressão aprovado nos projetos mobile e desktop.
### Contraste responsivo da abertura e beam em todos os CTAs
Na abertura, a foto deixa de funcionar como fundo de texto. Em telas abaixo de 800px, título e retrato ocupam a primeira linha de uma grade; modalidades, descrição e links vêm abaixo, sem sobreposição. A partir de 800px, conteúdo e retrato ocupam colunas separadas. A imagem mantém o tratamento suave e o título permite quebra em ampliação de texto. O sizes da imagem acompanha as novas áreas.
Todos os cinco CTAs de contato usam o mesmo border beam: individual, dupla, grupo, combo e contato final. Cada um anima somente quando visível e mantém a alternativa estática com movimento reduzido.
Verificação geométrica de texto/foto em 21 combinações de viewport entre320 e1440px, incluindo430×932 (dimensões do iPhone15ProMax), limites767/799/800 e orientação932×430, além de texto ampliado a200%. Testes automatizados de regressão cobrem a ausência de sobreposição, transbordamento, beams dos cinco contatos e transição preservada. Esses testes são de navegador e viewport emulado, sem alegação de teste em aparelho físico.
### Foto grande restaurada após revisão visual
A solução de miniatura ao lado do título foi rejeitada pelo usuário. A abertura volta à fotografia grande como marca-d'água lateral, ocupando78% da largura no celular e54% no desktop e acompanhando a altura do hero. As descrições agora ficam limitadas a58% da largura no celular (55% em tablets estreitos) e44% no desktop, com quebras naturais. O degradê em papel protege a faixa de leitura; título volta à escala anterior. A foto não tem moldura de miniatura. O cabeçalho permanece estático para preservar contraste desde o primeiro frame.
Teste responsivo atualizado para verificar tamanho real da marca-d'água e largura protegida do texto, em vez de impor colunas separadas. Onze larguras entre320 e1440px conferidas sem overflow e sem violações de contraste no Axe. Popover híbrido continua sem alterar o layout.
### Popup estável e cards com tonalidade mais fechada
A explicação de dança híbrida permanece em popover nativo, agora diretamente sob main, fora da introdução/fotografia. A entrada e a saída usam CSS transitions com opacity e scale(.97),180ms --ease-out, @starting-style e transição discreta de display/overlay. Sem WAAPI concorrente no toggle. Por teclado, transição instantânea; movimento reduzido usa apenas fade150ms. Dimensões limitadas à viewport, incluindo max-height dinâmico e rolagem interna se necessário; nenhum bloqueio de scroll da página.
Na investigação, não foi reproduzida mudança de largura/altura/zoom no código anterior. Após o ajuste, abertura/fechamento repetidos mantiveram clientWidth, scrollHeight, scrollY e visualViewport.scale em320/430/520/768/1440 e932×430. Regressão automatizada confirma a estabilidade e os modos de entrada.
Todos os cards investment e combo usam agora gradiente mais fechado #79402c → #713d29, com camada clara de10% no máximo (antes25%) e reflexo secundário reduzido. Preços, CTAs e beam preservados; contraste e bounds do popup verificados nos tamanhos testados.
### Gradiente com profundidade, método em passos e modal com blur
Novo gradiente compartilhado nos cards de investimento e combo: cobre #9a5234 → marrom #713d29 → terracota #8d4b30, com luz radial localizada na borda. Mantém o centro mais fechado sem o banho claro anterior e sem ficar chapado. Preços e condições preservados.
Como são as aulas agora é uma lista ordenada de três passos, cada um com título e três bullets baseados na explicação existente. Cards sticky com offsets20/32/44px formam uma pilha ao rolar. No desktop o título da seção acompanha a leitura à esquerda. Entrada por IntersectionObserver já existente; sticky desativado em viewports baixos (até600px) e movimento reduzido. Nenhuma rolagem é capturada ou simulada.
Dança híbrida passa de popover não modal para Dialog modal do BaseUI já instalado, em portal: backdrop com blur7px e escurecimento, bloqueio real de rolagem do documento, foco contido, Escape/clique fora e restauração de foco/posição. Popup usa fade/scale .97 em180ms; reduzido usa fade150ms. Keyboard conserva a abertura imediata. Dimensões limitadas à viewport e overflow interno, sem redimensionar o conteúdo atrás.
Padrão do projeto para essa explicação modal: ao abrir, aplicar blur no fundo e impedir rolagem da página; ao fechar, restaurar o ponto de leitura e devolver foco ao gatilho. O antigo comportamento de popover sem scroll lock está substituído.
Validação em320/430/768/1024/1440px: wheel não move o fundo; posição restaurada; foco contido após os focus guards; Axe sem violações no diálogo e na página. Verificado empilhamento real dos passos durante scroll e fallback reduzido.85 testes unitários e build aprovados; regressões de modal e sticky aprovadas nos projetos mobile e desktop.

### Diferenciação dos passos e entrada antecipada
Os três passos alternam terracota, creme com texto marrom e marrom profundo, mantendo numeração e bullets. A alternância separa visualmente as etapas durante o empilhamento. Observer exclusivo dos passos com threshold zero e margem inferior de -16px inicia a entrada assim que a borda chega à tela, sem aguardar20% da altura. Entrada lateral de28px em700ms com ease-out; movimento reduzido mantém somente fade150ms. Conteúdo visível sem JavaScript e posição restaurada não é ocultada.
Validado em320/430/768/1440px: entrada com40px visíveis, três fundos distintos, Axe sem violações na seção e sem transbordamento horizontal.


### Topo em vidro, ilustrações e rodapé
Cabeçalho sticky a12px, cápsula translúcida creme/cobre com blur22px, saturação150%, reflexo interno e sombra. Âncoras e cards sticky reservam112px para não entrar sob o menu. Rodapé separado do bloco de contato, com assinatura da marca, modalidades, Salvador/Bahia e navegação de retorno.
Três ilustrações originais geradas por IA para uso decorativo: professora/aluno, professora/dupla e professora/grupo de quatro. WebP600px com alpha (44/67/81KB), em public/images/catalogo-aula-*.webp. Marca-d'água à direita com opacidade22% e máscara gradual, sem texto alternativo porque não substitui as descrições. Arquivos já otimizados são servidos diretamente, com loading lazy, evitando nova conversão em tempo de execução.
Validação de topo fixo em320/430/535/768/1440px, sobre todas as faixas de cor; Axe sem violações na página, sem overflow horizontal. Três imagens carregadas e inspecionadas; testes de sticky, modal e retorno ao topo aprovados.

### Cabeçalho acoplado e flutuante em terracota
Substituído o vidro creme por terracota fechado com assinatura creme. No topo a superfície ocupa toda a largura, sem cantos arredondados. Após40px de rolagem, clip-path recorta a superfície com margem superior12px, laterais responsivas e raio22px; ao voltar a8px, retorna ao formato acoplado. Histerese evita alternância perto do limite. A altura reservada de84px permanece constante: sem alterações de layout. Transição reversível de280ms usando ease-in-out compartilhado; movimento reduzido troca estado imediatamente. Blur22px preservado no fundo, sem animação de blur.
Botão Meus links com seta de retorno, cápsula e borda creme, área mínima44px e foco visível. Cabeçalho sai da animação de chegada da rota para não competir com a transição de docking.
Validação em320/375/430/535/768/1440px: ciclo acoplar/desgrudar/voltar, interrupção e ausência de deslocamento do conteúdo; contraste Axe sem violações no cabeçalho e sem overflow. Regressões de modal, sticky, header e navegação preservando documento aprovadas.

### Método, treino e estudos dos cursos
Comunicação dos passos: avaliação inicial, ajustes e prática orientada, evolução fora da aula. Retirados títulos/frases duplicados e pedidos de passos. Incluída orientação de exercícios para treinar entre aulas conforme informação do usuário. Duração abreviada para1h apenas nas descrições dos formatos; removida dos rótulos dos investimentos e do pacote.
Pilha ligada à rolagem com ScrollTrigger carregado separadamente, usando somente transform. O deslocamento dos cards2/3 começa quando a faixa dos passos chega a75% da viewport, antes de encostar no cabeçalho. A reserva de altura nasce no CSS para a hidratação não alterar o tamanho da página durante a abertura do modal. Leitura linear em movimento reduzido, telas baixas e semJS.
Marcas-d'água menores no canto superior direito dos investimentos. Combo ilustrado com casal e três faixas simbólicas. Direção visual reafirmada: rostos sem traços faciais, mesma faixa aparente de adultos jovens das primeiras imagens; não usar as últimas imagens com rostos ou grandes diferenças de idade. Aula individual inclui duas mulheres, uma conduzindo a outra, mantendo o estilo e as faixas da referência aprovada. Imagens rejeitadas não foram integradas.
Comparação isolada em /catalogo/estudos-cursos: #destaque (curso central com vizinhos) e #galeria (card editorial amplo e faixas laterais). Cada opção usa os três cursos reais,149,90, ilustrações temáticas, setas, seleção e swipe, com contato contextual no WhatsApp. A lista atual do catálogo aguarda a escolha entre os dois estudos.
Validação:85 testes unitários; build aprovado; regressões de modal/stack. Catálogo em320/430/535/768/1440 e932×430 sem overflow e sem violações Axe. Estudos em320/430/768/1440, os três cursos e dois estilos sem corte de CTA nem violações Axe.

### Cabeçalho recolhido à assinatura
Durante a rolagem, Meus links e Ver valores saem com fade/deslocamento e ficam inert, removidos do foco e dos cliques. A logo se centraliza com transform, e o vidro se recorta para uma cápsula de208px em280ms. No retorno ao topo, a mesma transição se inverte e os controles voltam. A reserva de84px permanece fixa para não deslocar o conteúdo. Se o controle que sai estava focado, o foco passa ao cabeçalho sem alterar o scroll. Movimento reduzido troca os estados sem transição.
Conferidos320/375/430/535/768/1440px: centro da logo alinhado ao centro da viewport, botões ocultos/inert, retorno ao topo, contraste Axe sem violações e sem overflow. Regressões de cabeçalho e modal aprovadas; TypeScript e ESLint aprovados.

### Destaque central escolhido e integrado
O usuário escolheu o estilo1. CourseCarousel é o componente compartilhado do catálogo e da antiga página de estudos, que agora mostra apenas a direção escolhida. A galeria expansível e o seletor de protótipos foram retirados. Os três cursos usam título, descrição, preço e CTA centralizados. Texto do CTA: Quero adquirir esse curso. Duração1h informada uma vez na abertura da seção.
Cards têm altura intrínseca pela grade, alinhando os três conteúdos sem fixar550px e sem sobra excessiva sob o botão. Vidro terracota com transparência, blur24px/saturação145%, reflexo curvo, contorno luminoso e sombras em camadas. Beam de2,5px só no card ativo, pausado fora da viewport e estático em movimento reduzido. Vizinhos recuados, opacidade38% e blur2,5px em texto/ilustração. CTA mantém preenchimento recortado em cápsula e contato contextual pelo FeedbackLink.
Validação dos três cursos em320/430/535/768/1440, tanto na prévia quanto no catálogo: CTA central com margem inferior inferior a30px, sem cortes, carregamento das imagens, blur dos vizinhos, beam visível e pausa/reduzido; Axe sem violações e sem overflow. Regressão de compra contextual aprovada, TypeScript e ESLint aprovados.

### Revisão do fluxo de leitura e gestos
Cabeçalho volta a ser estático no topo: removidos observer de scroll, cápsula flutuante e controles inert dependentes de rolagem. Passos usam fluxo natural com sticky CSS apenas depois de chegarem ao topo; removidos ScrollTrigger, alturas artificiais, transform inicial e espaçador110svh. Cada card pode ser lido inteiro antes da próxima sobreposição, e o último determina o fim real da seção.
Carrossel: retirada a seleção visual redundante abaixo; permanece anúncio oculto para leitores de tela. Setas SVG com padding zero centralizadas nos círculos. Arraste acompanha o ponteiro com capture após reconhecer gesto horizontal, cancela a navegação do CTA ao arrastar e preserva pan vertical no toque. Preço com20px acima/abaixo. Cursos e investimentos compartilham --catalog-card-background; rodapé usa --brand-primary.
Conferidos seis viewports320/430/535/768/1440 e932×430: leitura inteira dos passos, altura sem sobra artificial, header fora da tela ao descer, arraste mouse, setas centradas, preço equidistante, gradiente compartilhado e Axe sem violações. Eventos touch via Chromium confirmam swipe horizontal e scroll vertical preservado. Build aprovado.

### Ritmo da troca e fechamento orientado à decisão
Cabeçalho continua no fluxo normal, com saída ligada aos primeiros110px de scroll: opacity1→0 e translateY0→-24px, reversíveis no retorno; sem acompanhar a rolagem. Reduced motion mantém apenas opacity. A altura do documento permanece estável.
Troca dos cursos em fases: saída da copy140ms, deslocamento de superfície520ms e revelação da nova copy após460ms; término740ms. Cliques repetidos durante a transição não pulam conteúdo. Teclado e movimento reduzido trocam imediatamente; arraste continua disponível e sem remontar cards.
Aplicação de revenue-centric-design/references/conversion-and-landing-pages.md: princípio Write the CTA microcopy, not the button color e clareza do próximo passo. O bloco final permanece para o visitante indeciso, mas o agradecimento genérico foi substituído por Qual caminho combina com a sua dança? e orientação curta. CTA Quero ajuda para escolher abre mensagem contextual pronta no WhatsApp, com indicação de que pode ser revisada. Nenhuma promessa de prazo, resultado ou disponibilidade foi acrescentada; impacto em conversão depende de medição real.
Validado em320/430/535/768/1440: fade do header, copy anterior sai antes da nova, altura estável, mensagem contextual e Axe sem violações. Regressões de sobreposição/cliques repetidos e teclado aprovadas.

### Troca contínua com GSAP Flip e copy final aprovada
Substituída a sequência de sumir/deslocar/revelar por GSAP Flip420ms power2.inOut. Captura posições/escala/opacidade das três superfícies, atualiza o card ativo e interpola os cards completos; a copy mantém opacity1 em todos os frames, sem apagar o texto. Não há CSS transition de transform concorrendo com Flip. useGSAP com scope/dependência active e revertOnUpdate limpa a animação ao trocar/desmontar. Conteúdo permanece manual, sem autoplay; teclado/reduced são imediatos; links dos vizinhos continuam inert.
Referências consultadas: gsap.com/docs/v3/Plugins/Flip/ e w3.org/WAI/ARIA/apg/patterns/carousel/ para transição entre estados, controle manual e foco nos controles. Teste cobre ausência de opacity0 durante12frames, troca por teclado e bloqueio de clique repetido durante420ms.
Copy final atual: Qual caminho combina mais com o seu momento atual na dança?; Posso te ajudar a decidir.; Priscilla te ajuda a escolher. Retirada a observação explicativa abaixo do CTA, conforme comentário do usuário. Mensagem de WhatsApp permanece contextual.
Build e TypeScript aprovados; quatro regressões de navegação/carrossel/modal/leitura aprovadas; conferência responsiva da copy e das transições sem violações Axe.

### Referência Pinterest970525788470144809
Vídeo público baixado por yt-dlp para .impeccable/references/pinterest-970525788470144809.mp4 (6s,1600×1200,60fps). Analisada sequência de30quadros em contact sheet, com procedência Pinterest/Lazarev e sem reutilizar conteúdo visual no site. Referência mostra deslocamento horizontal coerente, escala gradual e card central destacado.
Ajuste: laterais afastados de90% para108% no mobile e97% para112% em telas amplas, criando aproximadamente60px de separação na composição535px. Flip passa para520ms power3.out para saída rápida e assentamento desacelerado, mantendo o texto inteiro. Só o card atual e o próximo percorrem a faixa central; o terceiro é reciclado pela lateral com fade periférico, evitando o cruzamento contrário por trás do centro. Não há autoplay nem substituição das ilustrações.
Regressões do carrossel aprovadas; monitoramento de todos os textos confirma opacity1 durante a troca. Análise responsiva e contraste mantidos.

### Identidade cromática dos três cursos
Removido o reflexo curvo desenhado por reflection::before, conforme comentário visual. Mantidos vidro, iluminação suave e border beam. Cada curso passa a ter uma superfície própria: Consciência corporal em terracota, Musicalidade em oliva fechado e Autonomia e criatividade em marrom profundo. A identidade usa data-course e acompanha o curso ao trocar sua posição no carrossel; investimentos e combo preservam suas cores.
Conferidos os três cursos em430/535/1440px: fundos distintos, ausência do traço superior, sem overflow e sem violações Axe. TypeScript e ESLint do componente aprovados.

### Azul e títulos com brilho discreto
Musicalidade passa de oliva para azul fechado, mantendo a superfície de vidro. Títulos dos três cursos em maiúsculas com espaçamento de0,045em e tamanho adaptado para preservar as quebras no mobile. Shimmer por recorte de uma camada clara sobre o texto, sem apagar ou deslocar as letras; ciclo de5s com pausa, apenas no card ativo e visível. Movimento reduzido desativa o brilho; nome acessível do título continua único.

Hover dos CTAs acompanha o curso pela variável --course-action-hover: terracota #864129, azul #233e55 e marrom #45291c. Preservada a transição do preenchimento dentro da cápsula e o texto claro durante o hover. Conferidos os três estados em535/1440px, inclusive contraste Axe sem violações.
