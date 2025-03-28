
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";
  const lastActivity = localStorage.getItem("adminLastActivity");
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos em milissegundos

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
          toast({
            title: "Sessão expirada",
            description: "Sua sessão expirou por inatividade. Por favor, faça login novamente.",
            variant: "destructive",
          });
          window.location.href = "/admin/login";
        } else {
          // Atualiza o timestamp para evitar timeout durante uso ativo
          localStorage.setItem("adminLastActivity", Date.now().toString());
        }
      };

      // Verificar a cada minuto
      const interval = setInterval(checkSessionTimeout, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, toast]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
