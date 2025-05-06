
import { useState, useEffect } from "react";
import TarotCard from "./TarotCard";
import { useTarotAI } from "@/hooks/useTarotAI";
import { TarotCardType } from "@/data/tarotData";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TarotAuthCheck } from "./TarotAuthCheck";
import { TarotAreaType, tarotAreas } from "@/data/tarotAreas";

interface TarotReadingProps {
  cards: TarotCardType[];
}

const TarotReading = ({ cards }: TarotReadingProps) => {
  const [spreadType, setSpreadType] = useState<"single" | "three" | "celtic">("single");
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCardType[]>([]);
  const [primaryArea, setPrimaryArea] = useState<TarotAreaType | undefined>(undefined);
  const [secondaryArea, setSecondaryArea] = useState<TarotAreaType | undefined>(undefined);
  const [interpretation, setInterpretation] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const { toast } = useToast();
  const { generateReading, isGenerating: isAiGenerating, hasApiKey } = useTarotAI({});

  useEffect(() => {
    // Reset flipped cards, selected cards and interpretation when spread type changes
    setFlippedCards([]);
    setSelectedCards([]);
    setInterpretation("");
  }, [spreadType]);

  const handleCardClick = (index: number) => {
    if (flippedCards.includes(index)) {
      return; // Already flipped
    }

    let maxCards = 1;
    if (spreadType === "three") maxCards = 3;
    if (spreadType === "celtic") maxCards = 10;

    if (flippedCards.length < maxCards) {
      setFlippedCards([...flippedCards, index]);
      setSelectedCards([...selectedCards, cards[index]]);
    }
  };

  const handleGenerateReading = async () => {
    if (!primaryArea) {
      toast({
        title: "Área não selecionada",
        description: "Por favor, selecione uma área de interesse principal.",
        variant: "destructive",
      });
      return;
    }

    let requiredCards = 1;
    if (spreadType === "three") requiredCards = 3;
    if (spreadType === "celtic") requiredCards = 10;

    if (selectedCards.length < requiredCards) {
      toast({
        title: `Selecione ${requiredCards} cartas`,
        description: `Por favor, selecione ${requiredCards} cartas para a tiragem de ${
          spreadType === "single" ? "uma carta" : 
          spreadType === "three" ? "três cartas" : 
          "Cruz Celta"
        }.`,
        variant: "destructive",
      });
      return;
    }

    if (!hasApiKey) {
      toast({
        title: "API Key não configurada",
        description: "Configure uma chave API do Google Gemini para gerar interpretações.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const areas = { 
        primary: primaryArea, 
        secondary: secondaryArea 
      };
      
      const reading = await generateReading(selectedCards, areas, spreadType);
      setInterpretation(reading);
    } catch (error) {
      console.error("Error generating reading:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar a interpretação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFlippedCards([]);
    setSelectedCards([]);
    setInterpretation("");
  };

  const getSpreadInstructions = () => {
    switch (spreadType) {
      case "single":
        return "Escolha 1 carta para representar a energia dominante na situação.";
      case "three":
        return "Escolha 3 cartas para representar o passado, presente e futuro.";
      case "celtic":
        return "Escolha 10 cartas para a Cruz Celta - uma tiragem profunda e detalhada.";
    }
  };

  const getCardPositionName = (index: number) => {
    switch (spreadType) {
      case "single":
        return "Energia Dominante";
      case "three":
        return ["Passado", "Presente", "Futuro"][index] || "";
      case "celtic":
        return [
          "Situação Presente",
          "Desafio Imediato",
          "Passado",
          "Futuro",
          "Objetivo Consciente",
          "Inconsciente",
          "Sua Influência",
          "Influências Externas",
          "Esperanças ou Medos",
          "Resultado Final",
        ][index] || "";
    }
  };

  const renderCards = () => {
    const cardElements: JSX.Element[] = [];
    
    switch (spreadType) {
      case "single":
        cardElements.push(
          <div key="single" className="flex justify-center py-8">
            {flippedCards.length === 0 ? (
              <div 
                className="tarot-card-back cursor-pointer" 
                onClick={() => handleCardClick(Math.floor(Math.random() * cards.length))}
              >
                <div className="text-center font-mystical text-lg">
                  Clique para revelar
                </div>
              </div>
            ) : (
              <div className="text-center">
                <TarotCard card={selectedCards[0]} />
                <div className="mt-2 text-sm font-medium">{getCardPositionName(0)}</div>
              </div>
            )}
          </div>
        );
        break;
        
      case "three":
        for (let i = 0; i < 3; i++) {
          const isFlipped = flippedCards.length > i;
          cardElements.push(
            <div key={`three-${i}`} className="text-center">
              {isFlipped ? (
                <>
                  <TarotCard card={selectedCards[i]} />
                  <div className="mt-2 text-sm font-medium">{getCardPositionName(i)}</div>
                </>
              ) : (
                <div 
                  className="tarot-card-back cursor-pointer" 
                  onClick={() => {
                    const remainingIndices = Array.from({ length: cards.length }, (_, idx) => idx)
                      .filter(idx => !flippedCards.includes(idx));
                    const randomIndex = Math.floor(Math.random() * remainingIndices.length);
                    handleCardClick(remainingIndices[randomIndex]);
                  }}
                >
                  <div className="text-center font-mystical text-lg">
                    {i + 1}
                  </div>
                </div>
              )}
            </div>
          );
        }
        break;
        
      case "celtic":
        // Create a 4x3 grid for the Celtic Cross layout
        return (
          <TarotAuthCheck spreadType="celtic">
            <div className="grid grid-cols-4 gap-4 my-6">
              {/* Middle cross */}
              <div className="col-span-1"></div>
              <div className="col-span-1 flex justify-center">
                {renderCelticCard(3)}
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-1 flex justify-center">
                {renderCelticCard(6)}
              </div>
              
              <div className="col-span-1 flex justify-center">
                {renderCelticCard(2)}
              </div>
              <div className="col-span-1 relative">
                {renderCelticCard(0)}
                <div className="absolute inset-0 flex items-center justify-center">
                  {renderCelticCard(1, true)}
                </div>
              </div>
              <div className="col-span-1 flex justify-center">
                {renderCelticCard(4)}
              </div>
              <div className="col-span-1 flex justify-center">
                {renderCelticCard(7)}
              </div>
              
              <div className="col-span-1"></div>
              <div className="col-span-1 flex justify-center">
                {renderCelticCard(5)}
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-1 flex justify-center">
                {renderCelticCard(8)}
              </div>
              
              <div className="col-span-4 flex justify-center mt-4">
                {renderCelticCard(9)}
              </div>
            </div>
          </TarotAuthCheck>
        );
    }
    
    return (
      <div className="flex justify-center space-x-8 py-8">
        {cardElements}
      </div>
    );
  };
  
  const renderCelticCard = (position: number, overlay: boolean = false) => {
    const isFlipped = flippedCards.length > position;
    
    return (
      <div className={`text-center ${overlay ? "transform rotate-90 scale-90" : ""}`}>
        {isFlipped ? (
          <>
            <TarotCard card={selectedCards[position]} className="mx-auto" />
            <div className="mt-2 text-xs font-medium">{getCardPositionName(position)}</div>
          </>
        ) : (
          <div 
            className="tarot-card-back cursor-pointer" 
            onClick={() => {
              const remainingIndices = Array.from({ length: cards.length }, (_, idx) => idx)
                .filter(idx => !flippedCards.includes(idx));
              const randomIndex = Math.floor(Math.random() * remainingIndices.length);
              handleCardClick(remainingIndices[randomIndex]);
            }}
          >
            <div className="text-center font-mystical text-lg">
              {position + 1}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pt-2">
      <Tabs
        defaultValue="single"
        value={spreadType}
        onValueChange={(value) => setSpreadType(value as "single" | "three" | "celtic")}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="single">Uma Carta</TabsTrigger>
          <TabsTrigger value="three">Três Cartas</TabsTrigger>
          <TabsTrigger value="celtic">Cruz Celta</TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <p className="text-muted-foreground text-center">{getSpreadInstructions()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Área Principal*</label>
            <Select 
              value={primaryArea?.id} 
              onValueChange={(value) => {
                const area = tarotAreas.find(a => a.id === value);
                setPrimaryArea(area);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área principal" />
              </SelectTrigger>
              <SelectContent>
                {tarotAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Área Secundária (opcional)</label>
            <Select 
              value={secondaryArea?.id || ""} 
              onValueChange={(value) => {
                if (value === "") {
                  setSecondaryArea(undefined);
                } else {
                  const area = tarotAreas.find(a => a.id === value);
                  setSecondaryArea(area);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área secundária (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhuma</SelectItem>
                {tarotAreas
                  .filter(area => area.id !== primaryArea?.id)
                  .map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="single">
          {renderCards()}
        </TabsContent>
        
        <TabsContent value="three">
          {renderCards()}
        </TabsContent>
        
        <TabsContent value="celtic">
          {renderCards()}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center space-x-4 mt-6">
        <Button onClick={handleReset} variant="outline" disabled={isGenerating || isAiGenerating}>
          Nova Tiragem
        </Button>
        <Button 
          onClick={handleGenerateReading} 
          disabled={
            selectedCards.length === 0 || 
            isGenerating || 
            isAiGenerating || 
            !primaryArea ||
            (spreadType === "single" && selectedCards.length < 1) ||
            (spreadType === "three" && selectedCards.length < 3) ||
            (spreadType === "celtic" && selectedCards.length < 10)
          }
        >
          {isGenerating || isAiGenerating ? "Gerando..." : "Interpretar Tiragem"}
        </Button>
      </div>

      {interpretation && (
        <div className="mt-8 p-6 bg-muted/30 rounded-lg">
          <h3 className="text-2xl font-mystical mb-4">Interpretação das Cartas</h3>
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br>') }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotReading;
