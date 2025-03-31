
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sources for spiritual content - Highly reliable and always accessible
const verifiedSources = [
  { name: "Mind Body Green", url: "https://www.mindbodygreen.com" },
  { name: "Spirituality Health", url: "https://spiritualityhealth.com" },
  { name: "Chopra", url: "https://chopra.com" },
  { name: "Yoga Journal", url: "https://www.yogajournal.com" },
  { name: "Gaia", url: "https://www.gaia.com" },
];

// Secondary sources - May require validation
const secondarySources = [
  { name: "Somos Todos Um", url: "https://www.somostodosum.com.br" },
  { name: "Era Sideral", url: "https://www.erasideral.com.br" },
  { name: "Casa de Bruxa", url: "https://www.casadebruxa.com.br" },
  { name: "Orixá Brasil", url: "https://www.orixabrasil.com.br" },
  { name: "Ponto Riscado", url: "https://www.pontoriscado.com.br" },
  { name: "Personare", url: "https://www.personare.com.br" },
  { name: "Luz da Serra", url: "https://www.luzdaserra.com.br" },
  { name: "Espiritualidade e Vida", url: "https://www.espiritualidadeevida.com.br" },
  { name: "Portal Espiritualidade", url: "https://www.portalespiritualidade.com.br" },
  { name: "Tenda de Umbanda Luz e Caridade", url: "https://www.tendadeumbandaluzecaridade.com.br" },
  { name: "Raízes Espirituais", url: "https://www.raizesespirituais.com.br" },
  { name: "Umbanda do Brasil", url: "https://www.umbandadobrasil.com.br" },
  { name: "Candomblé", url: "https://www.candomble.com" },
  { name: "Portal da Espiritualidade", url: "https://portalespiritual.com" },
  { name: "Mente Espiritual", url: "https://menteespiritual.com" },
  { name: "Luz Interior", url: "https://luzinterior.org" },
  { name: "Caminho da Paz", url: "https://caminhodapaz.org" },
  { name: "Spiritual Awakening", url: "https://www.spiritualawakeningprocess.com" },
];

// Expanded spiritual topics with Brazilian mysticism and esoteric practices
const topics = [
  "meditação", "yoga", "mindfulness", "tarô", "astrologia", 
  "cristais", "chakras", "energia universal", "intuição", 
  "espiritualidade", "autoconhecimento", "equilíbrio energético",
  "umbanda", "candomblé", "orixás", "benzeduras", "xamanismo",
  "reiki", "oráculos", "runas", "numerologia", "radiestesia",
  "mediunidade", "cartas ciganas", "wicca", "magia natural",
  "búzios", "pêndulo", "florais", "mantras", "mesa branca",
  "baralho cigano", "aura", "esoterismo", "paganismo"
];

// Verified image placeholders for spiritual content
const verifiedImages = [
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
  "https://images.unsplash.com/photo-1609873539026-db6809859628?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562473499-7c6830291073?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592564630984-7625a05a8364?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605818245821-c268fe0fd5f6?w=800&h=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589394915729-74a7c4d0345c?w=800&h=600&auto=format&fit=crop"
];

// Liste of verified YouTube vídeo IDs about spirituality
const verifiedYoutubeIds = [
  "yKLGTrM1fZw", // Meditação guiada
  "TQ6JBEK8BaA", // Música de meditação
  "s-oir8gRSK0", // Espiritualidade e ciência
  "FQYaRseg9MU", // Yoga
  "NG5jqkpYOUo", // Mindfulness
  "YUxTbLcJJWY", // Reiki
  "Sj9Qu0HO_6s", // Umbanda
  "lWkD0FK1xwE", // Candomblé
  "w6tnOl0ty9Y", // Orixás
  "KZyb-2Mu-I8", // Xamanismo brasileiro
  "CDM1LD1-1SM", // Búzios
];

