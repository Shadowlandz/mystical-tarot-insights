
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getVideoThumbnail, isVideoUrl } from "@/utils/videoUtils";
import { validateLink, LinkValidationResult } from "@/utils/linkValidator";
import { fetchVideoMetadata } from "@/utils/videoMetadataFetcher";

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
  lockType?: boolean;
}

export function AcervoForm({ defaultValues, onSubmit, onCancel, isEditing, lockType = false }: AcervoFormProps) {
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
  
  // Estado para controlar a validação do link
  const [linkValidation, setLinkValidation] = useState<LinkValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  // Detectar thumbnail automaticamente quando for um vídeo
  useEffect(() => {
    if (type === "video" && link && isVideoUrl(link) && (!currentThumbnail || currentThumbnail === "")) {
      const thumbnail = getVideoThumbnail(link);
      if (thumbnail) {
        form.setValue("thumbnail", thumbnail, { shouldValidate: true });
      }
    }
  }, [type, link, currentThumbnail, form]);
  
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
        if (type === "video" && result.thumbnail && (!currentThumbnail || currentThumbnail === "")) {
          form.setValue("thumbnail", result.thumbnail, { shouldValidate: true });
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

  // Nova função para buscar metadados do vídeo
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
      const metadata = await fetchVideoMetadata(currentLink);
      
      let fieldsUpdated = 0;
      
      if (metadata.thumbnail && (!currentThumbnail || currentThumbnail === "")) {
        form.setValue("thumbnail", metadata.thumbnail, { shouldValidate: true });
        fieldsUpdated++;
      }
      
      if (metadata.title && form.getValues().title === "") {
        form.setValue("title", metadata.title, { shouldValidate: true });
        fieldsUpdated++;
      }
      
      if (metadata.description && form.getValues().excerpt === "") {
        // Truncate if too long
        const excerpt = metadata.description.length > 500 
          ? metadata.description.substring(0, 497) + "..." 
          : metadata.description;
        
        form.setValue("excerpt", excerpt, { shouldValidate: true });
        fieldsUpdated++;
      }
      
      if (fieldsUpdated > 0) {
        toast.success(`Metadados extraídos com sucesso! ${fieldsUpdated} campos atualizados.`);
      } else {
        toast.warning("Não foi possível extrair metadados deste vídeo.");
      }
    } catch (error) {
      toast.error("Erro ao extrair metadados: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsFetchingMetadata(false);
    }
  };
  
  // Função personalizada para submit
  const handleFormSubmit = async (values: AcervoFormValues) => {
    // Validar o link antes de enviar
    setIsValidating(true);
    
    try {
      const result = await validateLink(values.link);
      
      if (!result.isValid) {
        // Mostrar confirmação antes de prosseguir com um link inválido
        if (!window.confirm(`O link parece estar inacessível: ${result.message}. Deseja continuar mesmo assim?`)) {
          setIsValidating(false);
          return;
        }
      }
      
      // Se chegou aqui, o usuário confirmou ou o link está válido
      onSubmit(values);
    } catch (error) {
      toast.error("Erro ao validar link: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                disabled={lockType}
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
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input placeholder="https://example.com/content" {...field} />
                </FormControl>
                {type === "video" && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleFetchMetadata}
                    disabled={isFetchingMetadata || !field.value}
                    className="shrink-0"
                  >
                    {isFetchingMetadata ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
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
                  "URL do vídeo (YouTube, Vimeo, etc.). A miniatura será detectada automaticamente." : 
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
          <Button type="submit" disabled={isValidating || isFetchingMetadata}>
            {isEditing ? "Atualizar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
