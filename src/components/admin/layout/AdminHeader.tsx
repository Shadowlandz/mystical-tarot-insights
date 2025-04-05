
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  isMobileView: boolean;
}

export function AdminHeader({ isMobileView }: AdminHeaderProps) {
  return (
    <div className="flex h-16 items-center gap-4 border-b border-border/40 px-4 md:px-6">
      <div className="flex items-center">
        <SidebarTrigger />
        {isMobileView && (
          <Link to="/" className="ml-4 text-2xl font-mystical text-primary">
            Tarot Místico
          </Link>
        )}
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
          Voltar ao Site
        </Link>
      </div>
    </div>
  );
}
