
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validateLink, LinkValidationResult } from "@/utils/linkValidator";
import { isVideoUrl } from "@/utils/videoUtils";
import { acervoFormSchema, AcervoFormValues } from "./form-schema";
import { TitleField } from "./form/TitleField";
import { ContentTypeSelector } from "./form/ContentTypeSelector";
import { LinkValidationSection } from "./form/LinkValidationSection";
import { ThumbnailPreview } from "./form/ThumbnailPreview";
import { ExcerptField } from "./form/ExcerptField";
import { extractVideoMetadata } from "./form/MetadataExtractor";
import { FormFooterActions } from "./form/FormFooterActions";

export { type AcervoFormValues } from "./form-schema";

interface AcervoFormProps {
  defaultValues?: AcervoFormValues;
  onSubmit: (values: AcervoFormValues) => void;
  onCancel: () => void;
  isEditing: boolean;
  lockType?: boolean;
}

export function AcervoForm({ 
  defaultValues, 
  onSubmit, 
  onCancel, 
  isEditing, 
  lockType = false 
}: AcervoFormProps) {
  const form = useForm<AcervoFormValues>({
    resolver: zodResolver(acervoFormSchema),
    defaultValues: defaultValues || {
      title: "",
      type: "article",
      thumbnail: "",
      excerpt: "",
      link: "",
    },
  });

  // Observe form fields for metadata extraction
  const type = useWatch({ control: form.control, name: "type" });
  const link = useWatch({ control: form.control, name: "link" });
  const currentThumbnail = useWatch({ control: form.control, name: "thumbnail" });
  
  // State for link validation
  const [linkValidation, setLinkValidation] = useState<LinkValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  // Automatically fetch metadata when a video link is entered
  useEffect(() => {
    const fetchMetadataAutomatically = async () => {
      if (type === "video" && link && isVideoUrl(link)) {
        if (!currentThumbnail || form.getValues().title === "" || form.getValues().excerpt === "") {
          setIsFetchingMetadata(true);
          try {
            const fieldsUpdated = await extractVideoMetadata(link, form);
            
            if (fieldsUpdated > 0) {
              toast.success(`Metadados extraídos automaticamente (${fieldsUpdated} campos)`);
            }
          } finally {
            setIsFetchingMetadata(false);
          }
        }
      }
    };
    
    // Debounce the metadata fetch to avoid too many requests
    const timer = setTimeout(() => {
      fetchMetadataAutomatically();
    }, 800);
    
    return () => clearTimeout(timer);
  }, [type, link, currentThumbnail, form]);

  // Manual metadata fetching function
  const handleFetchMetadata = async () => {
    const currentLink = form.getValues().link;
    if (!currentLink) {
      toast.error("Insira um link de vídeo para extrair metadados");
      return;
    }

    if (type !== "video") {
      toast.error("A extração automática de metadados só funciona para vídeos");
      return;
    }
    
    setIsFetchingMetadata(true);
    
    try {
      toast.info("Buscando metadados do vídeo...");
      const fieldsUpdated = await extractVideoMetadata(currentLink, form);
      
      if (fieldsUpdated > 0) {
        toast.success(`Metadados extraídos com sucesso! ${fieldsUpdated} campos atualizados.`);
      } else {
        toast.warning("Não foi possível extrair metadados deste vídeo.");
      }
    } finally {
      setIsFetchingMetadata(false);
    }
  };
  
  // Custom submit function with validation
  const handleFormSubmit = async (values: AcervoFormValues) => {
    // For videos without description, add a default description
    if (values.type === "video" && (!values.excerpt || values.excerpt.trim() === "")) {
      values.excerpt = "Assista a este vídeo para mais informações.";
    }
    
    // Validate the link before submitting
    setIsValidating(true);
    
    try {
      const result = await validateLink(values.link);
      
      if (!result.isValid) {
        // Show confirmation before proceeding with an invalid link
        if (!window.confirm(`O link parece estar inacessível: ${result.message}. Deseja continuar mesmo assim?`)) {
          setIsValidating(false);
          return;
        }
      }
      
      // If we got here, the user confirmed or the link is valid
      onSubmit(values);
    } catch (error) {
      toast.error("Erro ao validar link: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <TitleField />
        <ContentTypeSelector lockType={lockType} />
        <LinkValidationSection 
          isEditing={isEditing}
          isValidating={isValidating}
          setIsValidating={setIsValidating}
          onFetchMetadata={handleFetchMetadata}
          isFetchingMetadata={isFetchingMetadata}
          type={type}
          linkValidation={linkValidation}
          setLinkValidation={setLinkValidation}
        />
        <ThumbnailPreview type={type} />
        <ExcerptField type={type} />
        
        <FormFooterActions 
          onCancel={onCancel} 
          isEditing={isEditing} 
          isValidating={isValidating}
          isFetchingMetadata={isFetchingMetadata}
        />
      </form>
    </FormProvider>
  );
}
