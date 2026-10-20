# Movimento e vidro — revisão de 15/10/2026

**Consolidação:** o código descrito aqui agora reside em `app/links/`. O usuário aprovou este layout como única versão para desktop e mobile. `/links-v2` redireciona para `/links`, e o monograma do topo é decorativo. As menções à preservação da primeira versão abaixo descrevem etapas anteriores; a versão inicial continua no histórico Git.

## Oportunidades selecionadas

| Local | Propósito | Frequência | Receita |
| --- | --- | --- | --- |
| Loader da abertura | Indicação de estado | Entrada ocasional | Contagem 1–100 baseada em conclusão das verificações de imagens, SVGs de marca e fontes. GSAP interpola apenas até o progresso confirmado, `ease: none`. Apresentação mínima 1500ms, saída de 450ms, `power3.out`. |
| Retrato e grupo de cartões | Evitar mudança abrupta | Entrada ocasional em página de apresentação | Retrato com 14px/escala .985; cartões com 22px/escala .97; duração 650ms, `power3.out`, intervalo de 70ms. GSAP usa `transform` e `opacity`, depois limpa estilos transitórios. |

## Candidatos rejeitados

- Texto em movimento contínuo: prejudica leitura e decisão.
- Marca ao fundo em rotação contínua: não comunica estado nem ação.
- Animação no salto de foco por teclado: dificulta a navegação funcional.

## Resultado implementado

`Entrance.tsx` usa `useGSAP`, contexto com limpeza, cancelamento de callbacks e temporizadores ao desmontar. A preferência por movimento reduzido dispensa cobertura e movimentos. Sem JavaScript, `noscript` oculta a cobertura. Recursos com erro ou espera acima de 12s encerram sua verificação; o indicador representa a preparação dos recursos, não bytes de rede. CSS tem saída de segurança aos 14s. Nenhum botão de pular é renderizado.

Topo: altura própria com monograma no centro exato do intervalo até o início dos cartões. Texto “Forró, no seu ritmo.” e assinatura inferior direita removidos. Vidro: fundos translúcidos, desfoque do conteúdo de fundo, reflexos internos e fotos com máscara gradual. Todos os cartões compartilham o mesmo alinhamento. Primeiro cartão usa foto frontal sorrindo e ícone do WhatsApp extraído do SVG Simple Icons já usado na versão original. Portfólio usa monograma translúcido, sem a foto de braços levantados. Títulos em Saans Bold 700, subtítulos de 14–16px.

## Validação

Lint, tipos e build aprovados. Teste com imagem retardada: progresso permaneceu abaixo de 100 até sua liberação e terminou em 100. Sem botão de pular, sem erros JS. Sem transbordamento de 320 a 1920px, incluindo a mudança de composição entre 899/900px. Axe sem violações em 1398px. Versão original `/links` não alterada.

## Cartões sem fotografias

Refinamento posterior solicitado pelo usuário: as quatro áreas usam apenas marcas-d'água, mantendo a foto principal. Aulas usa o símbolo do WhatsApp em verde profundo translúcido; portfólio usa o monograma P; trajetória usa a logo horizontal inclinada; Instagram usa a logo empilhada. Vidro, títulos, subtítulos e navegação preservados. A preparação do loader inclui o SVG adicional da logo empilhada. Capturas de 430 e 1398px confirmam quatro marcas, nenhuma foto nos cartões, nenhuma rolagem horizontal e zero violações Axe.

Limpeza final dos cartões: removidos o ícone pequeno do WhatsApp, as quatro setas dos cartões e o rodapé “Salvador, Bahia”. A marca-d'água da trajetória foi reduzida, deslocada para a direita e suavizada na borda esquerda. Links e marcas-d'água principais preservados. Conferido em 430 e 1440px; lint, tipos e build aprovados.

O notch passou a usar seta estritamente decorativa (`span`, `aria-hidden`, sem eventos de ponteiro), sem link, círculo ou área de clique. A marca-d'água do cartão Instagram agora usa o ícone da plataforma, a partir da mesma geometria usada na primeira versão; o loader inclui esse SVG. Conferido em 430 e 1398px: quatro links nos cartões, seta fora da navegação por teclado e nenhum transbordamento horizontal.

## Abertura de 1,25 s

Com recursos prontos, 750 ms de preparação e 500 ms de transição. O P gira com CSS durante a preparação; GSAP preserva sua posição angular e move a mesma marca até as coordenadas reais do monograma do cabeçalho, que só reaparece no fim da transferência. Fundo e progresso desaparecem separadamente. Recursos lentos podem prolongar a preparação; movimento reduzido continua sem giro ou deslocamento. Textos dos cartões atualizados conforme revisão, com quebra natural do convite para agendar a aula.

Validação desta revisão: lint, tipos, 85 testes e build aprovados; cartões sem cortes ou rolagem horizontal em 320, 430, 560, 900 e 1440 px. Giro e transferência conferidos por amostragem no navegador, com diferença inferior a 1 px entre a marca animada e a marca do cabeçalho no fim. Recurso retardado manteve o progresso abaixo de 100% até a liberação. Sem erros JavaScript.

Revisão posterior: removido o giro do P a pedido do usuário. O monograma permanece estático durante a preparação e mantém apenas o deslocamento até o cabeçalho. Duração de 1,25 s e demais transições preservadas.

## Estado atual: sem abertura

