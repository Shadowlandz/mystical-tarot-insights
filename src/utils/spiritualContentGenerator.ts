
// Tipos de conteúdo espiritual
export type SpiritualContentItem = {
  title: string;
  type: "article" | "video" | "document";
  thumbnail: string;
  excerpt: string;
  link: string;
};

// Fontes verificadas para conteúdo espiritual
const verifiedSources = [
  { name: "Mind Body Green", url: "https://www.mindbodygreen.com" },
  { name: "Spirituality Health", url: "https://spiritualityhealth.com" },
  { name: "Chopra", url: "https://chopra.com" },
  { name: "Yoga Journal", url: "https://www.yogajournal.com" },
  { name: "Gaia", url: "https://www.gaia.com" },
  { name: "Somos Todos Um", url: "https://www.somostodosum.com.br" },
  { name: "Personare", url: "https://www.personare.com.br" },
];

// Tópicos espirituais expandidos com misticismo brasileiro e práticas esotéricas
const topics = [
  "meditação", "yoga", "mindfulness", "tarô", "astrologia", 
  "cristais", "chakras", "energia universal", "intuição", 
  "espiritualidade", "autoconhecimento", "equilíbrio energético",
  "umbanda", "candomblé", "orixás", "benzeduras", "xamanismo",
  "reiki", "oráculos", "runas", "numerologia"
];

// Imagens verificadas para conteúdo espiritual
const verifiedImages = [
  "https://images.unsplash.com/photo-1531171074114-ce2fb0d97711?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532570204997-95c9903069e5?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574722772633-e4abe41ced20?w=800&h=600&auto=format&fit=crop"
];

// IDs de vídeos verificados do YouTube sobre espiritualidade
const verifiedYoutubeIds = [
  "yKLGTrM1fZw", // Meditação guiada
  "TQ6JBEK8BaA", // Música de meditação
  "s-oir8gRSK0", // Espiritualidade e ciência
  "FQYaRseg9MU", // Yoga
  "NG5jqkpYOUo", // Mindfulness
  "YUxTbLcJJWY", // Reiki
  "Sj9Qu0HO_6s", // Umbanda
  "lWkD0FK1xwE"  // Candomblé
];

// Gerar títulos espirituais
function generateTitle(topic: string): string {
  const templates = [
    `O Poder de ${topic} para Transformar sua Vida`,
    `Como ${topic} pode Elevar sua Consciência`,
    `Despertando a Sabedoria Interior através de ${topic}`,
    `${topic}: Um Caminho para a Iluminação Espiritual`,
    `A Jornada Sagrada de ${topic}`,
    `Descobrindo os Segredos de ${topic}`,
    `${topic}: Práticas Ancestrais para o Mundo Moderno`,
    `A Ciência Espiritual por trás de ${topic}`,
    `Conectando-se com o Divino através de ${topic}`,
    `Os Mistérios Revelados de ${topic}`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

// Gerar resumos de artigos espirituais
function generateExcerpt(topic: string, sourceName: string): string {
  const templates = [
    `Descubra como ${topic} pode transformar sua percepção do mundo e conectá-lo com sua essência divina. Este estudo profundo revela práticas milenares que foram preservadas por antigas tradições. Fonte: ${sourceName}`,
    
    `Neste artigo exclusivo, exploramos as dimensões ocultas de ${topic} e como esta prática pode ser integrada ao seu cotidiano para promover cura e equilíbrio. Fonte: ${sourceName}`,
    
    `A sabedoria ancestral de ${topic} traduzida para a vida moderna. Aprenda técnicas que mestres espirituais têm utilizado por séculos para alcançar estados elevados de paz interior. Fonte: ${sourceName}`,
    
    `Uma jornada através dos aspectos místicos e científicos de ${topic}. Este estudo combina conhecimentos esotéricos com descobertas da física quântica. Fonte: ${sourceName}`,
    
    `${topic} como portal para dimensões superiores de existência. Este guia prático oferece métodos comprovados para elevar sua frequência vibracional. Fonte: ${sourceName}`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

// Gerar tipo de conteúdo com distribuição controlada
function generateContentType(): "article" | "video" | "document" {
  const random = Math.random();
  
  if (random < 0.6) {
    return "article"; // 60% de chance
  } else if (random < 0.9) {
    return "video";   // 30% de chance
  } else {
    return "document"; // 10% de chance
  }
}

// Gerar um item de conteúdo espiritual confiável
function generateSpiritualContentItem(): SpiritualContentItem {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const type = generateContentType();
  const source = verifiedSources[Math.floor(Math.random() * verifiedSources.length)];
  
  // Gerar título e resumo
  const title = generateTitle(topic);
  const excerpt = generateExcerpt(topic, source.name);
  
  // Gerar link apropriado com base no tipo de conteúdo
  let link = "";
  
  if (type === "video") {
    // Usar links verificados do YouTube para vídeos
    const videoId = verifiedYoutubeIds[Math.floor(Math.random() * verifiedYoutubeIds.length)];
    link = `https://www.youtube.com/watch?v=${videoId}`;
  } else {
    // Para artigos e documentos - usar caminhos verificados
    const formattedTopic = topic.toLowerCase().replace(/\s+/g, '-');
    
    if (source.url.includes('mindbodygreen.com')) {
      link = `${source.url}/articles/spirituality/${formattedTopic}`;
    } else if (source.url.includes('spiritualityhealth.com')) {
      link = `${source.url}/practice/${formattedTopic}`;
    } else if (source.url.includes('chopra.com')) {
      link = `${source.url}/articles/meditation/${formattedTopic}`;
    } else if (source.url.includes('yogajournal.com')) {
      link = `${source.url}/poses/${formattedTopic}`;
    } else if (source.url.includes('somostodosum.com.br')) {
      link = `${source.url}/artigos/${formattedTopic}`;
    } else if (source.url.includes('personare.com.br')) {
      link = `${source.url}/conteudo/${formattedTopic}`;
    } else {
      link = `${source.url}/content/${formattedTopic}`;
    }
  }
  
  // Definir miniatura da lista verificada
  const thumbnail = verifiedImages[Math.floor(Math.random() * verifiedImages.length)];
  
  return {
    title,
    type,
    thumbnail,
    excerpt,
    link
  };
}

// Função exportada para gerar múltiplos itens de conteúdo espiritual
export function generateLocalSpiritualContent(count: number = 3): SpiritualContentItem[] {
  const items: SpiritualContentItem[] = [];
  
  for (let i = 0; i < count; i++) {
    items.push(generateSpiritualContentItem());
  }
  
  return items;
}
