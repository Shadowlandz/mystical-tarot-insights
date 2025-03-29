
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { getVideoThumbnail, isVideoUrl } from "@/utils/videoUtils";

// Form validation schema
export const acervoFormSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres",
  }),
  type: z.enum(["article", "video", "document"], {
    required_error: "Selecione um tipo de conteúdo",
  }),
  thumbnail: z.string().url({
    message: "Por favor, insira uma URL válida para a miniatura",
  }),
  excerpt: z.string().min(10, {
    message: "O resumo deve ter pelo menos 10 caracteres",
  }),
  link: z.string().url({
    message: "Por favor, insira uma URL válida para o conteúdo",
  }),
});

export type AcervoFormValues = z.infer<typeof acervoFormSchema>;

interface AcervoFormProps {
  defaultValues?: AcervoFormValues;
  onSubmit: (values: AcervoFormValues) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function AcervoForm({ defaultValues, onSubmit, onCancel, isEditing }: AcervoFormProps) {
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

  // Observar os campos 'type' e 'link' para detectar automaticamente a thumbnail
  const type = useWatch({ control: form.control, name: "type" });
  const link = useWatch({ control: form.control, name: "link" });
  const currentThumbnail = useWatch({ control: form.control, name: "thumbnail" });

  // Detectar thumbnail automaticamente quando for um vídeo
  useEffect(() => {
    if (type === "video" && link && isVideoUrl(link) && (!currentThumbnail || currentThumbnail === "")) {
      const thumbnail = getVideoThumbnail(link);
      if (thumbnail) {
        form.setValue("thumbnail", thumbnail, { shouldValidate: true });
      }
    }
  }, [type, link, currentThumbnail, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do conteúdo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Conteúdo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="article">Artigo</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link do Conteúdo</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/content" {...field} />
              </FormControl>
              <FormDescription>
                {type === "video" ? 
                  "URL do vídeo (YouTube, Vimeo, etc.). A miniatura será detectada automaticamente." : 
                  "URL para o artigo ou documento completo"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumo</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Breve descrição do conteúdo" 
                  className="resize-none"
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? "Atualizar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
