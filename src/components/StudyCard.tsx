
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface StudyCardProps {
  id: number;
  title: string;
  type: "article" | "video" | "document";
  thumbnail: string;
  excerpt: string;
  link: string;
  className?: string;
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
      </div>
      
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-lg font-mystical text-foreground mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{excerpt}</p>
        
        <Link 
          to={link} 
          className="mt-auto inline-flex items-center text-primary hover:text-accent transition-colors"
        >
          Ler mais <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
