
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StudyCardProps } from "@/components/StudyCard";
import { AcervoFormValues } from "@/components/admin/acervo/AcervoForm";
import { AcervoItemCard } from "@/components/admin/acervo/AcervoItemCard";
import { AcervoDialog } from "@/components/admin/acervo/AcervoDialog";

const AdminAcervoPage = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Dados de exemplo - em produção, seriam carregados do banco de dados
  const [acervoItems, setAcervoItems] = useState<StudyCardProps[]>([
    {
      id: 1,
      title: "Introdução ao Tarot de Rider-Waite",
      type: "article",
      thumbnail: "https://images.unsplash.com/photo-1600080699037-d779153fca2d?q=80&w=500",
      excerpt: "Um guia completo sobre o baralho de Tarot mais popular e suas origens.",
      link: "/acervo/artigo/introducao-rider-waite",
    },
    {
      id: 2,
      title: "Como Interpretar o Arcano 'O Louco'",
      type: "video",
      thumbnail: "https://images.unsplash.com/photo-1659078603811-2c19b9b62fa8?q=80&w=500",
      excerpt: "Análise profunda do significado e interpretações da carta 'O Louco' no Tarot.",
      link: "/acervo/video/interpretar-o-louco",
    },
    {
      id: 3,
      title: "Manual Completo de Tarot",
      type: "document",
      thumbnail: "https://images.unsplash.com/photo-1572856330944-6d9a552c38f9?q=80&w=500",
      excerpt: "Um documento abrangente com todos os arcanos maiores e menores explicados em detalhes.",
      link: "/acervo/documento/manual-completo",
    },
  ]);

  const handleAddItem = (values: AcervoFormValues) => {
    if (isEditing && editingId !== null) {
      // Atualizar item existente
      setAcervoItems(prev => 
        prev.map(item => 
          item.id === editingId 
            ? { 
                id: item.id,
                title: values.title,
                type: values.type,
                thumbnail: values.thumbnail,
                excerpt: values.excerpt,
                link: values.link
              } 
            : item
        )
      );
      toast({
        title: "Item atualizado",
        description: "O item do acervo foi atualizado com sucesso",
      });
    } else {
      // Adicionar novo item - garantir que todas as propriedades são fornecidas
      const newItem: StudyCardProps = {
        id: Math.max(0, ...acervoItems.map(item => item.id)) + 1,
        title: values.title,
        type: values.type,
        thumbnail: values.thumbnail,
        excerpt: values.excerpt,
        link: values.link
      };
      setAcervoItems(prev => [...prev, newItem]);
      toast({
        title: "Item adicionado",
        description: "Um novo item foi adicionado ao acervo",
      });
    }
    
    // Resetar estado e fechar dialog
    resetAndCloseDialog();
  };

  const handleEditItem = (item: StudyCardProps) => {
    setIsEditing(true);
    setEditingId(item.id);
    
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      setAcervoItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Item excluído",
        description: "O item foi removido do acervo",
      });
    }
  };

  const resetAndCloseDialog = () => {
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  // Get current item being edited (for form default values)
  const currentItem = isEditing && editingId 
    ? acervoItems.find(item => item.id === editingId) 
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Acervo de Estudos</h2>
          <p className="text-muted-foreground">
            Gerencie o conteúdo do acervo de estudos disponível para os usuários.
          </p>
        </div>
        <AcervoDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddItem}
          onCancel={resetAndCloseDialog}
          isEditing={isEditing}
          defaultValues={currentItem}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {acervoItems.map((item) => (
          <AcervoItemCard 
            key={item.id} 
            item={item} 
            onEdit={handleEditItem} 
            onDelete={handleDeleteItem} 
          />
        ))}
      </div>
    </div>
  );
};

export default AdminAcervoPage;
