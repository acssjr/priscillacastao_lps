# Painel de edição visual

Modo Operate. Referência aprovada: painel local de Iasmin Portugal; adaptar seu comportamento às três campanhas, sem Edição avançada. Preservar a landing e suas fotografias.

## Direction contract
- **THESIS:** O próprio site é a área de trabalho. Textos se editam na tela e nos controles sincronizados; formulários isolados não são a experiência principal.
- **OWN-WORLD:** Identidade existente de Priscilla: vinho, creme, papel, Plus Jakarta Sans e marca original. A estrutura operacional segue Iasmin.
- **STORY:** Entrar; escolher uma das três páginas; clicar no texto ou foto; ajustar na página ou nos controles; guardar rascunho; revisar e publicar. Histórico e acessos permanecem disponíveis.
- **FIRST VIEWPORT:** Lateral de gestão recolhível, barra superior persistente, seletor de campanha/dispositivo/zoom, site vivo como superfície dominante e controles da seção. Em tablets, controles abaixo; em celulares, seleção abre controles inferiores.
- **FORM:** Estrutura explicitamente solicitada, sem sorteio ou comp novo: editor visual de Iasmin adaptado ao catálogo de Priscilla. Interação principal: clique no texto, escrita direta e sincronização imediata do campo lateral sem perder o cursor.
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Comportamento
Lateral animada com GSAP, preferência persistente e movimento reduzido. Carregamento do acesso e publicação têm etapas e confirmação do servidor. Rascunhos não alteram a página pública. Prévia aceita valores não salvos e impede links externos. Edição de título mantém o destaque coerente. Fotos usam biblioteca e ponto de foco com arraste ou teclado. Perguntas e pilares ficam abertos para edição; Testar navegação restaura o comportamento público.

Mostrar campos e Ocultar campos revelam ou recolhem o inspetor. Testar navegação e Voltar à edição alternam entre interação pública e escrita direta. Formulários de acesso usam campos de 46px, grid alinhado no topo e uma coluna abaixo de 768px. Controles de busca, contato, menu, rodapé e dados não visíveis ficam no seletor Parte do site. Biblioteca, histórico, usuários, conta, ajuda seguem a referência. Respostas da jornada pertencem ao percurso de Iasmin, ausente nas landing pages de Priscilla.
