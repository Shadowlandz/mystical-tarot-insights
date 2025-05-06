import { useState } from "react";

const AdminVideosPage = () => {
  const [videos, setVideos] = useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Gerenciar Vídeos</h1>
        <p className="text-muted-foreground">
          Gerencie os vídeos do acervo.
        </p>
      </div>
      
      <div>
        {videos.length === 0 ? (
          <div className="text-center p-12">
            <p>Nenhum vídeo encontrado. Crie novos vídeos para começar.</p>
          </div>
        ) : (
          <div>
            {/* Lista de vídeos será exibida aqui quando implementada */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideosPage;
