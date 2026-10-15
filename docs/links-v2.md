# Alternativa desktop com notch

Rota: `/links-v2`. A versão original `/links` permanece intacta. Novo layout baseado na referência enviada pelo usuário: retrato grande à esquerda, quatro cartões empilhados à direita e recortes semicirculares nas bordas internas. O botão circular entre os blocos é um link real para a navegação `#links-rapidos`.

Identidade: Saans local já fornecida, vinho #64121f, fundo #280b12, creme #f1e2c9 e branco #faf5ec; rosa nas superfícies secundárias. Fotografias existentes sem repetição entre as cinco áreas. Textos limitados a título e ação por cartão, mais a assinatura no retrato. Destinos importados de `content/profile-links.ts`.

Desktop a partir de 900px: composição de duas colunas, largura máxima de 1280px, altura limitada ao espaço útil da janela. Mobile: retrato acima dos cartões, com notch horizontal entre os grupos e seta apontando para baixo. As duas versões têm rotas independentes e arquivos próprios.

Verificação: imagens carregadas, sem transbordamento em 390, 1024, 1366, 1440 e 1920px; composição cabe na altura desktop em 1024×768, 1366×768, 1440×900 e 1920×1080. Navegação do notch testada. Axe sem violações em 1440px. Lint, tipos e compilação aprovados. Novos arquivos restritos à rota alternativa e a esta documentação.
