
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormFooterActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isValidating: boolean;
  isFetchingMetadata: boolean;
}

export function FormFooterActions({ 
  onCancel, 
  isEditing, 
  isValidating, 
  isFetchingMetadata 
}: FormFooterActionsProps) {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isValidating || isFetchingMetadata}>
        {isEditing ? "Atualizar" : "Adicionar"}
      </Button>
    </DialogFooter>
  );
}
