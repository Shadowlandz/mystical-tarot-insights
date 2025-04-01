import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AcervoItemCard } from "@/components/admin/acervo/AcervoItemCard";
import { AcervoDialog } from "@/components/admin/acervo/AcervoDialog";
import { StudyCardProps } from "@/components/StudyCard";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { convertArrayToStudyCardProps, convertToStudyCardProps } from "@/types/acervo";
import { ContentType } from "@/components/admin/acervo/AcervoTypeUtils";

const AdminArticlesPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<StudyCardProps[]>([]);
  const [filteredItems, setFilteredItems] = useState<StudyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudyCardProps | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [activeTab, setActiveTab] = useState<ContentType>("article");

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('acervo_items')
        .select('*')
        .eq('type', activeTab)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const convertedData = convertArrayToStudyCardProps(data || []);
      setItems(convertedData);
      setFilteredItems(convertedData);
    } catch (error) {
      console.error(`Error fetching ${activeTab}s:`, error);
      toast({
        title: "Erro",
        description: `Não foi possível carregar os ${activeTab === 'article' ? 'artigos' : 'documentos'}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...items];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.excerpt.toLowerCase().includes(query)
      );
    }
    
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
    } else if (sortBy === "views") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredItems(filtered);
  }, [items, searchQuery, sortBy]);

  const handleAddItem = async (formValues) => {
    try {
      const newItem = {
        title: formValues.title,
        type: activeTab,
        thumbnail: formValues.thumbnail,
        excerpt: formValues.excerpt,
        link: formValues.link,
      };
      
      const { data, error } = await supabase
        .from('acervo_items')
        .insert(newItem)
        .select()
        .single();
      
      if (error) throw error;
      
      const convertedItem = convertToStudyCardProps(data);
      
      setItems(prevItems => [convertedItem, ...prevItems]);
      setIsAddDialogOpen(false);
      
      toast({
        title: activeTab === 'article' ? "Artigo adicionado" : "Documento adicionado",
        description: activeTab === 'article' 
          ? "O novo artigo foi adicionado ao acervo com sucesso."
          : "O novo documento foi adicionado ao acervo com sucesso.",
      });
    } catch (error) {
      console.error(`Error adding ${activeTab}:`, error);
      toast({
        title: "Erro",
        description: `Não foi possível adicionar o ${activeTab === 'article' ? 'artigo' : 'documento'}.`,
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async (updatedItem: StudyCardProps) => {
    try {
      const originalItem = items.find(item => item.id === updatedItem.id);
      if (!originalItem) {
        throw new Error("Item não encontrado");
      }
      
      const { data: dbItems, error: fetchError } = await supabase
        .from('acervo_items')
        .select('*')
        .limit(100);
      
      if (fetchError) throw fetchError;
      
      const dbItem = dbItems.find(item => {
        const convertedId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;
        return convertedId === updatedItem.id;
      });
      
      if (!dbItem) {
        throw new Error("Item não encontrado no banco de dados");
      }
      
      const { error } = await supabase
        .from('acervo_items')
        .update({
          title: updatedItem.title,
          type: activeTab,
          thumbnail: updatedItem.thumbnail,
          excerpt: updatedItem.excerpt,
          link: updatedItem.link,
        })
        .eq('id', dbItem.id);
      
      if (error) throw error;
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      
      setEditingItem(null);
      
      toast({
        title: activeTab === 'article' ? "Artigo atualizado" : "Documento atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error(`Error updating ${activeTab}:`, error);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar o ${activeTab === 'article' ? 'artigo' : 'documento'}.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    
    try {
      const { data: dbItems, error: fetchError } = await supabase
        .from('acervo_items')
        .select('*')
        .limit(100);
      
      if (fetchError) throw fetchError;
      
      const dbItem = dbItems.find(item => {
        const convertedId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;
        return convertedId === deletingId;
      });
      
      if (!dbItem) {
        throw new Error("Item não encontrado no banco de dados");
      }
      
      const { error } = await supabase
        .from('acervo_items')
        .delete()
        .eq('id', dbItem.id);
      
      if (error) throw error;
      
      setItems(prevItems => prevItems.filter(item => item.id !== deletingId));
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      
      toast({
        title: activeTab === 'article' ? "Artigo excluído" : "Documento excluído",
        description: activeTab === 'article' 
          ? "O artigo foi removido do acervo com sucesso."
          : "O documento foi removido do acervo com sucesso.",
      });
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
      toast({
        title: "Erro",
        description: `Não foi possível excluir o ${activeTab === 'article' ? 'artigo' : 'documento'}.`,
        variant: "destructive",
      });
    }
  };

  const getEmptyStateText = () => {
    return {
      title: activeTab === 'article' ? "Nenhum artigo encontrado" : "Nenhum documento encontrado",
      description: activeTab === 'article' 
        ? "Adicione novos artigos ou altere os critérios de busca."
        : "Adicione novos documentos ou altere os critérios de busca.",
      emoji: activeTab === 'article' ? "📝" : "📚",
      buttonText: activeTab === 'article' ? "Adicionar Artigo" : "Adicionar Documento"
    };
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Gerenciar Conteúdo</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchItems}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === 'article' ? "Adicionar Artigo" : "Adicionar Documento"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as "article" | "document");
        setSearchQuery("");
      }} className="mb-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="article">Artigos</TabsTrigger>
          <TabsTrigger value="document">Documentos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          placeholder="Buscar por título ou descrição..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-sm"
        />
        <Select onValueChange={setSortBy} defaultValue="recent">
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais Recentes</SelectItem>
            <SelectItem value="views">Mais Visualizados</SelectItem>
            <SelectItem value="title">Título (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-md p-4 bg-muted">
              <div className="h-40 bg-secondary rounded-md mb-2"></div>
              <div className="h-6 bg-secondary rounded-md mb-2"></div>
              <div className="h-4 bg-secondary rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <div className="text-4xl mb-2">{getEmptyStateText().emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{getEmptyStateText().title}</h3>
              <p className="text-muted-foreground mb-4">
                {getEmptyStateText().description}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {getEmptyStateText().buttonText}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <AcervoItemCard
                  key={item.id}
                  item={item}
                  onEdit={(item) => setEditingItem(item)}
                  onDelete={(id) => {
                    setDeletingId(id);
                    setIsDeleteDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      <AcervoDialog
        open={isAddDialogOpen}
        setOpen={setIsAddDialogOpen}
        onSubmit={handleAddItem}
        defaultType={activeTab}
      />

      <AcervoDialog
        open={!!editingItem}
        setOpen={() => setEditingItem(null)}
        item={editingItem}
        onSubmit={handleEditItem}
        lockType={true}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este {activeTab === 'article' ? 'artigo' : 'documento'} do acervo? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArticlesPage;
