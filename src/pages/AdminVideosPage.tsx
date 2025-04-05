
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useAdminVideos } from "@/hooks/useAdminVideos";
import { AcervoDialog } from "@/components/admin/acervo/AcervoDialog";
import { SearchAndFilterBar } from "@/components/admin/videos/SearchAndFilterBar";
import { VideosList } from "@/components/admin/videos/VideosList";
import { ErrorDisplay } from "@/components/admin/shared/ErrorDisplay";
import { DeleteConfirmationDialog } from "@/components/admin/shared/DeleteConfirmationDialog";
import { StudyCardProps } from "@/components/StudyCard";

const AdminVideosPage = () => {
  const {
    items,
    isLoading,
    isAdmin,
    isCheckingAdmin,
    hasError,
    errorMessage,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    fetchItems,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    isFetchingMetadata
  } = useAdminVideos();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudyCardProps | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const handleDeleteConfirm = async () => {
    if (deletingId) {
      const success = await handleDeleteItem(deletingId);
      if (success) {
        setIsDeleteDialogOpen(false);
        setDeletingId(null);
      }
    }
  };

  const handlePreviewVideo = (item: StudyCardProps) => {
    console.log("Visualizando vídeo:", item.title);
  };

  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões de administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Gerenciar Vídeos</h1>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchItems}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Vídeo
            </Button>
          </div>
        )}
      </div>

      <ErrorDisplay 
        isAdmin={isAdmin}
        hasError={hasError}
        errorMessage={errorMessage}
      />

      {isAdmin && (
        <>
          <SearchAndFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <VideosList 
            items={items}
            isLoading={isLoading}
            onEdit={(item) => setEditingItem(item)}
            onDelete={(id) => {
              setDeletingId(id);
              setIsDeleteDialogOpen(true);
            }}
            onPreview={handlePreviewVideo}
            onAddClick={() => setIsAddDialogOpen(true)}
          />

          <AcervoDialog
            open={isAddDialogOpen}
            setOpen={setIsAddDialogOpen}
            onSubmit={handleAddItem}
            defaultType="video"
            isFetchingMetadata={isFetchingMetadata}
          />

          <AcervoDialog
            open={!!editingItem}
            setOpen={() => setEditingItem(null)}
            item={editingItem}
            onSubmit={handleEditItem}
            lockType={true}
          />

          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            title="Confirmar Exclusão"
            description="Tem certeza de que deseja excluir este vídeo do acervo? Esta ação não pode ser desfeita."
          />
        </>
      )}
    </div>
  );
};

export default AdminVideosPage;
