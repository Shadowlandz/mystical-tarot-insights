
import { PlusCircle } from "lucide-react";
import { AcervoFormValues } from "./AcervoForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AcervoForm } from "./AcervoForm";

interface AcervoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AcervoFormValues) => void;
  onCancel: () => void;
  isEditing: boolean;
  defaultValues?: AcervoFormValues;
}

export function AcervoDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  onCancel,
  isEditing,
  defaultValues,
}: AcervoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Conteúdo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Conteúdo" : "Adicionar Novo Conteúdo"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes do conteúdo que deseja {isEditing ? "atualizar" : "adicionar"} ao acervo.
          </DialogDescription>
        </DialogHeader>
        <AcervoForm 
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
}
