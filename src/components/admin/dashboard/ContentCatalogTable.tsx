
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
import { Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getTypeIcon, getTypeLabel, getBadgeColor } from "@/components/admin/acervo/AcervoTypeUtils";

interface ContentCatalogTableProps {
  items: StudyCardProps[];
}

export const ContentCatalogTable = ({ items }: ContentCatalogTableProps) => {
  const navigate = useNavigate();
  
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

  // Extract domain from URL for better source display
  const getSourceDomain = (link: string) => {
    try {
      const url = new URL(link);
      return url.hostname.replace('www.', '');
    } catch (e) {
      return "fonte desconhecida";
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Fonte</TableHead>
            <TableHead className="hidden md:table-cell">Criado</TableHead>
            <TableHead className="hidden md:table-cell">Visualizações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
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
                  <span className="text-xs">{getSourceDomain(item.link)}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {getCreatedAt(item)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {item.views || 0}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => navigate(`/admin/acervo?edit=${item.id}`)}
                      title="Editar conteúdo"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      as="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir fonte original"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
