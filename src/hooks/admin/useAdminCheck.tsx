
import { useState, useEffect } from "react";
import { isUserAdmin } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to check admin status
 */
export function useAdminCheck() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkAdminStatus = async () => {
    setIsCheckingAdmin(true);
    try {
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        setHasError(true);
        setErrorMessage("Você não tem permissões de administrador para gerenciar vídeos. Entre em contato com o administrador do sistema.");
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissões para gerenciar vídeos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setHasError(true);
      setErrorMessage("Não foi possível verificar suas permissões. Tente novamente mais tarde.");
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  // Check admin status on mount
  useEffect(() => {
    checkAdminStatus();
  }, []);

  return {
    isAdmin,
    isCheckingAdmin,
    hasError,
    errorMessage,
    checkAdminStatus
  };
}
