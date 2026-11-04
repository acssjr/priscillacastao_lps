# Revisão de integridade e sincronização do agendamento

Data: 04/11/2026. Código analisado: commit 1e16f36, main.
Endereço público: https://agendamento-priscilla.vercel.app

## Resultado

Os dados atuais consultados estão coerentes. A lógica tem riscos relevantes em cancelamento concorrente, intervalos sobrepostos e recuperação de falhas de rede. Não foram feitas correções nem alterações de dados de produção nesta revisão.

## Método e limites

- Leitura do esquema, consultas SQL, autenticação, API pública, API administrativa e interfaces.
- Consulta ao PostgreSQL de produção em transação READ ONLY, usando apenas contagens e tipos de restrições. Nenhum nome ou telefone foi incluído no relatório.
- GET público de produção e tentativa de GET administrativo sem autenticação.
- Cinco testes de reprodução isolados com banco SQLite temporário e interface React simulada.
- Duas reproduções no navegador com respostas de API simuladas: inversão de respostas e perda da resposta de confirmação.
- Não houve gravação, cancelamento, criação de contas ou simulação de carga em produção.
- Não foram testadas transações concorrentes no PostgreSQL real, restauração de backup, failover ou limites contratados do provedor.
- Testes de aceitação de datas inválidas foram executados no adaptador SQLite. A possibilidade de gravar texto inválido e quebrar o cast no PostgreSQL é uma conclusão da inspeção do código; não foi provocada no banco real.

## Estado de produção observado

- 12 registros totais; 0 reservas; 12 horários habilitados sem reserva.
- 0 reservas desabilitadas; 0 telefones sem nome associado.
- 0 pares de horários habilitados sobrepostos no conjunto atual.
- Restrições retornadas: PRIMARY KEY e duas CHECK. As definições das CHECK não foram inspecionadas; não se presume proteção adicional por elas.
- API pública: HTTP 200, Cache-Control: no-store, 12 horários, 0 reservados.
- API administrativa sem sessão: HTTP 401.

## Achados prioritários

### 1. Alta: confirmação de cancelamento pode trocar a reserva alvo

Referências: app/admin/agendamentos/view.tsx:21, :25, :35 e :42.

O diálogo guarda apenas o horário. A pessoa exibida e expectedName/expectedPhone são recalculados a partir do último polling. Se a reserva A for cancelada por outra sessão e B reservar o horário, uma confirmação já aberta passa a enviar os dados de B. O servidor aceita porque compara com o estado atual correto, mas não com a intenção original da gestora.

Reprodução React: abrir Ana, clicar Cancelar reserva, atualizar o polling para Bea e confirmar. O POST enviado contém expectedName de Bea. Teste reproduzido.

Correção: capturar ID e versão da reserva ao abrir a confirmação; impedir a ação ou pedir nova confirmação ao detectar mudança. Nome e telefone devem ser informações de exibição, não identidade da reserva.

### 2. Alta: aulas de 1h podem se sobrepor

Referências: lib/scheduling.ts:12; app/api/admin/agendamentos/route.ts:32; app/api/agendamento/route.ts:22.

A chave única protege o início exato. O painel aceita minutos livres e não verifica o intervalo. É possível abrir e reservar 14:00 e 14:30, apesar de ambos representarem aulas de 1h.

Reprodução: adicionar os dois horários e reservar ambos por chamadas isoladas às APIs locais. As quatro operações retornaram 200. Em produção não existem sobreposições atualmente.

Correção: representar início e fim e impor regra contra sobreposição no banco, incluindo inserções simultâneas. Definir se uma única professora/recurso é compartilhada por todos os horários. Apenas consultar antes de inserir não elimina corrida concorrente.

### 3. Alta: gravação concluída com resposta perdida deixa aluno sem confirmação

Referências: app/api/agendamento/route.ts:22; app/agendar/booking.tsx:65.

O POST retorna apenas ok, sem identificador recuperável ou chave de idempotência. Se o banco confirmar e a resposta se perder, o navegador trata como falha. O refresh encontra o horário reservado e desabilita o botão; a pessoa não consegue verificar que a reserva é dela.

Reprodução de navegador: POST simulado grava e aborta a resposta. Nenhuma confirmação aparece; botão fica desabilitado; erro exibido: Failed to fetch. Não foi feita reserva real.

Correção: chave idempotente por tentativa, recibo seguro da reserva, repetição que devolva o mesmo resultado e recuperação após reconexão/recarregamento. Não recuperar uma reserva somente por nome e telefone nem expor dados pessoais em endpoint público.