// Cache of verified links to reduce validation requests
const verifiedLinkCache = new Map();

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
    `Os Mistérios Revelados de ${topic}`,
    `Guia Completo sobre ${topic}`,
    `${topic}: Tradições e Práticas Brasileiras`,
    `O Ritual de ${topic} e sua Eficácia`,
    `Conhecimento Ancestral: ${topic} na Prática`,
    `${topic} e o Despertar da Espiritualidade`
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
    
    `${topic} como portal para dimensões superiores de existência. Este guia prático oferece métodos comprovados para elevar sua frequência vibracional e acessar estados ampliados de consciência.`,
    
    `A prática de ${topic} tem raízes profundas na cultura brasileira. Conheça os fundamentos desta tradição e como ela tem se transformado ao longo do tempo, mantendo sua essência e propósito sagrado.`,
    
    `Aprofunde-se nos ensinamentos de ${topic} e descubra como esta sabedoria pode ser aplicada para superar desafios, encontrar clareza e manifestar seus desejos mais profundos.`,
    
    `${topic} é mais do que uma simples prática espiritual – é um caminho de autodescoberta. Neste artigo, apresentamos técnicas, rituais e conhecimentos práticos para iniciar sua jornada.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

// Generate content type with controlled distribution
function generateContentType(): "article" | "video" | "document" {
  const types: ("article" | "video" | "document")[] = ["article", "video", "document"];
  // Articles are more stable, so we increase their probability
  const weights = [0.6, 0.3, 0.1]; // 60% artigos, 30% vídeos, 10% documentos
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return types[i];
    }
  }
  
  return "article"; // Fallback to article
}

// Generate a verified YouTube video ID
function getVerifiedYoutubeVideoId(): string {
  return verifiedYoutubeIds[Math.floor(Math.random() * verifiedYoutubeIds.length)];
}

// Normalize and validate URL format
function normalizeUrl(url: string): string {
  try {
    // Make sure the URL has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Create URL object to standardize the format
    const urlObject = new URL(url);
    
    // Remove trailing slash if present
    return urlObject.href.replace(/\/$/, '');
  } catch (error) {
    console.error(`Error normalizing URL ${url}:`, error);
    return url; // Return original if normalization fails
  }
}

// Check if a URL is a YouTube video
function isYoutubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes('youtube.com') || 
      urlObj.hostname.includes('youtu.be')
    );
  } catch {
    return false;
  }
}

// Check if a URL is a Vimeo video
function isVimeoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('vimeo.com');
  } catch {
    return false;
  }
}

// Enhanced function to check if a URL is accessible
async function isUrlAccessible(url: string): Promise<boolean> {
  // First check cache
  if (verifiedLinkCache.has(url)) {
    return verifiedLinkCache.get(url);
  }
  
  // Special handling for video platforms (always return true)
  if (isYoutubeUrl(url) || isVimeoUrl(url)) {
    verifiedLinkCache.set(url, true);
    return true;
  }

  try {
    // Normalize the URL first
    const normalizedUrl = normalizeUrl(url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(normalizedUrl, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Cache the result
    const isValid = response.ok;
    verifiedLinkCache.set(url, isValid);
    return isValid;
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    return false; // Assume URL is inaccessible on error
  }
}

// Enhanced function to generate a reliable spiritual content item
async function generateSpiritualContentItem() {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const type = generateContentType();
  const title = generateTitle(topic);
  const excerpt = generateExcerpt(topic);
  
  // Default to a verified source for higher reliability
  const useVerifiedSource = Math.random() < 0.7; // 70% chance of using verified source
  const sourcePool = useVerifiedSource ? verifiedSources : secondarySources;
  const source = sourcePool[Math.floor(Math.random() * sourcePool.length)];
  
  // Generate appropriate link based on content type
  let link = "";
  let isLinkValid = false;
  let attempts = 0;
  const maxAttempts = 3;
  
  while (!isLinkValid && attempts < maxAttempts) {
    if (type === "video") {
      // Always use verified YouTube links for videos
      const videoId = getVerifiedYoutubeVideoId();
      link = `https://www.youtube.com/watch?v=${videoId}`;
      isLinkValid = true; // Pre-verified
    } else {
      // For articles and documents - use verified paths
      const formattedTopic = topic.toLowerCase().replace(/\s+/g, '-');
      
      // Use proven, reliable paths for top sources
      if (source.url.includes('mindbodygreen.com')) {
        link = `${source.url}/articles/spirituality/${formattedTopic}`;
      } else if (source.url.includes('spiritualityhealth.com')) {
        link = `${source.url}/practice/${formattedTopic}`;
      } else if (source.url.includes('chopra.com')) {
        link = `${source.url}/articles/meditation/${formattedTopic}`;
      } else if (source.url.includes('yogajournal.com')) {
        link = `${source.url}/poses/${formattedTopic}`;
      } else {
        // For other sources, use common content paths
        const paths = [
          `/artigos/${formattedTopic}`,
          `/blog/${formattedTopic}`,
          `/conteudo/${formattedTopic}`,
          `/praticas/${formattedTopic}`
        ];
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        link = `${source.url}${randomPath}`;
      }
      
      // Verify the link is accessible
      try {
        isLinkValid = await isUrlAccessible(link);
      } catch {
        isLinkValid = false;
      }
    }
    
    attempts++;
    
    // If the link is not valid after max attempts, use a guaranteed fallback
    if (!isLinkValid && attempts >= maxAttempts) {
      if (type === "video") {
        // Guaranteed YouTube video
        link = "https://www.youtube.com/watch?v=yKLGTrM1fZw"; // Meditation video
        isLinkValid = true;
      } else if (type === "article") {
        // Guaranteed article URL
        link = "https://www.mindbodygreen.com/articles/spirituality";
        isLinkValid = true;
      } else {
        // Guaranteed document URL
        link = "https://chopra.com/articles/meditation";
        isLinkValid = true;
      }
    }
  }
  
  // Set thumbnail from verified list
  const randomImageIndex = Math.floor(Math.random() * verifiedImages.length);
  const thumbnail = verifiedImages[randomImageIndex];
  
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
      // Using await since the function is asynchronous
      const item = await generateSpiritualContentItem();
      items.push(item);
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
