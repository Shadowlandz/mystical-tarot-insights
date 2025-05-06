
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChartPie, ChartLine, Users, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalReadings: number;
  readingsByType: {
    single: number;
    three: number;
    celtic: number;
  };
  readingsByArea: Record<string, number>;
  routinesCreated: number;
  userGrowth: {
    date: string;
    count: number;
  }[];
}

const AdminAnalyticsPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalReadings: 0,
    readingsByType: {
      single: 0,
      three: 0,
      celtic: 0,
    },
    readingsByArea: {},
    routinesCreated: 0,
    userGrowth: [],
  });
  const [dateRange, setDateRange] = useState("7d");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // In a real app, these would be actual queries to your Supabase database
      // For now, we'll use mock data
      
      // Mock data - in a real app, these would be queries to the database
      const mockAnalytics: AnalyticsData = {
        totalUsers: 152,
        activeUsers: 87,
        totalReadings: 432,
        readingsByType: {
          single: 278,
          three: 134,
          celtic: 20,
        },
        readingsByArea: {
          "Finanças": 98,
          "Amor": 124,
          "Saúde": 73,
          "Espiritualidade": 85,
          "Família": 52,
        },
        routinesCreated: 42,
        userGrowth: [
          { date: "2023-05-01", count: 10 },
          { date: "2023-05-08", count: 18 },
          { date: "2023-05-15", count: 25 },
          { date: "2023-05-22", count: 32 },
          { date: "2023-05-29", count: 45 },
          { date: "2023-06-05", count: 55 },
          { date: "2023-06-12", count: 67 },
        ]
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de análise.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAreaChart = () => {
    const areas = Object.keys(analytics.readingsByArea);
    const values = Object.values(analytics.readingsByArea);
    const total = values.reduce((sum, val) => sum + val, 0);

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          {areas.map((area, index) => (
            <div key={area} className="flex justify-between">
              <span>{area}</span>
              <span className="font-medium">{values[index]}</span>
            </div>
          ))}
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center text-2xl font-bold">
            {total}
          </div>
        </div>
      </div>
    );
  };

  const renderUserGrowthChart = () => {
    return (
      <div className="mt-4">
        <div className="h-64 flex items-end space-x-2">
          {analytics.userGrowth.map((point, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="bg-primary w-8" 
                style={{ 
                  height: `${(point.count / Math.max(...analytics.userGrowth.map(p => p.count))) * 200}px` 
                }}
              ></div>
              <span className="text-xs mt-2">
                {new Date(point.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Análise Detalhada</h1>
          <p className="text-muted-foreground">
            Insights e métricas do seu aplicativo
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => fetchAnalyticsData()}
          >
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : analytics.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Usuários ativos: {isLoading ? <Skeleton className="h-4 w-10 inline-block" /> : analytics.activeUsers}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Leituras de Tarô
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : analytics.totalReadings}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex justify-between">
              <span>Uma carta: {analytics.readingsByType.single}</span>
              <span>Três cartas: {analytics.readingsByType.three}</span>
              <span>Cruz Celta: {analytics.readingsByType.celtic}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Rotinas Espirituais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : analytics.routinesCreated}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Rotinas criadas pelos usuários
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="areas">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="areas">
            <ChartPie className="h-4 w-4 mr-2" />
            Áreas de Consulta
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Crescimento de Usuários
          </TabsTrigger>
          <TabsTrigger value="routines">
            <Clock className="h-4 w-4 mr-2" />
            Rotinas Espirituais
          </TabsTrigger>
        </TabsList>
        <TabsContent value="areas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Áreas de Consulta</CardTitle>
              <CardDescription>Distribuição das consultas de tarô por área</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                renderAreaChart()
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>
                <div className="flex space-x-4">
                  <Button 
                    variant={dateRange === "7d" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setDateRange("7d")}
                  >
                    7 dias
                  </Button>
                  <Button 
                    variant={dateRange === "30d" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setDateRange("30d")}
                  >
                    30 dias
                  </Button>
                  <Button 
                    variant={dateRange === "90d" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setDateRange("90d")}
                  >
                    90 dias
                  </Button>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                renderUserGrowthChart()
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="routines" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rotinas Espirituais</CardTitle>
              <CardDescription>Análise das rotinas espirituais criadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 border rounded-md text-center">
                  <p className="text-muted-foreground">
                    Análise detalhada de rotinas espirituais estará disponível em breve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsPage;
