
import { Edit, Trash2, FileText, Video, Library } from "lucide-react";
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

interface AcervoItemCardProps {
  item: StudyCardProps;
  onEdit: (item: StudyCardProps) => void;
  onDelete: (id: number) => void;
}

export function AcervoItemCard({ item, onEdit, onDelete }: AcervoItemCardProps) {
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
      <div className="h-40 overflow-hidden">
        <img 
          src={item.thumbnail} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
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
