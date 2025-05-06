
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { AuthCheck } from "@/components/AuthCheck";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpiritualRoutine } from "@/types/spiritualRoutine";
import { AlertCircle, Clock, Plus, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SpiritualRoutinesPage = () => {
  const [routines, setRoutines] = useState<SpiritualRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    frequency: "daily",
    day_of_week: 0, 
    time_of_day: "08:00"
  });

  const { toast } = useToast();

  // Fetch user's spiritual routines
  useEffect(() => {
    const fetchRoutines = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        setIsLoading(false);
        return;
      }

      try {
        // Mock implementation since we can't add spiritual_routines to the database schema here
        // In a real implementation, this would be a query to the spiritual_routines table
        // const { data, error } = await supabase.from("spiritual_routines").select("*").eq("user_id", session.session.user.id);
        
        // For now, just use some sample data
        const mockRoutines: SpiritualRoutine[] = [
          {
            id: "1",
            user_id: session.session.user.id,
            title: "Meditação Matinal",
            description: "15 minutos de meditação guiada para começar o dia com clareza mental",
            frequency: "daily",
            day_of_week: null,
            time_of_day: "08:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "2",
            user_id: session.session.user.id,
            title: "Ritual de Gratidão",
            description: "Listar 3 coisas pelas quais sou grato hoje",
            frequency: "daily",
            day_of_week: null,
            time_of_day: "22:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "3",
            user_id: session.session.user.id,
            title: "Leitura de Tarô Semanal",
            description: "Tiragem de três cartas para analisar a semana",
            frequency: "weekly",
            day_of_week: 1, // Monday
            time_of_day: "10:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        setRoutines(mockRoutines);
        
        /* In real implementation:
        if (error) throw error;
        setRoutines(data || []);
        */
      } catch (error) {
        console.error("Error fetching routines:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas rotinas.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutines();
  }, [toast]);

  const handleCreateRoutine = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const newRoutine: Omit<SpiritualRoutine, "id" | "created_at" | "updated_at"> = {
        user_id: session.session.user.id,
        title: formState.title,
        description: formState.description,
        frequency: formState.frequency as "daily" | "weekly" | "monthly" | "custom",
        day_of_week: formState.frequency === "weekly" ? formState.day_of_week : null,
        time_of_day: formState.time_of_day
      };

      // This is a mock implementation
      // In a real app, this would be inserted into the database
      /* Example of real implementation:
      const { data, error } = await supabase.from("spiritual_routines").insert(newRoutine).select();
      if (error) throw error;
      */
      
      // Mock implementation
      const mockNewRoutine: SpiritualRoutine = {
        ...newRoutine,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setRoutines([...routines, mockNewRoutine]);
      
      setOpen(false);
      setFormState({
        title: "",
        description: "",
        frequency: "daily",
        day_of_week: 0,
        time_of_day: "08:00"
      });
      
      toast({
        title: "Rotina criada",
        description: "Sua rotina espiritual foi criada com sucesso."
      });
    } catch (error) {
      console.error("Error creating routine:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar sua rotina.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      // Mock implementation
      // In a real app, this would delete from the database
      /* Example of real implementation:
      const { error } = await supabase.from("spiritual_routines").delete().eq("id", id);
      if (error) throw error;
      */
      
      // Mock implementation
      setRoutines(routines.filter(routine => routine.id !== id));
      
      toast({
        title: "Rotina excluída",
        description: "Sua rotina espiritual foi excluída com sucesso."
      });
    } catch (error) {
      console.error("Error deleting routine:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir sua rotina.",
        variant: "destructive",
      });
    }
  };

  const formatDayOfWeek = (day: number | null | undefined) => {
    if (day === null || day === undefined) return "";
    
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return days[day];
  };

  return (
    <AuthCheck>
      <div className="min-h-screen flex flex-col bg-background bg-stars">
        <NavBar />
        
        <main className="flex-1 pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <header className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-mystical text-accent mb-4">Minhas Rotinas Espirituais</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Crie e gerencie rotinas espirituais diárias, semanais ou mensais para fortalecer sua conexão espiritual.
              </p>
            </header>

            <div className="flex justify-end mb-6">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Rotina
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Nova Rotina Espiritual</DialogTitle>
                    <DialogDescription>
                      Crie uma nova rotina para sua prática espiritual.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Título
                      </Label>
                      <Input
                        id="title"
                        value={formState.title}
                        onChange={(e) => setFormState({...formState, title: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Descrição
                      </Label>
                      <Textarea
                        id="description"
                        value={formState.description}
                        onChange={(e) => setFormState({...formState, description: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="frequency" className="text-right">
                        Frequência
                      </Label>
                      <Select
                        value={formState.frequency}
                        onValueChange={(value) => setFormState({...formState, frequency: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Diária</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formState.frequency === "weekly" && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="day_of_week" className="text-right">
                          Dia da Semana
                        </Label>
                        <Select
                          value={formState.day_of_week.toString()}
                          onValueChange={(value) => setFormState({...formState, day_of_week: parseInt(value)})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o dia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Domingo</SelectItem>
                            <SelectItem value="1">Segunda-feira</SelectItem>
                            <SelectItem value="2">Terça-feira</SelectItem>
                            <SelectItem value="3">Quarta-feira</SelectItem>
                            <SelectItem value="4">Quinta-feira</SelectItem>
                            <SelectItem value="5">Sexta-feira</SelectItem>
                            <SelectItem value="6">Sábado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time_of_day" className="text-right">
                        Horário
                      </Label>
                      <Input
                        id="time_of_day"
                        type="time"
                        value={formState.time_of_day}
                        onChange={(e) => setFormState({...formState, time_of_day: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateRoutine}>Criar Rotina</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : routines.length === 0 ? (
              <Alert className="my-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nenhuma rotina encontrada</AlertTitle>
                <AlertDescription>
                  Você ainda não criou nenhuma rotina espiritual. Clique em "Nova Rotina" para começar.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {routines.map((routine) => (
                  <Card key={routine.id}>
                    <CardHeader>
                      <CardTitle>{routine.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {routine.frequency === "weekly" 
                          ? `Todo ${formatDayOfWeek(routine.day_of_week)} às ${routine.time_of_day}`
                          : `${routine.frequency === "daily" ? "Diariamente" : "Mensalmente"} às ${routine.time_of_day}`
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{routine.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Editar</Button>
                      <Button 
                        variant="outline"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteRoutine(routine.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthCheck>
  );
};

export default SpiritualRoutinesPage;
