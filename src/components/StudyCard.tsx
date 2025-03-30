
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { isYouTubeUrl } from "@/utils/videoUtils";

export interface StudyCardProps {
  id: number;
  title: string;
  type: "article" | "video" | "document";
  thumbnail: string;
  excerpt: string;
  link: string;
  className?: string;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function StudyCard({ id, title, type, thumbnail, excerpt, link, className }: StudyCardProps) {
  const typeIcons = {
    article: "📝",
    video: "🎬",
    document: "📚"
  };
  
  const typeLabels = {
    article: "Artigo",
    video: "Vídeo",
    document: "Documento"
  };

  const isVideo = type === "video";
  const isArticleOrDocument = type === "article" || type === "document";
  
  // Determine the destination based on content type
  const destination = isVideo 
    ? `/acervo/video/${id}` 
    : isArticleOrDocument
      ? `/acervo/content/${id}`
      : link;
  
  const isExternalLink = !isVideo && !isArticleOrDocument && !link.startsWith('/');
  
  const LinkComponent = isExternalLink 
    ? ({ children }: { children: React.ReactNode }) => (
        <a href={link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center text-primary hover:text-accent transition-colors">
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <Link to={destination} className="mt-auto inline-flex items-center text-primary hover:text-accent transition-colors">
          {children}
        </Link>
      );
  
  return (
    <div className={cn("mystic-card group h-full flex flex-col", className)}>
      <div className="relative h-40 overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm text-accent px-2 py-1 rounded text-xs font-medium">
          {typeIcons[type]} {typeLabels[type]}
        </div>
        
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center 
                           transform transition-transform group-hover:scale-110">
              <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-lg font-mystical text-foreground mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{excerpt}</p>
        
        <LinkComponent>
          {isVideo ? "Assistir vídeo" : isArticleOrDocument ? "Ler mais" : "Acessar conteúdo"}
          {isExternalLink ? (
            <ExternalLink className="ml-1 h-4 w-4" />
          ) : (
            <ArrowRight className="ml-1 h-4 w-4" />
          )}
        </LinkComponent>
      </div>
    </div>
  );
}
