
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StudyCard, { StudyCardProps } from "@/components/StudyCard";
import { supabase } from "@/integrations/supabase/client";
import { convertArrayToStudyCardProps } from "@/types/acervo";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

const AcervoPage = () => {
  const [items, setItems] = useState<StudyCardProps[]>([]);
  const [filteredItems, setFilteredItems] = useState<StudyCardProps[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAcervoItems = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('acervo_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        const convertedData = convertArrayToStudyCardProps(data || []);
        setItems(convertedData);
        setFilteredItems(convertedData);
      } catch (error) {
        console.error('Error fetching acervo items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAcervoItems();
  }, []);

  useEffect(() => {
    let result = [...items];
    
    if (activeCategory !== "all") {
      result = result.filter(item => item.type === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.excerpt.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(result);
  }, [activeCategory, searchQuery, items]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-8">
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
            
            {loading ? (
              <div className="flex justify-center py-12">
                <p className="text-muted-foreground">Carregando itens do acervo...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((study) => (
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
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
            
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
