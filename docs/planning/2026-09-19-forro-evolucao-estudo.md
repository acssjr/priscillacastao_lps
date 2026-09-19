# Estudo da segunda landing page — evolução no forró

Data: 19 de setembro de 2026. Base: `main`, sincronizada com `origin/main`, commit `10ed188`.

**Recomendação:** criar uma página específica para pessoas que já dançam forró, do básico ao intermediário, apresentando a aula particular como uma oportunidade de trabalhar a dança que elas já construíram. A mensagem principal é **“Dê mais fluidez ao forró que você já dança.”**

Este é um estudo de posicionamento, conversão, estrutura e linguagem. A proposta completa de textos está em [Copy da segunda versão](../content/2026-09-19-forro-evolucao-copy.md). A nova campanha ainda não foi implementada. O código da página atual foi atualizado a partir do remoto.

## 1. Base da recomendação

### O que está sustentado pelas fontes do projeto

| Informação | Fonte | Consequência para a V2 |
|---|---|---|
| Aulas particulares em Salvador, individuais ou em dupla; local, horário e investimento combinados por WhatsApp | [Copy aprovada da V1](../content/forro-do-zero-copy.md) e [campanha atual](../../content/landing-pages/forro-do-zero.ts) | Manter a oferta real; adaptar sua apresentação ao novo público. |
| Na aula individual não é necessário levar par | Mesmas fontes | Responder essa dúvida nos formatos e no FAQ; ela deixa de ser a principal mensagem do hero. |
| Trabalho com base, transferência de peso, musicalidade e comunicação; forró universitário e roots | Campanha atual e [pesquisa de Instagram de 06/09](../research/instagram-priscilla-castao.md) | Explicar como esses conteúdos se relacionam à qualidade da dança de quem já pratica. |
| Voz pública valoriza escuta, presença, compreensão do movimento e liberdade | Pesquisa de Instagram já registrada no projeto | Usar linguagem próxima, específica e respeitosa com a experiência do aluno. |
| A versão atual se apresenta explicitamente como uma página para iniciantes | Código e página renderizada em localhost, conferidos após a atualização | Reescrever toda a jornada, inclusive mensagens de WhatsApp e textos de acessibilidade. |

### Hipóteses que este estudo adota

- O público quer melhorar sua experiência no baile e na dança a dois. Fluidez, musicalidade e conexão são a ênfase inicial; a frequência real de cada objetivo ainda precisa ser confirmada com Priscilla.
- Parte das visitas pode vir do Instagram e de indicações, como previsto no planejamento existente. Não foi consultado um relatório de aquisição.
- Os formatos comerciais da V1 continuam disponíveis para esse público. Não se assume pacote, duração, desconto, avaliação gratuita, suporte entre aulas ou prazo para resultado.
- “Básico” e “intermediário” são referências de identificação. Não há um critério formal de nivelamento fornecido.

Não foram encontrados, nos materiais examinados, resultados documentados de alunos que permitam prometer evolução em um número de aulas. O carrossel atual apresenta benefícios do atendimento; não contém depoimentos de alunos.

## 2. Diagnóstico com Schwartz

| Dimensão | Diagnóstico de trabalho | Implicação |
|---|---|---|
| Desejo dominante | Aproveitar mais a própria dança, com liberdade para se mover e se comunicar | Mostrar uma experiência desejada e compreensível: ligar movimentos, perceber a música e interagir com o par. |
| Consciência | **Consciente da solução**, nível 3 na classificação da skill | A pessoa conhece aulas de dança; precisa entender a utilidade desta aula particular para seu momento. |
| Variações de consciência | Seguidores que conhecem Priscilla podem estar conscientes do produto; outros reconhecem só uma dificuldade | A abertura precisa funcionar sem conhecimento prévio da professora e apresentar rapidamente sua forma de ensinar. |
| Sofisticação | Hipótese de estágio 3: necessidade de explicar o mecanismo por trás da promessa | Demonstrar observação, orientação e prática, sem inventar um “método exclusivo”. |
| Lead | Promessa específica, seguida de identificação e explicação | Abrir com fluidez na dança já existente; concretizar imediatamente o que será trabalhado. |

O nível de dança não determina o nível de consciência de compra. Saber dançar não significa conhecer Priscilla, seu serviço ou os benefícios de uma aula particular.

