
import { PlusCircle } from "lucide-react";
import { StudyCardProps } from "@/components/StudyCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AcervoForm, AcervoFormValues } from "./AcervoForm";

interface AcervoDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: AcervoFormValues) => void;
  item?: StudyCardProps;
}

export function AcervoDialog({
  open,
  setOpen,
  onSubmit,
  item
}: AcervoDialogProps) {
  // Convert StudyCardProps to AcervoFormValues if needed
  const defaultValues = item ? {
    title: item.title,
    type: item.type,
    thumbnail: item.thumbnail,
    excerpt: item.excerpt,
    link: item.link,
  } : undefined;

  const isEditing = !!item;

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
}
