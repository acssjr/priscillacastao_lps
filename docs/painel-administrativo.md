# Painel administrativo

## Uso
Acesse /admin e entre com usuário e senha. O primeiro administrador é cadastrado pelo responsável técnico; novos acessos são criados dentro do painel em Usuários > Adicionar usuário. /admin/ativar apenas redireciona para o login.
O painel controla Forró do zero, Evolua no forró e Forró roots. A tela inicial é Editar no site: o site real ocupa a área de trabalho, com um painel de controles sincronizado.

1. Escolha a página em edição e a visualização Computador ou Celular. Zoom permite ajustar à tela ou usar o tamanho real.
2. Clique em um texto no site e escreva ali mesmo. O campo correspondente aparece em Você selecionou. Também é possível escrever nesse campo; o site acompanha a alteração. A edição preserva maiúsculas/minúsculas e quebras de linha do conteúdo, aceita apenas texto ao colar e mantém o cursor durante a sincronização.
3. Use Parte do site para escolher/localizar uma seção. Mensagem principal, botões, listas e fotos têm grupos próprios. Textos, contato, configurações para busca e rótulos não visíveis também podem ser alterados nos controles.
4. Use Alterar foto sobre a imagem ou Trocar imagem no controle para escolher uma original ou enviar uma nova. Arraste o ponto de foco, use as setas do teclado ou os presets para ajustar o enquadramento; confira também no celular. Descreva a foto no campo de descrição acessível.
5. Perguntas e pilares ficam abertos enquanto você edita seus textos. Explorar prévia desativa a edição e permite experimentar os acordéons, carrosséis e menu. Os links externos permanecem bloqueados no canvas.
6. Desfazer/Refazer recuperam alterações desta sessão. Restaurar em um campo recupera seu conteúdo original. Salvar rascunho guarda as alterações para continuar depois.

Ver prévia mostra as alterações privadas, ainda não publicadas, em computador ou celular. Salvar rascunho permite continuar depois. Publicar pede a revisão das páginas e seções alteradas e confirma o sucesso somente após resposta do servidor.
Histórico guarda as últimas 30 versões anteriores. Recuperar uma versão substitui o rascunho das três páginas; publicar é uma ação separada.
Usuários permite criar editores ou administradores, trocar permissões, redefinir senhas e revogar acessos. O último administrador ativo é protegido.
Minha conta permite alterar a própria senha; isso invalida outras sessões. Não há recuperação por e-mail configurada: outro administrador pode redefinir a senha.

## Desenvolvimento
Execute npm run admin:prepare para configurar o segredo de sessão. Abra /admin uma vez para inicializar o armazenamento e execute npm run admin:create. A conta admin é criada com senha aleatória, entregue em .cms/admin-local.txt. Uma conta admin existente é preservada; o comando não redefine sua senha.
.cms guarda conteúdo e imagens localmente e está fora do Git. Não copie os dados de Iasmin ou suas variáveis para este projeto.

## Produção
Configure DATABASE_URL apontando para um banco Neon dedicado a este projeto, ADMIN_SESSION_SECRET com pelo menos 32 caracteres. Após inicializar o armazenamento, execute npm run admin:create no ambiente técnico com DATABASE_URL do projeto para cadastrar o primeiro administrador. A senha inicial fica no arquivo privado .cms/admin-producao.txt e pode ser alterada em Minha conta.
O CMS cria as tabelas priscilla_cms e priscilla_media no primeiro acesso; use uma credencial autorizada a criar essas tabelas. Conteúdo e imagens persistem no banco e não dependem do disco temporário da hospedagem.
O modo local é bloqueado em produção. Quando o armazenamento não está configurado, o site mantém o conteúdo original e o painel informa indisponibilidade.
Altere variáveis apenas na configuração privada da hospedagem. Não versione segredos. A publicação pelo painel altera o conteúdo sem novo deploy.
Faça backup periódico das duas tabelas. A alteração de conteúdo usa controle otimista de revisão; em conflito, atualize o painel antes de continuar.

## Base reutilizada
Edição visual, comunicação entre canvas e controles, enquadramento, navegação GSAP, estados de acesso/publicação, sorteio de forró, autenticação, persistência, controle de revisão, gestão de usuários e diálogo adaptados do painel autorizado em https://github.com/acssjr/iasmin-psi (156c38d).
O editor foi adaptado à estrutura das campanhas de Priscilla. Não inclui edição avançada, edição de código ou os módulos específicos de psicologia.



## Validação da edição visual
O teste npm run test:admin usa armazenamento temporário e uma porta própria, sem editar os dados locais do usuário. Exercita escrita direta com teclado, sincronização nos dois sentidos, destaque do título, desfazer/refazer, perguntas, prévia, três campanhas, rascunho separado do publicado, publicação confirmada, recuperação de histórico, upload, posição de foto com teclado, novo usuário, navegação móvel e acessibilidade. Testes do catálogo rejeitam caminhos protegidos ou desconhecidos recebidos por mensagens do canvas.

A lateral tem preferência de recolhimento independente da de Iasmin, transição GSAP e suporte a movimento reduzido. O carregamento informa verificação de acesso e abertura do painel; a publicação mostra confirmação, operação pendente e sucesso real. O editor não reproduz as animações de entrada do site durante a escrita, seguindo o comportamento do editor de Iasmin; a landing pública continua com suas animações.
