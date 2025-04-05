
import { StudyCardProps } from "@/components/StudyCard";
import { AcervoItemCard } from "@/components/admin/acervo/AcervoItemCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentType } from "@/components/admin/acervo/AcervoTypeUtils";

interface ArticlesListProps {
  items: StudyCardProps[];
  isLoading: boolean;
  onEdit: (item: StudyCardProps) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
  contentType: ContentType;
}

export function ArticlesList({ 
  items, 
  isLoading, 
  onEdit, 
  onDelete, 
  onAddNew,
  contentType
}: ArticlesListProps) {
  const getEmptyStateText = () => {
    return {
      title: contentType === 'article' ? "Nenhum artigo encontrado" : "Nenhum documento encontrado",
      description: contentType === 'article' 
        ? "Adicione novos artigos ou altere os critérios de busca."
        : "Adicione novos documentos ou altere os critérios de busca.",
      emoji: contentType === 'article' ? "📝" : "📚",
      buttonText: contentType === 'article' ? "Adicionar Artigo" : "Adicionar Documento"
    };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-md p-4 bg-muted">
            <div className="h-40 bg-secondary rounded-md mb-2"></div>
            <div className="h-6 bg-secondary rounded-md mb-2"></div>
            <div className="h-4 bg-secondary rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    const emptyState = getEmptyStateText();
    
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <div className="text-4xl mb-2">{emptyState.emoji}</div>
        <h3 className="text-xl font-semibold mb-2">{emptyState.title}</h3>
        <p className="text-muted-foreground mb-4">
          {emptyState.description}
        </p>
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          {emptyState.buttonText}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <AcervoItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
