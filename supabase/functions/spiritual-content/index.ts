
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sources for spiritual content
const sources = [
  { name: "Espiritualidade na Prática", url: "https://espiritualidadenaprática.com" },
  { name: "Portal da Espiritualidade", url: "https://portalespiritual.com" },
  { name: "Mente Espiritual", url: "https://menteespiritual.com" },
  { name: "Luz Interior", url: "https://luzinterior.org" },
  { name: "Caminho da Paz", url: "https://caminhodapaz.org" }
];

// Spiritual topics
const topics = [
  "meditação", "yoga", "mindfulness", "tarô", "astrologia", 
  "cristais", "chakras", "energia universal", "intuição", 
  "espiritualidade", "autoconhecimento", "equilíbrio energético"
];

// Image placeholders for spiritual content
const imagePlaceholders = [
  "https://images.unsplash.com/photo-1531171074114-ce2fb0d97711?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532570204997-95c9903069e5?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574722772633-e4abe41ced20?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566513835522-a47aee7a0d4a?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567447426030-b7793211cc62?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562516155-e0c1ee44059b?w=800&h=600&auto=format&fit=crop",
];

// Generate spiritual titles
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

// Generate spiritual article excerpts
function generateExcerpt(topic: string): string {
  const templates = [
    `Descubra como ${topic} pode transformar sua percepção do mundo e conectá-lo com sua essência divina. Este estudo profundo revela práticas milenares que foram preservadas por antigas tradições e agora estão disponíveis para seu crescimento espiritual.`,
    
    `Neste artigo exclusivo, exploramos as dimensões ocultas de ${topic} e como esta prática pode ser integrada ao seu cotidiano para promover cura, equilíbrio e expansão de consciência.`,
    
    `A sabedoria ancestral de ${topic} traduzida para a vida moderna. Aprenda técnicas que mestres espirituais têm utilizado por séculos para alcançar estados elevados de paz interior e conexão universal.`,
    
    `Uma jornada através dos aspectos místicos e científicos de ${topic}. Este estudo combina conhecimentos esotéricos com descobertas da física quântica, revelando como a espiritualidade e a ciência estão interconectadas.`,
    
    `${topic} como portal para dimensões superiores de existência. Este guia prático oferece métodos comprovados para elevar sua frequência vibracional e acessar estados ampliados de consciência.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

// Generate content type (article, video, document)
function generateContentType(): "article" | "video" | "document" {
  const types: ("article" | "video" | "document")[] = ["article", "video", "document"];
  return types[Math.floor(Math.random() * types.length)];
}

function generateYoutubeVideoLink(): string {
  // Lista de IDs de vídeos do YouTube sobre espiritualidade
  const youtubeIds = [
    "cCFdM1k_JxI", // Meditação guiada
    "9KHLTZaJcR8", // Música de meditação
    "TPUTmXccllw", // Astrologia
    "UR2iFZERLdc", // Espiritualidade e ciência
    "lZ2h1k74JGc", // Tarô
    "Dx2EgQ7wr1c", // Chakras
    "4xpF-Bv9X0U", // Yoga
    "GRlZnlLf9Qc", // Mindfulness
    "L9XlBj6EzQA", // Reiki
    "lkFzSxYnvao"  // Espiritualidade moderna
  ];
  
  const randomId = youtubeIds[Math.floor(Math.random() * youtubeIds.length)];
  
  return randomId;
}

// Generate a spiritual content item
function generateSpiritualContentItem() {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const type = generateContentType();
  
  const title = generateTitle(topic);
  const excerpt = generateExcerpt(topic);
  
  // Generate appropriate link based on content type
  let link = "";
  if (type === "video") {
    const videoId = generateYoutubeVideoLink();
    link = `https://www.youtube.com/watch?v=${videoId}`;
  } else {
    // For articles and documents - source URL + generated path
    link = `${source.url}/artigos/${topic.toLowerCase().replace(/\s+/g, '-')}`;
  }
  
  // Set thumbnail based on content type
  const randomImageIndex = Math.floor(Math.random() * imagePlaceholders.length);
  const thumbnail = imagePlaceholders[randomImageIndex];
  
  return {
    title,
    type,
    thumbnail,
    excerpt: `${excerpt} Fonte: ${source.name}`,
    link
  };
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    let count = 3; // Default number of items to generate
    
    // Get parameters from request (if any)
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body && body.count && typeof body.count === 'number') {
          count = Math.min(Math.max(body.count, 1), 10); // Limit between 1 and 10
        }
      } catch (error) {
        console.error("Failed to parse request body:", error);
      }
    } else if (req.url.includes('?')) {
      const url = new URL(req.url);
      const countParam = url.searchParams.get('count');
      if (countParam && !isNaN(parseInt(countParam))) {
        count = Math.min(Math.max(parseInt(countParam), 1), 10); // Limit between 1 and 10
      }
    }
    
    // Generate the requested number of items
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(generateSpiritualContentItem());
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        items,
        message: `Generated ${items.length} spiritual content items`
      }),
      { 
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        } 
      }
    );
  } catch (error) {
    console.error("Error generating spiritual content:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to generate spiritual content"
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        } 
      }
    );
  }
});
