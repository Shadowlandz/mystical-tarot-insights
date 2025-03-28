
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TarotReading from "@/components/TarotReading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TarotPage = () => {
  const [activeTab, setActiveTab] = useState("single");
  
  return (
    <div className="min-h-screen flex flex-col bg-background bg-stars">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-mystical text-accent mb-4">Tiragem de Tarô</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o tipo de tiragem que deseja realizar. Concentre-se em sua pergunta ou situação enquanto as cartas são sorteadas.
            </p>
          </header>
          
          <div className="max-w-3xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger 
                  value="single" 
                  className="font-mystical data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Uma Carta
                </TabsTrigger>
                <TabsTrigger 
                  value="three"
                  className="font-mystical data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Três Cartas
                </TabsTrigger>
                <TabsTrigger 
                  value="celtic"
                  className="font-mystical data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  disabled
                >
                  Cruz Celta (Em breve)
                </TabsTrigger>
              </TabsList>
              
              <div className="mystic-border p-6 md:p-8">
                <TabsContent value="single" className="mt-0">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-mystical text-accent mb-2">Tiragem de Uma Carta</h2>
                    <p className="text-muted-foreground text-sm">
                      Ideal para perguntas simples ou orientação diária. A carta única representa a energia ou influência dominante na situação.
                    </p>
                  </div>
                  <TarotReading cardCount={1} />
                </TabsContent>
                
                <TabsContent value="three" className="mt-0">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-mystical text-accent mb-2">Tiragem de Três Cartas</h2>
                    <p className="text-muted-foreground text-sm">
                      Uma leitura clássica que representa passado, presente e futuro, ou situação, ação e resultado.
                    </p>
                  </div>
                  <TarotReading cardCount={3} />
                </TabsContent>
                
                <TabsContent value="celtic" className="mt-0">
                  <div className="text-center">
                    <h2 className="text-xl font-mystical text-accent mb-2">Cruz Celta</h2>
                    <p className="text-muted-foreground mb-6">
                      Esta tiragem detalhada de 10 cartas será lançada em breve.
                    </p>
                    <Button disabled className="bg-primary/50 text-primary-foreground/70 font-mystical cursor-not-allowed">
                      Em Desenvolvimento
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          <div className="mt-12 max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-mystical text-accent mb-4">Dicas para uma Boa Leitura</h3>
            <ul className="text-muted-foreground space-y-2 text-left mx-auto max-w-lg">
              <li>• Encontre um local tranquilo e livre de distrações.</li>
              <li>• Respire profundamente e concentre-se em sua pergunta.</li>
              <li>• Mantenha uma mente aberta às mensagens que as cartas trazem.</li>
              <li>• Lembre-se que o tarô é uma ferramenta para reflexão e autoconhecimento.</li>
              <li>• Confie em sua intuição ao interpretar os significados.</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TarotPage;
