# Pull requests e publicação

A main exige pull request, branch atualizada, check `Quality gate` do GitHub Actions e resolução das conversas de revisão. Não há bypass cadastrado; force-push e exclusão da main estão bloqueados. Nenhuma aprovação humana adicional é exigida: CodeRabbit continua responsável pela revisão conforme configurado no serviço.

## Etapas do Pipeline (`Pipeline de Qualidade e Deploy (CI/CD)`)

- **1. Código, Tipagem e Segurança (Vitest):** lint (ESLint), TypeScript estrito, validação de conteúdo, consentimento e links, autenticação e permissões do CMS, reserva/cancelamento, recuperação e sincronização da UI.
- **2. Concorrência e Banco Real (PostgreSQL 17):** PostgreSQL 17 descartável do runner, sem segredo. Exercita migração real, disputa simultânea do mesmo horário, intervalos sobrepostos simultâneos, chave idempotente, cancelamento versionado e rollback do grupo. Falta de banco faz esse job falhar; não é um teste ignorado na CI.
- O runner é fixado em Ubuntu 24.04 e Node 24; a instalação do Chromium usa somente o headless shell necessário, sem baixar navegadores extras.
- **3. Build de Produção e Navegador Real (Playwright):** build Next.js e navegador Chromium sobre servidor de produção, com disponibilidade simulada e determinística. Cobre reserva, conflito, rede, resposta fora de ordem, recuperação, teclado/acessibilidade e três telas representativas (320, 390 e 1440 px), além de calendário de seis semanas e personalização pelo painel.
- **Quality gate:** sempre executa e só fica verde se os três jobs anteriores terminarem com sucesso, inclusive quando um deles falha ou é cancelado. Mantém este nome técnico exato pois é a chave exigida pelo Ruleset do GitHub e pelo Deployment Check da Vercel.
- **4. Publicação na Vercel (Deploy Ativo):** executa logo após a aprovação do `Quality gate`, aguarda a confirmação oficial da Vercel via API de Deployments/Status do GitHub e registra no resumo visual do workflow a URL publicada e o ambiente (`Preview` ou `Production`).

Não há cobertura percentual arbitrária, chamadas ao banco de produção ou teste dependente dos dados de novembro de 2026. As demais verificações visuais existentes continuam disponíveis para revisão específica; não são gates obrigatórios.

## Revisão dos testes

Removidos testes que apenas procuram strings de CSS/media queries, exigem otimizações em relação a tamanhos antigos de arquivo, conferem coordenadas exatas de animação ou apenas a existência de main. Os arquivos essenciais continuam sendo verificados como presentes e não vazios e o manifesto mantém validação de identidade e ícones. Foram preservados testes comportamentais de links, carrosséis, navegação e consentimento. A matriz responsiva foi reduzida a três tamanhos úteis, retirando a comparação de círculo e alinhamento de texto em pixels.

## Deploy

A Vercel publica main pelo GitHub. O Deployment Check `Quality gate` bloqueia a atribuição dos domínios de produção até o GitHub aprovar o commit. PRs podem ter previews para revisão. O workflow também roda após merge para verificar o SHA efetivamente publicado e confirmar a publicação na etapa `4. Publicação na Vercel (Deploy Ativo)`.

No plano Hobby não é possível restringir as fontes de deploy (CLI/API) pela política do projeto; essa API exige Pro/Enterprise. Por isso AGENTS.md proíbe deploy manual/force-promote. Administradores dos serviços ainda podem editar regras ou forçar promoção: não tratar isso como bloqueio contra o próprio administrador.

## Uso local

- npm run lint
- npm run typecheck
- npm test
- TEST_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/priscilla_test npm run test:postgres
- npm run build && npm run test:ci-browser (usa porta 3000 exclusiva)

Credenciais do exemplo pertencem apenas ao serviço descartável de teste. O teste PostgreSQL rejeita host remoto e banco cujo nome não termine em _test.
