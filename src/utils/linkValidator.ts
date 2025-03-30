
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
 * Opções para configuração da validação de links
 */
export interface LinkValidationOptions {
  timeout?: number;
  retries?: number;
  userAgent?: string;
  followRedirects?: boolean;
}

const DEFAULT_OPTIONS: LinkValidationOptions = {
  timeout: 8000,
  retries: 2,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  followRedirects: true
};

/**
 * Função para tentar uma requisição com retry em caso de falha
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number
): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Aguarda antes de tentar novamente (backoff exponencial)
    await new Promise(resolve => setTimeout(resolve, 1000));
    return fetchWithRetry(url, options, retries - 1);
  }
}

/**
 * Valida um link para garantir que está acessível
 * @param url URL a ser validada
 * @param options Opções de configuração para a validação
 * @returns Resultado da validação com status e mensagem
 */
export async function validateLink(
  url: string,
  options: LinkValidationOptions = {}
): Promise<LinkValidationResult> {
  if (!url) {
    return { 
      isValid: false, 
      message: "URL não fornecida" 
    };
  }

  // Normaliza a URL para adicionar https:// se necessário
  let normalizedUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    normalizedUrl = 'https://' + url;
  }
  
  // Mescla as opções padrão com as fornecidas
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Para URLs de vídeo do YouTube, usamos uma abordagem diferente
    if (isYouTubeUrl(normalizedUrl)) {
      return await validateYouTubeVideo(normalizedUrl, mergedOptions);
    }
    
    // Para URLs de vídeo do Vimeo
    if (isVimeoUrl(normalizedUrl)) {
      return await validateVimeoVideo(normalizedUrl, mergedOptions);
    }
    
    // Simula um HEAD request para verificar se o recurso existe
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);
    
    try {
      const response = await fetchWithRetry(
        normalizedUrl,
        { 
          method: 'HEAD',
          headers: {
            'User-Agent': mergedOptions.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Cache-Control': 'no-cache'
          },
          redirect: mergedOptions.followRedirects ? 'follow' : 'manual',
          signal: controller.signal
        },
        mergedOptions.retries
      );
      
      clearTimeout(timeoutId);
      
      // Tratamento de redirecionamentos
      if (response.redirected && !mergedOptions.followRedirects) {
        return {
          isValid: true,
          status: response.status,
          message: `Redirecionamento detectado para: ${response.url}`
        };
      }
      
      // Verifica os códigos de status
      if (response.ok) {
        return {
          isValid: true,
          status: response.status,
          message: "Link válido e acessível"
        };
      } else if (response.status >= 300 && response.status < 400) {
        // Redirecionamentos geralmente são válidos
        return {
          isValid: true,
          status: response.status,
          message: `Redirecionamento detectado (${response.status})`
        };
      } else {
        // Se HEAD falhou, tenta com GET como fallback
        // Alguns servidores não respondem bem a HEAD requests
        if (response.status === 405) { // Method Not Allowed
          return await validateWithGetRequest(normalizedUrl, mergedOptions);
        }
        
        return {
          isValid: false,
          status: response.status,
          message: `Erro ao acessar URL: Status ${response.status}`
        };
      }
    } catch (fetchError) {
      // Se ocorreu timeout ou AbortError, tentamos com GET como fallback
      if (fetchError.name === 'AbortError') {
        return await validateWithGetRequest(normalizedUrl, mergedOptions);
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error("Erro ao validar link:", error);
    
    // Tentativa de obter uma mensagem mais amigável sobre o erro
    let errorMessage = error instanceof Error ? error.message : String(error);
    
    // Formata as mensagens de erro para serem mais amigáveis
    if (errorMessage.includes('ENOTFOUND')) {
      errorMessage = "Domínio não encontrado. Verifique se a URL está correta.";
    } else if (errorMessage.includes('ETIMEDOUT')) {
      errorMessage = "Tempo de conexão esgotado. O servidor pode estar fora do ar.";
    } else if (errorMessage.includes('ECONNREFUSED')) {
      errorMessage = "Conexão recusada pelo servidor.";
    }
    
    return {
      isValid: false,
      message: `Erro de conexão: ${errorMessage}`
    };
  }
}

/**
 * Fallback para validação usando GET request quando HEAD não funciona
 */
