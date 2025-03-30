
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { isYouTubeUrl } from "@/utils/videoUtils";
import { getTypeIcon, getTypeLabel } from "@/components/admin/acervo/AcervoTypeUtils";
import { StudyCardProps } from "@/components/StudyCard";
import { convertToStudyCardProps } from "@/types/acervo";

const ContentViewPage = () => {
  const { id } = useParams();
  const [content, setContent] = useState<StudyCardProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) {
        setError("ID do conteúdo não fornecido");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const numericId = parseInt(id);

        // Buscar todos os itens para encontrar o que corresponde ao ID convertido
        const { data, error: fetchError } = await supabase
          .from('acervo_items')
          .select('*')
          .limit(100);

        if (fetchError) throw fetchError;

        // Procurar o item que corresponde ao ID após a conversão
        const item = data?.find(dbItem => {
          // Converter UUID para um número
          const convertedId = parseInt(dbItem.id.replace(/-/g, '').substring(0, 8), 16) || 0;
          return convertedId === numericId;
        });

        if (item) {
          // Incrementar a contagem de visualizações
          const { error: updateError } = await supabase
            .from('acervo_items')
            .update({ views: (item.views || 0) + 1 })
            .eq('id', item.id);

          if (updateError) console.error("Erro ao atualizar visualizações:", updateError);

          // Converter para o formato da UI
          const contentItem = convertToStudyCardProps(item);
          setContent(contentItem);
        } else {
          setError("Conteúdo não encontrado");
        }
      } catch (err) {
        console.error("Erro ao buscar conteúdo:", err);
        setError("Ocorreu um erro ao carregar o conteúdo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavBar />
        <div className="container mx-auto py-8 px-4 flex-1">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-[300px] w-full mb-6" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavBar />
        <div className="container mx-auto py-8 px-4 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold mb-4">
            {error || "Conteúdo não encontrado"}
          </h1>
          <Button asChild>
            <Link to="/acervo">Voltar para o Acervo</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isVideo = content.type === "video";
  const isFromYoutube = isVideo && isYouTubeUrl(content.link);
  const formattedDate = content.createdAt 
    ? format(new Date(content.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "Data desconhecida";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <div className="container mx-auto py-8 px-4 flex-1">
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          asChild
        >
          <Link to="/acervo" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Acervo
          </Link>
        </Button>

        <div className="flex flex-wrap gap-3 mb-4">
          <Badge className="flex items-center gap-1">
            {getTypeIcon(content.type)}
            <span>{getTypeLabel(content.type)}</span>
          </Badge>
          
          {content.views !== undefined && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{content.views} visualizações</span>
            </Badge>
          )}
          
          {content.createdAt && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-semibold mb-6">{content.title}</h1>

        {isVideo ? (
          <div className="mb-6">
            <VideoPlayer 
              videoUrl={content.link} 
              title={content.title}
              className="mb-6"
              autoPlay={false}
            />
          </div>
        ) : (
          <div className="mb-6">
            <img 
              src={content.thumbnail} 
              alt={content.title}
              className="w-full rounded-lg object-cover max-h-[400px]"
            />
          </div>
        )}

        <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
          <p className="text-lg mb-4">{content.excerpt}</p>
          
          {!isVideo && (
            <div className="mt-6">
              <p>Para ler o conteúdo completo, acesse a fonte original:</p>
              <Button asChild className="mt-2">
                <a href={content.link} target="_blank" rel="noopener noreferrer">
                  Acessar conteúdo completo
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContentViewPage;
