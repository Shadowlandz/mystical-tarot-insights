
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
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Verifica se a URL é do YouTube
 */
export function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * Obtém automaticamente a thumbnail para uma URL de vídeo
 * Atualmente suporta apenas YouTube, mas pode ser expandido para outros serviços
 */
export function getVideoThumbnail(videoUrl: string): string | null {
  if (isYouTubeUrl(videoUrl)) {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      return getYouTubeThumbnail(videoId);
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
 * Obtém URL para embed de vídeo
 */
export function getVideoEmbedUrl(videoUrl: string): string | null {
  if (isYouTubeUrl(videoUrl)) {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      return getYouTubeEmbedUrl(videoId);
    }
  }
  
  // Retorna a URL original se não for possível converter
  return videoUrl;
}
