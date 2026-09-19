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

const rootsPoster = {
  src: "/images/cutouts/priscilla-castao-forro-roots-cutout.webp",
  alt: "Priscilla Castão dançando forró roots com um parceiro",
  width: 941,
  height: 1672,
};

export const forroRootsCampaign = LandingCampaignSchema.parse({
  id: "forro-roots",
  route: "/forro-roots",
  meta: {
    title: "Aulas de forró roots em Salvador | Priscilla Castão",
    description: "Aulas particulares de forró roots em Salvador para todos os níveis, individuais ou em dupla, com atenção ao seu momento e objetivo.",
    ogAlt: "Priscilla Castão apresenta aulas particulares de forró roots para todos os níveis em Salvador.",
  },
  navigation: [
    { label: "Início", target: "#inicio" },
    { label: "Seu momento", target: "#para-quem" },
    { label: "Aulas de roots", target: "#metodo" },
    { label: "Formatos", target: "#aulas" },
    { label: "Priscilla", target: "#sobre" },
    { label: "Dúvidas", target: "#duvidas" },
  ],
  ui: {
    headerCta: "AGENDAR AULA DE ROOTS",
    mobileMenuCta: "AGENDAR AULA DE ROOTS",
    recognitionAriaLabel: "Pontos de partida para as aulas de roots",
    footerDescription: "Aulas particulares de roots em Salvador para todos os níveis.",
    footerMethodLabel: "Aulas de roots",
    sticky: {
      title: "Aulas de roots",
      note: "Para todos os níveis",
      ariaLabel: "Agendar aula de roots com Priscilla pelo WhatsApp",
      mobileLabel: "AGENDAR AULA DE ROOTS",
      desktopLabel: "AGENDAR AULA DE ROOTS",
    },
  },
  hero: {
    eyebrow: "Aulas particulares de forró roots em Salvador — BA",
    title: "Forró roots para começar, continuar e aprofundar.",
    titleEmphasis: "Forró roots",
    body: [
      "Para quem nunca dançou, já começou ou quer explorar novos detalhes na própria dança.",
    ],
    proofPoints: [
      "Para todos os níveis",
      "Individual ou em dupla",
    ],
    image: heroImage,
    cta: "AGENDAR AULA DE ROOTS",
    ctaNote: {
      lead: "Conte seu momento",
      bridge: "conheça os formatos e",
      details: "consulte local, horários e valores",
    },
    location: "Salvador, Bahia",
  },
  recognition: {
    eyebrow: "Qual é o seu momento?",
    title: "Cada pessoa chega ao roots por um caminho.",
    body: [
      "Comece pelos fundamentos, mesmo que nunca tenha dançado.",
      "Retome a base, organize movimentos e esclareça dúvidas.",
      "Aprofunde o jogo de pernas, a conexão entre tronco e quadril e a musicalidade.",
    ],
  },
  method: {
    eyebrow: "Roots na prática",
    title: "Jogo de pernas, conexão corporal e musicalidade.",
    highlight: "conexão corporal",
    body: [
      "O jogo de pernas e a conexão entre tronco e quadril são marcas corporais do roots. Priscilla relaciona esses fundamentos à sua experiência e ao que você quer trabalhar.",
    ],
    pillars: [
      {
        title: "Jogo de pernas e transferência de peso",
        body: "Explore apoios, trocas de peso e desenhos das pernas para construir ou refinar o movimento.",
      },
      {
        title: "Conexão entre tronco e quadril",
        body: "Perceba como tronco e quadril se conectam para dar continuidade, intenção e presença ao movimento.",
      },
      {
        title: "Musicalidade e comunicação",
        body: "Relacione o corpo à pulsação e à escuta, percebendo também o diálogo com o par.",
      },
    ],
    image: methodImage,
  },
  proof: {
    anchor: "acompanhamento",
    eyebrow: "Atenção ao seu momento",
    title: "A aula parte de onde você está.",
    poster: rootsPoster,
    slides: [
      {
        title: "Comece com orientação",
        body: "Se roots é novidade, Priscilla apresenta os fundamentos e pratica com você.",
      },
      {
        title: "Retome com clareza",
        body: "Se você já começou, pode revisar movimentos e entender melhor o que está fazendo.",
      },
      {
        title: "Aprofunde com intenção",
        body: "Se já tem experiência, aprofunde o jogo de pernas, a conexão corporal e outros detalhes que queira observar com mais atenção.",
      },
    ],
    cta: "Quero entender as aulas de roots",
  },
  formats: {
    eyebrow: "Individual ou em dupla",
    title: "Escolha como quer praticar roots.",
    note: "Aulas presenciais em Salvador. Local, horários e investimento são combinados diretamente com Priscilla.",
    alternative: {
      key: "grupo-workshop",
      title: "Quer conversar sobre uma aula em grupo ou workshop?",
      cta: "CONSULTAR OUTRO FORMATO",
    },
  },
  offers: [
    {
      key: "individual",
      title: "Aula particular individual",
      audience: "Para começar ou aprofundar com atenção integral.",
      body: "Você pratica com Priscilla e não precisa levar par. A aula considera sua experiência e seus objetivos.",
      primary: true,
      cta: "AGENDAR AULA INDIVIDUAL",
    },
    {
      key: "dupla",
      title: "Aula particular em dupla",
      audience: "Para duas pessoas que querem aprender ou trabalhar a dança juntas.",
      body: "Priscilla observa cada pessoa e a comunicação entre vocês, respeitando o momento da dupla.",
      primary: false,
      cta: "AGENDAR AULA EM DUPLA",
    },
  ],
  about: {
    eyebrow: "Quem acompanha sua prática",
    title: "Priscilla Castão ensina roots com atenção ao corpo, à música e ao par.",
    body: [
      "Seu trabalho aborda jogo de pernas, base, transferência de peso, conexão entre tronco e quadril, musicalidade e comunicação na dança a dois.",
      "Nas aulas particulares, ela ajusta a explicação à experiência e ao objetivo de cada aluno.",
    ],
    image: aboutImage,
  },
  process: {
    eyebrow: "Do contato à aula",
    title: "Conte de onde você está partindo.",
    steps: [
      {
        title: "Fale sobre seu momento",
        body: "Diga se nunca dançou roots, se já começou ou o que deseja aprofundar.",
      },
      {
        title: "Conheça as opções",
        body: "Converse sobre formato, local, horários disponíveis e investimento.",
      },
      {
        title: "Combine sua aula",
        body: "Com os detalhes definidos, escolha um horário disponível e faça o agendamento.",
      },
    ],
  },
  faq: {
    eyebrow: "Antes de conversar",
    title: "As aulas de roots recebem pessoas em qualquer nível.",
    items: [
      {
        question: "Nunca dancei roots. Posso fazer a aula?",
        answer: "Sim. As aulas atendem quem está começando. Na conversa, conte sua experiência para Priscilla orientar o ponto de partida.",
      },
      {
        question: "Já danço roots. A aula também é para mim?",
        answer: "Sim. Você pode levar dúvidas, movimentos ou aspectos da dança que queira observar com mais atenção.",
      },
      {
        question: "Danço outro estilo de forró. Preciso recomeçar do zero?",
        answer: "Não há uma resposta única. Conte sua experiência a Priscilla; ela conversa com você sobre os fundamentos e o foco adequado à aula.",
      },
      {
        question: "O que pode ser trabalhado?",
        answer: "Jogo de pernas, base, transferência de peso, conexão entre tronco e quadril, musicalidade e comunicação com o par estão entre os conteúdos trabalhados. O foco é alinhado com Priscilla.",
      },
      {
        question: "Preciso levar um par?",
        answer: "Não para a aula individual. Você pratica com Priscilla. A aula em dupla atende duas pessoas que querem participar juntas.",
      },
      {
        question: "Onde acontecem as aulas?",
        answer: "As aulas são presenciais em Salvador, em local combinado diretamente com Priscilla.",
      },
      {
        question: "Quanto custa?",
        answer: "Priscilla informa o investimento conforme o formato e a disponibilidade, antes do agendamento.",
      },
      {
        question: "Como funciona o primeiro contato?",
        answer: "O botão abre uma mensagem no WhatsApp. Você conta seu momento e recebe informações sobre formatos, local, horários e valores.",
      },
    ],
  },
  closing: {
    eyebrow: "Roots no seu momento",
    title: "De onde você quer começar no roots?",
    body: [
      "Conte a Priscilla sua experiência e o que deseja trabalhar. Conversem sobre formato, local, horários e investimento.",
    ],
    cta: "AGENDAR AULA DE ROOTS",
  },
  whatsapp: {
    phone: "5575981234176",
    messages: {
      general: "Oi, Priscilla! Vi a página de aulas de roots e gostaria de agendar uma aula. Vou te contar minha experiência e quero saber sobre formatos, locais, horários e valores.",
      individual: "Oi, Priscilla! Vi a página de aulas de roots e tenho interesse em uma aula particular individual. Pode me explicar como funciona e informar locais, horários e valores?",
      dupla: "Oi, Priscilla! Vi a página de aulas de roots e tenho interesse em uma aula particular em dupla. Pode me explicar como funciona e informar locais, horários e valores?",
      "grupo-workshop": "Oi, Priscilla! Vi a página de aulas de roots e gostaria de conversar sobre uma aula em grupo ou workshop. Pode me explicar os formatos, a disponibilidade e os valores?",
    },
  },
});
