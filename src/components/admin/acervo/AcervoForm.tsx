import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
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

  const type = useWatch({ control: form.control, name: "type" });
  const link = useWatch({ control: form.control, name: "link" });
  const currentThumbnail = useWatch({ control: form.control, name: "thumbnail" });
  
  const [linkValidation, setLinkValidation] = useState<LinkValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

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
    
    const timer = setTimeout(() => {
      fetchMetadataAutomatically();
    }, 800);
    
    return () => clearTimeout(timer);
  }, [type, link, currentThumbnail, form]);

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

  const handleFormSubmit = async (values: AcervoFormValues) => {
    setIsValidating(true);
    
    try {
      const result = await validateLink(values.link);
      
      if (!result.isValid) {
        if (!window.confirm(`O link parece estar inacessível: ${result.message}. Deseja continuar mesmo assim?`)) {
          setIsValidating(false);
          return;
        }
      }
      
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
