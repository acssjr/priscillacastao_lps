# Agendamento de aulas

A página pública fica em `/agendar`; a gestão fica em `/admin/agendamentos`, protegida pela conta do painel. Os horários iniciais correspondem a 8, 9 e 10 de novembro de 2026, no horário de Brasília. O painel permite adicionar horários, remover horários livres e cancelar reservas.

No desenvolvimento, sem `DATABASE_URL`, a agenda usa o banco SQLite persistente em `.cms/appointments.sqlite` (Node.js 22.5 ou superior). Os dados locais não são compartilhados com o site publicado. Para produção, configure `DATABASE_URL` com um banco PostgreSQL Neon persistente e `ADMIN_SESSION_SECRET` conforme `.env.example`, e prepare a conta do painel seguindo o README. O banco precisa permitir criação de tabelas. A tabela `priscilla_appointments` é criada e preenchida na primeira consulta; o banco deve estar acessível para agendar.

A disponibilidade é atualizada a cada dez segundos e quando a janela recebe foco. A confirmação é feita por atualização condicional no banco, evitando que duas pessoas reservem o mesmo horário. Não há envio automático de e-mail, WhatsApp ou sincronização com calendários externos; a gestora consulta os dados na agenda e entra em contato. Cancelamentos no painel liberam o horário sem notificar a pessoa.
