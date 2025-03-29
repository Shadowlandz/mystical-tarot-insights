
import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getVideoEmbedUrl } from "@/utils/videoUtils";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  className?: string;
}

const VideoPlayer = ({ videoUrl, title, className }: VideoPlayerProps) => {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    // Converter a URL para uma URL de embed
    const url = getVideoEmbedUrl(videoUrl);
    setEmbedUrl(url);
  }, [videoUrl]);

  if (!embedUrl) {
    return <div className="p-4 bg-muted rounded-md">URL de vídeo inválida</div>;
  }

  return (
    <div className={className}>
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md"
        />
      </AspectRatio>
    </div>
  );
};

export default VideoPlayer;
