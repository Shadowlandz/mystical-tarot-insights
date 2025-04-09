
export interface TarotAreaType {
  id: string;
  name: string;
  description: string;
  keyword: string;
}

export const tarotAreas: TarotAreaType[] = [
  {
    id: "money",
    name: "Finanças",
    description: "Questões relacionadas a dinheiro, carreira, e prosperidade material",
    keyword: "finanças, dinheiro, carreira, trabalho, prosperidade"
  },
  {
    id: "love",
    name: "Amor",
    description: "Relacionamentos amorosos, romances e questões do coração",
    keyword: "amor, romance, relacionamento, parceria, casamento"
  },
  {
    id: "health",
    name: "Saúde",
    description: "Bem-estar físico e mental, equilíbrio e vitalidade",
    keyword: "saúde, bem-estar, equilíbrio, energia, vitalidade"
  },
  {
    id: "spiritual",
    name: "Espiritualidade",
    description: "Crescimento espiritual, propósito de vida e conexão com o divino",
    keyword: "espiritualidade, propósito, crescimento, consciência, divino"
  },
  {
    id: "family",
    name: "Família",
    description: "Relações familiares, lar e questões domésticas",
    keyword: "família, lar, pais, filhos, ancestrais"
  },
  {
    id: "social",
    name: "Vida Social",
    description: "Amizades, conexões sociais e relacionamentos de grupo",
    keyword: "amizades, grupos, comunidade, social, conexões"
  },
  {
    id: "education",
    name: "Educação",
    description: "Aprendizado, estudos e desenvolvimento intelectual",
    keyword: "educação, estudos, aprendizado, conhecimento, sabedoria"
  },
  {
    id: "creativity",
    name: "Criatividade",
    description: "Expressão criativa, projetos artísticos e inspiração",
    keyword: "criatividade, arte, inspiração, expressão, criação"
  }
];

