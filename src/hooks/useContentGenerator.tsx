
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
      // Generate content locally to avoid permission issues
      const generatedContent = generateLocalSpiritualContent(count);
      
      // Insert content into database
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

  // Separated DB insertion logic for better testability and separation of concerns
  const insertContentIntoDatabase = async (content: SpiritualContentItem[]) => {
    const itemsToInsert = content.map(item => ({
      title: item.title,
      type: item.type,
      thumbnail: item.thumbnail,
      excerpt: item.excerpt,
      link: item.link,
      views: 0
    }));
    
    return await supabase
      .from('acervo_items')
      .insert(itemsToInsert);
  };

  return { isGenerating, generateSpiritualContent };
};
