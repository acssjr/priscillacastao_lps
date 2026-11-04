# Agendamento de aulas

Público: https://agendamento-priscilla.vercel.app (reescreve / para /agendar). Gestão: /admin/agendamentos.

## Integridade e funcionamento

O PostgreSQL Neon é a fonte de verdade de produção. SQLite é usado somente no desenvolvimento sem DATABASE_URL, sem compartilhar dados com produção.

A tabela de horários mantém compatibilidade com os registros existentes. A inicialização adiciona start_at, version, booking_id e request_id; as migrações são serializadas por advisory lock em transação. A exclusão GiST em intervalos de 1h impede horários habilitados sobrepostos, inclusive em inclusões simultâneas. O servidor valida datas reais e rejeita abertura ou reserva de horários passados, no fuso America/Sao_Paulo.

Reservas e alterações usam condições atômicas. Cancelamento exige ID e versão capturados ao abrir o detalhe. Se o polling mudar a reserva, a confirmação é bloqueada. A chave de tentativa pública é única e aleatória, guardada na sessão do navegador enquanto o resultado estiver pendente. Ela permite recuperar o recibo após perda de resposta e recarregamento, sem divulgar nome ou telefone. Uma tentativa ainda não resolvida não permite trocar de horário. Recibos cancelados não se tornam confirmações novas.

priscilla_booking_receipts guarda chave privada, ID, horário, status e criação. priscilla_booking_events registra abertura, reserva, cancelamento e remoção com ID, versão e data, sem duplicar nome e telefone no histórico. Dados pessoais continuam na reserva atual e são apagados ao cancelar. O histórico não é uma ferramenta de restauração de dados pessoais.

Limitação persistente de tentativas usa identificadores SHA-256 e janelas de 10 minutos: 8 tentativas por telefone, 100 por origem de rede e 60 consultas de recuperação por origem. Entradas expiradas são limpas. Isso reduz abuso sem exigir cadastro; não comprova propriedade do telefone. A confirmação continua independente do envio opcional de WhatsApp. Não há notificação automática de reserva ou cancelamento.

## Abrir horários

No painel, Novo horário permite escolher data e um início, ou uma sequência de aulas de 1h. Na sequência, o fim indica o término da última aula: 14h até 17h abre 14h, 15h e 16h. Todos os horários são inseridos em uma transação: conflito ou entrada inválida cancela o grupo inteiro. Para cadastrar uma pessoa manualmente, use um horário por vez; nome é obrigatório para reservar, telefone é opcional na gestão.

## Sincronização e erros

As consultas são sem cache, a cada 10 segundos e ao retornar à página. Respostas antigas são descartadas. Ações retornam estado atualizado e invalidam consultas anteriores. Erros de consulta e de alteração são separados. O painel mostra último sincronismo, confirmação de alterações e opção de entrar novamente em caso de sessão expirada.

Erros HTTP: 400 entrada inválida, 401 sessão expirada, 403 origem inválida, 409 conflito/versão antiga/sobreposição, 413 corpo excessivo, 429 limite temporário, 503 indisponibilidade. Erros inesperados geram referência e código técnico no log sem nome/telefone. Na página pública, interrupção de confirmação orienta consultar o recibo antes de tentar outra reserva.

## Testes

npm test: regressões locais, validação, cancelamentos antigos, exclusão de intervalos, atomicidade de grupos, limitação e UI da gestora.
npx playwright test --config playwright.scheduling.config.ts: disponibilidade, conflito, respostas fora de ordem, bloqueio durante envio e recuperação após resposta perdida/recarregamento. Requer localhost:3002.

Teste PostgreSQL opt-in: RUN_SCHEDULING_PG=1 e tests/scheduling-postgres.test.ts. Requer arquivo local .impeccable/scheduling-test.env com DATABASE_URL; nunca versionar esse arquivo. Cria schema scheduling_test_<uuid>, qualifica explicitamente todos os objetos SQL para impedir fallback ao public e remove o schema ao terminar. Não usa search_path como proteção de isolamento.

Backups, retenção e restauração do provedor devem ser verificados operacionalmente; os testes de integridade não substituem um teste de restauração.
