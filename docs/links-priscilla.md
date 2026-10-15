# Página de links de Priscilla Castão

## Versão ativa

Em 15/10/2026, o usuário escolheu manter apenas o layout antes chamado v2 para desktop e mobile. Ele agora reside em `app/links/`, na rota `/links`, incluindo loader GSAP, estilos e fontes locais. `/links-v2` redireciona permanentemente para `/links`. O monograma do topo é decorativo, sem clique. A primeira implementação foi retirada das rotas e seus arquivos sem uso removidos; permanece recuperável no Git. As seções abaixo registram o histórico anterior à consolidação. Os refinamentos atuais estão em `docs/links-v2-motion.md`.

### Catálogo, ícones e compartilhamento

O botão “Conheça as aulas” abre `/materiais/catalogo-de-aulas-priscilla-castao.pdf` em nova aba, com indicação de PDF e rótulo acessível. Fonte confirmada pelo usuário: `outputs/pdf/priscilla-castao-catalogo-de-aulas-v15.pdf`, 7 páginas de 640×800pt (não A4). Arquivo copiado sem alterações: SHA-256 `7b1ac12bfd67b512b956fb2734a67083200ca60f4dc63921f924bc235ac58513`. HTTP 200 com `application/pdf`, resposta idêntica à fonte. Não pré-carregar esse documento no loader; transferir somente quando solicitado.

Adicionada a indicação “Veja todos os meus links” abaixo do botão, com seta direcional de acordo com a composição. Favicon SVG/ICO, PNG 96px, Apple 180px e ícones web-app 192/512px agora usam o P sobre vinho, gerados de forma reprodutível com `node scripts/update-brand-icons.mjs`. Ícones declarados no layout têm versão na URL para evitar reutilização do favicon antigo. Metadados Open Graph e cartão de compartilhamento configurados para `/links`, com nome, descrição e retrato existentes. Política de indexação preservada.

Verificação: 85 testes em 20 arquivos, lint, tipos e build aprovados. Axe sem violações; sem transbordamento em 430 e 1440px. Alias `/links-v2` continua redirecionando para `/links`.

## Overview

A rota `/links` reúne contato, portfólio, trajetória e Instagram em uma composição compacta, com foto e logo no topo. O cartão de WhatsApp recebe a maior área e prioridade visual. A rota tem título e descrição próprios e metadados `noindex, nofollow`.

Este documento registra apenas essa superfície. `PRODUCT.md`, `DESIGN.md` e `.impeccable/design.json` continuam sendo a referência global e foram preservados. A composição aprovada está registrada em `docs/superpowers/specs/2026-10-14-links-design.md`.

### Comparação com o sistema existente

O sistema existente usa vinho, creme e papel, Plus Jakarta Sans e fotografias com cantos arredondados nas campanhas; o painel herda essa identidade com superfícies claras e controles operacionais. `/links` preserva as cores centrais, o logo, o monograma e as fotografias existentes. As diferenças locais aprovadas pelo usuário são o fundo vinho mais profundo, cartões de vidro translúcido, reflexos discretos e Saans. Essas escolhas não substituem a tipografia nem os componentes globais das campanhas ou do painel.

## Colors

Os valores abaixo pertencem ao módulo `app/links/links.module.css`, sob `.page`:

| Valor | Uso local |
| --- | --- |
| `#64121f` (`--wine`) | Vinho de identidade; texto da seleção sobre creme. |
| `#f1e2c9` (`--cream`) | Ênfases, ícones, ação principal, monograma e foco. |
| `#faf5ec` (`--white`) | Texto principal, logo e camadas translúcidas dos cartões. |
| `#280b12` | Fundo profundo e base dos degradês sobre fotografias. |
| `#7a2638` / `#4b1421` | Iluminação radial do fundo. |
| `#4b0d17` | Texto da ação creme de WhatsApp; cor já presente no sistema global. |

O vidro combina transparências de branco quente, sombra escura e bordas internas claras. São tratamentos desta página, não novos tokens globais.

## Typography

