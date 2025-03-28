
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para embaralhar array (algoritmo Fisher-Yates)
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  let currentIndex = newArray.length;
  let temporaryValue;
  let randomIndex;

  // Enquanto houver elementos para embaralhar
  while (currentIndex !== 0) {
    // Escolha um elemento restante
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Troque-o com o elemento atual
    temporaryValue = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temporaryValue;
  }

  return newArray;
}

// Função para formatar data
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

// Função para truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
