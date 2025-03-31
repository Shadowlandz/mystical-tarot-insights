
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudyCardProps } from "@/components/StudyCard";
import { convertArrayToStudyCardProps } from "@/types/acervo";
import { useToast } from "@/hooks/use-toast";

interface AcervoStats {
  totalItems: number;
  totalViews: number;
  videoCount: number;
  articleCount: number;
  documentCount: number;
}

export const useAcervoData = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [catalogItems, setCatalogItems] = useState<StudyCardProps[]>([]);
  const [stats, setStats] = useState<AcervoStats>({
    totalItems: 0,
    totalViews: 0,
    videoCount: 0,
    articleCount: 0,
    documentCount: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('acervo_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const convertedData = convertArrayToStudyCardProps(data || []);
      setCatalogItems(convertedData);
      
      // Calculate stats
      const totalViews = convertedData.reduce((sum, item) => sum + (item.views || 0), 0);
      const videoCount = convertedData.filter(item => item.type === 'video').length;
      const articleCount = convertedData.filter(item => item.type === 'article').length;
      const documentCount = convertedData.filter(item => item.type === 'document').length;
      
      setStats({
        totalItems: convertedData.length,
        totalViews,
        videoCount,
        articleCount,
        documentCount
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do acervo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { catalogItems, stats, isLoading, fetchData };
};
