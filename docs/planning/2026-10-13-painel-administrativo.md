# Painel administrativo de Priscilla Castão
Edição orientada por seções das três campanhas. Navegação lateral por tarefa; editor com campos em português e prévia responsiva. Sem código, JSON, CSS ou edição avançada para o usuário final.

Base adaptada de acssjr/iasmin-psi: lib/cms/auth.ts, store.ts, API de usuários, UsersPanel e Modal. Dados, segredos e identidade de Iasmin não são copiados.

Fluxos: primeiro administrador provisionado pelo responsável; login com usuário e senha; escolher campanha; editar; revisar prévia; salvar rascunho; publicar após conferir as seções alteradas. Publicação guarda a versão anterior. Restaurar cria rascunho antes de republicar. Biblioteca de imagens com upload validado e ajuste de posição. Administradores gerenciam acessos; editores editam e publicam.

Persistência: arquivo local em .cms no desenvolvimento; Neon Postgres em produção, com controle de concorrência por revisão. Cookies assinados, HttpOnly, verificação de origem, senhas com scrypt, limites de tentativas e revogação de sessões.

Validação: testes de autenticação, conteúdo, persistência, publicação e concorrência; typecheck, lint, build; fluxo real no navegador em desktop e celular.
