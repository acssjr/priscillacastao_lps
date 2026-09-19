# Direção visual — Priscilla Castão

Versão 0.1 para validação. Este documento antecede qualquer implementação da landing page.

## Conceito central

**Presença em movimento.**

A identidade deve mostrar o forró como conversa corporal: firme sem ser rígida, íntima sem ser frágil, sofisticada sem perder calor. A Priscilla aparece como professora atenta e tecnicamente consciente, não como animadora de festa ou catálogo de passos.

Frase-guia interna:

> A forma nasce da escuta; o movimento nasce da confiança.

Ela orienta o design, mas não deve ser publicada como promessa sem validação.

## Atributos da experiência

- humana;
- confiante;
- fluida;
- próxima;
- corporal;
- precisa;
- brasileira contemporânea.

Evitar: estética genérica de festa junina, ornamento “feminino” sem função, glassmorphism, excesso de cartões, ícones óbvios de dança, texto ultrafino no corpo e efeitos que atrasem a decisão.

## Sistema de cor

| Cor | Token proposto | Papel |
|---|---|---|
| Vinho profundo `#64121F` | `brand-primary` | marca, CTA principal, linhas e destaques |
| Vinho escuro `#4B0D17` | `brand-dark` | seções de alta intensidade, hero alternativo e rodapé |
| Bordeaux `#7A1D2A` | `brand-mid` | variação de superfície e estados interativos |
| Rosa queimado `#AE6664` | `brand-soft` | detalhe raro, legenda ou marcador; nunca CTA principal |
| Creme `#F1E2C9` | `surface-cream` | campo claro de destaque e molduras fotográficas |
| Off-white quente `#FAF5EC` | `surface-paper` | fundo editorial dominante |
| Marrom quente `#342522` | `ink-warm` | texto secundário em fundos claros |

### Proporção orientativa

- 45% off-white quente;
- 25% creme;
- 20% vinho profundo ou vinho escuro;
- 8% bordeaux;
- até 2% rosa queimado.

A proporção não é uma fórmula rígida. Sua função é impedir que rosa e bordeaux diluam a presença do vinho principal.

### Contraste

- texto longo em fundo claro: `#342522`;
- texto claro em vinho escuro: `#FAF5EC`;
- CTA vinho em creme/off-white com rótulo claro;
- rosa queimado restrito a texto grande ou elemento não essencial até validar WCAG;
- estados de foco sempre visíveis e diferentes de hover.

## Tipografia

### Família principal

**Plus Jakarta Sans** será a base do produto inteiro.

- corpo: 400 ou 500;
- navegação e microcopy: 500 ou 600;
- títulos funcionais: 600 ou 700;
- evitar peso 300 em corpo, botão, FAQ e conteúdo móvel.

### Família de contraste a testar

**Newsreader** em 300/400, normal e itálico, é a primeira candidata. Ela entra somente em frases editoriais grandes, depoimentos curtos ou uma palavra de contraste na headline, sempre com tamanho generoso. Não entra em parágrafos, formulário, preço ou navegação.

O teste visual deve comparar:

1. 100% Plus Jakarta Sans;
2. Plus Jakarta Sans + Newsreader Light;
3. Plus Jakarta Sans + Newsreader Italic.

A variação vencedora é a que acrescentar ritmo sem reduzir a leitura. Se a segunda fonte parecer decoração, o sistema fica com uma única família.

## Fotografia

### Ensaio `DW1kXWEkYEa`

- `priscilla-castao-ensaio-01.webp`: principal candidata ao hero desktop pela área de respiro e direção do gesto.
- `priscilla-castao-ensaio-02.webp`: retrato vertical de maior energia; forte para hero mobile ou transição entre promessa e método.
- `priscilla-castao-ensaio-03.webp`: expressão frontal e acolhedora; prioridade para “Sobre Priscilla”.

### Capa `DJxh-HRu...`

`priscilla-castao-forro-roots-capa.webp` deve funcionar como prova da dança acontecendo. Ela não é hero: a resolução é menor, há outra pessoa reconhecível e a publicação pertence a outro perfil. Seu uso ideal é uma peça vertical com crédito/autorização verificados e indicação clara de movimento.

### Tratamento

- cortes amplos que preservem mãos, postura e relação entre corpos;
- proporções verticais assumidas, sem forçar fotos a banners baixos;
- sem filtros que alterem pele ou o vermelho original;
- curvas, arcos ou recortes usados apenas como assinatura recorrente;
- crédito e autorização quando houver terceiros.

## Composição

- grid editorial de 12 colunas no desktop e 4 no mobile;
- margens generosas, mas não a ponto de esconder oferta ou CTA na primeira dobra;
- headline com quebras deliberadas, jamais dependentes do acaso responsivo;
- assimetria controlada: texto firme e imagem em deslocamento, conectados por uma linha ou arco;
- no máximo um componente “flutuante” por cena;
- seções de borda a borda para tornar a mudança de assunto evidente.

## Ritmo cromático da página

1. **Hero — off-white e vinho:** clareza, rosto e decisão.
2. **Reconhecimento — vinho escuro:** mergulho no problema e contraste emocional.
3. **Método — creme:** compreensão e respiro.
4. **Prova — vinho profundo/bordeaux:** dança real, voz de alunos e sinais verificáveis.
5. **Formatos — off-white:** comparação clara e ação.
6. **Sobre — creme:** proximidade humana.
7. **FAQ — off-white:** leitura utilitária.
8. **Fechamento — vinho escuro:** decisão final sem distração.

Cada troca de cor corresponde a uma mudança de papel na decisão. Não haverá faixas intermediárias apenas para “decorar a rolagem”.

## Movimento

O vocabulário de animação deve derivar de conexão, peso e resposta:

- hero com entrada coordenada de headline, CTA e retrato;
- máscara fotográfica que abre como deslocamento de peso, não como simples fade;
- uma linha contínua atravessando reconhecimento e método para sugerir pergunta/resposta;
- pequenos deslocamentos opostos em pares de elementos, evocando parceria;
- prova em vídeo ou capa só anima quando entra na viewport;
- nenhuma animação essencial escondendo conteúdo no estado inicial.

Regras técnicas para a etapa futura:

- scroll nativo como padrão;
- `prefers-reduced-motion` com experiência completa e estática;
- animações contínuas pausadas fora da viewport;
- sem parallax no mobile;
- sem pinning antes de provar que melhora a narrativa;
- orçamento inicial: até três momentos autorais de movimento na página inteira.

## Interface e CTA

- um botão primário cheio em vinho profundo;
- ação secundária em texto ou contorno, nunca competindo com a principal;
- cantos discretos ou levemente orgânicos, sem transformar tudo em “pílula”;
- microcopy logo abaixo do CTA respondendo formato, custo/compromisso inicial e tempo de retorno, quando esses dados forem confirmados;
- ícones apenas quando acelerarem compreensão.

## O que fará esta página parecer própria

A combinação de retratos vermelhos, campos de vinho/creme, tipografia contemporânea e uma linha coreografada de conexão cria um sistema coerente com o material real da Priscilla. A assinatura não virá de importar o arco da Iasmin ou a moldura bruta do GFB, mas de traduzir a pedagogia da escuta em composição e movimento.
