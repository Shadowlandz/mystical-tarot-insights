
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Settings, BarChart2, TrendingUp, CircleSlash } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboardPage = () => {
  const { catalogItems, stats, isLoading, fetchData } = useAcervoData();
  const [showGeneratorSettings, setShowGeneratorSettings] = useState(false);
  const [contentCount, setContentCount] = useState(3);
  const [selectedTab, setSelectedTab] = useState("overview");
  
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

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise Detalhada</TabsTrigger>
          <TabsTrigger value="content">Gestão de Conteúdo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <StatisticsCards stats={stats} isLoading={isLoading} />
          <ContentCatalogSection items={catalogItems} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Distribuição por Tipo de Conteúdo
                </CardTitle>
                <CardDescription>
                  Análise por categoria de conteúdo espiritual
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : stats.totalItems === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <CircleSlash className="h-16 w-16 mx-auto mb-2 opacity-20" />
                    <p>Nenhum conteúdo cadastrado</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex gap-4">
                      {stats.videoCount > 0 && (
                        <div className="text-center">
                          <div className="text-3xl font-bold">{stats.videoCount}</div>
                          <div className="text-sm text-muted-foreground">Vídeos</div>
                        </div>
                      )}
                      {stats.articleCount > 0 && (
                        <div className="text-center">
                          <div className="text-3xl font-bold">{stats.articleCount}</div>
                          <div className="text-sm text-muted-foreground">Artigos</div>
                        </div>
                      )}
                      {stats.documentCount > 0 && (
                        <div className="text-center">
                          <div className="text-3xl font-bold">{stats.documentCount}</div>
                          <div className="text-sm text-muted-foreground">Documentos</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Tendências de Engajamento
                </CardTitle>
                <CardDescription>
                  Taxa de visualização e interação por conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : stats.totalViews === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <CircleSlash className="h-16 w-16 mx-auto mb-2 opacity-20" />
                    <p>Nenhuma visualização registrada</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold">{stats.totalViews}</div>
                    <div className="text-lg text-muted-foreground">Visualizações totais</div>
                    
                    <div className="text-sm mt-4 text-muted-foreground">
                      Média de {(stats.totalViews / stats.totalItems).toFixed(1)} visualizações por item
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content">
          <ContentCatalogSection items={catalogItems} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
