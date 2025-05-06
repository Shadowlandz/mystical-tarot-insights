
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TarotCardType } from "@/data/tarotData";

export interface TarotCardProps {
  card?: TarotCardType;
  id?: number;
  name?: string;
  image?: string;
  isRevealed?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TarotCard({ id, name, image, isRevealed = false, onClick, className, card }: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use card properties if a card object is provided
  const cardId = card?.id || id;
  const cardName = card?.name || name;
  const cardImage = card?.image || image;
  
  return (
    <div 
      className={cn(
        "relative w-[140px] h-[240px] cursor-pointer perspective-1000 glow-effect",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          "absolute w-full h-full transition-all duration-500 transform-style-preserve-3d",
          isRevealed && "animate-card-flip"
        )}
      >
        <div className="absolute backface-hidden w-full h-full card-back">
          <div className="text-accent/80 text-3xl font-mystical">T</div>
        </div>
        
        <div className="absolute backface-hidden w-full h-full rotate-y-180 mystic-card overflow-hidden">
          <img 
            src={cardImage} 
            alt={cardName}
            className="w-full h-full object-cover"
          />
          
          {(isRevealed || isHovered) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-mystic-dark/90 to-transparent p-2 text-center">
              <span className="text-sm font-mystical text-accent">{cardName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
