
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AcervoFormValues } from "../form-schema";
import { fetchVideoMetadata } from "@/utils/videoMetadataFetcher";
import { isVideoUrl } from "@/utils/videoUtils";

export function LinkValidationSection() {
  const form = useFormContext<AcervoFormValues>();
  const [isProcessingLink, setIsProcessingLink] = useState(false);
  const formType = form.watch("type");

  // Auto-extract metadata when link changes and is a video
  useEffect(() => {
    const link = form.watch("link");
    const currentTitle = form.watch("title");
    const currentThumbnail = form.watch("thumbnail");
    
    const extractMetadata = async () => {
      if (formType === "video" && link && isVideoUrl(link)) {
        setIsProcessingLink(true);
        try {
          const metadata = await fetchVideoMetadata(link);
          
          // Set thumbnail if available and not already set
          if (metadata.thumbnail && (!currentThumbnail || currentThumbnail === "")) {
            form.setValue("thumbnail", metadata.thumbnail, { shouldValidate: true });
          }
          
          // Set title if available and not already set
          if (metadata.title && (!currentTitle || currentTitle === "")) {
            form.setValue("title", metadata.title, { shouldValidate: true });
          }
          
        } catch (error) {
          console.error("Error extracting metadata:", error);
        } finally {
          setIsProcessingLink(false);
        }
      }
    };

    // Debounce metadata extraction
    const timer = setTimeout(extractMetadata, 500);
    return () => clearTimeout(timer);
  }, [form.watch("link"), formType]);

  return (
    <FormField
      control={form.control}
      name="link"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Link do Conteúdo</FormLabel>
          <FormControl>
            <div className="relative">
              <Input placeholder="https://example.com/content" {...field} />
              {isProcessingLink && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            {formType === "video" 
              ? "Insira a URL do vídeo. A miniatura será extraída automaticamente." 
              : "Insira a URL do conteúdo (artigo ou documento)."}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
