
import React, { useState } from "react";
import { PlusCircle, Edit, Trash2, FileText, Video, Library } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StudyCardProps } from "@/components/StudyCard";

// Esquema de validação do formulário
const formSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres",
  }),
  type: z.enum(["article", "video", "document"], {
    required_error: "Selecione um tipo de conteúdo",
  }),
  thumbnail: z.string().url({
    message: "Por favor, insira uma URL válida para a miniatura",
  }),
  excerpt: z.string().min(10, {
    message: "O resumo deve ter pelo menos 10 caracteres",
  }),
  link: z.string().url({
    message: "Por favor, insira uma URL válida para o conteúdo",
  }),
});

const AdminAcervoPage = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Dados de exemplo - em produção, seriam carregados do banco de dados
  const [acervoItems, setAcervoItems] = useState<StudyCardProps[]>([
    {
      id: 1,
      title: "Introdução ao Tarot de Rider-Waite",
      type: "article",
      thumbnail: "https://images.unsplash.com/photo-1600080699037-d779153fca2d?q=80&w=500",
      excerpt: "Um guia completo sobre o baralho de Tarot mais popular e suas origens.",
      link: "/acervo/artigo/introducao-rider-waite",
    },
    {
      id: 2,
      title: "Como Interpretar o Arcano 'O Louco'",
      type: "video",
      thumbnail: "https://images.unsplash.com/photo-1659078603811-2c19b9b62fa8?q=80&w=500",
      excerpt: "Análise profunda do significado e interpretações da carta 'O Louco' no Tarot.",
      link: "/acervo/video/interpretar-o-louco",
    },
    {
      id: 3,
      title: "Manual Completo de Tarot",
      type: "document",
      thumbnail: "https://images.unsplash.com/photo-1572856330944-6d9a552c38f9?q=80&w=500",
      excerpt: "Um documento abrangente com todos os arcanos maiores e menores explicados em detalhes.",
      link: "/acervo/documento/manual-completo",
    },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "article",
      thumbnail: "",
      excerpt: "",
      link: "",
    },
  });

  const handleAddItem = (values: z.infer<typeof formSchema>) => {
    if (isEditing && editingId !== null) {
      // Atualizar item existente
      setAcervoItems(prev => 
        prev.map(item => 
          item.id === editingId 
            ? { 
                id: item.id,
                title: values.title,
                type: values.type,
                thumbnail: values.thumbnail,
                excerpt: values.excerpt,
                link: values.link
              } 
            : item
        )
      );
      toast({
        title: "Item atualizado",
        description: "O item do acervo foi atualizado com sucesso",
      });
    } else {
      // Adicionar novo item - garantir que todas as propriedades são fornecidas
      const newItem: StudyCardProps = {
        id: Math.max(0, ...acervoItems.map(item => item.id)) + 1,
        title: values.title,
        type: values.type,
        thumbnail: values.thumbnail,
        excerpt: values.excerpt,
        link: values.link
      };
      setAcervoItems(prev => [...prev, newItem]);
      toast({
        title: "Item adicionado",
        description: "Um novo item foi adicionado ao acervo",
      });
    }
    
    // Resetar estado e fechar dialog
    form.reset();
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEditItem = (item: StudyCardProps) => {
    setIsEditing(true);
    setEditingId(item.id);
    
    // Preencher formulário com dados do item
    form.reset({
      title: item.title,
      type: item.type,
      thumbnail: item.thumbnail,
      excerpt: item.excerpt,
      link: item.link,
    });
    
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      setAcervoItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Item excluído",
        description: "O item foi removido do acervo",
      });
    }
  };

  const resetAndCloseDialog = () => {
    form.reset();
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const TypeIcon = ({ type }: { type: "article" | "video" | "document" }) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4 text-primary" />;
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "document":
        return <Library className="h-4 w-4 text-orange-500" />;
    }
  };

  const getTypeLabel = (type: "article" | "video" | "document") => {
    switch (type) {
      case "article":
        return "Artigo";
      case "video":
        return "Vídeo";
      case "document":
        return "Documento";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Acervo de Estudos</h2>
          <p className="text-muted-foreground">
            Gerencie o conteúdo do acervo de estudos disponível para os usuários.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              form.reset();
              setIsEditing(false);
              setEditingId(null);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Conteúdo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Conteúdo" : "Adicionar Novo Conteúdo"}
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes do conteúdo que deseja {isEditing ? "atualizar" : "adicionar"} ao acervo.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do conteúdo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Conteúdo</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="article">Artigo</SelectItem>
                          <SelectItem value="video">Vídeo</SelectItem>
                          <SelectItem value="document">Documento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Miniatura</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL de uma imagem para representar o conteúdo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumo</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Breve descrição do conteúdo" 
                          className="resize-none"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link do Conteúdo</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/content" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL para o artigo, vídeo ou documento completo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetAndCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Atualizar" : "Adicionar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {acervoItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TypeIcon type={item.type} />
                <CardDescription>{getTypeLabel(item.type)}</CardDescription>
              </div>
              <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAcervoPage;
