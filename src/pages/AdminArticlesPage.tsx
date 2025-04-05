
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcervoDialog } from "@/components/admin/acervo/AcervoDialog";
import { ContentType } from "@/components/admin/acervo/AcervoTypeUtils";
import { useAdminArticles } from "@/hooks/useAdminArticles";
import { SearchAndFilterBar } from "@/components/admin/articles/SearchAndFilterBar";
import { ArticlesList } from "@/components/admin/articles/ArticlesList";
import { DeleteConfirmationDialog } from "@/components/admin/articles/DeleteConfirmationDialog";
import { StudyCardProps } from "@/components/StudyCard";

type ArticleDocumentType = "article" | "document"; // Define a more specific type for articles/documents

const AdminArticlesPage = () => {
  const [activeTab, setActiveTab] = useState<ArticleDocumentType>("article");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudyCardProps | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const {
    items,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    fetchItems,
    addItem,
    editItem,
    deleteItem
  } = useAdminArticles(activeTab as ContentType);

  // Handle add item
  const handleAddItem = async (formValues) => {
    try {
      await addItem(formValues);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error in handleAddItem:", error);
    }
  };

  // Handle edit item
  const handleEditItem = async (updatedItem: StudyCardProps) => {
    try {
      await editItem(updatedItem);
      setEditingItem(null);
    } catch (error) {
      console.error("Error in handleEditItem:", error);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteItem(deletingId);
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error in handleDeleteConfirm:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <SearchAndFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onRefresh={fetchItems}
        onAddNew={() => setIsAddDialogOpen(true)}
        contentType={activeTab}
      />

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as ArticleDocumentType);
        setSearchQuery("");
      }} className="mb-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="article">Artigos</TabsTrigger>
          <TabsTrigger value="document">Documentos</TabsTrigger>
        </TabsList>
      </Tabs>

      <ArticlesList 
        items={items}
        isLoading={isLoading}
        onEdit={(item) => setEditingItem(item)}
        onDelete={(id) => {
          setDeletingId(id);
          setIsDeleteDialogOpen(true);
        }}
        onAddNew={() => setIsAddDialogOpen(true)}
        contentType={activeTab}
      />

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

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        contentType={activeTab}
      />
    </div>
  );
};

export default AdminArticlesPage;
