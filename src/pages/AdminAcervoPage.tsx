
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
import { supabase } from "@/integrations/supabase/client";

const AdminAcervoPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [acervoItems, setAcervoItems] = useState<StudyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carregar dados do Supabase
  useEffect(() => {
    loadItems();
    
    // Verificar se há um ID de edição na URL
    const editId = searchParams.get('edit');
    if (editId) {
      const itemToEdit = acervoItems.find(item => item.id.toString() === editId);
      if (itemToEdit) {
        handleEditItem(itemToEdit);
      }
    }
  }, [searchParams]);
  
  const loadItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('acervo_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Convert Supabase UUID to number ID for compatibility with existing components
        const formattedData = data.map(item => ({
          ...item,
          id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || Math.floor(Math.random() * 10000),
        }));
        
        setAcervoItems(formattedData);
      }
    } catch (error) {
      console.error("Erro ao carregar itens do acervo:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os itens do acervo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (values: AcervoFormValues) => {
    try {
      if (isEditing && editingId !== null) {
        // Encontrar o item pelo ID de edição
        const itemToUpdate = acervoItems.find(item => item.id.toString() === editingId);
        
        if (!itemToUpdate) {
          throw new Error("Item não encontrado");
        }
        
        // Atualizar item existente no Supabase
        const { error } = await supabase
          .from('acervo_items')
          .update({
            title: values.title,
            type: values.type,
            thumbnail: values.thumbnail,
            excerpt: values.excerpt,
            link: values.link,
            updated_at: new Date().toISOString()
          })
          .eq('id', itemToUpdate.id);
        
        if (error) throw error;
        
        toast({
          title: "Item atualizado",
          description: "O item do acervo foi atualizado com sucesso",
        });
      } else {
        // Adicionar novo item no Supabase
        const { error } = await supabase
          .from('acervo_items')
          .insert({
            title: values.title,
            type: values.type,
            thumbnail: values.thumbnail,
            excerpt: values.excerpt,
            link: values.link,
            views: 0
          });
        
        if (error) throw error;
        
        toast({
          title: "Item adicionado",
          description: "Um novo item foi adicionado ao acervo",
        });
      }
      
      // Recarregar a lista após salvar
      await loadItems();
      
      // Limpar parâmetros da URL se houver
      if (searchParams.has('edit')) {
        searchParams.delete('edit');
        setSearchParams(searchParams);
      }
      
      // Resetar estado e fechar dialog
      resetAndCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar item do acervo:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o item no acervo",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: StudyCardProps) => {
    setIsEditing(true);
    setEditingId(item.id.toString());
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      try {
        // Encontrar o item pelo ID para obter o UUID real no Supabase
        const itemToDelete = acervoItems.find(item => item.id === id);
        
        if (!itemToDelete) {
          throw new Error("Item não encontrado");
        }
        
        const { error } = await supabase
          .from('acervo_items')
          .delete()
          .eq('id', itemToDelete.id);
        
        if (error) throw error;
        
        // Recarregar a lista após excluir
        await loadItems();
        
        toast({
          title: "Item excluído",
          description: "O item foi removido do acervo",
        });
      } catch (error) {
        console.error("Erro ao excluir item do acervo:", error);
        toast({
          title: "Erro ao excluir",
          description: "Ocorreu um erro ao excluir o item do acervo",
          variant: "destructive",
        });
      }
    }
  };

  const handlePreviewItem = async (item: StudyCardProps) => {
    try {
      // Incrementar visualizações no Supabase
      const { error } = await supabase
        .from('acervo_items')
        .update({ views: (item.views || 0) + 1 })
        .eq('id', item.id);
      
      if (error) throw error;
      
      // Recarregar a lista para atualizar as visualizações
      await loadItems();
    } catch (error) {
      console.error("Erro ao atualizar visualizações:", error);
    }
  };

  const resetAndCloseDialog = () => {
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  // Get current item being edited (for form default values)
  const currentItem = isEditing && editingId 
    ? acervoItems.find(item => item.id.toString() === editingId) 
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Carregando itens do acervo...</p>
        </div>
      ) : acervoItems.length === 0 ? (
        <Alert variant="default" className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertTitle>Acervo vazio</AlertTitle>
          <AlertDescription>
            Você ainda não adicionou nenhum conteúdo ao acervo. Clique no botão "Adicionar Conteúdo" para começar.
          </AlertDescription>
        </Alert>
      ) : (
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
      )}
    </div>
  );
};

export default AdminAcervoPage;
