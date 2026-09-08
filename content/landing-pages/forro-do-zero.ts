import { LandingCampaignSchema } from "./schema";

const heroImage = {
  src: "/images/priscilla-castao-ensaio-01.webp",
  alt: "Priscilla Castão em movimento durante ensaio de dança",
  width: 1170,
  height: 1560,
};

const methodImage = {
  src: "/images/priscilla-castao-ensaio-02.webp",
  alt: "Priscilla Castão demonstrando expressão corporal no forró",
  width: 1170,
  height: 1560,
};

const aboutImage = {
  src: "/images/priscilla-castao-ensaio-03.webp",
  alt: "Retrato de Priscilla Castão, professora de forró em Salvador",
  width: 1170,
  height: 1560,
};

const proofPoster = {
  src: "/images/priscilla-castao-forro-roots-capa.webp",
  alt: "Priscilla Castão dançando forró roots com um parceiro",
  width: 720,
  height: 1280,
};

export const forroDoZeroCampaign = LandingCampaignSchema.parse({
  id: "forro-do-zero",
  route: "/",
  meta: {
    title: "Aulas particulares de forró em Salvador | Priscilla Castão",
    description: "Aprenda forró do zero em aulas particulares, individuais ou em dupla, com atenção próxima e local combinado em Salvador.",
    ogAlt: "Priscilla Castão apresenta aulas particulares de forró para iniciantes em Salvador.",
  },
  navigation: [
    { label: "Como funciona", target: "#metodo" },
    { label: "Depoimentos", target: "#depoimentos" },
    { label: "Formatos", target: "#aulas" },
    { label: "Sobre Priscilla", target: "#sobre" },
    { label: "Dúvidas", target: "#duvidas" },
  ],
  hero: {
    eyebrow: "Aulas particulares de forró em Salvador",
    title: "Aprenda forró do zero, no seu ritmo.",
    titleHighlight: "do zero,",
    body: [
      "Aula particular, ambiente reservado, explicação no ritmo do aluno, possibilidade de repetir os movimentos com mais calma e você não precisa levar um par.",
    ],
    image: heroImage,
    cta: "AGENDAR MINHA AULA",
    ctaNote: {
      lead: "Priscilla vai entender seu objetivo",
      bridge: "explicar as opções de aula e",
      details: "combinar local, horário e investimento",
    },
    location: "Salvador, Bahia",
  },
  recognition: {
    eyebrow: "Para quem está começando",
    title: "Começar fica mais leve quando você não precisa acompanhar o ritmo de uma turma.",
    body: [
      "Numa aula particular, há tempo para entender o movimento antes de tentar fazê-lo mais rápido.",
      "Você pode perguntar, repetir e ajustar quantas vezes precisar. A aula acompanha o seu momento, sem comparação com outras pessoas.",
      "Na modalidade individual, Priscilla faz o papel de par durante o aprendizado. Você pode começar mesmo que ninguém vá com você.",
    ],
  },
  method: {
    eyebrow: "Como Priscilla ensina",
    title: "Antes de decorar passos, você aprende a base que faz o movimento funcionar.",
    body: [
      "Priscilla mostra como apoiar os pés, transferir o peso, manter o equilíbrio e perceber os sinais do par. Você pratica cada parte com calma antes de juntar tudo na dança.",
    ],
    pillars: [
      {
        title: "Base e equilíbrio",
        body: "Você pratica onde apoiar os pés e como transferir o peso sem perder o equilíbrio durante o passo.",
      },
      {
        title: "Como dançar com o par",
        body: "Você aprende a perceber a condução, responder aos sinais e ajustar a distância para dançar com mais conforto.",
      },
      {
        title: "Como acompanhar a música",
        body: "Você reconhece a marcação da música e pratica como coordenar os passos sem precisar correr para alcançar o ritmo.",
      },
    ],
    image: methodImage,
  },
  proof: {
    eyebrow: "Experiências de alunos",
    title: "Quem começa do zero precisa de tempo para perguntar, praticar e repetir.",
    poster: proofPoster,
    status: "demonstration",
    testimonials: [
      {
        name: "Marina S. · nome fictício",
        quote: "Eu nunca tinha dançado e tinha receio de não acompanhar. Na aula particular, consegui entender cada movimento com calma e perguntar sem pressa.",
        verified: false,
      },
      {
        name: "Carlos M. · nome fictício",
        quote: "A aula me ajudou a perceber a transferência de peso em vez de tentar copiar passos. Quando entendi isso, fiquei mais à vontade para continuar aprendendo.",
        verified: false,
      },
      {
        name: "Ana e Rafael · nomes fictícios",
        quote: "Queríamos aprender juntos, mas cada um tinha uma dificuldade diferente. Priscilla ajustou a aula para que os dois participassem sem um apressar o outro.",
        verified: false,
      },
    ],
    cta: "Quero entender as aulas",
  },
  formats: {
    eyebrow: "Escolha como quer começar",
    title: "A mesma atenção próxima, em dois formatos particulares.",
    note: "O local, os horários e o investimento são combinados depois que Priscilla entende a necessidade de vocês.",
    alternative: {
      key: "grupo-workshop",
      title: "Precisa de uma aula em grupo ou workshop?",
      cta: "CONVERSAR SOBRE GRUPO OU WORKSHOP",
    },
  },
  offers: [
    {
      key: "individual",
      title: "Aula particular individual",
      audience: "Para quem quer começar sozinho, receber atenção integral e avançar no próprio ritmo.",
      body: "A aula acontece entre você e Priscilla. Você não precisa levar par, e cada explicação pode ser ajustada ao que o seu corpo precisa entender naquele momento.",
      primary: true,
      cta: "Conversar sobre aula individual",
    },
    {
      key: "dupla",
      title: "Aula particular em dupla",
      audience: "Para duas pessoas que já querem aprender juntas.",
      body: "Priscilla acompanha os dois alunos, observa a comunicação da dupla e ajusta os fundamentos às necessidades de cada pessoa.",
      primary: false,
      cta: "Conversar sobre aula em dupla",
    },
  ],
  about: {
    eyebrow: "Quem é Priscilla Castão",
    title: "Uma professora que trata o forró como movimento, escuta e comunicação.",
    body: [
      "Priscilla Castão é professora de forró universitário e roots. Em suas aulas e conteúdos, ela trabalha consciência corporal, transferência de peso, musicalidade e a comunicação que acontece entre duas pessoas enquanto dançam.",
      "Ela descreve sua trajetória como uma construção feita com estudo, treino e troca com os alunos. Essa escuta orienta uma aula próxima, na qual a explicação pode mudar conforme a necessidade de quem está aprendendo.",
      "Para quem começa do zero, isso significa aprender fundamentos antes de se preocupar em acompanhar uma turma ou acumular passos.",
    ],
    image: aboutImage,
  },
  process: {
    eyebrow: "Como começar",
    title: "A primeira conversa ajuda Priscilla a entender qual aula faz sentido para você.",
    steps: [
      { title: "Chame no WhatsApp", body: "A mensagem já informa que você veio pela página de aulas para iniciantes." },
      { title: "Conte o que procura", body: "Priscilla pergunta sobre seu objetivo, experiência e formato de interesse." },
      { title: "Combine o local", body: "O atendimento é em Salvador, e o local é definido conforme a necessidade." },
      { title: "Veja horários e investimento", body: "Essas informações são apresentadas depois que ela entende a aula procurada." },
      { title: "Agende a aula", body: "Com os detalhes combinados, vocês escolhem o próximo passo." },
    ],
  },
  faq: {
    eyebrow: "Dúvidas comuns",
    title: "O que você precisa saber antes de conversar com Priscilla.",
    items: [
      { question: "Preciso saber dançar?", answer: "Não. Esta página apresenta as aulas para quem quer começar do zero. Priscilla ajusta as explicações ao seu nível de experiência." },
      { question: "Preciso levar um par?", answer: "Não para a aula individual. Priscilla acompanha você durante os exercícios e o aprendizado." },
      { question: "Posso fazer aula com outra pessoa?", answer: "Sim. A aula em dupla atende duas pessoas que já querem aprender juntas." },
      { question: "Onde acontecem as aulas?", answer: "O atendimento presencial é em Salvador. O local exato é combinado diretamente com Priscilla conforme a necessidade." },
      { question: "Quanto custa?", answer: "Priscilla informa o investimento depois de entender seu objetivo, o formato desejado e a disponibilidade. Assim, a conversa começa pela aula que você procura." },
      { question: "Como funciona o primeiro contato?", answer: "Você envia uma mensagem curta pelo WhatsApp. Priscilla conversa sobre sua experiência, objetivo, formato, local e horários antes do agendamento." },
    ],
  },
  closing: {
    eyebrow: "Seu primeiro passo",
    title: "Você pode aprender forró com tempo para entender, repetir e ganhar segurança.",
    body: [
      "Conte a Priscilla o que você procura. Ela vai explicar as aulas particulares e combinar com você o formato, o local, os horários e o investimento.",
    ],
    cta: "AGENDAR MINHA PRIMEIRA AULA",
  },
  whatsapp: {
    phone: "5575981234176",
    messages: {
      individual: "Oi, Priscilla! Vim pela página de aulas e quero agendar uma aula particular individual. Estou começando do zero e gostaria de saber sobre locais, horários e valores.",
      dupla: "Oi, Priscilla! Vim pela página de aulas e quero agendar uma aula particular em dupla. Gostaria de saber sobre locais, horários e valores.",
      "grupo-workshop": "Oi, Priscilla! Vim pela página de aulas e gostaria de conversar sobre uma aula em grupo ou workshop. Pode me explicar os formatos, a disponibilidade e os valores?",
    },
  },
});
