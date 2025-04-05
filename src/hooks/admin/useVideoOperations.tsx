
import { useState } from "react";
import { supabase, isUserAdmin } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StudyCardProps } from "@/components/StudyCard";
import { convertToStudyCardProps } from "@/types/acervo";

/**
 * Hook for video CRUD operations
 */
export function useVideoOperations() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Add new video item
  const handleAddItem = async (formValues: any) => {
    try {
      // Ensure excerpt has a default value if not provided
      const excerpt = formValues.excerpt || "";
      
      const newItem = {
        title: formValues.title,
        type: "video",
        thumbnail: formValues.thumbnail || "", // Will come from metadata extraction
        excerpt: excerpt,
        link: formValues.link,
      };
      
      const { data, error } = await supabase
        .from('acervo_items')
        .insert(newItem)
        .select();
      
      if (error) {
        console.error("Database error:", error);
        if (error.code === '42501') {
          await isUserAdmin(); // Recheck admin status
          throw new Error("Você não tem permissão para adicionar vídeos. Verifique se você tem perfil de administrador.");
        } else {
          throw new Error(`Erro ao adicionar vídeo: ${error.message || error.details || "Erro de banco de dados"}`);
        }
      }
      
      const insertedItem = data && data.length > 0 ? data[0] : null;
      const convertedItem = insertedItem ? convertToStudyCardProps(insertedItem) : null;
      
      toast({
        title: "Vídeo adicionado",
        description: "O novo vídeo foi adicionado ao acervo com sucesso.",
      });

      return { success: true, item: convertedItem };
    } catch (error) {
      console.error("Error adding video:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar o vídeo. Verifique suas permissões.",
        variant: "destructive",
      });
      return { success: false, item: null };
    }
  };

  // Edit item
  const handleEditItem = async (updatedItem: StudyCardProps) => {
    try {
      const { data, error } = await supabase
        .from('acervo_items')
        .select('id')
        .eq('type', 'video')
        .limit(100);
      
      if (error) {
        if (error.code === '42501') {
          await isUserAdmin(); // Recheck admin status
          throw new Error("Você não tem permissão para editar vídeos. Verifique se você tem perfil de administrador.");
        } else {
          throw error;
        }
      }
      
      const dbItem = data.find(item => {
        const convertedId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;
        return convertedId === updatedItem.id;
      });
      
      if (!dbItem) {
        throw new Error("Item não encontrado no banco de dados");
      }
      
      const { error: updateError } = await supabase
        .from('acervo_items')
        .update({
          title: updatedItem.title,
          type: "video",
          thumbnail: updatedItem.thumbnail,
          excerpt: updatedItem.excerpt || "",
          link: updatedItem.link,
        })
        .eq('id', dbItem.id);
      
      if (updateError) {
        if (updateError.code === '42501') {
          await isUserAdmin(); // Recheck admin status
          throw new Error("Você não tem permissão para editar vídeos. Verifique se você tem perfil de administrador.");
        } else {
          throw updateError;
        }
      }
      
      toast({
        title: "Vídeo atualizado",
        description: "As alterações foram salvas com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Error updating video:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o vídeo. Verifique suas permissões.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: number) => {
    if (!itemId) return false;
    
    try {
      const { data, error } = await supabase
        .from('acervo_items')
        .select('id')
        .eq('type', 'video')
        .limit(100);
      
      if (error) {
        if (error.code === '42501') {
          await isUserAdmin(); // Recheck admin status
          throw new Error("Você não tem permissão para excluir vídeos. Verifique se você tem perfil de administrador.");
        } else {
          throw error;
        }
      }
      
      const dbItem = data.find(item => {
        const convertedId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;
        return convertedId === itemId;
      });
      
      if (!dbItem) {
        throw new Error("Item não encontrado no banco de dados");
      }
      
      const { error: deleteError } = await supabase
        .from('acervo_items')
        .delete()
        .eq('id', dbItem.id);
      
      if (deleteError) {
        if (deleteError.code === '42501') {
          await isUserAdmin(); // Recheck admin status
          throw new Error("Você não tem permissão para excluir vídeos. Verifique se você tem perfil de administrador.");
        } else {
          throw deleteError;
        }
      }
      
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi removido do acervo com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir o vídeo. Verifique suas permissões.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    handleAddItem,
    handleEditItem,
    handleDeleteItem
  };
}
