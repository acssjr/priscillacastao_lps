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
