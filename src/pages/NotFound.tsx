
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Erro: Usuário tentou acessar uma rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-gray-300 mb-4">Ops! Página não encontrada</p>
        <div className="space-y-2">
          <Link to="/" className="block text-blue-400 hover:text-blue-300 underline">
            Voltar para o Início
          </Link>
          <Link to="/admin/login" className="block text-sm text-gray-400 hover:text-gray-300">
            Acesso Administrativo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
