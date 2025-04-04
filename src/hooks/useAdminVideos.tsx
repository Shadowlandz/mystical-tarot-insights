
import { useState, useEffect } from "react";
import { supabase, isUserAdmin } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StudyCardProps } from "@/components/StudyCard";
import { convertArrayToStudyCardProps, convertToStudyCardProps } from "@/types/acervo";

export function useAdminVideos() {
  const { toast } = useToast();
  const [items, setItems] = useState<StudyCardProps[]>([]);
  const [filteredItems, setFilteredItems] = useState<StudyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Check admin status
  const checkAdminStatus = async () => {
    setIsCheckingAdmin(true);
    try {
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        setHasError(true);
        setErrorMessage("Você não tem permissões de administrador para gerenciar vídeos. Entre em contato com o administrador do sistema.");
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissões para gerenciar vídeos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setHasError(true);
      setErrorMessage("Não foi possível verificar suas permissões. Tente novamente mais tarde.");
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  // Fetch videos
  const fetchItems = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const { data, error } = await supabase
        .from('acervo_items')
        .select('*')
        .eq('type', 'video')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const convertedData = convertArrayToStudyCardProps(data || []);
      setItems(convertedData);
      setFilteredItems(convertedData);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setHasError(true);
      setErrorMessage("Não foi possível carregar os vídeos. Verifique se você tem permissões de administrador.");
      toast({
        title: "Erro",
        description: "Não foi possível carregar os vídeos. Verifique suas permissões.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort items
  useEffect(() => {
    let filtered = [...items];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        (item.excerpt && item.excerpt.toLowerCase().includes(query))
      );
    }
    
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
    } else if (sortBy === "views") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredItems(filtered);
  }, [items, searchQuery, sortBy]);

  // Add item
  const handleAddItem = async (formValues) => {
    try {
      // Ensure excerpt has a default value if not provided
      const excerpt = formValues.excerpt || "";
      
      const newItem = {
        title: formValues.title,
        type: "video",
        thumbnail: formValues.thumbnail,
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
          await checkAdminStatus(); // Recheck admin status
          throw new Error("Você não tem permissão para adicionar vídeos. Verifique se você tem perfil de administrador.");
        } else {
          throw new Error(`Erro ao adicionar vídeo: ${error.message || error.details || "Erro de banco de dados"}`);
        }
      }
      
      const insertedItem = data && data.length > 0 ? data[0] : null;
      
      if (insertedItem) {
        const convertedItem = convertToStudyCardProps(insertedItem);
        setItems(prevItems => [convertedItem, ...prevItems]);
      }
      
      toast({
        title: "Vídeo adicionado",
        description: "O novo vídeo foi adicionado ao acervo com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Error adding video:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar o vídeo. Verifique suas permissões.",
        variant: "destructive",
      });
      return false;
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
          await checkAdminStatus(); // Recheck admin status
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
          await checkAdminStatus(); // Recheck admin status
          throw new Error("Você não tem permissão para editar vídeos. Verifique se você tem perfil de administrador.");
        } else {
          throw updateError;
        }
      }
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      
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
          await checkAdminStatus(); // Recheck admin status
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
          await checkAdminStatus(); // Recheck admin status
          throw new Error("Você não tem permissão para excluir vídeos. Verifique se você tem perfil de administrador.");
        } else {
          throw deleteError;
        }
      }
      
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
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

  // Initial load
  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchItems();
    }
  }, [isAdmin]);

  return {
    items: filteredItems,
    isLoading,
    isAdmin,
    isCheckingAdmin,
    hasError,
    errorMessage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    fetchItems,
    handleAddItem,
    handleEditItem,
    handleDeleteItem
  };
}
