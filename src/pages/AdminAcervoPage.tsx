import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AcervoItemCard } from "@/components/admin/acervo/AcervoItemCard";
import { AcervoDialog } from "@/components/admin/acervo/AcervoDialog";
import { LinkValidator } from "@/components/admin/acervo/LinkValidator";
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

const AdminAcervoPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<StudyCardProps[]>([]);
  const [filteredItems, setFilteredItems] = useState<StudyCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudyCardProps | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('acervo_items')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const convertedData = convertArrayToStudyCardProps(data || []);
      setItems(convertedData);
      setFilteredItems(convertedData);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os itens do acervo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...items];
    
    if (filterType !== "all") {
      filtered = filtered.filter(item => item.type === filterType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.excerpt.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
  }, [items, searchQuery, filterType]);

  const handleAddItem = async (formValues) => {
    try {
      console.log("Form values received:", formValues);
      
      const newItem = {
        title: formValues.title,
        type: formValues.type,
        thumbnail: formValues.thumbnail,
        excerpt: formValues.excerpt,
        link: formValues.link,
      };
      
      console.log("Sending to Supabase:", newItem);
      
      const { data, error } = await supabase
        .from('acervo_items')
        .insert(newItem)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Response from Supabase:", data);
      
      const convertedItem = convertToStudyCardProps(data);
      
      setItems(prevItems => [convertedItem, ...prevItems]);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Item adicionado",
        description: "O novo item foi adicionado ao acervo com sucesso.",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item ao acervo.",
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
          type: updatedItem.type,
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
        title: "Item atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
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
        title: "Item excluído",
        description: "O item foi removido do acervo com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o item.",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Gerenciar Acervo</h1>
        <div className="flex gap-2">
          <LinkValidator items={items} onRefreshItems={fetchItems} />
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          placeholder="Buscar por título ou descrição..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="md:max-w-sm"
        />
        <Select onValueChange={setFilterType} defaultValue="all">
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="video">Vídeos</SelectItem>
            <SelectItem value="article">Artigos</SelectItem>
            <SelectItem value="document">Documentos</SelectItem>
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

      <AcervoDialog
        open={isAddDialogOpen}
        setOpen={setIsAddDialogOpen}
        onSubmit={handleAddItem}
      />

      <AcervoDialog
        open={!!editingItem}
        setOpen={() => setEditingItem(null)}
        item={editingItem}
        onSubmit={handleEditItem}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este item do acervo? Esta ação
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

export default AdminAcervoPage;
