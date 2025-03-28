
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Wand2, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  apiKey: z.string().min(1, {
    message: "A chave da API Gemini é obrigatória",
  }),
  prompt: z.string().min(10, {
    message: "O prompt deve ter pelo menos 10 caracteres",
  }),
});

const AdminGeminiPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [savedApiKey, setSavedApiKey] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      prompt: "Explique o significado da carta 'A Estrela' no tarot e como ela pode ser interpretada em diferentes contextos.",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setResponse(null);
      
      // Salvar API key para uso futuro
      if (values.apiKey !== savedApiKey) {
        setSavedApiKey(values.apiKey);
        toast({
          title: "API Key salva",
          description: "Sua chave da API Gemini foi salva para esta sessão",
        });
      }

      // Initialize the Gemini API client
      const genAI = new GoogleGenerativeAI(values.apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Call the Gemini API
      const result = await model.generateContent(values.prompt);
      const text = result.response.text();
      
      setResponse(text);
      
      toast({
        title: "Resposta gerada",
        description: "A IA Gemini processou seu prompt com sucesso",
      });
    } catch (error: any) {
      console.error("Erro na API Gemini:", error);
      toast({
        title: "Erro ao chamar a API",
        description: error.message || "Ocorreu um erro ao chamar a API Gemini",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Teste da IA Gemini</h2>
        <p className="text-muted-foreground">
          Configure e teste a integração com a API Gemini para interpretações de tarot.
        </p>
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Como usar a integração Gemini</AlertTitle>
        <AlertDescription>
          A API Gemini pode ser usada para fornecer interpretações dinâmicas de combinações de cartas de tarot.
          Para testar, insira sua chave de API e um prompt sobre tarot.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuração da API</CardTitle>
            <CardDescription>
              Configure a integração com a API Gemini para interpretações de tarot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave da API Google AI Studio</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Insira sua chave da API Gemini"
                          {...field} 
                          value={field.value || savedApiKey}
                        />
                      </FormControl>
                      <FormDescription>
                        Você pode obter sua chave no <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt para a IA</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite seu prompt sobre tarot para a IA" 
                          className="resize-none"
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Seja específico sobre qual informação de tarot você deseja obter.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Gerar Interpretação
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resposta da IA</CardTitle>
            <CardDescription>
              A interpretação gerada pela IA Gemini será exibida aqui.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Consultando a IA Gemini...
                </p>
              </div>
            ) : response ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{response}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Wand2 className="h-8 w-8 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Envie um prompt para ver a resposta da IA aqui.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGeminiPage;
