
import { Edit, Trash2, FileText, Video, Library, Eye } from "lucide-react";
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

interface AcervoItemCardProps {
  item: StudyCardProps;
  onEdit: (item: StudyCardProps) => void;
  onDelete: (id: number) => void;
}

export function AcervoItemCard({ item, onEdit, onDelete }: AcervoItemCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const TypeIcon = ({ type }: { type: "article" | "video" | "document" }) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4 text-primary" />;
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "document":
        return <Library className="h-4 w-4 text-orange-500" />;
    }
  };

  const getTypeLabel = (type: "article" | "video" | "document") => {
    switch (type) {
      case "article":
        return "Artigo";
      case "video":
        return "Vídeo";
      case "document":
        return "Documento";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-40 overflow-hidden relative group">
        <img 
          src={item.thumbnail} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
        
        {item.type === "video" && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="h-12 w-12 text-white" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TypeIcon type={item.type} />
          <CardDescription>{getTypeLabel(item.type)}</CardDescription>
        </div>
        <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
        
        {isPreviewOpen && item.type === "video" && (
          <div className="mt-4">
            <VideoPlayer videoUrl={item.link} title={item.title} />
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => setIsPreviewOpen(false)}>
              Fechar prévia
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
