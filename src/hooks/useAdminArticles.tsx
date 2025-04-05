
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StudyCardProps } from "@/components/StudyCard";
import { convertArrayToStudyCardProps, convertToStudyCardProps } from "@/types/acervo";
import { ContentType } from "@/components/admin/acervo/AcervoTypeUtils";

export const useAdminArticles = (contentType: ContentType = 'article') => {
  const { toast } = useToast();
  const [items, setItems] = useState<StudyCardProps[]>([]);
  const [filteredItems, setFilteredItems] = useState<StudyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  
  // Fetch all items of the specified content type
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('acervo_items')
        .select('*')
        .eq('type', contentType)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const convertedData = convertArrayToStudyCardProps(data || []);
      setItems(convertedData);
      setFilteredItems(convertedData);
    } catch (error) {
      console.error(`Error fetching ${contentType}s:`, error);
      toast({
        title: "Erro",
        description: `Não foi possível carregar os ${contentType === 'article' ? 'artigos' : 'documentos'}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new item
  const addItem = async (formValues) => {
    try {
      const newItem = {
        title: formValues.title,
        type: contentType,
        thumbnail: formValues.thumbnail,
        excerpt: formValues.excerpt,
        link: formValues.link,
      };
      
      const { data, error } = await supabase
        .from('acervo_items')
        .insert(newItem)
        .select()
        .single();
      
      if (error) throw error;
      
      const convertedItem = convertToStudyCardProps(data);
      
      setItems(prevItems => [convertedItem, ...prevItems]);
      
      toast({
        title: contentType === 'article' ? "Artigo adicionado" : "Documento adicionado",
        description: contentType === 'article' 
          ? "O novo artigo foi adicionado ao acervo com sucesso."
          : "O novo documento foi adicionado ao acervo com sucesso.",
      });

      return convertedItem;
    } catch (error) {
      console.error(`Error adding ${contentType}:`, error);
      toast({
        title: "Erro",
        description: `Não foi possível adicionar o ${contentType === 'article' ? 'artigo' : 'documento'}.`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Edit an existing item
  const editItem = async (updatedItem: StudyCardProps) => {
    try {
      const originalItem = items.find(item => item.id === updatedItem.id);
      if (!originalItem) {
        throw new Error("Item não encontrado");
      }
      
      const { data: dbItems, error: fetchError } = await supabase
        .from('acervo_items')
        .select('*')
        .limit(100);
      
      if (fetchError) throw fetchError;
      
      const dbItem = dbItems.find(item => {
        const convertedId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;
        return convertedId === updatedItem.id;
      });
      
      if (!dbItem) {
        throw new Error("Item não encontrado no banco de dados");
      }
      
      const { error } = await supabase
        .from('acervo_items')
        .update({
          title: updatedItem.title,
          type: contentType,
          thumbnail: updatedItem.thumbnail,
          excerpt: updatedItem.excerpt,
          link: updatedItem.link,
        })
        .eq('id', dbItem.id);
      
      if (error) throw error;
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      
      toast({
        title: contentType === 'article' ? "Artigo atualizado" : "Documento atualizado",
        description: "As alterações foram salvas com sucesso.",
      });

      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${contentType}:`, error);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar o ${contentType === 'article' ? 'artigo' : 'documento'}.`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete an item by ID
  const deleteItem = async (id: number) => {
    try {
      const { data: dbItems, error: fetchError } = await supabase
        .from('acervo_items')
        .select('*')
        .limit(100);
      
      if (fetchError) throw fetchError;
      
      const dbItem = dbItems.find(item => {
        const convertedId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;
        return convertedId === id;
      });
      
      if (!dbItem) {
        throw new Error("Item não encontrado no banco de dados");
      }
      
      const { error } = await supabase
        .from('acervo_items')
        .delete()
        .eq('id', dbItem.id);
      
      if (error) throw error;
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      toast({
        title: contentType === 'article' ? "Artigo excluído" : "Documento excluído",
        description: contentType === 'article' 
          ? "O artigo foi removido do acervo com sucesso."
          : "O documento foi removido do acervo com sucesso.",
      });
    } catch (error) {
      console.error(`Error deleting ${contentType}:`, error);
      toast({
        title: "Erro",
        description: `Não foi possível excluir o ${contentType === 'article' ? 'artigo' : 'documento'}.`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Filter and sort items based on search query and sort criteria
  useEffect(() => {
    let filtered = [...items];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.excerpt.toLowerCase().includes(query)
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

  return {
    items: filteredItems,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    fetchItems,
    addItem,
    editItem,
    deleteItem
  };
};