### 4. Alta: cancelamento antigo pode atingir uma nova reserva da mesma pessoa

Referência: app/api/admin/agendamentos/route.ts:33.

O controle concorrente compara apenas horário, nome e telefone. Uma reserva cancelada e depois refeita pela mesma pessoa possui os mesmos valores. Um comando antigo volta a ser considerado válido, apagando a nova reserva. Esse caso é independente da atualização do diálogo no achado 1.

Reprodução isolada: criar, cancelar, reservar novamente com mesmos dados, repetir o cancelamento antigo. Resultado 200; nova reserva cancelada.

Correção: ID imutável por reserva e revisão monotônica. Exigir a revisão no UPDATE/DELETE e retornar 409 quando a reserva tiver mudado.

### 5. Alta: validação de data/hora administrativa verifica formato, não validade

Referências: app/api/admin/agendamentos/route.ts:12 e :32; app/api/agendamento/route.ts:9.

A API aceita strings como 2035-99-99T25:99. O formulário limita hora/minuto, mas a API precisa validar suas próprias entradas. A coluna de horário é text. No adaptador local a inclusão inválida retorna 200. No PostgreSQL, um valor assim pode fazer a consulta pública inteira falhar ao executar slot::timestamp e devolver 503 para todos os horários.

Correção: validação estrita no servidor, tipo temporal apropriado no banco, regra de fuso e migração que valide os registros existentes. Não aceitar datas normalizadas silenciosamente para outro dia. Revisar também inclusão de horários no passado.

### 6. Média: respostas antigas sobrescrevem disponibilidade recente

Referências: app/agendar/booking.tsx:49 e :64; app/admin/agendamentos/view.tsx:21 e :22.

O intervalo fixo dispara consultas sem aguardar a anterior. A página pública também consulta no foco. Não há cancelamento nem sequência de requisições para ignorar respostas ultrapassadas.

Reprodução no navegador: resposta nova marca reservado; resposta antiga chega depois e o botão do mesmo horário volta a ficar habilitado. O UPDATE atômico ainda impede dupla reserva exata, mas o aluno pode preencher seus dados para uma vaga que já não existe. O painel usa o mesmo padrão de atualização e pode regredir visualmente.

Correção: uma consulta por vez ou sequence token/AbortController, invalidação após mutações e atualização ao retornar para a aba. Separar revisão do banco de ordem de chegada das respostas.

### 7. Média: navegação e edição continuam possíveis durante o POST

Referências: app/agendar/booking.tsx:34, :65 e :121.

A confirmação desabilita o botão principal e os novos atalhos do stepper, mas o botão Voltar para horários segue ativo. A navegação pode avançar para outra seleção durante a requisição. Como a tela final usa estado mutável selected/name e não um recibo retornado pelo servidor, existe risco de exibir seleção diferente daquela submetida. Identificado por inspeção; este cenário específico não foi reproduzido nesta revisão.

Correção: congelar snapshot da tentativa e renderizar confirmação a partir da resposta persistida; bloquear mudança de horário enquanto a operação estiver pendente ou tratar explicitamente seu resultado independente da navegação.

### 8. Média: cancelamento apaga histórico de reserva

Referência: app/api/admin/agendamentos/route.ts:33; lib/scheduling.ts:12.

Cancelar zera nome, telefone e created_at. O modelo mistura disponibilidade e reserva na mesma linha. Não há histórico de quem reservou/cancelou, nem motivo, revisão ou estado cancelado. Isso dificulta resolver relatos de aluno e gestora sobre reservas desaparecidas e implementar recibos/idempotência.

Correção: separar disponibilidade, reservas e histórico de eventos, com identidade, status e timestamps. Aplicar retenção de dados pessoais definida para a operação.

### 9. Média: erros técnicos não são distinguíveis nem correlacionáveis

Referências: app/api/agendamento/route.ts:25; app/api/admin/agendamentos/route.ts:38; app/agendar/booking.tsx:65.

Falha de banco e entrada inválida frequentemente resultam no mesmo HTTP 400; erros são capturados sem logging estruturado. No navegador erros de transporte podem aparecer em inglês. No painel o refresh bem-sucedido limpa o estado de erro, podendo apagar uma falha de ação enquanto o diálogo permanece aberto.

Correção: códigos distintos para validação, conflito e indisponibilidade, identificador da operação, logging sem dados pessoais e mensagens específicas. Separar erro de consulta de erro da ação. Não repetir automaticamente operações não idempotentes.

### 10. Média: agenda pública sem contenção de abuso observável no código

