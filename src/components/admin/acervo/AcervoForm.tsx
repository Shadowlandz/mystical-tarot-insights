
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { acervoFormSchema, AcervoFormValues } from "./form-schema";
import { TitleField } from "./form/TitleField";
import { ContentTypeSelector } from "./form/ContentTypeSelector";
import { LinkValidationSection } from "./form/LinkValidationSection";
import { ThumbnailPreview } from "./form/ThumbnailPreview";
import { ExcerptField } from "./form/ExcerptField";
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
  
  const handleFormSubmit = async (values: AcervoFormValues) => {
    try {
      // Simplified form submission without validation
      onSubmit(values);
    } catch (error) {
      toast.error("Erro ao processar formulário: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <TitleField />
        <ContentTypeSelector lockType={lockType} />
        <LinkValidationSection />
        <ThumbnailPreview type={type} />
        <ExcerptField type={type} />
        
        <FormFooterActions 
          onCancel={onCancel} 
          isEditing={isEditing} 
          isValidating={false}
          isFetchingMetadata={false}
        />
      </form>
    </FormProvider>
  );
}
