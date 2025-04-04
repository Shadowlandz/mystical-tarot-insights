
import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getVideoEmbedUrl } from "@/utils/videoUtils";
import { Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
}

const VideoPlayer = ({ videoUrl, title, className, autoPlay = false }: VideoPlayerProps) => {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simplified video loading without validation
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert the URL to an embed URL
      const url = getVideoEmbedUrl(videoUrl);
      if (!url) {
        setError("URL de vídeo inválida");
        setIsLoading(false);
        return;
      }
      
      setEmbedUrl(url);
    } catch (err) {
      setError(`Erro ao processar vídeo: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-muted rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md overflow-hidden">
        <Alert variant="destructive" className="flex flex-col items-center text-center p-6 bg-muted">
          <AlertTriangle className="h-12 w-12 mb-2" />
          <AlertTitle className="text-xl">Erro no vídeo</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Voltar
            </Button>
            <Button asChild>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                Acessar fonte original
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!embedUrl) {
    return <div className="p-4 bg-muted rounded-md">URL de vídeo inválida</div>;
  }

  const videoParams = new URLSearchParams({
    autoplay: autoPlay ? '1' : '0',
    controls: '1',
    modestbranding: '1',
    rel: '0',
    showinfo: '0'
  }).toString();

  return (
    <div className={className}>
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={`${embedUrl}?${videoParams}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md"
          onError={() => {
            setError("Erro ao carregar o vídeo");
            setIsLoading(false);
          }}
        />
      </AspectRatio>
    </div>
  );
};

export default VideoPlayer;
