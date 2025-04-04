
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Wand2, Sparkles, Loader2, Save, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  apiKey: z.string().min(1, {
    message: "A chave da API Gemini é obrigatória",
  }),
  prompt: z.string().min(10, {
    message: "O prompt deve ter pelo menos 10 caracteres",
  }),
});

// Sample prompts for Tarot interpretations
const SAMPLE_PROMPTS = [
  "Explique o significado da carta 'A Estrela' no tarot e como ela pode ser interpretada em diferentes contextos.",
  "Quais são as possíveis interpretações quando 'O Louco', 'A Lua' e 'O Sol' aparecem juntos em uma leitura?",
  "Explique como a carta 'A Torre' pode ter significados positivos em certos contextos.",
  "Como a carta 'O Imperador' se relaciona com questões de liderança e autoridade?",
];

const AdminGeminiPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<"unchecked" | "valid" | "invalid">("unchecked");
  const [activeTab, setActiveTab] = useState("generate");
  
  // Try to load API key from localStorage
  const storedApiKey = typeof window !== "undefined" ? localStorage.getItem("gemini_api_key") : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: storedApiKey || "",
      prompt: SAMPLE_PROMPTS[0],
    },
  });

  // Select a random prompt to inspire the user
  const selectRandomPrompt = () => {
    const randomPrompt = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    form.setValue("prompt", randomPrompt);
  };

  // Copy response to clipboard
  const copyToClipboard = async () => {
    if (!response) return;
    
    try {
      await navigator.clipboard.writeText(response);
      toast({
        title: "Copiado",
        description: "Texto copiado para a área de transferência",
      });
    } catch (err) {
      console.error("Falha ao copiar texto:", err);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setResponse(null);
      
      // Store API key for future use
      if (values.apiKey) {
        localStorage.setItem("gemini_api_key", values.apiKey);
        toast({
          title: "API Key salva",
          description: "Sua chave da API Gemini foi salva para esta sessão",
        });
      }

      // Initialize the Gemini API client
      const genAI = new GoogleGenerativeAI(values.apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Call the Gemini API with a more detailed system prompt
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Você é um especialista em tarot e espiritualidade. Forneça uma resposta detalhada, 
                        precisa e respeitosa para a seguinte pergunta sobre tarot: ${values.prompt}
                        
                        Estruture sua resposta com parágrafos claros, incluindo:
                        - Significado simbólico
                        - Interpretações em diferentes contextos (pessoal, profissional, espiritual)
                        - Conselhos práticos relacionados
                        
                        Use uma linguagem acessível mas profunda.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      
      const text = result.response.text();
      setResponse(text);
      setApiKeyStatus("valid");
      
      toast({
        title: "Resposta gerada",
        description: "A IA Gemini processou seu prompt com sucesso",
      });
    } catch (error: any) {
      console.error("Erro na API Gemini:", error);
      setApiKeyStatus("invalid");
      toast({
        title: "Erro ao chamar a API",
        description: error.message || "Ocorreu um erro ao chamar a API Gemini",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check API key on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = form.getValues("apiKey");
      if (!apiKey) {
        setApiKeyStatus("unchecked");
        return;
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        await genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        setApiKeyStatus("valid");
      } catch (error) {
        setApiKeyStatus("invalid");
      }
    };

    if (storedApiKey) {
      checkApiKey();
    }
  }, [storedApiKey, form]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">IA Gemini para Tarot</h2>
        <p className="text-muted-foreground">
          Gere interpretações de tarot e conteúdo espiritual com a API Gemini.
        </p>
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Como usar a integração Gemini</AlertTitle>
        <AlertDescription>
          A API Gemini pode ser usada para fornecer interpretações dinâmicas de cartas de tarot.
          Configure sua chave de API e use prompts específicos para obter os melhores resultados.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Gerar Interpretação</TabsTrigger>
          <TabsTrigger value="settings">Configurações da API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4 pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prompt para Interpretação</CardTitle>
                <CardDescription>
                  Escreva seu prompt sobre tarot para a IA Gemini.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prompt para a IA</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Digite seu prompt sobre tarot para a IA" 
                              className="resize-none h-40"
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
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1" 
                        onClick={selectRandomPrompt}
                      >
                        Prompt Aleatório
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading || apiKeyStatus === "invalid"} 
                        className="flex-1"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Gerar
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resposta da IA</CardTitle>
                <CardDescription>
                  A interpretação gerada pela IA Gemini.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Consultando a IA Gemini...
                    </p>
                  </div>
                ) : response ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none h-[300px] overflow-y-auto">
                    <div className="whitespace-pre-wrap">{response}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Wand2 className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Envie um prompt para ver a resposta da IA aqui.
                    </p>
                  </div>
                )}
              </CardContent>
              {response && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copiar
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração da API</CardTitle>
              <CardDescription>
                Configure a integração com a API Gemini para interpretações de tarot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
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
                            onChange={(e) => {
                              field.onChange(e);
                              setApiKeyStatus("unchecked");
                            }}
                          />
                        </FormControl>
                        <FormDescription className="flex items-center justify-between">
                          <span>
                            Obtenha sua chave no <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a>
                          </span>
                          {apiKeyStatus === "valid" && (
                            <span className="text-green-500 text-xs">Chave válida</span>
                          )}
                          {apiKeyStatus === "invalid" && (
                            <span className="text-red-500 text-xs">Chave inválida</span>
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="button" 
                    onClick={() => {
                      const apiKey = form.getValues("apiKey");
                      if (apiKey) {
                        localStorage.setItem("gemini_api_key", apiKey);
                        toast({
                          title: "API Key salva",
                          description: "Sua chave da API Gemini foi salva para esta sessão",
                        });
                        setActiveTab("generate");
                      } else {
                        form.setError("apiKey", { 
                          type: "required", 
                          message: "A chave da API é obrigatória" 
                        });
                      }
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGeminiPage;
