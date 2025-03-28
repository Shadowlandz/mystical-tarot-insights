
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background/70 backdrop-blur-md border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-mystical text-accent mb-4">Mystical Tarot Insights</h3>
            <p className="text-muted-foreground">
              Explore o mundo místico do tarot com orientação intuitiva e estudos aprofundados.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-mystical text-accent mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tarot" className="text-foreground hover:text-accent transition-colors duration-200">
                  Tiragem de Tarot
                </Link>
              </li>
              <li>
                <Link to="/acervo" className="text-foreground hover:text-accent transition-colors duration-200">
                  Acervo de Estudos
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-foreground hover:text-accent transition-colors duration-200">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-mystical text-accent mb-4">Contato</h4>
            <p className="text-muted-foreground mb-2">
              Para dúvidas e sugestões:
            </p>
            <a href="mailto:contato@mysticaltarot.com" className="text-primary hover:text-accent transition-colors duration-200">
              contato@mysticaltarot.com
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Mystical Tarot Insights. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
