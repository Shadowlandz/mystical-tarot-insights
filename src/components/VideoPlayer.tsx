
import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getVideoEmbedUrl } from "@/utils/videoUtils";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
}

const VideoPlayer = ({ videoUrl, title, className, autoPlay = false }: VideoPlayerProps) => {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Converter a URL para uma URL de embed
    const url = getVideoEmbedUrl(videoUrl);
    setEmbedUrl(url);
    setIsLoading(false);
  }, [videoUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-muted rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!embedUrl) {
    return <div className="p-4 bg-muted rounded-md">URL de vídeo inválida</div>;
  }

  return (
    <div className={className}>
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={`${embedUrl}${autoPlay ? '?autoplay=1' : ''}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md"
          onLoad={() => setIsLoading(false)}
        />
      </AspectRatio>
    </div>
  );
};

export default VideoPlayer;
