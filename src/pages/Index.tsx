
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TarotCard from "@/components/TarotCard";
import StudyCard from "@/components/StudyCard";
import { supabase } from "@/integrations/supabase/client";
import { convertArrayToStudyCardProps } from "@/types/acervo";

const Index = () => {
  const [recentStudies, setRecentStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent content from Supabase
  useEffect(() => {
    const fetchRecentContent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('acervo_items')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        const convertedData = convertArrayToStudyCardProps(data || []);
        setRecentStudies(convertedData);
      } catch (error) {
        console.error("Error fetching recent content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentContent();
  }, []);

  // Cartas destacadas para a página inicial
  const featuredCards = [
    {
      id: 0,
      name: "O Louco",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
    },
    {
      id: 17,
      name: "A Estrela",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
    },
    {
      id: 19,
      name: "O Sol",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background bg-stars">
      <NavBar />
      
      {/* Hero Section */}
      <section className="mt-16 pt-16 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[70%] bg-gradient-to-b from-mystic-purple/10 to-transparent"></div>
        <div className="container mx-auto flex flex-col items-center text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-mystical text-gradient-to-b from-accent to-accent/70 mb-6 text-shadow animate-float">
            Mystical Tarot Insights
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mb-8">
            Explore o mundo místico do tarô com orientações intuitivas e interpretações profundas. Descubra os segredos que as cartas revelam sobre seu caminho.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground font-mystical">
              <Link to="/tarot">Iniciar Tiragem de Tarô</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 text-foreground font-mystical">
              <Link to="/acervo">Explorar Acervo de Estudos</Link>
            </Button>
          </div>
          
          <div className="mt-16 flex justify-center items-end space-x-4 md:space-x-8">
            {featuredCards.map((card, index) => (
              <TarotCard 
                key={index}
                id={card.id}
                name={card.name}
                image={card.image}
                isRevealed={true}
                className={`transform ${
                  index === 0 ? 'rotate-[-8deg]' : 
                  index === 2 ? 'rotate-[8deg]' : ''
                } hover:rotate-0 transition-transform duration-300`}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto">
          <h2 className="text-3xl font-mystical text-accent text-center mb-12">
            Descubra o Poder do Tarô
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="mystic-border p-6 flex flex-col items-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-3xl">🔮</span>
              </div>
              <h3 className="text-xl font-mystical text-accent mb-3">Tiragens Personalizadas</h3>
              <p className="text-muted-foreground">
                Escolha entre tiragens de 1, 3 ou 10 cartas com interpretações detalhadas para suas questões específicas.
              </p>
            </div>
            
            <div className="mystic-border p-6 flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-mystical text-accent mb-3">Acervo de Estudos</h3>
              <p className="text-muted-foreground">
                Acesse artigos, documentos e vídeos sobre tarô, simbolismo esotérico e práticas espirituais.
              </p>
            </div>
            
            <div className="mystic-border p-6 flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-mystical text-accent mb-3">Interpretação por IA</h3>
              <p className="text-muted-foreground">
                Obtenha insights profundos através de interpretações geradas por nossa inteligência artificial especializada.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Articles Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-mystical text-accent">Estudos Recentes</h2>
            <Link to="/acervo" className="text-primary hover:text-accent transition-colors flex items-center">
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="mystic-card group h-full flex flex-col animate-pulse">
                  <div className="h-40 bg-primary/10 rounded-t-md"></div>
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="h-6 bg-primary/10 rounded-md mb-2 w-3/4"></div>
                    <div className="h-4 bg-primary/10 rounded-md mb-2 w-full"></div>
                    <div className="h-4 bg-primary/10 rounded-md mb-2 w-5/6"></div>
                    <div className="h-4 bg-primary/10 rounded-md w-2/3 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentStudies.map((study) => (
                <StudyCard
                  key={study.id}
                  id={study.id}
                  title={study.title}
                  type={study.type as "article" | "video" | "document"}
                  thumbnail={study.thumbnail}
                  excerpt={study.excerpt}
                  link={study.link}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-mystical text-accent mb-4">
            Comece Sua Jornada Mística
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Embarque em uma jornada de autodescoberta e iluminação através do poder ancestral do tarô.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground font-mystical">
            <Link to="/tarot">Fazer Minha Primeira Tiragem</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
