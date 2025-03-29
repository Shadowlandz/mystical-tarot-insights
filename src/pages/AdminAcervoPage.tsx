
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { StudyCardProps } from "@/components/StudyCard";
import { AcervoFormValues } from "@/components/admin/acervo/AcervoForm";
import { AcervoItemCard } from "@/components/admin/acervo/AcervoItemCard";
import { AcervoDialog } from "@/components/admin/acervo/AcervoDialog";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminAcervoPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [acervoItems, setAcervoItems] = useState<StudyCardProps[]>([]);
  
  // Carregar dados do localStorage
  useEffect(() => {
    loadItems();
    
    // Verificar se há um ID de edição na URL
    const editId = searchParams.get('edit');
    if (editId) {
      const id = parseInt(editId);
      const itemToEdit = acervoItems.find(item => item.id === id);
      if (itemToEdit) {
        handleEditItem(itemToEdit);
      }
    }
  }, []);
  
  const loadItems = () => {
    const storedItems = localStorage.getItem('acervoItems');
    if (storedItems) {
      try {
        const items = JSON.parse(storedItems);
        setAcervoItems(items);
      } catch (e) {
        console.error("Erro ao carregar itens do acervo:", e);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os itens do acervo",
          variant: "destructive",
        });
      }
    }
  };
  
  // Salvar dados no localStorage
  const saveItems = (items: StudyCardProps[]) => {
    try {
      localStorage.setItem('acervoItems', JSON.stringify(items));
    } catch (e) {
      console.error("Erro ao salvar itens do acervo:", e);
      toast({
        title: "Erro ao salvar dados",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = (values: AcervoFormValues) => {
    if (isEditing && editingId !== null) {
      // Atualizar item existente
      const updatedItems = acervoItems.map(item => 
        item.id === editingId 
          ? { 
              ...item,
              title: values.title,
              type: values.type,
              thumbnail: values.thumbnail,
              excerpt: values.excerpt,
              link: values.link,
              updatedAt: new Date().toISOString(),
            } 
          : item
      );
      
      setAcervoItems(updatedItems);
      saveItems(updatedItems);
      
      toast({
        title: "Item atualizado",
        description: "O item do acervo foi atualizado com sucesso",
      });
    } else {
      // Adicionar novo item com timestamp de criação
      const newItem: StudyCardProps = {
        id: Math.max(0, ...acervoItems.map(item => item.id)) + 1,
        title: values.title,
        type: values.type,
        thumbnail: values.thumbnail,
        excerpt: values.excerpt,
        link: values.link,
        createdAt: new Date().toISOString(),
        views: 0,
      };
      
      const updatedItems = [...acervoItems, newItem];
      setAcervoItems(updatedItems);
      saveItems(updatedItems);
      
      toast({
        title: "Item adicionado",
        description: "Um novo item foi adicionado ao acervo",
      });
    }
    
    // Limpar parâmetros da URL se houver
    if (searchParams.has('edit')) {
      searchParams.delete('edit');
      setSearchParams(searchParams);
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
      const updatedItems = acervoItems.filter(item => item.id !== id);
      setAcervoItems(updatedItems);
      saveItems(updatedItems);
      
      toast({
        title: "Item excluído",
        description: "O item foi removido do acervo",
      });
    }
  };

  const handlePreviewItem = (item: StudyCardProps) => {
    // Incrementar visualizações ao visualizar preview
    const updatedItems = acervoItems.map(i => 
      i.id === item.id 
        ? { ...i, views: (i.views || 0) + 1 } 
        : i
    );
    
    setAcervoItems(updatedItems);
    saveItems(updatedItems);
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

      {acervoItems.length === 0 && (
        <Alert variant="default" className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertTitle>Acervo vazio</AlertTitle>
          <AlertDescription>
            Você ainda não adicionou nenhum conteúdo ao acervo. Clique no botão "Adicionar Conteúdo" para começar.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {acervoItems.map((item) => (
          <AcervoItemCard 
            key={item.id} 
            item={item} 
            onEdit={handleEditItem} 
            onDelete={handleDeleteItem}
            onPreview={handlePreviewItem}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminAcervoPage;
