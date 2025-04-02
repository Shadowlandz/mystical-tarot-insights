
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AcervoFormValues } from "../form-schema";

export function TitleField() {
  const form = useFormContext<AcervoFormValues>();

  return (
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
  );
}
