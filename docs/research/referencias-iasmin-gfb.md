# Estudo comparativo — `iasmin-psi` e `gfb_lp`

Foram examinados os sites publicados e a implementação dos dois repositórios. O objetivo não é copiar a superfície visual, mas identificar decisões estruturais que produzem a sensação de trabalho cuidadoso.

- [Iasmin Psicologia](https://iasmin-psi.vercel.app/) — repositório local em `references/repos/iasmin-psi`
- [GFB](https://gfblp-main.vercel.app/) — repositório local em `references/repos/gfb_lp`

## Leitura executiva

O GFB é a referência mais próxima de mercado: ensina uma dança, trabalha objeções, formatos, horários, preço e matrículas. Iasmin é a referência mais forte para cadência editorial, intimidade e passagem entre estados emocionais.

A qualidade percebida dos dois projetos vem de quatro sistemas trabalhando juntos:

- hierarquia de conversão clara;
- blocos cromáticos que tornam cada seção inequivocamente distinta;
- fotografia real integrada à composição, não usada como decoração genérica;
- movimento coreografado por intenção, viewport e capacidade do dispositivo.

## Comparação

| Dimensão | Iasmin | GFB | Aplicação em Priscilla |
|---|---|---|---|
| Tom | Editorial, íntimo, contemplativo | Enérgico, popular, direto | Intimidade e presença com energia corporal controlada |
| Hero | Headline ampla, retrato vertical, dois caminhos e trilha gráfica | Oferta inequívoca, benefício, dois caminhos e foto de grupo | Uma oferta principal, retrato real e CTA de conversa com microcopy |
| Ritmo | Jornada emocional com transições lentas | Sequência comercial longa e explícita | Página mais curta, combinando emoção com progressão de decisão |
| Seções | Campos de cor e capítulos bem demarcados | Blocos de alto contraste, molduras e faixas | Alternância entre off-white/creme e vinho escuro, sem zonas ambíguas |
| Movimento | Narrativa com caminho desenhado e seção fixada | Revelações, cinética, carrossel e profundidade | Poucos gestos autorais: entrada do hero, linha de conexão e prova em movimento |
| Conversão | WhatsApp contextual e CTA final | CTA repetido, preço, horários e barra móvel | CTA principal repetido 3 vezes; preço/agenda só após validação |
| Prova | Reconhecimento, presença e história | Resultados, equipe, depoimentos e logística | Prova real antes de uma lista extensa de benefícios |

## O que o código da Iasmin ensina

A composição central está em `src/components/landing/landing-page.tsx`; o sistema de movimento em `landing-motion.tsx`; e elementos específicos em `context-trail.tsx` e `recognition-carousel.tsx`.

- A animação usa contextos separados para desktop, mobile e `prefers-reduced-motion`.
- A suavização de scroll só aparece em desktop com ponteiro preciso; toque mantém comportamento nativo.
- A seção de cuidado fixa a narrativa e desenha um caminho SVG enquanto revela três pilares.
- Fontes e imagens são aguardadas antes de recalcular gatilhos, reduzindo saltos.
- O carrossel móvel pausa com interação e oferece controle por ponteiro e teclado.

A lição importante não é adotar `ScrollSmoother` por padrão. É fazer cada efeito responder a uma função narrativa e degradar de maneira previsível.

## O que o código do GFB ensina

A montagem está em `src/components/landing/LandingPage.tsx`; a coreografia em `AnimatedLanding.tsx`; hero e prova em `HeroSection.tsx` e `ProofSection.tsx`; e a oferta em `PricingSection.tsx`.

- O hero entra como uma única sequência, mantendo título, apoio, CTA e imagem sincronizados.
- A faixa cinética trabalha somente quando está visível e pausa fora da viewport.
- As revelações são agrupadas, evitando dezenas de observadores independentes.
- A profundidade de desktop usa um gatilho de scroll compartilhado.
- O movimento preserva scroll nativo e mantém leitura estática quando animação não roda.
- Os testes verificam acessibilidade, overflow, mensagens do WhatsApp, UTMs, ativos reais, carrossel, FAQ e comportamento responsivo.

O GFB também demonstra que uma página comercial pode ser expressiva sem esconder preço, horários, formatos ou objeções.

## Padrões a reutilizar

1. **Capítulos cromáticos completos.** A troca de fundo deve coincidir com a troca de pergunta na cabeça do visitante.
2. **Hero composto como cartaz.** Headline, foto e CTA formam uma única cena, não três caixas independentes.
3. **Uma gramática de movimento.** Máscaras de imagem, uma linha que sugere conexão e revelações com o mesmo ritmo.
4. **Fotos reais cedo.** Priscilla deve aparecer na primeira dobra e a dança real até a segunda.
5. **Conteúdo legível sem JavaScript.** Animação aprimora; não libera informação essencial.
6. **Mobile com composição própria.** O retrato, a ordem do conteúdo e a ação fixa precisam ser decididos, não apenas reduzidos.
7. **Prova operacional.** Testes de links, mensagens, redução de movimento, contraste, navegação por teclado e overflow.

## Padrões que não devem ser copiados

- a quantidade de seções do GFB, incompatível com uma oferta individual ainda não validada;
- o scroll suavizado da Iasmin antes de medir custo e necessidade;
- cores, molduras, frases, composições ou movimentos reconhecíveis das referências;
- animações contínuas puramente decorativas;
- duas ou mais rotas de CTA com o mesmo peso quando existe uma conversão prioritária;
- depoimentos, números, credenciais ou urgência que não tenham fonte verificável.

## Critério de sofisticação

Neste projeto, “efeito avançado” significará sincronização, boa direção e adaptação — não quantidade. Um único movimento de linha que traduza escuta e parceria pode ter mais valor de marca que parallax em todas as fotografias.
