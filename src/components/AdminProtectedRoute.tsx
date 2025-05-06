
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AdminProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const AdminProtectedRoute = ({ 
  children, 
  redirectTo = "/admin/login" 
}: AdminProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth");
      
      if (!adminAuth) {
        toast({
          title: "Acesso negado",
          description: "Por favor, faça login para acessar essa área",
          variant: "destructive",
        });
        navigate(redirectTo);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, redirectTo, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AdminProtectedRoute;
