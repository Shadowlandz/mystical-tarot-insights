
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface ErrorDisplayProps {
  isAdmin: boolean;
  hasError: boolean;
  errorMessage: string;
}

export function ErrorDisplay({ isAdmin, hasError, errorMessage }: ErrorDisplayProps) {
  return (
    <>
      {hasError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro no carregamento</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {!isAdmin && (
        <Alert variant="destructive" className="mb-6">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acesso restrito</AlertTitle>
          <AlertDescription>
            Você não tem permissões de administrador para gerenciar vídeos.
            Entre em contato com o administrador do sistema para solicitar acesso.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
