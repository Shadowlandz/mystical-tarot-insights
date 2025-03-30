
/**
 * Utilitário para validar links e garantir que estão funcionando corretamente
 */

import { isVideoUrl, extractYouTubeId, isYouTubeUrl, extractVimeoId, isVimeoUrl } from "./videoUtils";

/**
 * Interface para resultado da validação de link
 */
export interface LinkValidationResult {
  isValid: boolean;
  status?: number;
  message: string;
  thumbnail?: string | null;
}

/**
 * Valida um link para garantir que está acessível
 * @param url URL a ser validada
 * @returns Resultado da validação com status e mensagem
 */
export async function validateLink(url: string): Promise<LinkValidationResult> {
  if (!url) {
    return { 
      isValid: false, 
      message: "URL não fornecida" 
    };
  }
  
  try {
    // Para URLs de vídeo do YouTube, usamos uma abordagem diferente
    if (isYouTubeUrl(url)) {
      return await validateYouTubeVideo(url);
    }
    
    // Para URLs de vídeo do Vimeo
    if (isVimeoUrl(url)) {
      return await validateVimeoVideo(url);
    }
    
    // Para outros URLs, tentamos fazer uma requisição HEAD
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    
    if (response.ok) {
      return {
        isValid: true,
        status: response.status,
        message: "Link válido e acessível"
      };
    } else {
      return {
        isValid: false,
        status: response.status,
        message: `Erro ao acessar URL: Status ${response.status}`
      };
    }
  } catch (error) {
    console.error("Erro ao validar link:", error);
    return {
      isValid: false,
      message: `Erro de conexão: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Valida um vídeo do YouTube verificando se o ID existe
 * @param youtubeUrl URL do YouTube a ser validada
 * @returns Resultado da validação
 */
async function validateYouTubeVideo(youtubeUrl: string): Promise<LinkValidationResult> {
  const videoId = extractYouTubeId(youtubeUrl);
  
  if (!videoId) {
    return {
      isValid: false,
      message: "ID de vídeo do YouTube inválido"
    };
  }
  
  try {
    // Verificamos se o thumbnail existe, se existir, o vídeo é válido
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const response = await fetch(thumbnailUrl, { method: 'HEAD' });
    
    if (response.ok) {
      return {
        isValid: true,
        message: "Vídeo do YouTube válido e acessível",
        thumbnail: thumbnailUrl
      };
    } else {
      return {
        isValid: false,
        status: response.status,
        message: "Vídeo do YouTube não encontrado ou indisponível"
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message: `Erro ao verificar vídeo do YouTube: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Valida um vídeo do Vimeo verificando se o ID existe
 * @param vimeoUrl URL do Vimeo a ser validada
 * @returns Resultado da validação
 */
async function validateVimeoVideo(vimeoUrl: string): Promise<LinkValidationResult> {
  const videoId = extractVimeoId(vimeoUrl);
  
  if (!videoId) {
    return {
      isValid: false,
      message: "ID de vídeo do Vimeo inválido"
    };
  }
  
  try {
    // Para o Vimeo, fazemos uma requisição à URL de embed
    const embedUrl = `https://player.vimeo.com/video/${videoId}`;
    const response = await fetch(embedUrl, { method: 'HEAD' });
    
    if (response.ok) {
      return {
        isValid: true,
        message: "Vídeo do Vimeo válido e acessível"
      };
    } else {
      return {
        isValid: false,
        status: response.status,
        message: "Vídeo do Vimeo não encontrado ou indisponível"
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message: `Erro ao verificar vídeo do Vimeo: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Verifica a validade de um conjunto de links
 * @param links Array de URLs para verificar
 * @returns Array com os resultados das validações
 */
export async function validateMultipleLinks(links: string[]): Promise<{url: string, result: LinkValidationResult}[]> {
  const results = [];
  
  for (const url of links) {
    const result = await validateLink(url);
    results.push({ url, result });
  }
  
  return results;
}
