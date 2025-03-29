
/**
 * Utilitário para manipulação de vídeos e extração de thumbnails
 */

/**
 * Extrai o ID de um vídeo do YouTube a partir da URL
 */
export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Gera URL da thumbnail do YouTube baseado no ID do vídeo
 * Retorna a thumbnail de alta qualidade (hqdefault)
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Verifica se a URL é do YouTube
 */
export function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * Verifica se a URL é do Vimeo
 */
export function isVimeoUrl(url: string): boolean {
  return url.includes('vimeo.com');
}

/**
 * Extrai o ID de um vídeo do Vimeo a partir da URL
 */
export function extractVimeoId(url: string): string | null {
  const regExp = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?))/;
  const match = url.match(regExp);
  
  return match && match[1] ? match[1] : null;
}

/**
 * Obtém a thumbnail de um vídeo do Vimeo (retorna a URL da API do Vimeo)
 * Nota: Para uso real, seria necessário fazer uma chamada à API do Vimeo para obter a URL real da thumbnail
 */
export function getVimeoThumbnailUrl(videoId: string): string | null {
  // Em uma implementação real, você faria uma chamada à API do Vimeo
  // https://api.vimeo.com/videos/{videoId}
  // Como isso exigiria uma chave de API, retornamos null por enquanto
  return null;
}

/**
 * Obtém automaticamente a thumbnail para uma URL de vídeo
 * Suporta YouTube e possui estrutura para suportar Vimeo
 */
export function getVideoThumbnail(videoUrl: string): string | null {
  if (isYouTubeUrl(videoUrl)) {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      return getYouTubeThumbnail(videoId);
    }
  } else if (isVimeoUrl(videoUrl)) {
    const videoId = extractVimeoId(videoUrl);
    if (videoId) {
      // Vimeo requer API para thumbnails de alta qualidade
      // Em uma implementação real, você faria uma chamada à API do Vimeo
      return null;
    }
  }
  
  // Retorna null se não conseguir extrair a thumbnail
  return null;
}

/**
 * Converte URL de vídeo do YouTube para URL de embed
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Converte URL de vídeo do Vimeo para URL de embed
 */
export function getVimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}`;
}

/**
 * Obtém URL para embed de vídeo
 */
export function getVideoEmbedUrl(videoUrl: string): string | null {
  if (isYouTubeUrl(videoUrl)) {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      return getYouTubeEmbedUrl(videoId);
    }
  } else if (isVimeoUrl(videoUrl)) {
    const videoId = extractVimeoId(videoUrl);
    if (videoId) {
      return getVimeoEmbedUrl(videoId);
    }
  }
  
  // Retorna a URL original se não for possível converter
  return videoUrl;
}

/**
 * Verifica se a URL é um vídeo
 */
export function isVideoUrl(url: string): boolean {
  return isYouTubeUrl(url) || isVimeoUrl(url);
}