Saans é carregada localmente por `next/font/local` em `app/links/page.tsx`, com `display: swap`, e aplicada somente ao elemento principal da rota. Arquivos em `app/links/fonts/`:

- `Saans-TRIAL-Regular.woff2`: peso 400.
- `Saans-TRIAL-Medium.woff2`: peso 500.
- `Saans-TRIAL-SemiBold.woff2`: peso 600.

Os nomes identificam os arquivos como TRIAL; a implementação não estabelece licença de produção. A marca no título usa o SVG existente e mantém “Priscilla Castão” como texto acessível. O cartão principal usa título fluido de 26 a 30px; os títulos editoriais variam de 17 a 20px conforme a largura do conteúdo.

## Layout

Uma coluna central com largura máxima de 500px organiza hero, boas-vindas, navegação e rodapé. Portfólio e trajetória ficam em duas colunas. O espaçamento dos cartões é de 14px, com 10px entre os editoriais abaixo de 360px. A adaptação principal ocorre em 560px; há ajustes adicionais em 359px. Retratos, fotografias e SVGs reutilizam os arquivos existentes em `public/images/` e `public/brand/`.

## Elevation & Depth

Os cartões usam raio de 16px, `backdrop-filter: blur(22px) saturate(125%)`, degradê translúcido e bordas internas iluminadas. O reflexo radial acompanha a posição do mouse por propriedades CSS `--glass-x` e `--glass-y`, atualizadas por `requestAnimationFrame` em `app/links/GlassSurface.tsx`; o agendamento é cancelado na desmontagem.

Em dispositivos com hover e ponteiro preciso, cartões com links sobem 3px e exibem reflexo. Fotos editoriais com destino podem ampliar discretamente. Os cartões sem destino não recebem esses estados de interação. A entrada de hero, boas-vindas e navegação usa deslocamento vertical, opacidade e desfoque, somente sob `prefers-reduced-motion: no-preference`.

Com movimento reduzido, animações e transições são removidas e o componente não atualiza o reflexo pelo ponteiro. O foco de teclado é indicado por um contorno creme de 3px no link e por um anel externo no contêiner de vidro, evitando que o recorte dos cartões esconda a indicação.

## Components

### Destinos e conteúdo

A configuração fica em `content/profile-links.ts`:

- **WhatsApp:** reutiliza `forroDoZeroCampaign.whatsapp.phone`, de `content/landing-pages/forro-do-zero`, com mensagem específica da página de links codificada por `encodeURIComponent`. Nenhum novo telefone foi criado.
- **Instagram:** `https://www.instagram.com/priscillacastao_danca/`, o perfil existente indicado no briefing e no rodapé.
- **Portfólio:** `portfolio: null` até que o destino aprovado seja fornecido.
- **Release / trajetória:** `release: null` até que o destino aprovado seja fornecido.

Para ativar portfólio ou release, substituir o respectivo `null` por uma URL HTTPS aprovada e validar o destino. Com `null`, o cartão exibe “Link a definir”, usa `aria-disabled="true"`, não possui `href` e não entra na sequência de tabulação. Com URL, passa a ser um link com rótulo acessível. Os links ativos abrem em nova aba com `rel="noopener noreferrer"`.

### Validação local registrada

Evidências da verificação da implementação, fornecidas pela execução principal em 14/10/2026:

- Lint e verificação de tipos passaram.
- Suíte completa: 20 arquivos de teste e 85 testes passaram.
- Build de produção concluído; `/links` gerada como rota estática.
- Axe: zero violações detectadas.
- Sem transbordamento horizontal em 320, 390, 768 e 1440px.
- Nenhum erro de JavaScript no navegador durante a verificação.
- Com movimento reduzido, animações e transições computadas como `none`.
- Foco de teclado externo confirmado como anel creme de 3px.

Esses resultados descrevem a validação local; não constituem evidência de publicação em produção. Portfólio e release permanecem pendentes dos destinos reais.

## Do's and Don'ts

