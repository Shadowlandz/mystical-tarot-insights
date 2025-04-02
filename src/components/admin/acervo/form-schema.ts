
import { z } from "zod";

// Form validation schema with optional excerpt field for all content types
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
  }).optional(),
  link: z.string().url({
    message: "Por favor, insira uma URL válida para o conteúdo",
  }),
});

export type AcervoFormValues = z.infer<typeof acervoFormSchema>;

export type ContentType = "article" | "video" | "document";
