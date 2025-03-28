
import { useState } from "react";
import TarotCard from "./TarotCard";
import { Button } from "./ui/button";
import { tarotData } from "@/data/tarotData";
import { shuffle } from "@/lib/utils";

interface TarotReadingProps {
  cardCount: 1 | 3 | 10;
}

export default function TarotReading({ cardCount }: TarotReadingProps) {
  const [selectedCards, setSelectedCards] = useState<typeof tarotData>([]);
  const [isReadingGenerated, setIsReadingGenerated] = useState(false);
  const [isCardsRevealed, setIsCardsRevealed] = useState(false);
  const [interpretation, setInterpretation] = useState("");
  
  const generateReading = () => {
    const shuffledDeck = shuffle([...tarotData]);
    const newSelectedCards = shuffledDeck.slice(0, cardCount);
    
    setSelectedCards(newSelectedCards);
    setIsReadingGenerated(true);
    setIsCardsRevealed(false);
    setInterpretation("");
  };
  
  const revealCards = () => {
    setIsCardsRevealed(true);
    
    // Simulando a interpretação da IA
    setTimeout(() => {
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
        message = `Uma leitura completa do caminho da vida foi gerada. As dez cartas representam diferentes aspectos de sua jornada. A combinação indica [interpretação detalhada baseada nas 10 cartas selecionadas].`;
      }
      
      setInterpretation(message);
    }, 1500);
  };
  
  return (
    <div className="w-full">
      {!isReadingGenerated ? (
        <div className="flex flex-col items-center space-y-6 animate-fade-in">
          <h2 className="text-2xl font-mystical text-accent text-glow">Tiragem de Tarô</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Concentre-se em sua pergunta ou situação enquanto prepara-se para a tiragem de {cardCount} {cardCount === 1 ? 'carta' : 'cartas'}.
          </p>
          <Button 
            onClick={generateReading}
            className="bg-primary hover:bg-primary/80 text-primary-foreground font-mystical"
          >
            Iniciar Tiragem
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-8 animate-fade-in">
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
          
          {!isCardsRevealed ? (
            <Button 
              onClick={revealCards}
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-mystical mt-6"
            >
              Revelar Cartas
            </Button>
          ) : (
            <div className="mt-8 w-full max-w-2xl animate-fade-in">
              <div className="mystic-border p-6 text-foreground">
                <h3 className="text-xl font-mystical text-accent mb-4">Interpretação das Cartas</h3>
                <p className="whitespace-pre-line">{interpretation || "Gerando interpretação..."}</p>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={generateReading}
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10 text-foreground font-mystical"
                >
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
