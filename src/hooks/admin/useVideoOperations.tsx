
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StudyCardProps } from "@/components/StudyCard";
import { convertToStudyCardProps } from "@/types/acervo";
import { fetchVideoMetadata } from "@/utils/videoMetadataFetcher";

/**
 * Hook for video CRUD operations
 */
export function useVideoOperations() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  
  // Add new video item
  const handleAddItem = async (formValues: any) => {
    try {
      setIsLoading(true);
      
      let thumbnailUrl = formValues.thumbnail || "";
      let title = formValues.title;
      
      // Se não tiver thumbnail e tiver link, tenta extrair metadados do vídeo
      if ((!thumbnailUrl || thumbnailUrl.trim() === "") && formValues.link) {
        setIsFetchingMetadata(true);
        try {
          const metadata = await fetchVideoMetadata(formValues.link);
          if (metadata.thumbnail) {
            thumbnailUrl = metadata.thumbnail;
          }
          // Se o título estiver vazio e encontrarmos um título no metadata, use-o
          if ((!title || title.trim() === "") && metadata.title) {
            title = metadata.title;
          }
        } catch (error) {
          console.error("Error extracting video metadata:", error);
        } finally {
          setIsFetchingMetadata(false);
        }
      }
      
      // Ensure excerpt has a default value if not provided
      const excerpt = formValues.excerpt || "";
      
      const newItem = {
        title: title,
        type: "video",
        thumbnail: thumbnailUrl,
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
          throw new Error("Você não tem permissão para adicionar vídeos. Verifique se você tem perfil de administrador. Código de erro: " + error.code);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Edit item
  const handleEditItem = async (updatedItem: StudyCardProps) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('acervo_items')
        .select('id')
        .eq('type', 'video')
        .limit(100);
      
      if (error) {
        if (error.code === '42501') {
          throw new Error("Você não tem permissão para editar vídeos. Verifique se você tem perfil de administrador. Código de erro: " + error.code);
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
          throw new Error("Você não tem permissão para editar vídeos. Verifique se você tem perfil de administrador. Código de erro: " + updateError.code);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: number) => {
    if (!itemId) return false;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('acervo_items')
        .select('id')
        .eq('type', 'video')
        .limit(100);
      
      if (error) {
        if (error.code === '42501') {
          throw new Error("Você não tem permissão para excluir vídeos. Verifique se você tem perfil de administrador. Código de erro: " + error.code);
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
          throw new Error("Você não tem permissão para excluir vídeos. Verifique se você tem perfil de administrador. Código de erro: " + deleteError.code);
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
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    isFetchingMetadata,
    handleAddItem,
    handleEditItem,
    handleDeleteItem
  };
}
