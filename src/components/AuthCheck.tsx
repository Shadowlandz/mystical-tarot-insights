
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthCheckProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export const AuthCheck = ({ 
  children, 
  requireAdmin = false, 
  redirectTo = "/auth" 
}: AuthCheckProps) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setIsLoading(false);
        
        // If requireAdmin is true, check if user is admin
        if (requireAdmin && session) {
          checkAdminStatus(session);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      
      // If requireAdmin is true, check if user is admin
      if (requireAdmin && session) {
        checkAdminStatus(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, redirectTo, requireAdmin]);

  const checkAdminStatus = async (session: Session) => {
    try {
      // Call the is_admin function
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        navigate(redirectTo);
      } else {
        setIsAdmin(data);
        if (!data && requireAdmin) {
          navigate(redirectTo);
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      navigate(redirectTo);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session) {
    navigate(redirectTo);
    return null;
  }

  // Redirect if not admin (when required)
  if (requireAdmin && !isAdmin) {
    navigate(redirectTo);
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
};
