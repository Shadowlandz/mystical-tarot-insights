
import { Edit, Trash2, Eye, Calendar } from "lucide-react";
import { useState } from "react";
import { StudyCardProps } from "@/components/StudyCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VideoPlayer from "@/components/VideoPlayer";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { getTypeIcon, getTypeLabel } from "@/components/admin/acervo/AcervoTypeUtils";

interface AcervoItemCardProps {
  item: StudyCardProps;
  onEdit: (item: StudyCardProps) => void;
  onDelete: (id: number) => void;
  onPreview?: (item: StudyCardProps) => void;
}

export function AcervoItemCard({ item, onEdit, onDelete, onPreview }: AcervoItemCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const formatCreatedAt = (date: string | undefined) => {
    if (!date) return "Data desconhecida";
    
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  const handlePreviewToggle = () => {
    if (!isPreviewOpen && onPreview) {
      onPreview(item);
    }
    setIsPreviewOpen(!isPreviewOpen);
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-40 overflow-hidden relative group">
        <img 
          src={item.thumbnail} 
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Imagem+Indisponível';
          }}
        />
        
        {item.type === "video" && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handlePreviewToggle}
          >
            <Eye className="h-12 w-12 text-white" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {getTypeIcon(item.type)}
            <CardDescription>{getTypeLabel(item.type)}</CardDescription>
          </div>
          {item.views !== undefined && (
            <Badge variant="outline" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {item.views}
            </Badge>
          )}
        </div>
        <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
        
        {item.createdAt && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Criado {formatCreatedAt(item.createdAt)}</span>
          </div>
        )}
        
        {isPreviewOpen && item.type === "video" && (
          <div className="mt-4">
            <VideoPlayer videoUrl={item.link} title={item.title} />
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handlePreviewToggle}>
              Fechar prévia
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </TooltipTrigger>
          <TooltipContent>Editar este item</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </TooltipTrigger>
          <TooltipContent>Excluir este item permanentemente</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
