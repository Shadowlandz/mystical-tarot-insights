
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle2, ExternalLink, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { validateMultipleLinks, validateLink, LinkValidationResult } from "@/utils/linkValidator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudyCardProps } from "@/components/StudyCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTypeIcon, getTypeLabel } from "@/components/admin/acervo/AcervoTypeUtils";

interface LinkValidatorProps {
  items: StudyCardProps[];
  onRefreshItems: () => void;
}

export function LinkValidator({ items, onRefreshItems }: LinkValidatorProps) {
  const [open, setOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<{url: string, result: LinkValidationResult, item: StudyCardProps}[]>([]);
  const [filterType, setFilterType] = useState<"all" | "valid" | "invalid">("all");
  
  const startValidation = async () => {
    if (!items.length) {
      toast.error("Não há itens para validar");
      return;
    }
    
    setIsValidating(true);
    setProgress(0);
    setValidationResults([]);
    
    try {
      const totalLinks = items.length;
      const results: {url: string, result: LinkValidationResult, item: StudyCardProps}[] = [];
      
      for (let i = 0; i < totalLinks; i++) {
        const item = items[i];
        const url = item.link;
        
        const result = await validateLink(url);
        
        results.push({ url, result, item });
        setProgress(Math.round(((i + 1) / totalLinks) * 100));
        setValidationResults([...results]);
      }
      
      // Mostrar resumo
      const invalidCount = results.filter(r => !r.result.isValid).length;
      
      if (invalidCount > 0) {
        toast.error(`Atenção: ${invalidCount} de ${totalLinks} links estão inacessíveis.`);
      } else {
        toast.success(`Todos os ${totalLinks} links estão funcionando corretamente.`);
      }
      
    } catch (error) {
      toast.error("Erro ao validar links: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsValidating(false);
    }
  };
  
  // Extract domain from URL for better source display
  const getSourceDomain = (link: string) => {
    try {
      const url = new URL(link);
      return url.hostname.replace('www.', '');
    } catch (e) {
      return "fonte desconhecida";
    }
  };
  
  const filteredResults = (() => {
    switch (filterType) {
      case "valid":
        return validationResults.filter(r => r.result.isValid);
      case "invalid":
        return validationResults.filter(r => !r.result.isValid);
      default:
        return validationResults;
    }
  })();
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Verificar Links</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verificador de Links</DialogTitle>
          <DialogDescription>
            Verifique todos os links do acervo para garantir que estão acessíveis
          </DialogDescription>
        </DialogHeader>
        
        {isValidating ? (
          <div className="py-6 space-y-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p>Verificando links... {progress}% concluído</p>
            <Progress value={progress} className="w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {validationResults.length > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    {validationResults.filter(r => r.result.isValid).length} válidos
                  </Badge>
                  <Badge variant="destructive">
                    {validationResults.filter(r => !r.result.isValid).length} inválidos
                  </Badge>
                </div>
                <Select
                  value={filterType}
                  onValueChange={(value: "all" | "valid" | "invalid") => setFilterType(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filtrar resultados" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os links</SelectItem>
                    <SelectItem value="valid">Apenas válidos</SelectItem>
                    <SelectItem value="invalid">Apenas inválidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-4">
              {filteredResults.map((item, index) => (
                <Card key={index} className={`border-l-4 ${item.result.isValid ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{item.item.title}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTypeIcon(item.item.type)}
                        {getTypeLabel(item.item.type)}
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        Fonte: {getSourceDomain(item.url)}
                      </span>
                      <div className="flex items-center">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs truncate hover:underline text-primary flex items-center">
                          {item.url}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert variant={item.result.isValid ? "default" : "destructive"}>
                      {item.result.isValid ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <AlertTitle>{item.result.isValid ? "Link válido" : "Problema detectado"}</AlertTitle>
                      <AlertDescription>{item.result.message}</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {validationResults.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Clique em "Verificar Agora" para iniciar a validação dos links
                </p>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          {validationResults.length > 0 && !isValidating ? (
            <div className="flex gap-2 justify-end w-full">
              <Button variant="outline" onClick={() => setValidationResults([])}>
                Limpar Resultados
              </Button>
              <Button onClick={startValidation} disabled={isValidating}>
                Verificar Novamente
              </Button>
            </div>
          ) : (
            <Button onClick={startValidation} disabled={isValidating}>
              {isValidating ? "Verificando..." : "Verificar Agora"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
