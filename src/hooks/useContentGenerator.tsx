
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateLocalSpiritualContent, SpiritualContentItem } from "@/utils/spiritualContentGenerator";

interface UseContentGeneratorOptions {
  onSuccessCallback: () => void;
  count?: number;
}

export const useContentGenerator = ({ 
  onSuccessCallback, 
  count = 3 
}: UseContentGeneratorOptions) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSpiritualContent = async () => {
    if (isGenerating) return; // Prevent multiple simultaneous requests
    
    setIsGenerating(true);
    try {
      // Generate content locally
      const generatedContent = generateLocalSpiritualContent(count);
      
      // Insert content into database with simplified approach
      const { error } = await insertContentIntoDatabase(generatedContent);
      
      if (error) throw error;
      
      toast({
        title: "Conteúdo gerado com sucesso",
        description: `${generatedContent.length} novos itens de conteúdo espiritual foram adicionados.`,
      });
      
      // Refresh data
      onSuccessCallback();
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar conteúdo espiritual: " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Simplified DB insertion logic
  const insertContentIntoDatabase = async (content: SpiritualContentItem[]) => {
    const itemsToInsert = content.map(item => ({
      title: item.title,
      type: item.type,
      thumbnail: item.thumbnail,
      excerpt: item.excerpt,
      link: item.link,
      views: Math.floor(Math.random() * 10) // Generate random initial views for better analytics data
    }));
    
    return await supabase
      .from('acervo_items')
      .insert(itemsToInsert);
  };

  return { isGenerating, generateSpiritualContent };
};