Referência: app/api/agendamento/route.ts:13.

A reserva exige apenas nome e telefone sintaticamente válidos. Não há limite por tentativa/telefone/IP nem confirmação do contato no código revisado. A verificação de Origin não autentica pessoas nem impede clientes automatizados de enviar esse header. Um uso abusivo pode ocupar todas as vagas. Proteções externas da Vercel não foram auditadas; não foi feito teste de abuso.

Correção: contenção proporcional, limitação persistente de tentativas, detecção de padrões e definição se a reserva requer confirmação de contato. Não confiar apenas em limitador na memória de função serverless.

### 11. Baixa a média: atualização do painel depende de polling e data inicial fixa

Referências: app/admin/agendamentos/view.tsx:16 e :22.

O painel abre em novembro de 2026, sem selecionar hoje nem a próxima reserva. Consulta a cada 10s e não tem o listener de foco usado pela página pública. Em aba suspensa, a atualização pode atrasar mais que 10s. A sessão expirada gera mensagem genérica de falha em vez de orientar novo login.

Correção: data inicial baseada no contexto atual, atualização no foco/visibilitychange e após ações, indicação do último sincronismo e tratamento explícito de 401. Tempo real só se a operação exigir; polling correto pode ser suficiente.

## Proteções verificadas

- UPDATE condicional único com name IS NULL e enabled=true protege o mesmo horário exato em PostgreSQL; não há sequência vulnerável de SELECT seguido de UPDATE na reserva pública.
- Teste local com dez tentativas do mesmo início: uma confirmação e nove conflitos 409. Isso testa o adaptador SQLite; a garantia PostgreSQL foi avaliada pela consulta atômica, não por carga no banco real.
- O servidor rejeita confirmação de horário passado no fluxo público usando America/Sao_Paulo; a decisão não depende do relógio do aluno.
- SQL parametrizado; disponibilidade pública não retorna nome ou telefone.
- Leituras retornam no-store e são dinâmicas.
- Remover horário livre usa guarda name IS NULL; não remove reserva existente.
- Inclusão de horário já habilitado não sobrescreve a reserva.
- Falha da inicialização permite nova tentativa; INSERT ON CONFLICT não sobrescreve reservas nem reativa horários desabilitados.
- O WhatsApp é uma continuação opcional. O banco é gravado antes da confirmação, e a reserva não depende do envio da mensagem.

## Ordem recomendada de correção

1. Identidade e versão das reservas; snapshot seguro do cancelamento.
2. Datas válidas, intervalos e proteção contra sobreposição no PostgreSQL.
3. Idempotência, recibo e recuperação de confirmação perdida.
4. Ordenação das consultas e snapshot da tentativa de agendamento.
5. Histórico, erros observáveis, atualização do painel e contenção de abuso.

## Validação após as correções

Usar banco PostgreSQL de teste com o mesmo esquema/migrações de produção. Cobrir concorrência do mesmo início e de inícios sobrepostos, remoção concorrente com reserva, cancelamento/refazimento, resposta perdida e repetida, expiração de sessão, reconexão, inversão de respostas e entrada temporal inválida. Validar que não existam dados pessoais nas respostas públicas ou logs. Testar restauração de backup separadamente antes de declarar recuperação operacional garantida.

## Evidências reproduzíveis

As reproduções locais estão em tests/scheduling-audit.test.ts e tests/scheduling-audit-ui.test.tsx. Os testes AUDIT documentam falhas existentes e esperam o comportamento atual; não representam aprovação de segurança. Devem ser convertidos para testes de regressão com as expectativas corretas ao implementar cada correção.

Comando executado: npx vitest run tests/scheduling-audit.test.ts tests/scheduling-audit-ui.test.tsx. Resultado final: cinco testes passaram, reproduzindo os comportamentos descritos. A primeira execução do teste de diálogo precisou corrigir o harness para capturar exclusivamente o intervalo de polling de 10s; não foi uma falha do aplicativo.

## Implementação posterior à revisão

Os achados acima documentam a versão anterior. As correções estão descritas em docs/agendamento.md e os testes AUDIT foram convertidos em regressões que exigem bloqueio dos problemas. A sessão PostgreSQL inicial não respeitou search_path; um registro sintético foi inserido em public, removido por horário/nome/telefone exatos e a contagem original de 12 horários e zero reservas foi revalidada. O teste foi corrigido para qualificação explícita de objetos, executado com sucesso e a limpeza de schemas e registros sintéticos foi confirmada. Não houve reserva real modificada.
