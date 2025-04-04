
import { useState, useEffect } from "react";
import { StudyCardProps } from "@/components/StudyCard";
import { AcervoItemCard } from "@/components/admin/acervo/AcervoItemCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VideosListProps {
  items: StudyCardProps[];
  isLoading: boolean;
  onEdit: (item: StudyCardProps) => void;
  onDelete: (id: number) => void;
  onPreview: (item: StudyCardProps) => void;
  onAddClick: () => void;
}

export function VideosList({
  items,
  isLoading,
  onEdit,
  onDelete,
  onPreview,
  onAddClick
}: VideosListProps) {
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
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <div className="text-4xl mb-2">🎬</div>
        <h3 className="text-xl font-semibold mb-2">Nenhum vídeo encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Adicione novos vídeos ou altere os critérios de busca.
        </p>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Vídeo
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
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
