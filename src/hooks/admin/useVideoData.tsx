
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudyCardProps } from "@/components/StudyCard";
import { convertArrayToStudyCardProps } from "@/types/acervo";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for fetching video data
 */
export function useVideoData(isAdmin: boolean) {
  const { toast } = useToast();
  const [items, setItems] = useState<StudyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // Initial fetch when admin status is confirmed
  useEffect(() => {
    if (isAdmin) {
      fetchItems();
    }
  }, [isAdmin]);

  return {
    items,
    setItems,
    isLoading,
    fetchItems
  };
}
