
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Settings, Clock, LogOut } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  role: string;
  created_at: string;
}

const profileSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Nome de usuário deve ter pelo menos 3 caracteres.",
    })
    .max(50, {
      message: "Nome de usuário deve ter no máximo 50 caracteres.",
    }),
  avatar_url: z.string().url({ message: "URL inválida." }).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        setUser(user);

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        setProfile(profileData);
        form.reset({
          username: profileData.username || "",
          avatar_url: profileData.avatar_url || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seu perfil. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        } else if (session && event === "SIGNED_IN") {
          fetchUserData();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          username: values.username,
          avatar_url: values.avatar_url || profile?.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso.",
      });

      // Refresh profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erro",
        description: "Não foi possível sair da sua conta. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  if (loading && !profile) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
          <div className="w-full max-w-md space-y-4 mt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || ""} />
          <AvatarFallback className="text-3xl">{profile?.username?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="mt-4 text-3xl font-bold">{profile?.username || user?.email}</h1>
        <p className="text-muted-foreground">
          Membro desde {new Date(profile?.created_at || "").toLocaleDateString("pt-BR")}
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="routines">
            <Clock className="mr-2 h-4 w-4" />
            Rotinas
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome de usuário</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} disabled={loading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da foto de perfil</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://exemplo.com/suafoto.jpg"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription>Seu endereço de email</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{user?.email}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="routines" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rotinas Espirituais</CardTitle>
              <CardDescription>Gerencie suas rotinas espirituais</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/routines")} className="mb-4">
                Gerenciar Rotinas Espirituais
              </Button>
              
              <div className="rounded-md border p-4 text-center">
                <p className="text-muted-foreground">
                  Crie rotinas espirituais para se conectar com sua espiritualidade regularmente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da conta</CardTitle>
              <CardDescription>Gerencie suas preferências</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4 text-center">
                <p className="text-muted-foreground">
                  Configurações adicionais da conta estarão disponíveis em breve.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair da conta
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
