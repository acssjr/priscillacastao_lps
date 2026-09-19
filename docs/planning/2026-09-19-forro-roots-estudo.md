# Estudo da V3 — aulas de forró roots

Data: 19 de setembro de 2026. Rota proposta: `/forro-roots`. Campanha: `forro-roots`.

## Direção recomendada

A V3 deve apresentar as aulas particulares de forró roots como uma experiência que recebe pessoas em qualquer momento da dança: quem nunca dançou, quem já começou e quem quer aprofundar a prática. A mensagem principal recomendada é:

> **Forró roots para começar, continuar e aprofundar.**

A página não divide o público em caixas rígidas. Ela mostra três possíveis pontos de partida e mantém uma ação principal: agendar uma aula de roots com Priscilla.

## Base factual e limites

Fatos já documentados no projeto:

- Priscilla ensina forró universitário e roots.
- Oferece aulas particulares individuais e em dupla em Salvador.
- Na aula individual, a pessoa não precisa levar par.
- Local, horários e investimento são combinados diretamente com Priscilla.
- Sua linguagem pública aborda base, transferência de peso, musicalidade, presença, comunicação e conexão.
- O WhatsApp é o canal de contato.
- O responsável pelo projeto informou que as aulas de roots atendem iniciantes, iniciados e pessoas de qualquer nível.
- O responsável pelo projeto definiu o jogo de pernas e a conexão entre tronco e quadril como marcas corporais do roots que precisam aparecer na página.

Hipóteses adotadas para o exemplo:

- Os mesmos formatos comerciais das outras páginas também estão disponíveis para a aula específica de roots.
- A aula pode adaptar explicação e prática à experiência relatada pelo aluno.
- “Aprofundar” pode envolver retomar fundamentos, observar detalhes, musicalidade e comunicação. Não se promete conteúdo avançado fixo nem progressão em prazo definido.

Não foram fornecidos preço, duração, calendário, depoimentos autorizados ou um método proprietário. Esses elementos não serão inventados.

## Público e argumento

| Ponto de partida | O que a página reconhece | Resposta da oferta |
|---|---|---|
| Nunca dançou roots | Precisa entender a base e experimentar a dança com orientação | Começar pelos fundamentos, sem precisar levar par na aula individual |
| Já começou | Quer organizar o que aprendeu e praticar com atenção | Retomar base, esclarecer dúvidas e relacionar movimento, música e par |
| Já tem experiência | Quer observar detalhes e ampliar possibilidades | Trabalhar objetivos específicos com acompanhamento individualizado |

O argumento central não é que todas as pessoas precisam da mesma aula. É que o conteúdo parte do momento e do objetivo de cada uma.

## Estratégia de copy

Objetivo da página: levar ao agendamento de uma aula de roots pelo WhatsApp.

Promessa permitida: encontrar um ponto de partida adequado e trabalhar fundamentos do roots com atenção próxima.

Razões para acreditar:

- atenção individual;
- possibilidade de praticar com Priscilla na aula individual;
- conteúdos concretos já associados à atuação pública da professora;
- formatos e próximos passos explicados com clareza.

Tom: direto, acolhedor e corporal. Evitar “do zero ao avançado”, “domine o roots”, “evolução rápida”, “todos os passos” e qualquer linguagem que transforme nível em status.

Alternativas de headline:

1. **Forró roots para começar, continuar e aprofundar.** — recomendada por cobrir todos os momentos sem prometer uma trilha padronizada.
2. **Seu caminho no forró roots pode começar de onde você está.** — mais acolhedora, porém menos direta.
3. **Descubra novas possibilidades no forró roots.** — funciona melhor para quem já dança, mas inclui menos claramente iniciantes.

## Plano de conteúdo

1. **Hero:** nomear forró roots, Salvador, qualquer nível, formatos e contato.
2. **Pontos de partida:** mostrar que começar, continuar e aprofundar são caminhos válidos.
3. **Conteúdo da aula:** jogo de pernas e transferência de peso, conexão entre tronco e quadril, musicalidade e comunicação.
4. **Acompanhamento:** explicar como atenção próxima se adapta a dúvidas e experiência.
5. **Formatos:** individual e dupla, com informações práticas.
6. **Priscilla:** conectar atuação em roots à sua linguagem pedagógica documentada.
7. **Contato:** explicar o que acontece do WhatsApp ao agendamento.
8. **FAQ:** resolver adequação por nível, necessidade de par, conteúdos, local e investimento.
9. **Fechamento:** convidar a pessoa a dizer de onde está partindo.

## Direção visual e interação

**Tese visual:** preservar o sistema bordô e creme, usando o retrato como presença de marca e a imagem de dança roots como contexto real de movimento.

**Tese de interação:** manter a entrada coordenada do hero, o destaque progressivo dos fundamentos, o movimento de profundidade na imagem e as revelações de seção já usadas nas outras campanhas. A V3 não precisa de um novo sistema visual para parecer uma página diferente; a especificidade vem da mensagem.

Cuidados:

- “Para todos os níveis” deve ficar visível na primeira dobra.
- O hero precisa caber com CTA no primeiro viewport móvel comum.
- A imagem de Priscilla dançando roots com outra pessoa exige autorização/crédito já apontados nos documentos do projeto.
- A seção hoje apresentada como benefícios não deve ser chamada de depoimentos.
- A página deve funcionar com movimento reduzido e navegação por teclado, como as versões existentes.

## Métricas e validação

Antes de publicar, apresentar o hero a pessoas com experiências diferentes e perguntar: o que está sendo oferecido, para quem é e o que acontece depois do clique.

Depois da publicação, separar a campanha `forro-roots` nos eventos e acompanhar:

- conversas iniciadas;
- objetivo/nível informado;
- conversas qualificadas;
- aulas agendadas e pagas;
- motivo de não agendamento.

Um clique em WhatsApp não comprova envio, agendamento ou receita. A comparação com V1 e V2 deve considerar que as páginas atendem intenções diferentes.

## Implementação

- Criar `content/landing-pages/forro-roots.ts`.
- Registrar `forro-roots` no catálogo de campanhas.
- Criar `app/forro-roots/page.tsx` com metadados próprios.
- Reutilizar os componentes parametrizados pelas campanhas anteriores.
- Adicionar testes de rota, público, mensagens de WhatsApp e ausência de linguagem exclusiva de iniciantes ou intermediários.
- Validar desktop, mobile, testes, lint, TypeScript e build de produção.

## Pendências para validação com Priscilla

- Confirmar se individual e dupla são os formatos prioritários para roots.
- Confirmar quais fundamentos e objetivos aparecem com mais frequência nessas aulas.
- Confirmar se pessoas que nunca dançaram nenhum tipo de forró e pessoas vindas de outros estilos recebem a mesma oferta.
- Obter informações comerciais e provas autorizadas antes de acrescentá-las.
