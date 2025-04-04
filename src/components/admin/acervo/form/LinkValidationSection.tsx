
import { useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AcervoFormValues } from "../form-schema";

export function LinkValidationSection() {
  const form = useFormContext<AcervoFormValues>();

  return (
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
            Insira a URL do conteúdo (vídeo, artigo ou documento)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
