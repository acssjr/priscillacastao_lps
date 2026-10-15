# Movimento e vidro — revisão de 15/10/2026

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
