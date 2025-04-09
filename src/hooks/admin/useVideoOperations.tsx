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
  
  // Função auxiliar para tratar erros do Supabase
  const handleSupabaseError = (error: any, operation: string) => {
    console.error(`Error ${operation} video:`, error);
    
    // Tratamento específico para erro de permissão
    if (error.code === '42501') {
      const errorMsg = `Você não tem permissão para ${operation} vídeos. Verifique se você tem perfil de administrador.`;
      setErrorMessage(errorMsg);
      toast({
        title: "Erro de permissão",
        description: errorMsg,
        variant: "destructive",
      });
    } else {
      const errorMsg = error.message || `Não foi possível ${operation} o vídeo. Verifique suas permissões.`;
      setErrorMessage(errorMsg);
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
    }
    
    setHasError(true);
    return false;
  };
  
  // Add new video item
  const handleAddItem = async (formValues: any) => {
    try {
      setIsLoading(true);
      setHasError(false);
      
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
        return handleSupabaseError(error, "adicionar");
      }
      
      const insertedItem = data && data.length > 0 ? data[0] : null;
      const convertedItem = insertedItem ? convertToStudyCardProps(insertedItem) : null;
      
      if (!convertedItem) {
        // Se não conseguirmos obter o item convertido, retorne apenas false
        return false;
      }
      
      toast({
        title: "Vídeo adicionado",
        description: "O novo vídeo foi adicionado ao acervo com sucesso.",
      });

      return { success: true, item: convertedItem };
    } catch (error: any) {
      return handleSupabaseError(error, "adicionar");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit item
  const handleEditItem = async (updatedItem: StudyCardProps) => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      const { data, error } = await supabase
        .from('acervo_items')
        .select('id')
        .eq('type', 'video')
        .limit(100);
      
      if (error) {
        return handleSupabaseError(error, "editar");
      }
      
      const dbItem = data.find(item => {
        const convertedId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;
        return convertedId === updatedItem.id;
      });
      
      if (!dbItem) {
        const errorMsg = "Item não encontrado no banco de dados";
        setErrorMessage(errorMsg);
        toast({
          title: "Erro",
          description: errorMsg,
          variant: "destructive",
        });
        return false;
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
        return handleSupabaseError(updateError, "editar");
      }
      
      toast({
        title: "Vídeo atualizado",
        description: "As alterações foram salvas com sucesso.",
      });

      return true;
    } catch (error: any) {
      return handleSupabaseError(error, "editar");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: number) => {
    if (!itemId) return false;
    
    try {
      setIsLoading(true);
      setHasError(false);
      
      const { data, error } = await supabase
        .from('acervo_items')
        .select('id')
        .eq('type', 'video')
        .limit(100);
      
      if (error) {
        return handleSupabaseError(error, "excluir");
      }
      
      const dbItem = data.find(item => {
        const convertedId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;
        return convertedId === itemId;
      });
      
      if (!dbItem) {
        const errorMsg = "Item não encontrado no banco de dados";
        setErrorMessage(errorMsg);
        toast({
          title: "Erro",
          description: errorMsg,
          variant: "destructive",
        });
        return false;
      }
      
      const { error: deleteError } = await supabase
        .from('acervo_items')
        .delete()
        .eq('id', dbItem.id);
      
      if (deleteError) {
        return handleSupabaseError(deleteError, "excluir");
      }
      
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi removido do acervo com sucesso.",
      });

      return true;
    } catch (error: any) {
      return handleSupabaseError(error, "excluir");
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
