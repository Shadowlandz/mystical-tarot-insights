import { useState } from "react";

const AdminArticlesPage = () => {
  const [articles, setArticles] = useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Gerenciar Artigos</h1>
        <p className="text-muted-foreground">
          Gerencie os artigos do acervo.
        </p>
      </div>
      
      <div>
        {articles.length === 0 ? (
          <div className="text-center p-12">
            <p>Nenhum artigo encontrado. Crie novos artigos para começar.</p>
          </div>
        ) : (
          <div>
            {/* Lista de artigos será exibida aqui quando implementada */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArticlesPage;
