
import { useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AcervoFormValues } from "../form-schema";

interface ExcerptFieldProps {
  type: string;
}

export function ExcerptField({ type }: ExcerptFieldProps) {
  const form = useFormContext<AcervoFormValues>();

  return (
    <FormField
      control={form.control}
      name="excerpt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{type === "video" ? "Resumo (opcional para vídeos)" : "Resumo"}</FormLabel>
          <FormControl>
            <Textarea 
              placeholder={type === "video" ? "Opcional - será preenchido automaticamente se disponível" : "Breve descrição do conteúdo"} 
              className="resize-none"
              rows={3}
              {...field} 
            />
          </FormControl>
          <FormDescription>
            {type === "video" ? 
              "Para vídeos, o resumo é opcional e será extraído automaticamente quando possível." : 
              "Uma breve descrição do conteúdo para exibição na listagem."}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
