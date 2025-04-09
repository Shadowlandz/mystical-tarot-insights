
import { useState } from "react";
import TarotCard from "./TarotCard";
import { Button } from "./ui/button";
import { tarotData } from "@/data/tarotData";
import { shuffle } from "@/lib/utils";
import { Input } from "./ui/input";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTarotAI, TarotCard as TarotCardType } from "@/hooks/useTarotAI";

interface TarotReadingProps {
  cardCount: 1 | 3 | 10;
}

export default function TarotReading({ cardCount }: TarotReadingProps) {
  const [selectedCards, setSelectedCards] = useState<typeof tarotData>([]);
  const [isReadingGenerated, setIsReadingGenerated] = useState(false);
  const [isCardsRevealed, setIsCardsRevealed] = useState(false);
  const [interpretation, setInterpretation] = useState("");
  const [questions, setQuestions] = useState({
    question1: "",
    question2: "",
    question3: "",
  });
  const { toast } = useToast();
  const { generateReading: generateAIReading, isGenerating } = useTarotAI();
  
  const generateTarotReading = () => {
    // Para Cruz Celta, exigir que pelo menos uma pergunta seja preenchida
    if (cardCount === 10) {
      if (!questions.question1) {
        toast({
          title: "Pergunta necessária",
          description: "Por favor, preencha pelo menos a primeira pergunta para continuar.",
          variant: "destructive",
        });
        return;
      }
    }
    
    const shuffledDeck = shuffle([...tarotData]);
    const newSelectedCards = shuffledDeck.slice(0, cardCount);
    
    setSelectedCards(newSelectedCards);
    setIsReadingGenerated(true);
    setIsCardsRevealed(false);
    setInterpretation("");
  };
  
  const revealCards = async () => {
    setIsCardsRevealed(true);
    
    // Determinar qual tipo de spread estamos usando
    let spreadType: "single" | "three" | "celtic";
    if (cardCount === 1) spreadType = "single";
    else if (cardCount === 3) spreadType = "three";
    else spreadType = "celtic";
    
    // Coletar perguntas não vazias
    const userQuestions = [
      questions.question1,
      questions.question2,
      questions.question3
    ].filter(q => q.trim() !== "");

    // Se a tiragem for mais complexa ou tivermos perguntas, use a IA
    if (cardCount > 1 || userQuestions.length > 0) {
      try {
        const aiInterpretation = await generateAIReading(
          selectedCards,
          userQuestions,
          spreadType
        );
        
        setInterpretation(aiInterpretation);
      } catch (error) {
        console.error("Erro ao gerar interpretação:", error);
        
        // Fallback para interpretação simples
        generateSimpleInterpretation();
      }
    } else {
      // Para uma carta sem perguntas, usamos interpretação simples
      generateSimpleInterpretation();
    }
  };
  
  // Método de fallback para interpretação simples
  const generateSimpleInterpretation = () => {
    let message = "";
    
    if (cardCount === 1) {
      message = `A carta ${selectedCards[0].name} representa ${selectedCards[0].meaning.upright}. Isso sugere que você está em um momento de ${selectedCards[0].meaningKeywords}. Reflita sobre como essa energia está presente em sua vida atualmente.`;
    } else if (cardCount === 3) {
      message = `As cartas revelam uma jornada: 
              \n\n1. ${selectedCards[0].name} (Passado): ${selectedCards[0].meaning.upright} 
              \n\n2. ${selectedCards[1].name} (Presente): ${selectedCards[1].meaning.upright} 
              \n\n3. ${selectedCards[2].name} (Futuro): ${selectedCards[2].meaning.upright} 
              \n\nEsta combinação indica que você está passando por uma transição significativa. A influência do passado ainda é forte, mas novas energias estão se manifestando em sua vida.`;
    } else {
      // Interpretação básica para Cruz Celta
      message = `# Interpretação da Cruz Celta\n\n`;
      
      // Posições da Cruz Celta
      const positions = [
        "Situação presente",
        "Desafio imediato",
        "Passado recente",
        "Futuro próximo",
        "Objetivo consciente",
        "Inconsciente",
        "Atitude do consulente",
        "Influências externas",
        "Esperanças e medos",
        "Resultado final"
      ];
      
      // Construir a interpretação para cada posição
      message += `## Visão Geral\n\n`;
      if (questions.question1) {
        message += `Com base na sua pergunta "${questions.question1}", `;
      }
      message += `a tiragem de Cruz Celta revela um caminho transformador. Vamos analisar cada posição:\n\n`;
      
      // Adicionar interpretação para cada carta
      selectedCards.forEach((card, index) => {
        message += `### ${index + 1}. ${positions[index]} - ${card.name}\n\n`;
        message += `${card.meaning.upright}.\n\n`;
      });
    }
    
    setInterpretation(message);
  };

  // Função para renderizar o layout da Cruz Celta
  const renderCelticCrossLayout = () => {
    if (!isReadingGenerated || selectedCards.length !== 10) return null;

    return (
      <div className="relative w-full max-w-[400px] h-[400px] mx-auto my-4">
        {/* Centro - Cartas 1 e 2 sobrepostas */}
        <div className="absolute left-[calc(50%-35px)] top-[calc(50%-70px)]">
          <TarotCard
            id={selectedCards[0].id}
            name={`1. ${selectedCards[0].name}`}
            image={selectedCards[0].image}
            isRevealed={isCardsRevealed}
          />
        </div>
        <div className="absolute left-[calc(50%-35px)] top-[calc(50%-70px)] rotate-90">
          <TarotCard
            id={selectedCards[1].id}
            name={`2. ${selectedCards[1].name}`}
            image={selectedCards[1].image}
            isRevealed={isCardsRevealed}
          />
        </div>

        {/* Cruz - Cartas 3 a 6 */}
        <div className="absolute left-[calc(50%-35px)] top-[20px]">
          <TarotCard
            id={selectedCards[2].id}
            name={`3. ${selectedCards[2].name}`}
            image={selectedCards[2].image}
            isRevealed={isCardsRevealed}
          />
        </div>
        <div className="absolute left-[calc(50%-35px)] bottom-[20px]">
          <TarotCard
            id={selectedCards[3].id}
            name={`4. ${selectedCards[3].name}`}
            image={selectedCards[3].image}
            isRevealed={isCardsRevealed}
          />
        </div>
        <div className="absolute left-[20px] top-[calc(50%-120px)]">
          <TarotCard
            id={selectedCards[4].id}
            name={`5. ${selectedCards[4].name}`}
            image={selectedCards[4].image}
            isRevealed={isCardsRevealed}
          />
        </div>
        <div className="absolute right-[20px] top-[calc(50%-120px)]">
          <TarotCard
            id={selectedCards[5].id}
            name={`6. ${selectedCards[5].name}`}
            image={selectedCards[5].image}
            isRevealed={isCardsRevealed}
          />
        </div>

        {/* Coluna à direita - Cartas 7 a 10 */}
        <div className="absolute right-[-60px] bottom-[20px]">
          <TarotCard
            id={selectedCards[6].id}
            name={`7. ${selectedCards[6].name}`}
            image={selectedCards[6].image}
            isRevealed={isCardsRevealed}
          />
        </div>
        <div className="absolute right-[-60px] bottom-[90px]">
          <TarotCard
            id={selectedCards[7].id}
            name={`8. ${selectedCards[7].name}`}
            image={selectedCards[7].image}
            isRevealed={isCardsRevealed}
          />
        </div>
        <div className="absolute right-[-60px] bottom-[160px]">
          <TarotCard
            id={selectedCards[8].id}
            name={`9. ${selectedCards[8].name}`}
            image={selectedCards[8].image}
            isRevealed={isCardsRevealed}
          />
        </div>
        <div className="absolute right-[-60px] bottom-[230px]">
          <TarotCard
            id={selectedCards[9].id}
            name={`10. ${selectedCards[9].name}`}
            image={selectedCards[9].image}
            isRevealed={isCardsRevealed}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {!isReadingGenerated ? (
        <div className="flex flex-col items-center space-y-6 animate-fade-in">
          <h2 className="text-2xl font-mystical text-accent text-glow">Tiragem de Tarô</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Concentre-se em sua pergunta ou situação enquanto prepara-se para a tiragem de {cardCount} {cardCount === 1 ? 'carta' : 'cartas'}.
          </p>
          
          {/* Formulário de perguntas para Cruz Celta */}
          {cardCount === 10 && (
            <div className="w-full max-w-md space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Sua pergunta principal *
                </label>
                <Input 
                  placeholder="Ex: Qual é o caminho para meu crescimento espiritual?"
                  value={questions.question1}
                  onChange={(e) => setQuestions(prev => ({ ...prev, question1: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Pergunta adicional (opcional)
                </label>
                <Input 
                  placeholder="Uma área específica de interesse"
                  value={questions.question2}
                  onChange={(e) => setQuestions(prev => ({ ...prev, question2: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Pergunta adicional (opcional)
                </label>
                <Input 
                  placeholder="Outra área específica de interesse"
                  value={questions.question3}
                  onChange={(e) => setQuestions(prev => ({ ...prev, question3: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          <Button 
            onClick={generateTarotReading}
            className="bg-primary hover:bg-primary/80 text-primary-foreground font-mystical"
          >
            Iniciar Tiragem
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-8 animate-fade-in">
          {cardCount === 10 ? (
            renderCelticCrossLayout()
          ) : (
            <div className={`flex flex-wrap gap-4 justify-center ${cardCount === 1 ? 'mt-4' : 'mt-8'}`}>
              {selectedCards.map((card, index) => (
                <TarotCard 
                  key={index}
                  id={card.id}
                  name={card.name}
                  image={card.image}
                  isRevealed={isCardsRevealed}
                  className={`${isCardsRevealed ? 'opacity-100' : 'opacity-90 hover:opacity-100'} transition-opacity duration-300`}
                />
              ))}
            </div>
          )}
          
          {!isCardsRevealed ? (
            <Button 
              onClick={revealCards}
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-mystical mt-6"
            >
              Revelar Cartas
            </Button>
          ) : (
            <div className="mt-8 w-full max-w-3xl animate-fade-in">
              <div className="mystic-border p-6 text-foreground">
                <h3 className="text-xl font-mystical text-accent mb-4">Interpretação das Cartas</h3>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      O oráculo está interpretando as cartas...
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">
                    {interpretation || "Gerando interpretação..."}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={generateTarotReading}
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10 text-foreground font-mystical"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Nova Tiragem
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
