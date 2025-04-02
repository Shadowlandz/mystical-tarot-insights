
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validateLink, LinkValidationResult } from "@/utils/linkValidator";
import { AcervoFormValues } from "../form-schema";

interface LinkValidationSectionProps {
  isEditing: boolean;
  isValidating: boolean;
  setIsValidating: (value: boolean) => void;
  onFetchMetadata?: () => void;
  isFetchingMetadata?: boolean;
  type: string;
  linkValidation: LinkValidationResult | null;
  setLinkValidation: (result: LinkValidationResult | null) => void;
}

export function LinkValidationSection({
  isEditing,
  isValidating,
  setIsValidating,
  onFetchMetadata,
  isFetchingMetadata = false,
  type,
  linkValidation,
  setLinkValidation,
}: LinkValidationSectionProps) {
  const form = useFormContext<AcervoFormValues>();

  // Função para validar o link atual
  const handleValidateLink = async () => {
    const currentLink = form.getValues().link;
    if (!currentLink) {
      toast.error("Insira um link para validar");
      return;
    }
    
    setIsValidating(true);
    setLinkValidation(null);
    
    try {
      const result = await validateLink(currentLink);
      setLinkValidation(result);
      
      if (result.isValid) {
        toast.success("Link validado com sucesso!");
        
        // Se for um vídeo e o resultado trouxer uma thumbnail, usamos ela
        if (type === "video" && result.thumbnail) {
          const currentThumbnail = form.getValues().thumbnail;
          if (!currentThumbnail || currentThumbnail === "") {
            form.setValue("thumbnail", result.thumbnail, { shouldValidate: true });
          }
        }
      } else {
        toast.error("Problema com o link: " + result.message);
      }
    } catch (error) {
      toast.error("Erro ao validar link: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="link"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Link do Conteúdo</FormLabel>
          <div className="flex gap-2">
            <FormControl className="flex-1">
              <Input placeholder="https://example.com/content" {...field} />
            </FormControl>
            {type === "video" && onFetchMetadata && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onFetchMetadata}
                disabled={isFetchingMetadata || !field.value}
                className="shrink-0"
              >
                {isFetchingMetadata ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Loader2 className="h-4 w-4 mr-2" />
                )}
                Extrair Metadados
              </Button>
            )}
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleValidateLink}
              disabled={isValidating || !field.value}
              className="shrink-0"
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                "Validar Link"
              )}
            </Button>
          </div>
          <FormDescription>
            {type === "video" ? 
              "URL do vídeo (YouTube, Vimeo, etc.). A miniatura, título e descrição serão detectados automaticamente." : 
              "URL para o artigo ou documento completo"}
          </FormDescription>
          
          {linkValidation && (
            <Alert variant={linkValidation.isValid ? "default" : "destructive"} className="mt-2">
              {linkValidation.isValid ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle>{linkValidation.isValid ? "Link válido" : "Problema detectado"}</AlertTitle>
              <AlertDescription>{linkValidation.message}</AlertDescription>
            </Alert>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