O usuário retirou a animação de abertura integralmente. Entrance.tsx, loader, progresso, giro, deslocamento do P e entrada dos cartões foram removidos da rota. O histórico acima documenta decisões anteriores. Responsividade e medições atuais estão em docs/links-priscilla.md.

Correção de escopo: a abertura foi restaurada após esclarecimento do usuário. Apenas o movimento do P até o cabeçalho permanece removido, assim como o giro retirado anteriormente. Progresso e entrada dos cartões permanecem; P estático no loader e no cabeçalho. Implementação nativa em Entrance.tsx, com limpeza de frames, temporizadores e animações. Ver docs/links-priscilla.md para estado atual.

## Entrada progressiva — 16/10/2026

Reconhecimento: React/Next.js, WAAPI já existente, curva compartilhada --ease-out. Frequência: chegada ocasional à página de apresentação. Sem alteração de layout ou comportamento sticky.

| # | Local | Antes | Propósito | Frequência | Movimento escolhido |
| --- | --- | --- | --- | --- | --- |
| 1 | app/links/Entrance.tsx, reveal/showCard | Cartões começavam parcialmente visíveis e animavam sob o loader, inclusive fora da tela | Evitar mudança abrupta | Entrada ocasional | WAAPI: opacity 0 → 1 e translateY(18px) scale(.97) → translateY(0) scale(1), 450ms, --ease-out cubic-bezier(.23,1,.32,1). Primeiro cartão após 180ms, intervalo de 80ms. IntersectionObserver threshold .08 revela uma vez os cartões abaixo da dobra. |
| 2 | app/links/Entrance.tsx, portraitEntrance | Retrato surgia junto com todos os cartões | Estabelecer hierarquia na chegada | Entrada ocasional | Após a saída do loader: opacity 0 → 1, translateY(14px) scale(.97) → estado final, 450ms com a mesma curva. |

Orçamento: entrada de apresentação permite 450ms; sequência curta, somente transform/opacity. Teclado cancela a animação do cartão focado imediatamente. Movimento reduzido conserva a apresentação estática existente. Sem JS não há superfícies ocultas. Observador, animações e listener são limpos ao desmontar.

Candidatos rejeitados: giro/deslocamento do P (sem propósito atual e retirado pelo usuário); animação repetida a cada passagem pela tela (prejudica leitura); movimento em saltos de foco por teclado (reprovado na frequência/função). Maior benefício: guardar os cartões fora da tela para sua primeira aparição, em vez de terminar a animação antes que o visitante os veja. Diagnóstico pela skill find-animation-opportunities; implementação pela skill animate.

Validação em Chromium: intervalos registrados de 180/260/340/420ms no desktop, cartões abaixo da dobra com opacidade zero até a rolagem, revelação completa e sem repetição. Foco no último cartão o revela imediatamente. Sem rolagem horizontal em 320/768/1024/1440px, sem erros de página; movimento reduzido e versão sem JavaScript aprovados. Lint, tipos e build aprovados. Localhost ativo na porta 3002.

## Entrada lateral — revisão de 16/10/2026

A pedido do usuário, substituída a cascata vertical por movimento horizontal sincronizado. Superfícies: 650ms, opacity 0 → 1, perspective(1000px) translateX(-48px) rotateY(-6deg) scale(.97) → estado final, curva compartilhada --ease-out. Texto: deslocamento horizontal de 12px, 450ms, começa 90ms após sua superfície. Todos os cartões visíveis usam o mesmo atraso de 180ms após a saída do loader, sem escalonamento entre linhas. O retrato também entra lateralmente (14px, 450ms). Cartões abaixo da dobra mantêm entrada única ao rolar, sem cascata. Movimento reduzido, foco imediato por teclado e limpeza ao desmontar preservados. Não foi adicionada biblioteca.

Validação: keyframes e temporização conferidos no navegador (quatro atrasos iguais de 180ms, nenhuma translação Y); sem transbordamento em 320/768/1024/1440px. Entrada ao rolar, foco e movimento reduzido aprovados. Lint, tipos e build aprovados. P permanece estático.
## Hover de contorno e legibilidade do retrato
Os quatro cards e o CTA Conheça as aulas usam um border beam que aparece em hover com mouse, em160ms, e pausa ao sair. A camada usa máscara interna de2px e pointer-events none: não intercepta cliques nem altera dimensões. Em teclado, foco continua visível com contorno estático; movimento reduzido mantém o beam estático. No toque, a pressão mostra o contorno sem animação de hover persistente.
A fotografia preserva suas cores, com sombra neutra graduada a partir de35% e maior intensidade da metade para baixo. A assinatura usa creme #f1e2c9. Validação de hover dos cinco links, movimento reduzido, ausência de transbordamento e Axe sem violações em320/430/520/768/1440px.
## Rodapé, alturas e indicação do notch
Incluído rodapé discreto após a composição, com divisor, assinatura em creme e modalidades, dando encerramento após o quarto link. Alturas ajustadas levemente: retrato400px na base,456px acima de421px,576px em tablets; cards com mínimo148px (156px em tablets). Desktop mantém as colunas alinhadas com composição mínima656px e altura responsiva72svh. A frase Veja todos os meus links é posicionada acima do recorte, sem seta duplicada; a seta decorativa única tem18px, centralizada exatamente no notch, sem botão ou contorno adicional. Layout validado em320/430/520/768/1440px, sem overflow e sem violações WCAG A/AA. Teste de regressão confirma dimensões, centro da seta, separação do rodapé e preservação dos cinco hover beams.
