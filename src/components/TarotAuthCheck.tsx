
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LockOpen } from "lucide-react";

interface TarotAuthCheckProps {
  children: ReactNode;
  spreadType: "single" | "three" | "celtic";
}

export const TarotAuthCheck = ({ children, spreadType }: TarotAuthCheckProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only require authentication for celtic spread
    if (spreadType !== "celtic") {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [spreadType]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show auth prompt if trying to access celtic cross without authentication
  if (spreadType === "celtic" && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 border rounded-lg bg-muted/20">
        <div className="bg-primary/10 p-4 rounded-full">
          <LockOpen className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Acesso Exclusivo</h2>
        <p className="text-muted-foreground">
          A tiragem Cruz Celta está disponível apenas para usuários cadastrados.
        </p>
        <div className="flex space-x-2">
          <Button onClick={() => navigate("/auth")}>Entrar</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Render children if authenticated or not celtic spread
  return <>{children}</>;
};
