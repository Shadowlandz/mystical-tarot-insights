
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Lock, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Esquema de validação com mensagens em português
const formSchema = z.object({
  email: z.string().email({
    message: "Digite um email válido",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres",
  }),
});

const AdminLoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockExpiry, setLockExpiry] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [attempts, setAttempts] = useState(0);
  
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos em milissegundos

  // Verificar se a conta está bloqueada ao carregar
  useEffect(() => {
    const storedLockExpiry = localStorage.getItem("adminLockExpiry");
    const storedAttempts = localStorage.getItem("adminLoginAttempts");
    
    if (storedLockExpiry) {
      const expiryTime = parseInt(storedLockExpiry);
      if (expiryTime > Date.now()) {
        setIsLocked(true);
        setLockExpiry(expiryTime);
      } else {
        // Se o bloqueio expirou, remova-o
        localStorage.removeItem("adminLockExpiry");
        localStorage.removeItem("adminLoginAttempts");
      }
    }
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
  }, []);

  // Mostrar contagem regressiva se a conta estiver bloqueada
  useEffect(() => {
    if (isLocked && lockExpiry) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (now >= lockExpiry) {
          setIsLocked(false);
          setLockExpiry(null);
          localStorage.removeItem("adminLockExpiry");
          localStorage.removeItem("adminLoginAttempts");
          clearInterval(interval);
        } else {
          const diff = lockExpiry - now;
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isLocked, lockExpiry]);

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Verificar se o usuário tem role 'admin'
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        
        if (profileData?.role === 'admin') {
          localStorage.setItem("adminAuth", "true");
          localStorage.setItem("adminLastActivity", Date.now().toString());
          const returnUrl = new URLSearchParams(location.search).get("returnUrl");
          navigate(returnUrl || "/admin/dashboard");
        }
      }
    };
    
    checkSession();
  }, [navigate, location.search]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLocked) return;
    
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Tentar autenticar com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Verificar se o usuário tem role 'admin'
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (profileData?.role === 'admin') {
          // Login bem-sucedido como administrador
          localStorage.setItem("adminAuth", "true");
          localStorage.setItem("adminLastActivity", Date.now().toString());
          localStorage.removeItem("adminLoginAttempts");
          localStorage.removeItem("adminLockExpiry");
          
          toast({
            title: "Login bem-sucedido",
            description: "Bem-vindo ao painel administrativo",
          });
          
          // Redirecionar para a página solicitada ou para o dashboard
          const returnUrl = new URLSearchParams(location.search).get("returnUrl");
          navigate(returnUrl || "/admin/dashboard");
        } else {
          // Usuário não é administrador
          await supabase.auth.signOut();
          incrementAttempts();
          setLoginError("Você não tem permissões de administrador.");
          
          toast({
            title: "Acesso negado",
            description: "Você não tem permissões de administrador.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
      incrementAttempts();
      
      toast({
        title: "Erro de autenticação",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const incrementAttempts = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    localStorage.setItem("adminLoginAttempts", newAttempts.toString());
    
    // Verificar se deve bloquear
    if (newAttempts >= MAX_ATTEMPTS) {
      const expiryTime = Date.now() + LOCKOUT_TIME;
      setIsLocked(true);
      setLockExpiry(expiryTime);
      localStorage.setItem("adminLockExpiry", expiryTime.toString());
      
      setLoginError(`Conta bloqueada por muitas tentativas. Tente novamente em 15 minutos.`);
    } else {
      setLoginError(`Credenciais inválidas. Tentativas restantes: ${MAX_ATTEMPTS - newAttempts}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg border-purple-800/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-mystical text-primary">Acesso Administrativo</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginError}
                {isLocked && timeLeft && ` Tempo restante: ${timeLeft}`}
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                          <User className="h-4 w-4" />
                        </span>
                        <Input className="pl-9" placeholder="admin@exemplo.com" {...field} disabled={isLocked} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                          <Lock className="h-4 w-4" />
                        </span>
                        <Input 
                          className="pl-9" 
                          type="password" 
                          placeholder="******" 
                          {...field} 
                          disabled={isLocked} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Entrar
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">
            Apenas administradores autorizados podem acessar este portal.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
