
import { Skeleton } from "@/components/ui/skeleton";
import { ContentCatalogTable } from "@/components/admin/dashboard/ContentCatalogTable";
import { StudyCardProps } from "@/components/StudyCard";

interface ContentCatalogSectionProps {
  items: StudyCardProps[];
  isLoading: boolean;
}

export const ContentCatalogSection = ({ items, isLoading }: ContentCatalogSectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Catálogo de Conteúdo</h2>
      {isLoading ? (
        <div>
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
        </div>
      ) : (
        <ContentCatalogTable items={items} />
      )}
    </div>
  );
};
