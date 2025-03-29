import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Video, BookOpen } from "lucide-react";
import { ContentCatalogTable } from "@/components/admin/dashboard/ContentCatalogTable";
import { Skeleton } from "@/components/ui/skeleton";
import { StudyCardProps } from "@/components/StudyCard";
import { supabase } from "@/integrations/supabase/client";
import { convertArrayToStudyCardProps } from "@/types/acervo";

const AdminDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [catalogItems, setCatalogItems] = useState<StudyCardProps[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalViews: 0,
    videoCount: 0,
    articleCount: 0,
    documentCount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('acervo_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        const convertedData = convertArrayToStudyCardProps(data || []);
        setCatalogItems(convertedData);
        
        // Calculate stats
        const totalViews = convertedData.reduce((sum, item) => sum + (item.views || 0), 0);
        const videoCount = convertedData.filter(item => item.type === 'video').length;
        const articleCount = convertedData.filter(item => item.type === 'article').length;
        const documentCount = convertedData.filter(item => item.type === 'document').length;
        
        setStats({
          totalItems: convertedData.length,
          totalViews,
          videoCount,
          articleCount,
          documentCount
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Painel de Administração</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total de Itens
            </CardTitle>
            <CardDescription>Número total de itens no acervo</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-4 w-16" /> : <div className="text-2xl font-bold">{stats.totalItems}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total de Visualizações
            </CardTitle>
            <CardDescription>Número total de visualizações em todos os itens</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-4 w-16" /> : <div className="text-2xl font-bold">{stats.totalViews}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Vídeos
            </CardTitle>
            <CardDescription>Número de vídeos no acervo</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-4 w-16" /> : <div className="text-2xl font-bold">{stats.videoCount}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Artigos
            </CardTitle>
            <CardDescription>Número de artigos no acervo</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-4 w-16" /> : <div className="text-2xl font-bold">{stats.articleCount}</div>}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Catálogo de Conteúdo</h2>
        {isLoading ? (
          <div>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
          </div>
        ) : (
          <ContentCatalogTable items={catalogItems} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
