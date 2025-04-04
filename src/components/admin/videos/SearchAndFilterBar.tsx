
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SearchAndFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export function SearchAndFilterBar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy
}: SearchAndFilterBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Input
        placeholder="Buscar por título ou descrição..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="md:max-w-sm"
      />
      <Select onValueChange={setSortBy} defaultValue={sortBy}>
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
  );
}