- Preservar o sistema global e manter Saans e vidro restritos a `/links`.
- Reutilizar fotografias, marca e dados existentes; confirmar novos destinos antes de ativá-los.
- Manter foco visível, estados pendentes explícitos e respeito à redução de movimento.
- Não inventar URLs, telefone, documentos de portfólio ou release.
- Não promover os tratamentos locais desta página a regras globais de campanha ou painel.

## Revisão solicitada em 14/10/2026

Retrato principal: foto de frente `priscilla-castao-instagram-DYf07MJEQ9z-01.webp`, com sobreposição vinho escura para contraste da marca. Subtexto abaixo da logo removido. Fotos sem repetição: ensaio 01 no WhatsApp, 02 no portfólio e 03 na trajetória. Instagram alterado para “Volte ao Instagram”. Ícone do WhatsApp substituído pela geometria SVG do [Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/icons/whatsapp.svg), preservada sem redesenho.

Revisão validada em 390, 560 e 1440px, incluindo carregamento das quatro imagens, ausência de transbordamento e zero violações Axe em 560px. Lint, tipos e build passaram nesta revisão.

### Composição compacta e navegação interna

Novo refinamento: retrato em escala menor, contorno suave e iluminação vinho desfocada; removidos indicador de localização e recuo superior. Header reduzido para 280px no celular e 295px no desktop. Boas-vindas subidas e legenda “Links úteis” acompanhada de seta SVG para baixo. Recorte do WhatsApp ultrapassa o cartão em 32px; janela independente preserva o recorte inferior arredondado.

Os cartões agora navegam na mesma aba para áreas já existentes: portfólio em `/#aulas` e trajetória em `/#sobre`. Isso substitui a configuração nula descrita anteriormente. Não foram criados documentos de release nem fatos biográficos novos. Cliques e presença dos destinos verificados no navegador.

Lint, tipos e build aprovados; zero violações Axe em 430px e nenhum transbordamento em 320, 390, 430, 768 e 1440px. Recorte superior de 32px confirmado em todas essas larguras.

### Composição para computador

A partir de 960px, o conteúdo passa a uma grade de duas colunas com largura máxima de 1160px: retrato, identidade, boas-vindas e assinatura à esquerda; links à direita. A composição é centralizada verticalmente, com espaço para rolagem em janelas baixas. A ordem semântica e de teclado é preservada. O grupo de links tem seu próprio contêiner para calcular os tamanhos fluidos; a tipografia não depende da largura total da tela.

Entre 640 e 959px, a coluna única usa até 600px, com imagens e cartões em escala intermediária. Abaixo disso, mantém-se a composição mobile. Imagens têm `sizes` próprios para cada faixa, evitando usar o tamanho mobile no desktop.

Revisão visual em 390, 768, 960, 1024, 1366, 1440 e 1920px, com imagens carregadas e movimento reduzido durante as capturas. Título comercial preservado, aguardando escolha do usuário entre as opções de copy.

### Correção da direção desktop

O usuário rejeitou as duas colunas e confirmou explicitamente que a composição deve ser vertical e centralizada também no computador. Esta decisão substitui a seção anterior: a partir de 960px, a coluna possui até 600px, com retrato e marca no topo, boas-vindas, cartões e assinatura nessa ordem. O topo da cena fotográfica recebe uma máscara suave para eliminar o corte horizontal perceptível. Mobile preservado. Fluxo vertical e ausência de transbordamento verificados em 390, 768, 1024, 1440 e 1920px.

### Escala desktop por altura de janela — 15/10/2026

Composição vertical preservada. Desktop agora usa até 640px, com retrato de 330px e cartões mais proporcionais. Em janelas de PC de até 900px de altura, a coluna usa até 580px e recebe espaçamento e cartões compactos. O ponto focal das fotografias editoriais muda apenas no desktop, preservando rostos e mãos nos cartões baixos. Mobile mantém suas regras anteriores.

Verificado sem rolagem horizontal e com todo o conteúdo cabendo na altura em 1366×768, 1440×900 e 1920×1080. Axe sem violações em 1366×768. Capturas com as quatro imagens carregadas. Arquivo gerado `next-env.d.ts` já estava modificado pelo servidor; não faz parte deste ajuste.
