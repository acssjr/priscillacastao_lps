# Alternativa desktop com notch

Rota: `/links-v2`. A versão original `/links` permanece intacta. Novo layout baseado na referência enviada pelo usuário: retrato grande à esquerda, quatro cartões empilhados à direita e recortes semicirculares nas bordas internas. O botão circular entre os blocos é um link real para a navegação `#links-rapidos`.

Identidade: Saans local já fornecida, vinho #64121f, fundo #280b12, creme #f1e2c9 e branco #faf5ec; rosa nas superfícies secundárias. Fotografias existentes sem repetição entre as cinco áreas. Textos limitados a título e ação por cartão, mais a assinatura no retrato. Destinos importados de `content/profile-links.ts`.

Desktop a partir de 900px: composição de duas colunas, largura máxima de 1280px, altura limitada ao espaço útil da janela. Mobile: retrato acima dos cartões, com notch horizontal entre os grupos e seta apontando para baixo. As duas versões têm rotas independentes e arquivos próprios.

Verificação: imagens carregadas, sem transbordamento em 390, 1024, 1366, 1440 e 1920px; composição cabe na altura desktop em 1024×768, 1366×768, 1440×900 e 1920×1080. Navegação do notch testada. Axe sem violações em 1440px. Lint, tipos e compilação aprovados. Novos arquivos restritos à rota alternativa e a esta documentação.

## Refinamento de marca e abertura

Topo com monograma P centralizado, extraído do primeiro glifo vetorial da logo fornecida, sem repetir o nome em texto. Cartões com fotografia mais larga e máscara lateral gradual, eliminando a divisória visível dos arquivos originais. O notch agora existe só na borda do retrato, com raio de 19px e botão visual de 26px, mantendo alvo interativo de 44px; o grupo de cartões tem borda contínua.

Abertura de marca em vinho e bordô com logo translúcida de fundo, monograma central e linha ornamental. Duração total de 1800ms: 1350ms de apresentação e 450ms de saída em opacidade. CSS anima apenas transform/opacity, reutilizando `--ease-out`. Entrada dos blocos escalonada em 50ms. A linha não representa progresso de rede.

O componente remove a cobertura ao terminar; a própria animação CSS oculta a cobertura como fallback. Escape, Tab e botão “Pular abertura” permitem dispensá-la. A preferência por movimento reduzido exibe o conteúdo imediatamente, sem a espera. A versão original `/links` permanece intacta.
