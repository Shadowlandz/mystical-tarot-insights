
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { StatisticsCards } from "@/components/admin/dashboard/StatisticsCards";
import { ContentCatalogSection } from "@/components/admin/dashboard/ContentCatalogSection";
import { useAcervoData } from "@/hooks/useAcervoData";
import { useContentGenerator } from "@/hooks/useContentGenerator";

const AdminDashboardPage = () => {
  const { catalogItems, stats, isLoading, fetchData } = useAcervoData();
  const { isGenerating, generateSpiritualContent } = useContentGenerator(fetchData);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Painel de Administração</h1>
        <Button 
          onClick={generateSpiritualContent} 
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

      <StatisticsCards stats={stats} isLoading={isLoading} />
      <ContentCatalogSection items={catalogItems} isLoading={isLoading} />
    </div>
  );
};

export default AdminDashboardPage;
