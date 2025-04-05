
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onRefresh: () => void;
  onAddNew: () => void;
  contentType: 'article' | 'document';
}

export function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onRefresh,
  onAddNew,
  contentType
}: SearchAndFilterBarProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Gerenciar Conteúdo</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={onAddNew}>
            <span className="sr-only">Add New</span>
            {contentType === 'article' ? "Adicionar Artigo" : "Adicionar Documento"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          placeholder="Buscar por título ou descrição..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="md:max-w-sm"
        />
        <Select onValueChange={onSortChange} defaultValue={sortBy}>
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais Recentes</SelectItem>
            <SelectItem value="views">Mais Visualizados</SelectItem>
            <SelectItem value="title">Título (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
