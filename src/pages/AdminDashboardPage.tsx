
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Library, 
  FileText, 
  Video,
  Users,
  ArrowUpRight,
  TrendingUp,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 257,
    totalViews: 12634,
    totalArticles: 45,
    totalVideos: 23,
    documentsCount: 12,
    engagementRate: 68,
    growthRate: 23.5,
    recentActivity: [
      { id: 1, type: "article", title: "Significado dos Arcanos Maiores", views: 342 },
      { id: 2, type: "video", title: "Como Interpretar a Carta do Louco", views: 259 },
      { id: 3, type: "document", title: "Guia Completo do Tarot de Marselha", views: 187 },
      { id: 4, type: "article", title: "A História do Tarot Através dos Séculos", views: 143 },
    ]
  });

  useEffect(() => {
    // Aqui você faria uma chamada API para buscar as estatísticas reais
    // Por enquanto, usamos dados estáticos para demonstração
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
            <ArrowUpRight className={`h-3 w-3 ml-1 ${trend > 0 ? "text-green-500" : "text-red-500"}`} />
            <span className="ml-1 text-muted-foreground">desde o mês passado</span>
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral das métricas e atividades do seu portal de Tarot.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total de Usuários" 
          value={stats.totalUsers} 
          icon={Users}
          trend={12.5}
        />
        <StatCard 
          title="Visualizações" 
          value={stats.totalViews.toLocaleString()} 
          icon={Eye}
          trend={8.2}
        />
        <StatCard 
          title="Taxa de Engajamento" 
          value={`${stats.engagementRate}%`} 
          icon={TrendingUp}
          trend={4.1}
          description="Baseado em interações/visualizações"
        />
        <StatCard 
          title="Conteúdo Total" 
          value={stats.totalArticles + stats.totalVideos + stats.documentsCount} 
          icon={Library}
          description={`${stats.totalArticles} artigos, ${stats.totalVideos} vídeos, ${stats.documentsCount} documentos`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Visitas por Tipo de Conteúdo</CardTitle>
            <CardDescription>Distribuição de visitas nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    <span>Artigos</span>
                  </div>
                  <span className="text-sm text-muted-foreground">58%</span>
                </div>
                <Progress value={58} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Video className="mr-2 h-4 w-4 text-blue-500" />
                    <span>Vídeos</span>
                  </div>
                  <span className="text-sm text-muted-foreground">32%</span>
                </div>
                <Progress value={32} className="h-2 bg-blue-100 dark:bg-blue-900" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Library className="mr-2 h-4 w-4 text-orange-500" />
                    <span>Documentos</span>
                  </div>
                  <span className="text-sm text-muted-foreground">10%</span>
                </div>
                <Progress value={10} className="h-2 bg-orange-100 dark:bg-orange-900" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo Popular</CardTitle>
            <CardDescription>Conteúdo mais visualizado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((item) => (
                <div key={item.id} className="flex items-center">
                  {item.type === "article" && <FileText className="mr-2 h-4 w-4 text-primary" />}
                  {item.type === "video" && <Video className="mr-2 h-4 w-4 text-blue-500" />}
                  {item.type === "document" && <Library className="mr-2 h-4 w-4 text-orange-500" />}
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none truncate max-w-[200px]">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.views} visualizações
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
