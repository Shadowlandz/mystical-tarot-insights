
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
      // Gerar conteúdo localmente para evitar problemas de permissão
      const generatedContent = generateLocalSpiritualContent(3);
      
      // Preparar os itens para inserção no Supabase
      const itemsToInsert = generatedContent.map(item => ({
        title: item.title,
        type: item.type,
        thumbnail: item.thumbnail,
        excerpt: item.excerpt,
        link: item.link,
        views: 0
      }));
      
      // Inserir os itens no banco de dados
      const { error: insertError } = await supabase
        .from('acervo_items')
        .insert(itemsToInsert);
      
      if (insertError) throw insertError;
      
      toast({
        title: "Conteúdo gerado",
        description: `${generatedContent.length} novos itens de conteúdo espiritual foram adicionados.`,
      });
      
      // Atualizar os dados
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
