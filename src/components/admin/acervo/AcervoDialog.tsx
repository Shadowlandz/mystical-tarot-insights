
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
import { AcervoForm } from "./AcervoForm";
import { AcervoFormValues } from "./form-schema";
import { ContentType } from "./form-schema";
import { useState, useEffect } from "react";
import { isUserAdmin } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AcervoDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: AcervoFormValues) => void;
  item?: StudyCardProps;
  defaultType?: ContentType;
  lockType?: boolean;
  isFetchingMetadata?: boolean;
}

export function AcervoDialog({
  open,
  setOpen,
  onSubmit,
  item,
  defaultType,
  lockType = false,
  isFetchingMetadata = false
}: AcervoDialogProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  
  // Check admin status when dialog opens
  useEffect(() => {
    let isMounted = true;
    
    if (open) {
      const checkAdmin = async () => {
        setIsCheckingAdmin(true);
        try {
          const adminStatus = await isUserAdmin();
          console.log("Admin status check result:", adminStatus);
          if (isMounted) {
            setIsAdmin(adminStatus);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          if (isMounted) {
            setIsAdmin(false);
          }
        } finally {
          if (isMounted) {
            setIsCheckingAdmin(false);
          }
        }
      };
      
      checkAdmin();
    }
    
    return () => {
      isMounted = false;
    };
  }, [open]);

  // Convert StudyCardProps to AcervoFormValues if needed
  const defaultValues = item ? {
    title: item.title,
    type: item.type,
    thumbnail: item.thumbnail,
    excerpt: item.excerpt,
    link: item.link,
  } : defaultType ? {
    title: "",
    type: defaultType,
    thumbnail: "",
    excerpt: "",
    link: "",
  } : undefined;

  const isEditing = !!item;

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (values: AcervoFormValues) => {
    if (!isAdmin) {
      console.log("Submit blocked: User is not admin");
      return;
    }
    onSubmit(values);
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
        
        {isCheckingAdmin ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : !isAdmin ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você não tem permissão para {isEditing ? "editar" : "adicionar"} conteúdo.
              Verifique se você está logado com uma conta de administrador.
            </AlertDescription>
          </Alert>
        ) : (
          <AcervoForm 
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={isEditing}
            lockType={lockType}
            isFetchingMetadata={isFetchingMetadata}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
