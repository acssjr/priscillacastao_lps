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

export const forroEvolucaoCampaign = LandingCampaignSchema.parse({
  id: "forro-evolucao",
  route: "/evolua-no-forro",
  meta: {
    title: "Aprimore seu forró em Salvador | Priscilla Castão",
    description: "Já dança forró? Aprimore base, musicalidade e conexão em aulas particulares com Priscilla Castão, individuais ou em dupla, em Salvador.",
    ogAlt: "Priscilla Castão apresenta aulas particulares de forró para quem já dança em Salvador.",
  },
  navigation: [
    { label: "Início", target: "#inicio" },
    { label: "Sua dança", target: "#para-quem" },
    { label: "Como são as aulas", target: "#metodo" },
    { label: "Formatos", target: "#aulas" },
    { label: "Priscilla", target: "#sobre" },
    { label: "Dúvidas", target: "#duvidas" },
  ],
  ui: {
    headerCta: "AGENDAR AULA",
    mobileMenuCta: "AGENDAR AULA",
    recognitionAriaLabel: "Objetivos para aprimorar sua dança",
    footerDescription: "Aulas particulares de forró em Salvador para quem já dança e quer evoluir.",
    footerMethodLabel: "Como são as aulas",
    sticky: {
      title: "Aprimore sua dança",
      note: "Forró · Básico e intermediário",
      ariaLabel: "Agendar aula com Priscilla pelo WhatsApp",
      mobileLabel: "AGENDAR AULA",
      desktopLabel: "AGENDAR AULA",
    },
  },
  hero: {
    eyebrow: "Aulas particulares de forró em Salvador — BA",
    title: "Dê mais fluidez ao forró que você já dança.",
    titleEmphasis: "mais fluidez",
    body: [
      "Para quem já dança e quer aprimorar os movimentos, a musicalidade e a comunicação com o par.",
    ],
    proofPoints: [
      "Atenção ao seu nível e objetivo",
      "Individual ou em dupla",
    ],
    image: heroImage,
    cta: "AGENDAR AULA",
    ctaNote: {
      lead: "Conte o que você quer melhorar",
      bridge: "conheça os formatos e",
      details: "consulte local, horários e valores",
    },
    location: "Salvador, Bahia",
  },
  recognition: {
    eyebrow: "Para quem já dança",
    title: "Sua experiência é o ponto de partida.",
    body: [
      "Ligue um movimento ao outro com mais fluidez.",
      "Perceba melhor a música e explore suas variações.",
      "Comunique-se com mais clareza na condução e na resposta.",
    ],
  },
  method: {
    eyebrow: "O que trabalhar na sua dança",
    title: "Base, musicalidade e conexão na prática.",
    highlight: "musicalidade e conexão",
    body: [
      "Priscilla acompanha seus movimentos, explica os fundamentos envolvidos e orienta os ajustes.",
    ],
    pillars: [
      {
        title: "Base para mais fluidez",
        body: "Apoio dos pés, equilíbrio e transferência de peso para observar como você passa de um movimento para o outro.",
      },
      {
        title: "Musicalidade nas escolhas",
        body: "Marcação e variações da música relacionadas aos movimentos que você já conhece.",
      },
      {
        title: "Comunicação com o par",
        body: "Condução, resposta e distância para trabalhar uma interação mais confortável e atenta.",
      },
    ],
    image: methodImage,
  },
  proof: {
    anchor: "acompanhamento",
    eyebrow: "A atenção da aula particular",
    title: "Um olhar atento ao jeito como você dança.",
    poster: proofPoster,
    slides: [
      {
        title: "Atenção aos detalhes",
        body: "Priscilla acompanha sua prática e orienta os movimentos que precisam de ajuste.",
      },
      {
        title: "Espaço para suas dúvidas",
        body: "Você pode retomar um fundamento e entender como ele se relaciona ao movimento.",
      },
      {
        title: "Prática com orientação",
        body: "Experimente os ajustes e repita com acompanhamento, levando em conta sua experiência.",
      },
    ],
    cta: "Quero entender as aulas",
  },
  formats: {
    eyebrow: "Individual ou em dupla",
    title: "Escolha como quer trabalhar sua dança.",
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
      audience: "Para dedicar atenção aos seus movimentos e objetivos.",
      body: "Pratique com Priscilla, esclareça suas dúvidas e trabalhe os ajustes da sua dança. Você não precisa levar par.",
      primary: true,
      cta: "AGENDAR AULA INDIVIDUAL",
    },
    {
      key: "dupla",
      title: "Aula particular em dupla",
      audience: "Para duas pessoas que querem aprimorar a dança juntas.",
      body: "Trabalhem os movimentos e a comunicação entre vocês, com atenção à experiência de cada pessoa.",
      primary: false,
      cta: "AGENDAR AULA EM DUPLA",
    },
  ],
  about: {
    eyebrow: "Quem acompanha sua prática",
    title: "Priscilla Castão. Forró com atenção ao corpo, à música e ao par.",
    body: [
      "Priscilla ensina forró universitário e roots em Salvador. Seu trabalho aborda base, transferência de peso, musicalidade e comunicação na dança a dois.",
      "Nas aulas particulares, ela acompanha a prática e ajusta as explicações à experiência de cada aluno.",
    ],
    image: aboutImage,
  },
  process: {
    eyebrow: "Do contato à aula",
    title: "Conte o que você quer melhorar.",
    steps: [
      {
        title: "Fale sobre sua dança",
        body: "Envie uma mensagem para Priscilla com sua experiência e o que gostaria de trabalhar.",
      },
      {
        title: "Conheça as opções",
        body: "Conversem sobre aula individual ou em dupla, local, horários disponíveis e investimento.",
      },
      {
        title: "Combine sua aula",
        body: "Com os detalhes definidos, escolha um horário disponível e faça o agendamento diretamente com Priscilla.",
      },
    ],
  },
  faq: {
    eyebrow: "Antes de conversar",
    title: "Entenda se a aula combina com seu momento.",
    items: [
      {
        question: "Tenho só a base do forró. A aula é para mim?",
        answer: "Esta proposta é para quem já começou a dançar e quer se desenvolver, do básico ao intermediário. Conte a Priscilla o que você já pratica e quais são suas dúvidas.",
      },
      {
        question: "Já faço aulas. O que posso trabalhar na particular?",
        answer: "Você pode trazer movimentos e dúvidas que gostaria de explorar com mais atenção. A aula particular permite dedicar a prática a esses pontos, com orientação próxima de Priscilla.",
      },
      {
        question: "O foco é aprender passos novos?",
        answer: "O trabalho inclui base, transferência de peso, musicalidade e comunicação com o par. Se ampliar o repertório é seu objetivo, conte isso a Priscilla para alinhar o conteúdo.",
      },
      {
        question: "Preciso levar um par?",
        answer: "Não. Na aula individual, você pratica com Priscilla. Para a aula em dupla, combine o formato com ela e com a pessoa que participará com você.",
      },
      {
        question: "A aula trabalha condução e resposta?",
        answer: "Condução, resposta e comunicação com o par fazem parte dos conteúdos abordados. Na conversa, diga o que você pratica e o que quer desenvolver.",
      },
      {
        question: "Onde acontecem as aulas?",
        answer: "As aulas são presenciais em Salvador. O local é combinado diretamente com Priscilla, junto com os horários disponíveis.",
      },
      {
        question: "Quanto custa?",
        answer: "Priscilla informa os valores e as condições conforme o formato. Pelo WhatsApp, você pode consultar investimento, local e horários antes de agendar.",
      },
      {
        question: "Como funciona o primeiro contato?",
        answer: "O botão abre uma mensagem no WhatsApp. Você conta sua experiência e o que deseja melhorar; Priscilla explica as opções e vocês combinam os detalhes antes do agendamento.",
      },
    ],
  },
  closing: {
    eyebrow: "Sua dança, com atenção próxima",
    title: "O que você quer melhorar no seu forró?",
    body: [
      "Conte a Priscilla o que você já dança e o que gostaria de desenvolver. Conversem sobre o formato, o local, os horários e o investimento.",
    ],
    cta: "AGENDAR AULA",
  },
  whatsapp: {
    phone: "5575981234176",
    messages: {
      general: "Oi, Priscilla! Vi a página para quem já dança forró e quero melhorar minha dança. Gostaria de agendar uma aula particular e saber os formatos, locais, horários e valores.",
      individual: "Oi, Priscilla! Vi a página para quem já dança forró e tenho interesse em uma aula particular individual para melhorar minha dança. Pode me explicar como funciona e informar locais, horários e valores?",
      dupla: "Oi, Priscilla! Vi a página para quem já dança forró e tenho interesse em uma aula particular em dupla. Queremos aprimorar nossa dança. Pode me explicar como funciona e informar locais, horários e valores?",
      "grupo-workshop": "Oi, Priscilla! Vi a página para quem já dança forró e gostaria de conversar sobre uma aula em grupo ou workshop. Pode me explicar os formatos, a disponibilidade e os valores?",
    },
  },
});
