
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import { StudyCardProps } from "@/components/StudyCard";
import { supabase } from "@/integrations/supabase/client";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const VideoViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<StudyCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      
      try {
        // First try to find the video by numeric ID (for compatibility with existing routes)
        const videoId = parseInt(id || '0');
        
        // Query Supabase for the video
        const { data, error } = await supabase
          .from('acervo_items')
          .select('*')
          .eq('type', 'video')
          .limit(100);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Find the video with matching converted ID
          const foundVideo = data.find(item => {
            const convertedId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;
            return convertedId === videoId;
          });
          
          if (foundVideo) {
            // Update view count
            await supabase
              .from('acervo_items')
              .update({ views: (foundVideo.views || 0) + 1 })
              .eq('id', foundVideo.id);
            
            // Convert the ID for compatibility and ensure type is compatible with StudyCardProps
            const videoWithNumericId: StudyCardProps = {
              ...foundVideo,
              id: parseInt(foundVideo.id.replace(/-/g, '').substring(0, 8), 16) || Math.floor(Math.random() * 10000),
              type: foundVideo.type as "video" | "article" | "document",
              createdAt: foundVideo.created_at,
            };
            
            setVideo(videoWithNumericId);
          } else {
            setError("Vídeo não encontrado");
          }
        } else {
          setError("Vídeo não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar o vídeo");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [id]);

  const handleShareVideo = () => {
    if (navigator.share) {
      navigator.share({
        title: video?.title || "Vídeo compartilhado",
        url: window.location.href,
      })
      .then(() => {
        toast.success("Vídeo compartilhado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao compartilhar:", error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Carregando vídeo...</p>
        </div>
      </div>
    );
  }
  
  if (error || !video) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <p className="text-muted-foreground text-xl">{error || "Vídeo não encontrado"}</p>
          <Button asChild>
            <Link to="/acervo">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Acervo
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <Button asChild variant="outline">
          <Link to="/acervo">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Acervo
          </Link>
        </Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleShareVideo}>
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Compartilhar vídeo</TooltipContent>
        </Tooltip>
      </div>
      
      <h1 className="text-3xl font-mystical text-accent mb-6">{video.title}</h1>
      
      <div className="space-y-8">
        <VideoPlayer 
          videoUrl={video.link} 
          title={video.title} 
          className="shadow-lg rounded-lg overflow-hidden"
        />
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg">{video.excerpt}</p>
          
          <div className="mt-8 p-6 bg-muted/30 rounded-lg">
            <h2 className="text-xl font-mystical mb-4">Sobre este vídeo</h2>
            <p>
              Este é um conteúdo de demonstração. Em uma implementação completa, 
              aqui seria exibida uma descrição detalhada do vídeo, transcrição, 
              ou materiais complementares.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoViewPage;
