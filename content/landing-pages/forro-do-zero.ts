import { LandingCampaignSchema } from "./schema";

const heroImage = {
  src: "/images/cutouts/priscilla-castao-ensaio-03-cutout.webp",
  alt: "Priscilla Castão em pose de forró com um braço estendido",
  width: 1086,
  height: 1449,
};

const methodImage = {
  src: "/images/cutouts/priscilla-castao-ensaio-02-cutout.webp",
  alt: "Priscilla Castão demonstrando expressão corporal no forró",
  width: 1170,
  height: 1560,
};

const aboutImage = {
  src: "/images/priscilla-castao-instagram-DYf07MJEQ9z-01.webp",
  alt: "Retrato de Priscilla Castão, professora de forró em Salvador",
  width: 900,
  height: 1200,
};

const proofPoster = {
  src: "/images/cutouts/priscilla-castao-forro-roots-cutout.webp",
  alt: "Priscilla Castão dançando forró roots com um parceiro",
  width: 941,
  height: 1672,
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
    { label: "Início", target: "#inicio" },
    { label: "Método", target: "#metodo" },
    { label: "Aulas", target: "#aulas" },
    { label: "Sobre", target: "#sobre" },
    { label: "Dúvidas", target: "#duvidas" },
  ],
  ui: {
    headerCta: "AGENDAR",
    mobileMenuCta: "AGENDAR MINHA AULA",
    recognitionAriaLabel: "Como a aula ajuda quem está começando",
    footerDescription: "Aulas particulares de forró para iniciantes em Salvador.",
    footerMethodLabel: "Como funciona",
    sticky: {
      title: "Aula particular para iniciantes",
      note: "Não precisa levar par.",
      ariaLabel: "AGENDAR AULA",
      mobileLabel: "AGENDAR MINHA AULA",
      desktopLabel: "AGENDAR AULA",
    },
  },
  hero: {
    eyebrow: "Aulas particulares de forró em Salvador — BA",
    title: "Aprenda forró do zero com acompanhamento individualizado.",
    titleEmphasis: "forró do zero",
    body: [
      "Você aprende a base com Priscilla, pratica com ela e repete cada movimento quantas vezes precisar.",
    ],
    proofPoints: [
      "Você não precisa levar par",
      "Aula particular para iniciantes",
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
    title: "Um movimento de cada vez. Até o corpo entender.",
    body: [
      "Aprenda desde a base, com atenção em cada movimento.",
      "Pergunte, repita e ajuste quantas vezes precisar.",
      "Na aula individual, Priscilla também faz o papel de par.",
    ],
  },
  method: {
    eyebrow: "Como Priscilla ensina",
    title: "Antes de decorar passos, você aprende a base que faz o movimento funcionar.",
    highlight: "você aprende a base",
    body: [
      "Você entende cada fundamento antes de juntar tudo na dança.",
    ],
    pillars: [
      {
        title: "Base e equilíbrio",
        body: "Apoio dos pés e transferência de peso sem perder o equilíbrio.",
      },
      {
        title: "Como dançar com o par",
        body: "Condução, resposta e distância para dançar com conforto.",
      },
      {
        title: "Como acompanhar a música",
        body: "Marcação musical e coordenação para entender onde o movimento entra na música.",
      },
    ],
    image: methodImage,
  },
  proof: {
    anchor: "depoimentos",
    eyebrow: "Acompanhamento de perto",
    title: "A aula particular tira a pressa de aprender.",
    poster: proofPoster,
    slides: [
      {
        title: "Repita sem pressa",
        body: "Priscilla retoma o movimento quantas vezes você precisar.",
      },
      {
        title: "Comece sem levar um par",
        body: "Na aula individual, Priscilla acompanha os exercícios com você.",
      },
      {
        title: "Aprenda com atenção individualizada",
        body: "Priscilla ajusta a explicação e a prática ao seu nível de experiência.",
      },
    ],
    cta: "Quero entender as aulas",
  },
  formats: {
    eyebrow: "Escolha como quer começar",
    title: "A mesma atenção próxima, em dois formatos particulares.",
    note: "Local, horários e investimento são combinados diretamente com Priscilla.",
    alternative: {
      key: "grupo-workshop",
      title: "Precisa de uma aula em grupo ou workshop?",
      cta: "FALAR SOBRE OUTRO FORMATO",
    },
  },
  offers: [
    {
      key: "individual",
      title: "Aula particular individual",
      audience: "Para começar sozinho e receber atenção integral.",
      body: "Você não precisa levar par. A explicação acompanha o que seu corpo precisa entender.",
      primary: true,
      cta: "AGENDAR MINHA AULA PARTICULAR",
    },
    {
      key: "dupla",
      title: "Aula particular em dupla",
      audience: "Para duas pessoas que já querem aprender juntas.",
      body: "Priscilla acompanha a comunicação da dupla e ajusta os fundamentos para cada pessoa.",
      primary: false,
      cta: "AGENDAR AULA EM DUPLA",
    },
  ],
  about: {
    eyebrow: "Quem é Priscilla Castão",
    title: "Priscilla ensina forró universitário e roots em Salvador.",
    body: [
      "Base, transferência de peso, musicalidade e comunicação com o par, com atenção ao jeito de aprender de cada aluno.",
    ],
    image: aboutImage,
  },
  process: {
    eyebrow: "Como começar",
    title: "Sua primeira aula começa com uma conversa simples.",
    steps: [
      {
        title: "Conte o que você quer aprender",
        body: "Priscilla entende seu ponto de partida, seu objetivo e se a aula será individual ou em dupla.",
      },
      {
        title: "Defina os detalhes da aula",
        body: "Vocês combinam o formato, o local, os horários disponíveis e o investimento.",
      },
      {
        title: "Escolha o horário e agende",
        body: "Com tudo definido, escolha uma opção disponível e deixe sua primeira aula marcada.",
      },
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
      general: "Oi, Priscilla! Vim pela página de aulas para iniciantes e quero começar a dançar forró. Gostaria de saber sobre formatos, locais, horários e valores.",
      individual: "Oi, Priscilla! Vim pela página de aulas e quero agendar uma aula particular individual. Estou começando do zero e gostaria de saber sobre locais, horários e valores.",
      dupla: "Oi, Priscilla! Vim pela página de aulas e quero agendar uma aula particular em dupla. Gostaria de saber sobre locais, horários e valores.",
      "grupo-workshop": "Oi, Priscilla! Vim pela página de aulas e gostaria de conversar sobre uma aula em grupo ou workshop. Pode me explicar os formatos, a disponibilidade e os valores?",
    },
  },
});