async function validateWithGetRequest(
  url: string,
  options: LinkValidationOptions
): Promise<LinkValidationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);
    
    // Usamos GET, mas com uma solicitação limitada para economizar largura de banda
    const response = await fetchWithRetry(
      url,
      {
        method: 'GET',
        headers: {
          'User-Agent': options.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Range': 'bytes=0-1024' // Limita a quantidade de dados carregados
        },
        redirect: options.followRedirects ? 'follow' : 'manual',
        signal: controller.signal
      },
      options.retries
    );
    
    clearTimeout(timeoutId);
    
    return {
      isValid: response.ok,
      status: response.status,
      message: response.ok 
        ? "Link válido e acessível (verificado com GET)"
        : `Erro ao acessar URL: Status ${response.status}`
    };
  } catch (error) {
    return {
      isValid: false,
      message: `Erro na verificação GET: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Valida um vídeo do YouTube verificando se o ID existe
 * @param youtubeUrl URL do YouTube a ser validada
 * @param options Opções de configuração para a validação
 * @returns Resultado da validação
 */
async function validateYouTubeVideo(
  youtubeUrl: string,
  options: LinkValidationOptions
): Promise<LinkValidationResult> {
  const videoId = extractYouTubeId(youtubeUrl);
  
  if (!videoId) {
    return {
      isValid: false,
      message: "ID de vídeo do YouTube inválido"
    };
  }
  
  try {
    // Verifica a disponibilidade do vídeo usando a API de oEmbed do YouTube
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);
    
    const response = await fetchWithRetry(
      oembedUrl, 
      {
        headers: { 'User-Agent': options.userAgent },
        signal: controller.signal
      },
      options.retries
    );
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      // Se a API de oEmbed responde, o vídeo está disponível
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      return {
        isValid: true,
        message: "Vídeo do YouTube válido e acessível",
        thumbnail: thumbnailUrl
      };
    } else {
      // Fallback para o método de verificação de thumbnail
      return await validateYouTubeThumbnail(videoId, options);
    }
  } catch (error) {
    // Se falhar, tentamos o método da thumbnail como fallback
    return await validateYouTubeThumbnail(videoId, options);
  }
}

/**
 * Método alternativo para validar vídeos do YouTube usando thumbnails
 */
async function validateYouTubeThumbnail(
  videoId: string,
  options: LinkValidationOptions
): Promise<LinkValidationResult> {
  try {
    // Verificamos se o thumbnail existe, se existir, o vídeo é válido
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);
    
    const response = await fetchWithRetry(
      thumbnailUrl, 
      { 
        method: 'HEAD',
        headers: { 'User-Agent': options.userAgent },
        signal: controller.signal
      },
      options.retries
    );
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return {
        isValid: true,
        message: "Vídeo do YouTube válido (verificado via thumbnail)",
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
 * @param options Opções de configuração para a validação
 * @returns Resultado da validação
 */
async function validateVimeoVideo(
  vimeoUrl: string,
  options: LinkValidationOptions
): Promise<LinkValidationResult> {
  const videoId = extractVimeoId(vimeoUrl);
  
  if (!videoId) {
    return {
      isValid: false,
      message: "ID de vídeo do Vimeo inválido"
    };
  }
  
  try {
    // Verifica a disponibilidade do vídeo usando a API de oEmbed do Vimeo
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);
    
    const response = await fetchWithRetry(
      oembedUrl, 
      {
        headers: { 'User-Agent': options.userAgent },
        signal: controller.signal
      },
      options.retries
    );
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      // Se a API de oEmbed responde, o vídeo está disponível
      const data = await response.json();
      return {
        isValid: true,
        message: "Vídeo do Vimeo válido e acessível",
        thumbnail: data.thumbnail_url
      };
    } else {
      // Fallback para o método de verificação de embed
      return await validateVimeoEmbed(videoId, options);
    }
  } catch (error) {
    // Se falhar, tentamos o método do embed como fallback
    return await validateVimeoEmbed(videoId, options);
  }
}

/**
 * Método alternativo para validar vídeos do Vimeo usando a URL de embed
 */
async function validateVimeoEmbed(
  videoId: string,
  options: LinkValidationOptions
): Promise<LinkValidationResult> {
  try {
    // Para o Vimeo, fazemos uma requisição à URL de embed
    const embedUrl = `https://player.vimeo.com/video/${videoId}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);
    
    const response = await fetchWithRetry(
      embedUrl, 
      { 
        method: 'HEAD',
        headers: { 'User-Agent': options.userAgent },
        signal: controller.signal
      }, 
      options.retries
    );
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return {
        isValid: true,
        message: "Vídeo do Vimeo válido (verificado via embed)"
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
 * @param options Opções de configuração para a validação
 * @returns Array com os resultados das validações
 */
export async function validateMultipleLinks(
  links: string[],
  options: LinkValidationOptions = {}
): Promise<{url: string, result: LinkValidationResult}[]> {
  const results = [];
  
  for (const url of links) {
    const result = await validateLink(url, options);
    results.push({ url, result });
  }
  
  return results;
}
