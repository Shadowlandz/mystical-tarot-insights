
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase, isUserAdmin } from "@/integrations/supabase/client";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos em milissegundos

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se o usuário está autenticado no Supabase
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Verificar se o usuário tem role 'admin' usando nossa função auxiliar
          const adminStatus = await isUserAdmin();
          console.log("AdminProtectedRoute: Admin status check:", adminStatus);
          
          if (adminStatus) {
            localStorage.setItem("adminAuth", "true");
            localStorage.setItem("adminLastActivity", Date.now().toString());
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("adminAuth");
            localStorage.removeItem("adminLastActivity");
            setIsAuthenticated(false);
            toast({
              title: "Acesso negado",
              description: "Você não tem permissões de administrador.",
              variant: "destructive",
            });
          }
        } else {
          // Sessão do Supabase não encontrada
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminLastActivity");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [toast, location.pathname]);

  useEffect(() => {
    // Se estiver autenticado, atualize o timestamp de última atividade
    if (isAuthenticated) {
      localStorage.setItem("adminLastActivity", Date.now().toString());
    }
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      // Verifica se a sessão expirou
      const checkSessionTimeout = () => {
        const lastActivityTime = parseInt(localStorage.getItem("adminLastActivity") || "0");
        if (Date.now() - lastActivityTime > SESSION_TIMEOUT) {
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminLastActivity");
          setIsAuthenticated(false);
          
          toast({
            title: "Sessão expirada",
            description: "Sua sessão expirou por inatividade. Por favor, faça login novamente.",
            variant: "destructive",
          });
          
          // Deslogar do Supabase também
          supabase.auth.signOut();
        } else {
          // Atualiza o timestamp para evitar timeout durante uso ativo
          localStorage.setItem("adminLastActivity", Date.now().toString());
        }
      };

      // Verificar a cada minuto
      const interval = setInterval(checkSessionTimeout, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, toast, SESSION_TIMEOUT]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
