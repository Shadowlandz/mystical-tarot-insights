
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateLocalSpiritualContent } from "@/utils/spiritualContentGenerator";

export const useContentGenerator = (onSuccessCallback: () => void) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSpiritualContent = async () => {
    setIsGenerating(true);
    try {
      // Generate content locally to avoid permission issues
      const generatedContent = generateLocalSpiritualContent(3);
      
      // Prepare items for insertion into Supabase
      const itemsToInsert = generatedContent.map(item => ({
        title: item.title,
        type: item.type,
        thumbnail: item.thumbnail,
        excerpt: item.excerpt,
        link: item.link,
        views: 0
      }));
      
      // Insert directly into the acervo_items table
      // This avoids the permission issue with the users table
      const { error: insertError } = await supabase
        .from('acervo_items')
        .insert(itemsToInsert);
      
      if (insertError) throw insertError;
      
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

  return { isGenerating, generateSpiritualContent };
};
