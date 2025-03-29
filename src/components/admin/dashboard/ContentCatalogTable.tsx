
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudyCardProps } from "@/components/StudyCard";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Library, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContentCatalogTableProps {
  items: StudyCardProps[];
}

export const ContentCatalogTable = ({ items }: ContentCatalogTableProps) => {
  const navigate = useNavigate();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4 text-primary" />;
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "document":
        return <Library className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "article":
        return "Artigo";
      case "video":
        return "Vídeo";
      case "document":
        return "Documento";
      default:
        return type;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "video":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "document":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      default:
        return "";
    }
  };
  
  const getCreatedAt = (item: StudyCardProps) => {
    if (!item.createdAt) return "Data desconhecida";
    
    try {
      return formatDistanceToNow(new Date(item.createdAt), {
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return "Data inválida";
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Criado</TableHead>
            <TableHead className="hidden md:table-cell">Visualizações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhum conteúdo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Badge className={`flex gap-1 items-center ${getBadgeColor(item.type)}`} variant="outline">
                    {getTypeIcon(item.type)}
                    <span>{getTypeLabel(item.type)}</span>
                  </Badge>
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {item.title}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {getCreatedAt(item)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {item.views || 0}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(`/admin/acervo?edit=${item.id}`)}
                    title="Visualizar conteúdo"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
