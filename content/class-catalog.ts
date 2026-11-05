import {
  DEFAULT_CATALOG_PRICES,
  type CatalogPricingSettings,
} from "@/lib/booking-settings";

/** Based on catalogue v15, with subsequent user-approved web pricing updates and runtime DB overrides. */
export const lessonMethod = [
  { title: "Avaliação inicial da sua dança", points: ["Você começa dançando com Priscilla.", "Ela observa seu repertório, a execução dos movimentos e suas dificuldades.", "Essa leitura orienta o que vocês vão trabalhar na aula."] },
  { title: "Ajustes e prática orientada", points: ["Refine os movimentos que você já conhece, com correções durante a prática.", "Experimente novos passos de acordo com seu nível e o estilo escolhido.", "Trabalhe a execução e a comunicação com o par."] },
  { title: "Evolução também fora da aula", points: ["Retome os pontos trabalhados para entender o que precisa de atenção.", "Priscilla deixa exercícios para você treinar depois da aula.", "Use esse treino para consolidar os ajustes e dar continuidade à sua evolução."] },
];

export type CatalogPriceItem = {
  label: string;
  amount: string;
  saving?: string;
};

export type LessonFormat = {
  id: "individual" | "dupla" | "grupo";
  title: string;
  description: string;
  prices: CatalogPriceItem[];
  sections: Array<{ title: string; text: string }>;
};

export type FreeCourse = {
  title: string;
  text: string;
  amount: string;
};

export function buildCatalogContent(
  prices: CatalogPricingSettings = DEFAULT_CATALOG_PRICES,
): {
  lessonFormats: LessonFormat[];
  freeCourses: FreeCourse[];
  comboPrice: { amount: string; saving: string };
} {
  return {
    lessonFormats: [
      {
        id: "individual",
        title: "Aula individual",
        description: "1h com Priscilla, sem precisar levar um par.",
        prices: [
          { label: "Aula avulsa", amount: prices.individualSingle },
          {
            label: "Pacote individual · 4 aulas",
            amount: prices.individualPackage,
            saving: prices.individualPackageSaving,
          },
        ],
        sections: [
          { title: "Para quem é indicada", text: "Para quem quer começar sozinho ou já dança e deseja corrigir a execução dos passos e aprender outros. Priscilla acompanha você como par durante a aula." },
          { title: "Como funciona", text: "Você dança com Priscilla para que ela entenda seu nível. Depois, vocês trabalham os ajustes que ela identificou e praticam novos movimentos no universitário, no roots ou na dança híbrida." },
          { title: "Depois da aula", text: "Priscilla deixa exercícios para você treinar e consolidar os movimentos trabalhados. Assim, a prática continua entre uma aula e outra." },
        ],
      },
      {
        id: "dupla",
        title: "Aula em dupla",
        description: "1h para duas pessoas que querem aprender juntas.",
        prices: [{ label: "Investimento para a dupla", amount: prices.dupla }],
        sections: [
          { title: "Para quem é indicada", text: "Para duas pessoas que querem começar no forró ou melhorar os passos que já dançam juntas. Vocês escolhem o estilo que desejam trabalhar: universitário, roots ou dança híbrida." },
          { title: "Como funciona", text: "Priscilla acompanha os dois alunos e observa como a dupla dança. Ela ajusta os fundamentos às necessidades de cada pessoa e propõe novos movimentos a partir da experiência de vocês." },
          { title: "O que vocês praticam", text: "Vocês refinam os passos e aprendem outros, com atenção à execução e à comunicação com o par. Priscilla também orienta exercícios para a dupla continuar treinando depois da aula." },
        ],
      },
      {
        id: "grupo",
        title: "Aula em grupo",
        description: "1h de aula para um grupo de quatro pessoas.",
        prices: [{ label: "Investimento para o grupo de 4 pessoas", amount: prices.grupo }],
        sections: [
          { title: "Para quem é indicada", text: "Para quatro pessoas que querem fazer uma aula de forró juntas, no universitário, no roots ou na dança híbrida, com orientação de Priscilla." },
          { title: "O que vocês trabalham", text: "A proposta inclui ajustes nos passos e novos movimentos, de acordo com a experiência dos participantes e o estilo escolhido. O grupo pratica o repertório com atenção à execução." },
          { title: "Depois da aula", text: "O grupo recebe orientações de treino para retomar os movimentos e consolidar os ajustes trabalhados com Priscilla." },
        ],
      },
    ],
    freeCourses: [
      { title: "Consciência corporal", text: "Desenvolva a percepção dos seus movimentos e identifique o que pode ajustar. O foco é dançar com mais controle e clareza na execução.", amount: prices.courseSingle },
      { title: "Musicalidade", text: "Desenvolva a escuta para variar sua dança acompanhando o que a música pede. Experimente movimentos que expressem o que você ouve.", amount: prices.courseSingle },
      { title: "Autonomia e criatividade", text: "Combine os passos que você já conhece e experimente variações. Desenvolva repertório para escolher movimentos e criar sequências na dança.", amount: prices.courseSingle },
    ],
    comboPrice: {
      amount: prices.courseCombo,
      saving: prices.courseComboSaving,
    },
  };
}

const defaultCatalog = buildCatalogContent();
export const lessonFormats = defaultCatalog.lessonFormats;
export const freeCourses = defaultCatalog.freeCourses;
export const comboPrice = defaultCatalog.comboPrice;
