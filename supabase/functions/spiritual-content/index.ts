
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sites confiáveis de espiritualidade
const TRUSTED_SOURCES = [
  { name: "Espiritualidade na Prática", url: "https://espiritualizando.com.br" },
  { name: "Portal da Espiritualidade", url: "https://www.espiritismo.es" },
  { name: "Mente Espiritual", url: "https://www.menteespiritual.com" },
  { name: "Sabedoria Espiritual", url: "https://harmoniaespiritual.com.br" },
  { name: "Caminho da Paz", url: "https://www.caminhodapaz.com.br" }
];

// Temas relacionados à espiritualidade
const SPIRITUAL_TOPICS = [
  "meditação", "yoga", "mindfulness", "tarô", "astrologia", "chakras",
  "energia universal", "karma", "reencarnação", "evolução espiritual",
  "autoconhecimento", "amor universal", "intuição", "lei da atração",
  "práticas espirituais", "consciência", "paz interior"
];

// Tipos de conteúdo
const CONTENT_TYPES = ["article", "video", "document"];

// Função para gerar um resumo aleatório
function generateRandomExcerpt(topic: string): string {
  const intros = [
    `Descubra como ${topic} pode transformar sua vida espiritual.`,
    `Aprenda práticas essenciais de ${topic} para seu desenvolvimento espiritual.`,
    `Entenda a conexão entre ${topic} e seu crescimento interior.`,
    `Explore os segredos antigos de ${topic} e sua relevância hoje.`,
    `Conheça as origens e benefícios de ${topic} na jornada espiritual.`
  ];
  
  const middles = [
    `Este guia oferece perspectivas valiosas sobre como integrar ${topic} no cotidiano.`,
    `Veja como mestres espirituais aplicam ${topic} para alcançar harmonia.`,
    `Descubra técnicas ancestrais e modernas relacionadas a ${topic}.`,
    `Aprenda como ${topic} se relaciona com outras práticas espirituais.`,
    `Entenda por que ${topic} é essencial para o equilíbrio energético.`
  ];
  
  const endings = [
    `Uma jornada transformadora para quem busca evolução através de ${topic}.`,
    `Conteúdo essencial para praticantes e interessados em ${topic}.`,
    `Material indispensável para aprofundar seu conhecimento sobre ${topic}.`,
    `Reflexões profundas sobre a essência de ${topic} no mundo moderno.`,
    `Uma abordagem acessível para iniciantes em ${topic}.`
  ];
  
  const randomIntro = intros[Math.floor(Math.random() * intros.length)];
  const randomMiddle = middles[Math.floor(Math.random() * middles.length)];
  const randomEnding = endings[Math.floor(Math.random() * endings.length)];
  
  return `${randomIntro} ${randomMiddle} ${randomEnding}`;
}

// Função para gerar um título aleatório
function generateRandomTitle(topic: string): string {
  const prefixes = [
    "O Guia Completo sobre", 
    "Descobrindo os Segredos de", 
    "A Jornada Interior através de", 
    "Práticas Essenciais de", 
    "Transformação Espiritual com",
    "A Sabedoria Ancestral de",
    "Os Benefícios de",
    "Iniciação aos Mistérios de",
    "Desvendando os Símbolos de",
    "A Arte Sagrada de"
  ];
  
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  
  return `${randomPrefix} ${capitalizedTopic}`;
}

// Função para gerar uma URL de thumbnail aleatória
function generateRandomThumbnail(topic: string): string {
  const imageKeywords = encodeURIComponent(`spiritual ${topic}`);
  return `https://source.unsplash.com/featured/?${imageKeywords}`;
}

// Função para gerar um link aleatório
function generateRandomLink(type: string): string {
  if (type === "video") {
    return "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Link placeholder para vídeos
  } else if (type === "document") {
    return "https://exemplo.com/documento.pdf"; // Link placeholder para documentos
  } else {
    return "https://exemplo.com/artigo"; // Link placeholder para artigos
  }
}

// Função para gerar um item de conteúdo aleatório
function generateRandomContentItem() {
  const randomTopic = SPIRITUAL_TOPICS[Math.floor(Math.random() * SPIRITUAL_TOPICS.length)];
  const randomType = CONTENT_TYPES[Math.floor(Math.random() * CONTENT_TYPES.length)];
  const randomSource = TRUSTED_SOURCES[Math.floor(Math.random() * TRUSTED_SOURCES.length)];
  
  return {
    title: generateRandomTitle(randomTopic),
    type: randomType,
    thumbnail: generateRandomThumbnail(randomTopic),
    excerpt: generateRandomExcerpt(randomTopic),
    link: generateRandomLink(randomType),
    source: randomSource.name,
    sourceUrl: randomSource.url
  };
}

// Função para gerar vários itens de conteúdo aleatório
function generateRandomContent(count: number) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(generateRandomContentItem());
  }
  return items;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Updated: Parse request body for parameters instead of URL query params
    let count = 3; // Default value
    
    // Check if we have a body to parse
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        const body = await req.json();
        // If body contains count parameter, use it
        if (body && body.count) {
          count = parseInt(body.count);
        }
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    } else {
      // Fallback to URL params for backward compatibility
      const url = new URL(req.url);
      const urlCount = url.searchParams.get('count');
      if (urlCount) {
        count = parseInt(urlCount);
      }
    }
    
    // Ensure count is valid
    count = Math.max(1, Math.min(count, 10)); // Between 1 and 10
    
    // Gerar conteúdo aleatório
    const randomContent = generateRandomContent(count);
    
    // Resposta com o conteúdo gerado
    return new Response(
      JSON.stringify({
        success: true,
        items: randomContent
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error generating spiritual content:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro ao gerar conteúdo espiritual'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
