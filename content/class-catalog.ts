/** Based on catalogue v15, with subsequent user-approved web pricing updates. */
export const lessonMethod = [
  { title: "Priscilla começa dançando com você", points: ["Você começa dançando com Priscilla.", "Ela observa os passos que você conhece e como os executa.", "Juntos, identificam ajustes e possibilidades para seu repertório."] },
  { title: "Ajustes nos passos que você já usa", points: ["Refine a execução e a limpeza dos movimentos.", "Trabalhe os ajustes com atenção às suas dificuldades.", "O foco é dançar com mais segurança e clareza."] },
  { title: "Novos passos e pedidos específicos", points: ["Aprenda movimentos a partir da sua experiência e do estilo escolhido.", "Peça um passo que queira aprender.", "Mostre uma dificuldade para trabalhar na aula."] },
];

export const lessonFormats = [
  {
    id: "individual", title: "Aula individual", description: "1 hora com Priscilla, sem precisar levar um par.",
    prices: [{ label: "Aula individual · 1 hora", amount: "R$ 120,00" }, { label: "Pacote individual · 4 aulas de 1h", amount: "R$ 439,90", saving: "Economize R$ 40,10 em relação a 4 aulas avulsas" }],
    sections: [
      { title: "Para quem é indicada", text: "Para quem quer começar sozinho ou já dança e deseja corrigir a execução dos passos e aprender outros. Priscilla acompanha você como par durante a aula." },
      { title: "Como funciona", text: "Você dança com Priscilla para que ela entenda seu nível. Depois, vocês trabalham os ajustes que ela identificou e praticam novos movimentos no universitário, no roots ou na dança híbrida." },
      { title: "Pedidos para sua aula", text: "Mostre a Priscilla um passo que quer aprender ou que ainda não consegue executar como gostaria. Ela pode dedicar a prática a esse pedido e refinar os movimentos com você." },
    ],
  },
  {
    id: "dupla", title: "Aula em dupla", description: "1 hora para duas pessoas que querem aprender juntas.",
    prices: [{ label: "Investimento na aula em dupla · 1 hora", amount: "R$ 215,00" }],
    sections: [
      { title: "Para quem é indicada", text: "Para duas pessoas que querem começar no forró ou melhorar os passos que já dançam juntas. Vocês escolhem o estilo que desejam trabalhar: universitário, roots ou dança híbrida." },
      { title: "Como funciona", text: "Priscilla acompanha os dois alunos e observa como a dupla dança. Ela ajusta os fundamentos às necessidades de cada pessoa e propõe novos movimentos a partir da experiência de vocês." },
      { title: "O que vocês praticam", text: "Vocês refinam os passos e aprendem outros, com atenção à execução e à comunicação com o par. Podem indicar um movimento ou uma dificuldade que queiram trabalhar na aula." },
    ],
  },
  {
    id: "grupo", title: "Aula em grupo", description: "1 hora de aula para um grupo de quatro pessoas.",
    prices: [{ label: "Investimento para o grupo de 4 pessoas · 1 hora", amount: "R$ 420,00" }],
    sections: [
      { title: "Para quem é indicada", text: "Para quatro pessoas que querem fazer uma aula de forró juntas, no universitário, no roots ou na dança híbrida, com orientação de Priscilla." },
      { title: "O que vocês trabalham", text: "A proposta inclui ajustes nos passos e novos movimentos, de acordo com a experiência dos participantes e o estilo escolhido. O grupo pratica o repertório com atenção à execução." },
      { title: "Pedidos para a aula", text: "Contem a Priscilla se há um passo que gostariam de aprender ou uma dificuldade que querem resolver. Esses pedidos ajudam a definir o que trabalhar com o grupo." },
    ],
  },
];

export const freeCourses = [
  { title: "Consciência corporal", text: "Desenvolva a percepção dos seus movimentos e identifique o que pode ajustar. O foco é dançar com mais controle e clareza na execução.", amount: "R$ 149,90" },
  { title: "Musicalidade", text: "Desenvolva a escuta para variar sua dança acompanhando o que a música pede. Experimente movimentos que expressem o que você ouve.", amount: "R$ 149,90" },
  { title: "Autonomia e criatividade", text: "Combine os passos que você já conhece e experimente variações. Desenvolva repertório para escolher movimentos e criar sequências na dança.", amount: "R$ 149,90" },
];
