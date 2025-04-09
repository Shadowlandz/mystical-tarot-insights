
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface TarotCard {
  id: number;
  name: string;
  image: string;
  meaning: {
    upright: string;
    reversed: string;
  };
  meaningKeywords: string;
  description: string;
}

interface UseTarotAIProps {
  apiKey?: string;
}

export function useTarotAI({ apiKey }: UseTarotAIProps = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Verificar se existe uma API key armazenada no localStorage se não fornecida
  const storedApiKey = typeof localStorage !== "undefined" 
    ? localStorage.getItem("gemini_api_key") 
    : null;
  
  const activeApiKey = apiKey || storedApiKey;

  const generateReading = async (
    cards: TarotCard[], 
    questions: string[], 
    spreadType: "single" | "three" | "celtic"
  ): Promise<string> => {
    // Resetar estado
    setError(null);
    setIsGenerating(true);

    try {
      if (!activeApiKey) {
        throw new Error("A chave da API Gemini não está configurada");
      }

      // Inicializar o cliente da API Gemini
      const genAI = new GoogleGenerativeAI(activeApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Construir o prompt baseado no tipo de tiragem
      let spreadName = "";
      let positionsInfo = "";
      
      switch (spreadType) {
        case "single":
          spreadName = "Uma Carta";
          positionsInfo = "A carta representa a energia dominante na situação.";
          break;
        case "three":
          spreadName = "Três Cartas";
          positionsInfo = "1. Passado, 2. Presente, 3. Futuro";
          break;
        case "celtic":
          spreadName = "Cruz Celta";
          positionsInfo = "1. Situação presente, 2. Desafio imediato, 3. Passado recente, 4. Futuro próximo, 5. Objetivo consciente, 6. Inconsciente, 7. Atitude do consulente, 8. Influências externas, 9. Esperanças e medos, 10. Resultado final";
          break;
      }
      
      // Construir informações sobre as cartas
      const cardsInfo = cards.map((card, index) => 
        `Carta ${index + 1}: ${card.name} - ${card.meaning.upright} - Palavras-chave: ${card.meaningKeywords}`
      ).join("\n");

      // Construir informações sobre as perguntas
      const questionsInfo = questions
        .filter(q => q.trim() !== "")
        .map((q, index) => `Pergunta ${index + 1}: ${q}`).join("\n");

      // Construir o prompt completo
      let prompt = `Você é um especialista em tarô, com décadas de experiência em leituras e interpretações. 
        Você vai fornecer uma interpretação profunda, intuitiva e detalhada para uma tiragem de tarô do tipo "${spreadName}".

        ## Informações da tiragem:
        ${positionsInfo}

        ## Cartas sorteadas:
        ${cardsInfo}

        ${questionsInfo ? `## Perguntas do consulente:\n${questionsInfo}` : ""}

        ## Instruções para a interpretação:
        1. Você deve interpretar o significado de cada carta na posição específica, considerando suas relações com outras cartas.
        2. Explique como as energias das cartas se relacionam com as perguntas do consulente (se fornecidas).
        3. Seja específico, evitando generalidades que poderiam se aplicar a qualquer pessoa.
        4. Mantenha um tom respeitoso, empático e levemente místico, mas sem exageros.
        5. Forneça insights práticos e reflexões que o consulente possa aplicar em sua vida.
        6. Conclua com um resumo e recomendações finais.
        7. Formate o texto com cabeçalhos, parágrafos e seções para facilitar a leitura.
        
        ## Interpretação completa:`;

      // Chamar a API Gemini
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1500,
        },
      });

      const response = result.response.text();
      
      return response;
    } catch (err: any) {
      console.error("Erro ao gerar interpretação de tarô:", err);
      const errorMessage = err.message || "Erro ao gerar interpretação. Tente novamente.";
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return "Não foi possível gerar a interpretação das cartas. Por favor, verifique a configuração da API Gemini ou tente novamente mais tarde.";
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateReading,
    isGenerating,
    error,
    hasApiKey: !!activeApiKey,
  };
}
