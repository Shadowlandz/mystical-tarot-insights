
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminGeminiPage = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!apiKey) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira uma chave API válida",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("gemini_api_key", apiKey);
    
    toast({
      title: "Chave API salva",
      description: "A chave API do Gemini foi salva com sucesso",
    });
  };

  // Carrega a chave salva quando o componente monta
  useState(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Configuração do Gemini</h1>
        <p className="text-muted-foreground">
          Configurar a integração com a API do Google Gemini.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Chave de API do Google Gemini</CardTitle>
          <CardDescription>
            A chave de API é necessária para utilizar os recursos de IA do Google Gemini.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Chave API
            </label>
            <Input
              id="api-key"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Insira a chave API do Gemini"
            />
            <p className="text-xs text-muted-foreground">
              Você pode obter uma chave API em: https://ai.google.dev
            </p>
          </div>
          <Button onClick={handleSaveApiKey}>Salvar Chave API</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGeminiPage;
