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
