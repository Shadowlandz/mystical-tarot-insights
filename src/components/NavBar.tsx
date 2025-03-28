
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-mystical font-bold text-accent text-glow">Mystical Tarot</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-accent transition-colors duration-200">Início</Link>
          <Link to="/tarot" className="text-foreground hover:text-accent transition-colors duration-200">Tiragem</Link>
          <Link to="/acervo" className="text-foreground hover:text-accent transition-colors duration-200">Acervo</Link>
          <Link to="/sobre" className="text-foreground hover:text-accent transition-colors duration-200">Sobre</Link>
          <ThemeToggle />
        </div>
        
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-accent transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/tarot" 
              className="text-foreground hover:text-accent transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Tiragem
            </Link>
            <Link 
              to="/acervo" 
              className="text-foreground hover:text-accent transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Acervo
            </Link>
            <Link 
              to="/sobre" 
              className="text-foreground hover:text-accent transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
