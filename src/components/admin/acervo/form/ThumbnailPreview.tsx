
import { useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AcervoFormValues } from "../form-schema";

interface ThumbnailPreviewProps {
  type: string;
}

export function ThumbnailPreview({ type }: ThumbnailPreviewProps) {
  const form = useFormContext<AcervoFormValues>();
  const thumbnailValue = form.watch("thumbnail");

  return (
    <FormField
      control={form.control}
      name="thumbnail"
      render={({ field }) => (
        <FormItem>
          <FormLabel>URL da Miniatura</FormLabel>
          <FormControl>
            <Input placeholder="https://example.com/image.jpg" {...field} />
          </FormControl>
          <FormDescription>
            {type === "video" ? 
              "Miniatura detectada automaticamente. Você pode modificá-la se desejar." : 
              "URL de uma imagem para representar o conteúdo"}
          </FormDescription>
          {field.value && (
            <div className="mt-2">
              <p className="text-sm mb-1">Prévia:</p>
              <img 
                src={field.value} 
                alt="Thumbnail preview" 
                className="w-full h-32 object-cover rounded-md" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Imagem+Inválida';
                }}
              />
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
