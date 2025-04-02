
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
          <FormLabel>Resumo (opcional)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Opcional - breve descrição do conteúdo" 
              className="resize-none"
              rows={3}
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Uma breve descrição do conteúdo é opcional. Deixe em branco se não quiser adicionar.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
