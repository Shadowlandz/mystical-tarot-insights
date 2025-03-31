
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Video, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  totalItems: number;
  totalViews: number;
  videoCount: number;
  articleCount: number;
  documentCount: number;
}

interface StatisticsCardsProps {
  stats: StatsData;
  isLoading: boolean;
}

export const StatisticsCards = ({ stats, isLoading }: StatisticsCardsProps) => {
  return (
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
  );
};
