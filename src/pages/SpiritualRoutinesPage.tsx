
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Plus, Edit, Trash, Bell, BellOff, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SpiritualRoutine {
  id: string;
  title: string;
  description: string | null;
  frequency: string;
  day_of_week: number | null;
  time_of_day: string;
  created_at: string;
  updated_at: string;
}

const routineSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().optional(),
  frequency: z.string(),
  day_of_week: z.number().min(0).max(6).optional().nullable(),
  time_of_day: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Formato de hora inválido. Use HH:MM.",
  }),
});

type RoutineFormValues = z.infer<typeof routineSchema>;

const daysOfWeek = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

export default function SpiritualRoutinesPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState<SpiritualRoutine[]>([]);
  const [currentRoutine, setCurrentRoutine] = useState<SpiritualRoutine | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const form = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      title: "",
      description: "",
      frequency: "daily",
      day_of_week: null,
      time_of_day: "08:00",
    },
  });

  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
        return;
      }
      
      fetchRoutines();
    };

    checkSession();
  }, [navigate]);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("spiritual_routines")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setRoutines(data || []);
    } catch (error) {
      console.error("Error fetching routines:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas rotinas. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    form.reset({
      title: "",
      description: "",
      frequency: "daily",
      day_of_week: null,
      time_of_day: "08:00",
    });
    setCurrentRoutine(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (routine: SpiritualRoutine) => {
    form.reset({
      title: routine.title,
      description: routine.description || "",
      frequency: routine.frequency,
      day_of_week: routine.day_of_week,
      time_of_day: routine.time_of_day,
    });
    setCurrentRoutine(routine);
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: RoutineFormValues) => {
    try {
      setLoading(true);
      
      if (currentRoutine) {
        // Update routine
        const { error } = await supabase
          .from("spiritual_routines")
          .update({
            title: values.title,
            description: values.description,
            frequency: values.frequency,
            day_of_week: values.frequency === "weekly" ? values.day_of_week : null,
            time_of_day: values.time_of_day,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentRoutine.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Rotina atualizada",
          description: "Sua rotina espiritual foi atualizada com sucesso.",
        });
      } else {
        // Create routine
        const { error } = await supabase
          .from("spiritual_routines")
          .insert({
            title: values.title,
            description: values.description,
            frequency: values.frequency,
            day_of_week: values.frequency === "weekly" ? values.day_of_week : null,
            time_of_day: values.time_of_day,
          });

        if (error) {
          throw error;
        }

        toast({
          title: "Rotina criada",
          description: "Sua rotina espiritual foi criada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      fetchRoutines();
    } catch (error: any) {
      console.error("Error saving routine:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar sua rotina. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("spiritual_routines")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Rotina excluída",
        description: "Sua rotina espiritual foi excluída com sucesso.",
      });
      
      fetchRoutines();
    } catch (error) {
      console.error("Error deleting routine:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir sua rotina. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled) {
      // Request notification permission
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            setNotificationsEnabled(true);
            toast({
              title: "Notificações ativadas",
              description: "Você será notificado de suas rotinas espirituais.",
            });
          } else {
            toast({
              title: "Notificações bloqueadas",
              description: "Permita as notificações no seu navegador para receber lembretes.",
              variant: "destructive",
            });
          }
        });
      } else {
        setNotificationsEnabled(true);
        toast({
          title: "Notificações ativadas",
          description: "Você será notificado de suas rotinas espirituais.",
        });
      }
    } else {
      setNotificationsEnabled(false);
      toast({
        title: "Notificações desativadas",
        description: "Você não receberá mais notificações de suas rotinas espirituais.",
      });
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    
    try {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return time;
    }
  };

  const getFrequencyText = (routine: SpiritualRoutine) => {
    if (routine.frequency === "daily") {
      return "Todos os dias";
    } else if (routine.frequency === "weekly" && routine.day_of_week !== null) {
      const day = daysOfWeek.find(d => d.value === routine.day_of_week)?.label || "";
      return `Toda(o) ${day}`;
    }
    return routine.frequency;
  };

  if (loading && routines.length === 0) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Rotinas Espirituais</h1>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Rotinas Espirituais</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleNotifications}
            title={notificationsEnabled ? "Desativar notificações" : "Ativar notificações"}
          >
            {notificationsEnabled ? (
              <Bell className="h-5 w-5" />
            ) : (
              <BellOff className="h-5 w-5" />
            )}
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Rotina
          </Button>
        </div>
      </div>

      {routines.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <Clock className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Nenhuma rotina encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Crie rotinas espirituais para se conectar com sua espiritualidade regularmente.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira rotina
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {routines.map((routine) => (
            <Card key={routine.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{routine.title}</CardTitle>
                    <CardDescription className="mt-1 flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {getFrequencyText(routine)}
                      <span className="mx-2">•</span>
                      <Clock className="mr-1 h-3 w-3" />
                      {formatTime(routine.time_of_day)}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(routine)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir rotina</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta rotina? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteRoutine(routine.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              {routine.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{routine.description}</p>
                </CardContent>
              )}
              <CardFooter className="text-xs text-muted-foreground pt-0">
                Última atualização: {new Date(routine.updated_at).toLocaleDateString("pt-BR")}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentRoutine ? "Editar rotina" : "Nova rotina espiritual"}
            </DialogTitle>
            <DialogDescription>
              {currentRoutine
                ? "Atualize os detalhes da sua rotina espiritual"
                : "Crie uma nova rotina para sua prática espiritual"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Meditação matinal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalhes sobre sua rotina..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("frequency") === "weekly" && (
                <FormField
                  control={form.control}
                  name="day_of_week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia da semana</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value, 10))}
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o dia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem
                              key={day.value}
                              value={day.value.toString()}
                            >
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="time_of_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Salvando..."
                    : currentRoutine
                    ? "Atualizar rotina"
                    : "Criar rotina"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
