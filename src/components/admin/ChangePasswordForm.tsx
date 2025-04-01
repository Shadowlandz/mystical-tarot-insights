
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Lock, AlertCircle } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Esquema de validação com mensagens em português
const formSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Senha atual deve ter pelo menos 6 caracteres",
  }),
  newPassword: z.string().min(6, {
    message: "Nova senha deve ter pelo menos 6 caracteres",
  }),
  confirmPassword: z.string().min(6, {
    message: "Confirme a nova senha",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const ChangePasswordForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar primeiro se podemos fazer login com a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: values.currentPassword,
      });
      
      if (signInError) {
        throw new Error("Senha atual incorreta");
      }
      
      // Alterar a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Limpar formulário
      form.reset();
      
      toast({
        title: "Senha alterada com sucesso",
        description: "Sua senha de administrador foi atualizada",
      });
      
    } catch (error: any) {
      setError(error.message);
      console.error("Erro ao alterar senha:", error);
      
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Alterar Senha</CardTitle>
        <CardDescription>
          Altere sua senha de administrador do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha Atual</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </span>
                      <Input className="pl-9" type="password" placeholder="******" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </span>
                      <Input className="pl-9" type="password" placeholder="******" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme a Nova Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </span>
                      <Input className="pl-9" type="password" placeholder="******" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                  Processando...
                </span>
              ) : (
                <span className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Alterar Senha
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        <p className="w-full">
          Mantenha sua senha segura e não a compartilhe com ninguém.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ChangePasswordForm;
