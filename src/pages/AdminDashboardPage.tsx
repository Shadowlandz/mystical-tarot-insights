
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Settings } from "lucide-react";
import { StatisticsCards } from "@/components/admin/dashboard/StatisticsCards";
import { ContentCatalogSection } from "@/components/admin/dashboard/ContentCatalogSection";
import { useAcervoData } from "@/hooks/useAcervoData";
import { useContentGenerator } from "@/hooks/useContentGenerator";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminDashboardPage = () => {
  const { catalogItems, stats, isLoading, fetchData } = useAcervoData();
  const [showGeneratorSettings, setShowGeneratorSettings] = useState(false);
  const [contentCount, setContentCount] = useState(3);
  
  const { isGenerating, generateSpiritualContent } = useContentGenerator({
    onSuccessCallback: fetchData,
    count: contentCount
  });

  const handleGenerateContent = async () => {
    await generateSpiritualContent();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Painel de Administração</h1>
          <p className="text-muted-foreground">
            Gerencie o conteúdo e acompanhe estatísticas do site
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showGeneratorSettings} onOpenChange={setShowGeneratorSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurações do Gerador</DialogTitle>
                <DialogDescription>
                  Ajuste as configurações para geração de conteúdo espiritual
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contentCount" className="text-right">
                    Quantidade
                  </Label>
                  <Input
                    id="contentCount"
                    type="number"
                    min={1}
                    max={10}
                    value={contentCount}
                    onChange={(e) => setContentCount(parseInt(e.target.value) || 3)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowGeneratorSettings(false)}>
                  Salvar Configurações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={handleGenerateContent} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando conteúdo...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Gerar Conteúdo Espiritual
              </>
            )}
          </Button>
        </div>
      </div>

      <StatisticsCards stats={stats} isLoading={isLoading} />
      <ContentCatalogSection items={catalogItems} isLoading={isLoading} />
    </div>
  );
};

export default AdminDashboardPage;
