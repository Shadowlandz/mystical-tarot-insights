
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { isVideoUrl } from "@/utils/videoUtils";
import { fetchVideoMetadata } from "@/utils/videoMetadataFetcher";
import { AcervoFormValues } from "../form-schema";

export async function extractVideoMetadata(
  link: string,
  form: UseFormReturn<AcervoFormValues>
): Promise<number> {
  if (!link || !isVideoUrl(link)) {
    return 0;
  }

  try {
    const metadata = await fetchVideoMetadata(link);
    let fieldsUpdated = 0;
    
    const currentThumbnail = form.getValues().thumbnail;
    if (metadata.thumbnail && (!currentThumbnail || currentThumbnail === "")) {
      form.setValue("thumbnail", metadata.thumbnail, { shouldValidate: true });
      fieldsUpdated++;
    }
    
    const currentTitle = form.getValues().title;
    if (metadata.title && (!currentTitle || currentTitle === "")) {
      form.setValue("title", metadata.title, { shouldValidate: true });
      fieldsUpdated++;
    }
    
    const currentExcerpt = form.getValues().excerpt;
    if (metadata.description && (!currentExcerpt || currentExcerpt === "")) {
      // Truncate if too long
      const excerpt = metadata.description.length > 500 
        ? metadata.description.substring(0, 497) + "..." 
        : metadata.description;
      
      form.setValue("excerpt", excerpt, { shouldValidate: true });
      fieldsUpdated++;
    }
    
    return fieldsUpdated;
  } catch (error) {
    console.error("Erro ao extrair metadados:", error);
    toast.error("Falha ao extrair metadados: " + 
      (error instanceof Error ? error.message : String(error)));
    return 0;
  }
}
