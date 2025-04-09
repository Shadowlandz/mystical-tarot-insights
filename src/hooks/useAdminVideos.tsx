
import { useState } from "react";
import { useAdminCheck } from "./admin/useAdminCheck";
import { useVideoData } from "./admin/useVideoData";
import { useVideoFilters } from "./admin/useVideoFilters";
import { useVideoOperations } from "./admin/useVideoOperations";
import { StudyCardProps } from "@/components/StudyCard";

// Define um tipo para o resultado da operação de adição
interface AddItemResult {
  success: boolean;
  item?: StudyCardProps;
}

export function useAdminVideos() {
  // Use the admin check hook
  const { 
    isAdmin, 
    isCheckingAdmin, 
    hasError: adminHasError, 
    errorMessage: adminErrorMessage 
  } = useAdminCheck();
  
  // Use the video data hook
  const { 
    items, 
    setItems,
    isLoading, 
    fetchItems 
  } = useVideoData(isAdmin);
  
  // Use the video filters hook
  const { 
    filteredItems, 
    searchQuery, 
    setSearchQuery, 
    sortBy, 
    setSortBy 
  } = useVideoFilters(items);
  
  // Use the video operations hook
  const { 
    hasError: operationsHasError,
    errorMessage: operationsErrorMessage,
    isFetchingMetadata,
    handleAddItem: addItem,
    handleEditItem: editItem,
    handleDeleteItem: deleteItem
  } = useVideoOperations();
  
  // Combine errors from different sources
  const hasError = adminHasError || operationsHasError;
  const errorMessage = adminHasError ? adminErrorMessage : operationsErrorMessage;
  
  // Wrap the add item function to update local state
  const handleAddItem = async (formValues: any) => {
    const result = await addItem(formValues);
    
    // Fix TypeScript error by checking if result is an object with success property
    if (result && typeof result === 'object' && 'success' in result && result.success && result.item) {
      setItems(prevItems => [result.item, ...prevItems]);
      return true;
    }
    return false;
  };
  
  // Wrap the edit item function to update local state
  const handleEditItem = async (updatedItem: StudyCardProps) => {
    const success = await editItem(updatedItem);
    if (success === true) {  // Explicitamente verificando se é true
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      return true;
    }
    return false;
  };
  
  // Wrap the delete item function to update local state
  const handleDeleteItem = async (itemId: number) => {
    const success = await deleteItem(itemId);
    if (success === true) {  // Explicitamente verificando se é true
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      return true;
    }
    return false;
  };

  return {
    items: filteredItems,
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
  };
}
