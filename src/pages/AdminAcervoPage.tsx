import { useState } from "react";

const AdminAcervoPage = () => {
  const [items, setItems] = useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Gerenciar Acervo</h1>
        <p className="text-muted-foreground">
          Gerencie todos os itens do acervo.
        </p>
      </div>
      
      <div>
        {items.length === 0 ? (
          <div className="text-center p-12">
            <p>Nenhum item encontrado. Crie novos itens para começar.</p>
          </div>
        ) : (
          <div>
            {/* Lista de itens será exibida aqui quando implementada */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAcervoPage;
