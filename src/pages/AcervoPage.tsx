
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StudyCard from "@/components/StudyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { StudyCardProps } from "@/components/StudyCard";

const AcervoPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [acervoItems, setAcervoItems] = useState<StudyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data from Supabase
  useEffect(() => {
    fetchAcervoItems();
  }, []);
  
  const fetchAcervoItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('acervo_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching acervo items:", error);
        return;
      }
      
      if (data) {
        // Convert Supabase UUID to number ID for compatibility with existing components
        const formattedData = data.map(item => ({
          ...item,
          id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || Math.floor(Math.random() * 10000),
        }));
        
        setAcervoItems(formattedData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filtragem dos estudos com base na pesquisa e na tab ativa
  const filteredStudies = acervoItems.filter((study) => {
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         study.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || study.type === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-background bg-stars">
      <NavBar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-mystical text-accent mb-4">Acervo de Estudos</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore nossa coleção de artigos, documentos e vídeos sobre tarô, símbolos místicos e práticas espirituais.
            </p>
          </header>
          
          <div className="max-w-5xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por título ou conteúdo..."
                className="pl-10 bg-background border-primary/30 focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger 
                  value="all" 
                  className="font-mystical data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Todos
                </TabsTrigger>
                <TabsTrigger 
                  value="article"
                  className="font-mystical data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Artigos
                </TabsTrigger>
                <TabsTrigger 
                  value="video"
                  className="font-mystical data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Vídeos
                </TabsTrigger>
                <TabsTrigger 
                  value="document"
                  className="font-mystical data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Documentos
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p className="text-muted-foreground">Carregando itens do acervo...</p>
              </div>
            ) : filteredStudies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudies.map((study) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Nenhum resultado encontrado para sua busca.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setActiveTab("all");
                  }}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
            
            {/* Paginação (para futuras implementações) */}
            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="border-primary/30 hover:bg-primary/10" disabled>
                Carregar Mais
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AcervoPage;