A hipótese de sofisticação vem de uma amostra exploratória, não de pesquisa representativa. O [site de Géssica Barreto](https://gessicabarreto.com/) já apresenta consciência corporal, autonomia, aulas particulares adaptadas às demandas e depoimentos. O [perfil comercial Aula de Forró Salvador no Wellhub](https://wellhub.com/pt-br/search/partners/aula-de-forro-salvador/) distingue praticantes de iniciantes e comunica aperfeiçoamento de movimentos, musicalidade e conexão. Consultados em 19/09/2026.

**Inferência:** esse vocabulário é relevante para a categoria, mas não constitui exclusividade de Priscilla. O diferencial comunicável precisa aparecer na sua didática e na experiência de acompanhamento. Essa amostra não prova que os visitantes estejam saturados de anúncios ou insatisfeitos com outros professores.

## 3. Público e proposta de valor

| Situação | Necessidade que a página pode reconhecer | Linguagem indicada |
|---|---|---|
| Já conhece a base e alguns movimentos | Ganhar continuidade e clareza ao dançar com outra pessoa | “Ligar os movimentos com mais fluidez.” |
| Já frequenta bailes e tem repertório | Trabalhar a qualidade das transições, a relação com a música e a comunicação | “Explorar os movimentos que você já conhece e perceber novos ajustes.” |
| Dança com frequência com a mesma pessoa | Entender a interação entre os dois e trabalhar dificuldades da dupla | “Atenção à dança de cada pessoa e à comunicação entre vocês.” |

Essas situações são hipóteses de reconhecimento para a copy, não relatos reais de clientes. Não atribuir automaticamente vergonha, estagnação ou falta de talento ao público. Também não exigir tempo mínimo de prática ou conhecimento de passos específicos sem critério fornecido pela professora.

**Proposta de valor:** aulas particulares de forró para quem já dança e quer trabalhar base, musicalidade e comunicação com orientação próxima, levando em conta sua experiência e seus objetivos.

**Por que considerar a aula particular:** poder dedicar atenção a movimentos, dúvidas e ajustes específicos da própria dança. A página deve explicar esse valor sem depreciar aulas coletivas, outros professores ou o repertório que o aluno já aprendeu.

## 4. Aplicação de Revenue-Centric Design

| Princípio aplicado | Decisão para a V2 | Efeito esperado a validar |
|---|---|---|
| Definir público e consciência antes do design | Identificar quem já dança logo na abertura; manter Salvador visível | Reduzir dúvidas sobre adequação da aula. |
| Clareza do hero em poucos segundos | Serviço, público, benefício e localização na primeira seção | Permitir que o visitante explique o que está sendo oferecido. |
| Qualificação por especificidade | Exemplos de fluidez, música e comunicação; individual e dupla bem descritas | Gerar conversas com objetivos mais claros. |
| Diferenciação pelo mecanismo | Explicar o que Priscilla observa e orienta; mostrar um exemplo real quando disponível | Tornar a atenção individual concreta. |
| Evidência proporcional à promessa | Usar imagens como apresentação; incluir demonstração didática e depoimentos somente quando reais | Sustentar confiança sem promessas de velocidade ou superioridade. |
| CTA explica o próximo passo | “Conversar sobre as aulas” + WhatsApp, local, horários e valores | Alinhar expectativa: o clique abre uma conversa, não confirma uma reserva. |
| Um caminho principal de decisão | WhatsApp como ação principal; individual e dupla como escolhas de formato | Evitar dispersão entre objetivos comerciais diferentes. |
| Medir valor para o negócio | Acompanhar conversas qualificadas, aulas pagas e receita | Evitar escolher uma copy apenas por aumentar cliques. |

Essas são hipóteses de design e conversão. Nenhuma taxa de melhoria foi estimada ou transferida dos exemplos das skills para este negócio.

Não transformar a falta de preço no material em uma tática de persuasão. Por ora, informar claramente que os valores são explicados no WhatsApp. Se houver tabela estável e autorizada, exibi-la junto aos formatos pode reduzir incerteza e deve ser considerado.

## 5. Estrutura recomendada

| Ordem | Seção | Pergunta que resolve |
|---|---|---|
| 1 | Hero: benefício, público, serviço, cidade e CTA | Esta aula faz sentido para alguém como eu? |
| 2 | Reconhecimento: objetivos de quem já dança | O que posso trabalhar na minha dança? |
| 3 | Ensino: base, musicalidade e comunicação | Como esses conteúdos se relacionam ao que quero melhorar? |
| 4 | Acompanhamento: olhar, orientação e prática | O que torna a atenção individual útil? |
| 5 | Formatos: individual e dupla | Qual formato atende meu objetivo? |
| 6 | Priscilla: atuação e abordagem | Quem vai me acompanhar? |
| 7 | Contato: três etapas simples | O que acontece depois do clique? |
| 8 | FAQ: nível, conteúdo, par, local e investimento | O que ainda preciso esclarecer? |
| 9 | Convite final | Como conversar sobre a minha aula? |

Quando existir uma demonstração didática real, posicioná-la junto à seção de ensino/acompanhamento, antes dos formatos. Sem esse material, publicar uma explicação do atendimento com imagem de apresentação corretamente descrita. Não inserir um player sem vídeo ou chamar a imagem de “resultado de aluno”.

### Direção visual

Manter a identidade atual: bordô, creme, acentos terracota, retratos da professora e linguagem de movimento. A mudança prioritária é de comunicação e hierarquia.

- Dar destaque tipográfico a “mais fluidez”. O trecho “que você já dança” precisa continuar claramente legível.
- Trocar os dois pontos de apoio do hero por “Atenção ao seu nível e objetivo” e “Individual ou em dupla”. São informações de oferta, não prova social.
- Usar um retrato existente enquanto não houver imagem adequada de prática. Preferir, futuramente, uma cena real de orientação com autorização das pessoas retratadas.
- Deixar os três temas da aula escaneáveis. Uma frase útil de cada tema deve ficar visível sem depender de abrir um acordeão.
- Para o conteúdo que explica o acompanhamento, preferir três blocos estáticos curtos a um carrossel automático. A leitura da explicação deve estar sob controle do visitante.
- Reservar maior contraste à ação de WhatsApp. Links de navegação e aprofundamento têm menor peso visual.
- Conferir que o botão fixo no celular não cobre o FAQ, o rodapé ou os controles de consentimento. Testar a quebra da nova headline e do CTA em telas pequenas.

## 6. Adaptação da linguagem em toda a jornada

| Área | Enquadramento atual | Direção V2 |
|---|---|---|
| Hero | Aprender do zero | Dar mais fluidez ao forró que já dança |
| Identificação | Quem está começando | Experiência existente e objetivos de evolução |
| Fundamentos | Aprender a base antes dos passos | Refinar base e transferência de peso na dança já praticada |
| Musicalidade | Entender onde o movimento entra na música | Relacionar movimentos, marcação e variações musicais |
| Comunicação | Como dançar com o par | Clareza na condução, na resposta e na interação |
| Benefício da atenção | Repetir sem pressa | Observar detalhes, esclarecer dúvidas e praticar ajustes |
| Individual | Começar sozinho | Trabalhar objetivos próprios sem precisar levar par |
| Dupla | Aprender juntos | Trabalhar cada dança e a comunicação entre os dois |
| FAQ | “Preciso saber dançar?” | “Tenho só a base. A aula é para mim?” e “Já faço aulas. O que posso trabalhar?” |
| CTA | Agendar primeira aula | Conversar sobre as aulas e entender a oferta |
| WhatsApp | “Estou começando do zero” | “Já danço forró e quero melhorar minha dança” |
| Rodapé, SEO e acessibilidade | Para iniciantes | Para quem já dança; básico e intermediário |

Evitar: “destrave de vez”, “domine qualquer par”, “vire referência no salão”, “você dança errado”, “método revolucionário”, “resultado garantido” e “evolução em X aulas”. “Subir de nível” sozinho também é pouco informativo. Preferir ações que a pessoa reconhece na prática.

## 7. Provas e informações a obter

| Material/informação | Uso proposto | Situação |
|---|---|---|
| Trecho real em que Priscilla explica um ajuste e demonstra sua aplicação | Mostrar a didática junto ao conteúdo de ensino | Ainda não foi selecionado um vídeo que cumpra essa função. |
| Depoimento de pessoa que já dançava antes das aulas | Mostrar objetivo inicial, trabalho realizado e mudança percebida | Depoimento e autorização não fornecidos para esta V2. |
| Dúvidas e objetivos recorrentes dos interessados | Priorizar a promessa e o FAQ com vocabulário real | Validar com Priscilla, sem tratar hipóteses como entrevistas. |
| Preço, duração, disponibilidade e política de agendamento | Completar a decisão comercial | Não inventar; usar somente informações confirmadas. |

Para uma futura gravação, o roteiro sugerido é: apresentar uma situação da dança, explicar um ajuste, demonstrá-lo e dizer o que observar ao praticar. Isso é uma sugestão de material de comunicação, não a afirmação de que toda aula tem um protocolo fixo.

## 8. Validação e métricas

**Primeiro, clareza:** apresentar a abertura a cerca de cinco pessoas do público pretendido e perguntar o que está sendo oferecido, para quem, o que elas esperariam trabalhar e o que acham que acontece ao clicar. É uma avaliação qualitativa, não comprovação estatística de conversão.

**Depois, resultado comercial:** registrar, por campanha e período, conversas iniciadas, conversas qualificadas, aulas agendadas, aulas pagas e receita. Considerar qualificada a conversa de alguém que já dança, busca aperfeiçoamento e tem interesse compatível com formato e atendimento em Salvador. Registrar motivo de não agendamento ajuda a separar problemas de copy, preço, agenda e localização.

- Taxa de qualificação = conversas qualificadas / conversas recebidas identificadas com a campanha.
- Conversão comercial = novos alunos com aula paga / conversas qualificadas no mesmo grupo acompanhado.
- Com mídia paga: custo por novo aluno pagante = investimento atribuído / novos alunos pagantes atribuídos.

Definir uma janela de acompanhamento antes da comparação e contabilizar pessoas sem duplicar mensagens. Não contar cada mensagem de WhatsApp como novo interessado.

O código atual envia eventos para `dataLayer` quando há consentimento e inclui o identificador da campanha. Um clique em WhatsApp não comprova envio de mensagem, agendamento ou pagamento. A existência dessa camada também não comprova que relatórios externos estejam configurados. A atribuição posterior precisa de registro operacional; não enviar nomes, telefones ou conteúdo de conversas para os eventos do site.

V1 e V2 atendem públicos diferentes. Comparar suas taxas brutas não constitui um teste A/B válido da copy. Se houver volume suficiente, testar duas aberturas da V2 com distribuição aleatória dentro do mesmo público, mantendo oferta e condições equivalentes. Sem esse volume, priorizar compreensão qualitativa e qualidade das conversas.

## 9. Mapa para implementação posterior

Recomendação de rota: `/evolua-no-forro`. Identificador da campanha: `forro-evolucao`. Manter a página de entrada para iniciantes como campanha própria; encaminhar cada divulgação para a página adequada ao público.

| Ponto do projeto | Adaptação necessária |
|---|---|
| `content/landing-pages/` e `registry.ts` | Adicionar uma campanha própria e todos os textos da V2. |
| Nova rota em `app/` | Carregar a campanha nova e seus metadados. A rota é proposta, ainda não existe. |
| `app/layout.tsx` | Revisar a descrição global para não impor a mensagem de iniciantes à V2; preferir metadados específicos por rota. |
| `Hero.tsx` | Usar o novo título e destaque; verificar quebra, título acessível e microtexto. |
| `Recognition.tsx` | Parametrizar o rótulo acessível atualmente fixo em “quem está começando”. |
| `Method.tsx` | Parametrizar a expressão destacada hoje fixa em “você aprende a base”; a V2 precisa de outro trecho. |
| `Proof.tsx` | A seção atual tem ID `depoimentos`, mas mostra benefícios. Dar nome e ID coerentes; integrar prova real apenas quando disponível. |
| `SiteHeader.tsx` e `MobileMenu.tsx` | Tornar os CTAs configuráveis pela campanha. |
| `MobileStickyCta.tsx` | Remover o texto fixo “Aula particular para iniciantes” da V2, incluindo o nome acessível do link. |
| `SiteFooter.tsx` e `LandingPage.tsx` | Permitir descrição do rodapé por campanha; hoje o rodapé não recebe a campanha. |
| `schema.ts` | Acrescentar os campos necessários para textos compartilhados, destaques e acessibilidade, preservando a V1. |
| Mensagens de WhatsApp | Acrescentar uma mensagem geral para os CTAs sem formato escolhido e substituir as mensagens de individual, dupla e grupo/workshop. |
| Eventos e testes existentes | Identificar a campanha; testar que as mensagens abrem o destino correto e que a V2 não herda rótulos de iniciantes. |

Critérios de conclusão da futura implementação: copy consistente de ponta a ponta; visual desktop/mobile legível; teclado e movimento reduzido funcionando; links de WhatsApp com texto adequado; título/descrição/compartilhamento próprios; V1 preservada; evidências e oferta revisadas com os materiais reais.

## 10. Referências e limites

- [Revenue-Centric Design — skill utilizada](<C:/Users/Antônio/.codex/skills/revenue-centric-design/SKILL.md>): referências de conversão, posicionamento e experimentação.
- [Schwartz Copy — skill utilizada](<C:/Users/Antônio/.codex/skills/schwartz-copy/SKILL.md>): diagnóstico de consciência, sofisticação, desejo e estratégia de abertura.
- [Pesquisa pública de Priscilla, 06/09/2026](../research/instagram-priscilla-castao.md): fonte documental para sua linguagem; a tentativa de consultar o Instagram novamente nesta sessão foi limitada pelo serviço, portanto não se afirma nova verificação das publicações.
- [Copy aprovada da V1](../content/forro-do-zero-copy.md) e [campanha do site](../../content/landing-pages/forro-do-zero.ts): base factual da oferta.
- [Géssica Barreto](https://gessicabarreto.com/) e [Aula de Forró Salvador](https://wellhub.com/pt-br/search/partners/aula-de-forro-salvador/): amostra exploratória da linguagem de ofertas locais, consultada em 19/09/2026. Ofertas e depoimentos desses serviços não foram atribuídos a Priscilla.

O estudo resulta em uma direção recomendada e copy revisável. Não constitui validação de demanda, teste de conversão, comprovação de resultado pedagógico ou confirmação da disponibilidade comercial atual.
